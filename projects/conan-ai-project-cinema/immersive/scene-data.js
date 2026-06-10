/**
 * scene-data.js — CP-4A Immersive Mode
 * Six scene spatial mapping for 3D camera and audio state.
 * Each scene defines camera position/target and accent color.
 */

window.CP_IMMERSIVE_SCENES = [
  {
    id: 'scene-01',
    title: 'Complex Ideas',
    titleZh: '把复杂内容讲清楚',
    description: '论文 · 书籍 · 截图 · 散落的想法',
    // CP-5C: Per-scene camera — desktop and mobile
    camera: {
      desktop: { position: { x: -7, y: 3.4, z: 9 },   target: { x: -7, y: 1.3, z: 1.5 } },
      mobile:  { position: { x: -7, y: 3.0, z: 7 },  target: { x: -7, y: 1.2, z: 1.5 } }
    },
    accentColor: '#7eb8f7',
    audioMood: 'ideas',
    objectFocus: 'paper-stack',
    ambientIntensity: 0.4,
  },
  {
    id: 'scene-02',
    title: 'AI Beyond Chat',
    titleZh: 'AI 进入文档、网页、命令行',
    description: '文档 · 网页 · 命令行 · 项目流程',
    camera: {
      desktop: { position: { x: -4, y: 3.2, z: 8 },  target: { x: 0, y: 1.5, z: 0 } },
      mobile:  { position: { x: -3, y: 3.0, z: 6 },  target: { x: 0, y: 1.2, z: 0 } }
    },
    accentColor: '#a08cf7',
    audioMood: 'chat',
    objectFocus: 'terminal-panel',
    ambientIntensity: 0.5,
  },
  {
    id: 'scene-03',
    title: 'Projects Become Artifacts',
    titleZh: '每个想法留下可运行的产物',
    description: 'artifact cards · project stack',
       camera: {
      desktop: { position: { x: 3, y: 4.5, z: 8 },  target: { x: 0, y: 1.2, z: 0 } },
      mobile:  { position: { x: 3, y: 3.5, z: 6 },  target: { x: 0, y: 1.0, z: 0 } }
    },
    accentColor: '#7af7b8',
    audioMood: 'artifacts',
    objectFocus: 'artifact-stack',
    ambientIntensity: 0.5,
  },
  {
    id: 'scene-04',
    title: 'Agents Join the Workflow',
    titleZh: '每个阶段留下设计理由',
    description: 'OpenClaw · Hermes · Codex · Phase Report',
    camera: {
      // CP-5C: Agent hub at z=-15, camera looks toward z=-15 area
      desktop: { position: { x: 0, y: 5, z: 5 },   target: { x: 0, y: 2.5, z: -15 } },
      mobile:  { position: { x: 0, y: 4, z: 3 },   target: { x: 0, y: 2.5, z: -15 } }
    },
    accentColor: '#f7c87a',
    audioMood: 'agents',
    objectFocus: 'agent-line',
    ambientIntensity: 0.6,
  },
  {
    id: 'scene-05',
    title: 'Control Tower',
    titleZh: '项目系统化，AI 进入工作流',
    description: 'constellation · system nodes',
    camera: {
      // CP-5C: Control tower at z=-20, camera looks at tower
      desktop: { position: { x: -4, y: 6, z: -10 }, target: { x: 0, y: 3, z: -20 } },
      mobile:  { position: { x: -4, y: 5, z: -8 },  target: { x: 0, y: 3, z: -20 } }
    },
    accentColor: '#f78c7a',
    audioMood: 'tower',
    objectFocus: 'constellation',
    ambientIntensity: 0.6,
  },
  {
    id: 'scene-06',
    title: 'Artifact Archive',
    titleZh: '持续生长的个人 AI 档案馆',
    description: 'archive gate · artifact wall',
    camera: {
      // CP-5C: Archive hall at z=-25, camera looks at archive
      desktop: { position: { x: 0, y: 3.5, z: -5 },  target: { x: 0, y: 2, z: -25 } },
      mobile:  { position: { x: 0, y: 3, z: -3 },    target: { x: 0, y: 2, z: -25 } }
    },
    accentColor: '#7ac8f7',
    audioMood: 'archive',
    objectFocus: 'archive-wall',
    ambientIntensity: 0.5,
  },
];