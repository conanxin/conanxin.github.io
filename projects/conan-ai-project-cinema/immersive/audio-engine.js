/**
 * audio-engine.js — CP-4A Immersive Mode
 * Pure Web Audio API. No external audio files.
 * Sound starts only after user click. Always respects mute.
 */

(function () {
  'use strict';

  var AudioEngine = function () {
    this.ctx = null;
    this.masterGain = null;
    this.muted = false;
    this.started = false;
    this.currentMood = null;
    this.nodes = [];
  };

  // ── Init ─────────────────────────────────────────────────────────
  AudioEngine.prototype.init = function () {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      return false;
    }
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0;
    this.masterGain.connect(this.ctx.destination);
    return true;
  };

  // ── Start (called after user click) ────────────────────────────
  AudioEngine.prototype.start = function () {
    if (this.started) return;
    if (!this.ctx) return;
    this.started = true;
    // Fade in master
    this.masterGain.gain.setTargetAtTime(0.12, this.ctx.currentTime, 1.5);
  };

  // ── Mood transitions ───────────────────────────────────────────
  AudioEngine.prototype.setMood = function (mood) {
    if (!this.ctx || !this.started || this.muted) return;
    if (this.currentMood === mood) return;
    this.currentMood = mood;
    this._clearNodes();
    switch (mood) {
      case 'ideas':
        this._buildIdeas();
        break;
      case 'chat':
        this._buildChat();
        break;
      case 'artifacts':
        this._buildArtifacts();
        break;
      case 'agents':
        this._buildAgents();
        break;
      case 'tower':
        this._buildTower();
        break;
      case 'archive':
        this._buildArchive();
        break;
      default:
        this._buildIdle();
    }
  };

  // ── Mute / Unmute ───────────────────────────────────────────────
  AudioEngine.prototype.mute = function () {
    this.muted = true;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.3);
    }
    this._clearNodes();
  };

  AudioEngine.prototype.unmute = function () {
    if (!this.started) return;
    this.muted = false;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(0.12, this.ctx.currentTime, 0.5);
    }
    if (this.currentMood) this.setMood(this.currentMood);
  };

  AudioEngine.prototype.toggleMute = function () {
    if (this.muted) this.unmute(); else this.mute();
  };

  // ── Cleanup on page hide ────────────────────────────────────────
  AudioEngine.prototype.suspend = function () {
    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend();
    }
  };

  AudioEngine.prototype.resume = function () {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  };

  AudioEngine.prototype.destroy = function () {
    this._clearNodes();
    if (this.masterGain) {
      this.masterGain.disconnect();
    }
    if (this.ctx) {
      this.ctx.close();
    }
    this.started = false;
  };

  // ── Private: helpers ────────────────────────────────────────────
  AudioEngine.prototype._clearNodes = function () {
    var self = this;
    this.nodes.forEach(function (n) {
      try { n.stop(); } catch (e) {}
      try { n.disconnect(); } catch (e) {}
    });
    this.nodes = [];
  };

  AudioEngine.prototype._osc = function (freq, type, gainVal, durFade) {
    var osc = this.ctx.createOscillator();
    var g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = gainVal;
    g.gain.setTargetAtTime(0, this.ctx.currentTime + durFade, 0.5);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start();
    this.nodes.push(osc, g);
    return osc;
  };

  AudioEngine.prototype._noise = function (gainVal) {
    var bufSize = this.ctx.sampleRate * 2;
    var buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    var src = this.ctx.createBufferSource();
    var filter = this.ctx.createBiquadFilter();
    var g = this.ctx.createGain();
    src.buffer = buf;
    src.loop = true;
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 0.5;
    g.gain.value = gainVal;
    src.connect(filter);
    filter.connect(g);
    g.connect(this.masterGain);
    src.start();
    this.nodes.push(src, filter, g);
    return src;
  };

  AudioEngine.prototype._schedPulse = function (freq, interval, gainVal) {
    var self = this;
    var osc = this.ctx.createOscillator();
    var g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.value = 0;
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start();
    this.nodes.push(osc, g);
    var t = this.ctx.currentTime;
    function pulse() {
      if (!self.nodes.length) return;
      g.gain.setTargetAtTime(gainVal, t, 0.02);
      g.gain.setTargetAtTime(0, t + 0.05, 0.1);
      t += interval;
      osc.scheduleStart(t,0.01);
      osc.scheduleStop(t + 0.01);
      setTimeout(pulse, interval * 1000);
    }
    setTimeout(pulse, interval * 1000);
  };

  // ── Mood builders ───────────────────────────────────────────────
  AudioEngine.prototype._buildIdle = function () {
    this._osc(80, 'sine', 0.04, 3);
  };

  AudioEngine.prototype._buildIdeas = function () {
    // Soft filtered noise — paper-like ambience
    this._noise(0.03);
    this._osc(220, 'triangle', 0.015, 5);
    this._osc(330, 'sine', 0.01, 6);
  };

  AudioEngine.prototype._buildChat = function () {
    // Subtle digital pulse
    this._osc(120, 'sawtooth', 0.02, 4);
    this._osc(240, 'square', 0.008, 5);
    this._noise(0.02);
  };

  AudioEngine.prototype._buildArtifacts = function () {
    // Warm low pad
    this._osc(110, 'sine', 0.03, 4);
    this._osc(165, 'triangle', 0.02, 5);
    this._osc(220, 'sine', 0.015, 6);
  };

  AudioEngine.prototype._buildAgents = function () {
    // Rhythmic tick
    this._osc(1000, 'square', 0.015, 2);
    this._osc(80, 'sine', 0.03, 4);
    var self = this;
    var t = this.ctx.currentTime;
    function tick() {
      if (!self.nodes.length) return;
      var g = self.ctx.createGain();
      g.gain.value = 0.02;
      var osc = self.ctx.createOscillator();
      osc.frequency.value = 800;
      osc.type = 'square';
      osc.connect(g);
      g.connect(self.masterGain);
      osc.start(t);
      osc.stop(t + 0.02);
      self.nodes.push(osc, g);
      t += 0.8;
      setTimeout(tick, 800);
    }
    setTimeout(tick, 800);
  };

  AudioEngine.prototype._buildTower = function () {
    // Deep system hum
    this._osc(55, 'sine', 0.04, 4);
    this._osc(110, 'sawtooth', 0.015, 5);
    this._osc(165, 'triangle', 0.01, 6);
  };

  AudioEngine.prototype._buildArchive = function () {
    // Open airy pad
    this._osc(130, 'sine', 0.025, 4);
    this._osc(195, 'sine', 0.02, 5);
    this._osc(260, 'triangle', 0.015, 6);
  };

  // ── CP-4E: Scene transition cues — short, distinct sounds ─────
  // Only plays when sound is enabled and not muted. Volume very low.
  AudioEngine.prototype.playSceneCue = function (mood) {
    if (!this.ctx || !this.started || this.muted) return;
    var t = this.ctx.currentTime;
    var vol = 0.04; // very low volume
    var duration = 0.12;
    switch (mood) {
      case 'ideas':
        // Soft paper-like click
        this._osc(800, 'sine', vol, 1, t, duration);
        this._osc(600, 'sine', vol * 0.5, 1, t + 0.03, duration * 0.5);
        break;
      case 'chat':
        // Short digital blip
        this._osc(1200, 'square', vol * 0.6, 1, t, 0.08);
        this._osc(900, 'sine', vol * 0.4, 1, t + 0.06, 0.06);
        break;
      case 'artifacts':
        // Warm chime
        this._osc(523, 'sine', vol, 1, t, 0.2);
        this._osc(659, 'sine', vol * 0.6, 1, t + 0.08, 0.15);
        this._osc(784, 'sine', vol * 0.4, 1, t + 0.15, 0.12);
        break;
      case 'agents':
        // Short tick sequence
        this._osc(400, 'square', vol * 0.5, 1, t, 0.05);
        this._osc(600, 'square', vol * 0.4, 1, t + 0.08, 0.05);
        this._osc(800, 'square', vol * 0.3, 1, t + 0.15, 0.05);
        break;
      case 'tower':
        // Low pulse
        this._osc(80, 'sine', vol * 1.5, 1, t, 0.25);
        this._osc(60, 'sine', vol, 1, t + 0.05, 0.2);
        break;
      case 'archive':
        // Airy open tone
        this._osc(330, 'sine', vol, 1, t, 0.18);
        this._osc(495, 'sine', vol * 0.5, 1, t + 0.05, 0.15);
        this._noise(0.02, 1, t, 0.15); // brief noise texture
        break;
      default:
        // Generic soft click
        this._osc(660, 'sine', vol, 1, t, 0.1);
    }
  };

  // ── Expose globally ────────────────────────────────────────────
  window.CP_ImmersiveAudio = AudioEngine;

})();