/**
 * scene-layout.js — CP-5A Immersive Scene Layout Configuration
 *
 * Defines the spatial world, layers, camera offsets, and atmosphere
 * for each of the six immersive scenes.
 *
 * Structure per scene:
 *   id — scene identifier (matches scene-data.js)
 *   sceneIndex      — zero-based index
 *   worldType — thematic type identifier
 *   accent — primary accent hex color
 *   atmosphere      — spatial description / visual keywords
 *   desktopOffset — camera offset for desktop (applied to baseCameraPos)
 *   mobileOffset    — camera offset for mobile (applied to baseCameraPos)
 *   layers — { foreground, midground, background } object lists
 */

window.CP_SCENE_LAYOUTS = [
  {
    id: 'scene-01',
    sceneIndex: 0,
    worldType: 'research-desk',
    accent: '#7eb8f7',
    atmosphere: 'thought fragments / research desk / idea links',
    desktopOffset: { x: 0, y: 0, z: 0 },
    mobileOffset: { x: 0, y: 1.0, z: -2.5 },
    layers: {
      foreground: [
        { type: 'dust', count: 30, color: 0x7eb8f7 }
      ],
      midground: [
        { type: 'desk', label: 'Research Desk' },
        { type: 'screen', count: 3, label: 'Paper Fragments' },
        { type: 'card', count: 4, label: 'Note Cards' }
      ],
      background: [
        { type: 'shelf', label: 'Archive Silhouettes' }
      ]
    }
  },
  {
    id: 'scene-02',
    sceneIndex: 1,
    worldType: 'terminal-docs',
    accent: '#a08cf7',
    atmosphere: 'terminal / docs / browser / workflow stream',
    desktopOffset: { x: -1, y: 0.5, z: -1 },
    mobileOffset: { x: -0.5, y: 1.2, z: -2 },
    layers: {
      foreground: [
        { type: 'dust', count: 25, color: 0xa08cf7 }
      ],
      midground: [
        { type: 'screen', count: 3, label: 'Terminal Panels' },
        { type: 'card', count: 5, label: 'Document Cards' },
        { type: 'ribbon', label: 'Workflow Stream' }
      ],
      background: [
        { type: 'panel', label: 'Browser Frame' }
      ]
    }
  },
  {
    id: 'scene-03',
    sceneIndex: 2,
    worldType: 'artifact-display',
    accent: '#7af7b8',
    atmosphere: 'artifact production / display / archive objects',
    desktopOffset: { x: 0, y: 0.5, z: -1 },
    mobileOffset: { x: 0, y: 1.0, z: -2.5 },
    layers: {
      foreground: [
        { type: 'dust', count: 20, color: 0x7af7b8 }
      ],
      midground: [
        { type: 'conveyor', label: 'Artifact Conveyor' },
        { type: 'plinth', count: 4, label: 'Display Plinths' },
        { type: 'frame', count: 3, label: 'Project Cards' }
      ],
      background: [
        { type: 'wall', label: 'Archive Wall' }
      ]
    }
  },
  {
    id: 'scene-04',
    sceneIndex: 3,
    worldType: 'agent-network',
    accent: '#f7c87a',
    atmosphere: 'agent network / orchestration / active routing',
    desktopOffset: { x: 0, y: 0, z: 0 },
    mobileOffset: { x: 0, y: 1.5, z: -3 },
    layers: {
      foreground: [
        { type: 'dust', count: 25, color: 0xf7c87a }
      ],
      midground: [
        { type: 'hub', label: 'Orchestration Hub' },
        { type: 'node', count: 4, label: 'Agent Nodes' },
        { type: 'route', count: 4, label: 'Pulsing Routes' }
      ],
      background: [
        { type: 'ring', count: 2, label: 'Signal Rings' }
      ]
    }
  },
  {
    id: 'scene-05',
    sceneIndex: 4,
    worldType: 'control-tower',
    accent: '#f78c7a',
    atmosphere: 'tower / radar / constellation / command center',
    desktopOffset: { x: 0, y: 0, z: 0 },
    mobileOffset: { x: 0, y: 2.0, z: -4 },
    layers: {
      foreground: [
        { type: 'dust', count: 20, color: 0xf78c7a }
      ],
      midground: [
        { type: 'tower', label: 'Control Tower' },
        { type: 'ring', count: 3, label: 'Radar Rings' },
        { type: 'antenna', label: 'Signal Antenna' }
      ],
      background: [
        { type: 'constellation', count: 5, label: 'System Nodes' }
      ]
    }
  },
  {
    id: 'scene-06',
    sceneIndex: 5,
    worldType: 'archive-hall',
    accent: '#7ac8f7',
    atmosphere: 'archive hall / storage / final repository',
    desktopOffset: { x: 0, y: 0, z: 0 },
    mobileOffset: { x: 0, y: 1.0, z: -3 },
    layers: {
      foreground: [
        { type: 'dust', count: 20, color: 0x7ac8f7 }
      ],
      midground: [
        { type: 'shelf', count: 20, label: 'Glowing Shelf Rows' },
        { type: 'arch', label: 'Archive Arch' }
      ],
      background: [
        { type: 'wall', label: 'Archive Hall Back Wall' },
        { type: 'strip', label: 'Floor Glow Strip' }
      ]
    }
  }
];