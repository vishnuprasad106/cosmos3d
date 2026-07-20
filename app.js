import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- Configuration & Constants ---
const celestialData = {
  sun: {
    name: "The Sun",
    type: "Yellow Dwarf Star (G2V)",
    diameter: "1,392,700 km",
    mass: "333,000",
    velocity: "0 km/s",
    temp: "5,500 °C",
    desc: "The star at the center of our solar system. It contains 99.8% of the system's mass and is a nearly perfect sphere of hot plasma, powering itself through nuclear fusion of hydrogen into helium.",
    color: "#ffd700",
    visibleSize: 10,
    realisticSize: 22,
    visibleDistance: 0,
    realisticDistance: 0,
    rotationSpeed: 0.05,
    orbitSpeed: 0,
    axialTilt: 7.25
  },
  mercury: {
    name: "Mercury",
    type: "Terrestrial Planet",
    diameter: "4,879 km",
    mass: "0.055",
    velocity: "47.4 km/s",
    temp: "167 °C",
    desc: "The smallest and closest planet to the Sun. Mercury has no atmosphere to trap heat, resulting in the most extreme temperature swings in the solar system, from freezing nights at -173 °C to scorching days at 427 °C.",
    color: "#8a8a93",
    visibleSize: 0.8,
    realisticSize: 0.22,
    visibleDistance: 20,
    realisticDistance: 35,
    rotationSpeed: 0.02,
    orbitSpeed: 0.03,
    axialTilt: 0.034
  },
  venus: {
    name: "Venus",
    type: "Terrestrial Planet",
    diameter: "12,104 km",
    mass: "0.815",
    velocity: "35.0 km/s",
    temp: "464 °C",
    desc: "The second planet from the Sun, wrapped in a dense, toxic atmosphere of carbon dioxide. A runaway greenhouse effect makes its surface hot enough to melt lead, making it hotter than even Mercury.",
    color: "#dec89c",
    visibleSize: 1.5,
    realisticSize: 0.55,
    visibleDistance: 28,
    realisticDistance: 48,
    rotationSpeed: -0.015, // Retrograde rotation
    orbitSpeed: 0.022,
    axialTilt: 177.3
  },
  earth: {
    name: "Earth",
    type: "Terrestrial Planet",
    diameter: "12,742 km",
    mass: "1.0",
    velocity: "29.8 km/s",
    temp: "15 °C",
    desc: "Our home planet is the third world from the Sun and the only place in the universe known to harbor life. Its liquid water oceans, protective atmosphere, and magnetic field make life possible.",
    color: "#2f6ab3",
    visibleSize: 1.6,
    realisticSize: 0.58,
    visibleDistance: 38,
    realisticDistance: 62,
    rotationSpeed: 0.1,
    orbitSpeed: 0.016,
    axialTilt: 23.44
  },
  mars: {
    name: "Mars",
    type: "Terrestrial Planet",
    diameter: "6,779 km",
    mass: "0.107",
    velocity: "24.1 km/s",
    temp: "-65 °C",
    desc: "The Red Planet is a cold, dry desert world covered in iron-oxide dust. It features massive shield volcanoes, a grand canyon system, and frozen polar ice caps containing water ice and carbon dioxide.",
    color: "#c1440e",
    visibleSize: 1.1,
    realisticSize: 0.32,
    visibleDistance: 48,
    realisticDistance: 78,
    rotationSpeed: 0.095,
    orbitSpeed: 0.012,
    axialTilt: 25.19
  },
  jupiter: {
    name: "Jupiter",
    type: "Gas Giant",
    diameter: "139,820 km",
    mass: "318",
    velocity: "13.1 km/s",
    temp: "-110 °C",
    desc: "The largest planet in our solar system, Jupiter is a massive gas giant primarily made of hydrogen and helium. Its iconic Great Red Spot is a giant, high-pressure storm wider than planet Earth.",
    color: "#b07f35",
    visibleSize: 4.2,
    realisticSize: 3.2,
    visibleDistance: 65,
    realisticDistance: 110,
    rotationSpeed: 0.22, // Very fast rotation
    orbitSpeed: 0.007,
    axialTilt: 3.13
  },
  saturn: {
    name: "Saturn",
    type: "Gas Giant",
    diameter: "116,460 km",
    mass: "95",
    velocity: "9.7 km/s",
    temp: "-140 °C",
    desc: "A massive gas giant renowned for its spectacular, highly visible ring system composed of billions of ice particles, rocky debris, and cosmic dust. It is the least dense planet in our solar system.",
    color: "#dec797",
    visibleSize: 3.5,
    realisticSize: 2.7,
    visibleDistance: 85,
    realisticDistance: 148,
    rotationSpeed: 0.2,
    orbitSpeed: 0.005,
    axialTilt: 26.73,
    hasRings: true,
    ringInner: 4.8,
    ringOuter: 9.0
  },
  uranus: {
    name: "Uranus",
    type: "Ice Giant",
    diameter: "50,724 km",
    mass: "14.5",
    velocity: "6.8 km/s",
    temp: "-195 °C",
    desc: "An ice giant with a pale cyan atmosphere rich in methane. Uranus has a unique axial tilt of nearly 98 degrees, causing it to orbit the Sun literally rolling on its side.",
    color: "#a4e4e6",
    visibleSize: 2.5,
    realisticSize: 1.4,
    visibleDistance: 105,
    realisticDistance: 190,
    rotationSpeed: -0.15, // Retrograde
    orbitSpeed: 0.003,
    axialTilt: 97.77,
    hasRings: true,
    ringInner: 3.0,
    ringOuter: 4.2,
    ringColor: 'rgba(100, 200, 255, 0.15)'
  },
  neptune: {
    name: "Neptune",
    type: "Ice Giant",
    diameter: "49,244 km",
    mass: "17.1",
    velocity: "5.4 km/s",
    temp: "-200 °C",
    desc: "The most distant planet in our solar system, Neptune is a freezing, windy ice giant. Its atmosphere features supersonic winds reaching up to 2,100 km/h, and its deep blue color is due to atmospheric methane.",
    color: "#2147a1",
    visibleSize: 2.4,
    realisticSize: 1.3,
    visibleDistance: 125,
    realisticDistance: 240,
    rotationSpeed: 0.16,
    orbitSpeed: 0.002,
    axialTilt: 28.32
  }
};

// --- Procedural Textures Generator ---
function createPlanetTexture(name) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (name === 'sun') {
    // Fire radial and linear gradient blend
    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad.addColorStop(0, '#ffa200');
    grad.addColorStop(0.5, '#ff4800');
    grad.addColorStop(1, '#ffa200');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add sunspots & solar storms
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const r = Math.random() * 90 + 30;
      const radial = ctx.createRadialGradient(x, y, 0, x, y, r);
      radial.addColorStop(0, '#ffffff');
      radial.addColorStop(0.2, '#ffea00');
      radial.addColorStop(0.6, 'rgba(255, 60, 0, 0.4)');
      radial.addColorStop(1, 'rgba(255, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } 
  else if (name === 'mercury') {
    ctx.fillStyle = '#656569';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Cratering noise
    for (let i = 0; i < 10000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const light = Math.floor(Math.random() * 30 - 15) + 101;
      ctx.fillStyle = `rgb(${light}, ${light}, ${light})`;
      ctx.fillRect(x, y, 2, 2);
    }
    // Individual craters
    for (let i = 0; i < 120; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const r = Math.random() * 15 + 2;
      
      // Shadow rim
      ctx.fillStyle = 'rgba(25, 25, 25, 0.5)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      
      // Highlight rim
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  } 
  else if (name === 'venus') {
    ctx.fillStyle = '#ccaa78';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Wavy horizontal bands for gas atmosphere
    for (let y = 0; y < canvas.height; y += 4) {
      const scale = Math.sin(y * 0.04 + Math.cos(y * 0.015) * 4) * 0.5 + 0.5;
      const noise = Math.random() * 0.12;
      ctx.fillStyle = `rgba(148, 108, 64, ${scale * 0.5 + noise})`;
      ctx.fillRect(0, y, canvas.width, 4);
    }
    
    // Giant cloud patches
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const r = Math.random() * 200 + 80;
      const radial = ctx.createRadialGradient(x, y, 0, x, y, r);
      radial.addColorStop(0, 'rgba(238, 218, 185, 0.45)');
      radial.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } 
  else if (name === 'earth') {
    // Base ocean blue
    ctx.fillStyle = '#0a2240';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw procedural landmasses
    ctx.fillStyle = '#1e541a'; // Deep green
    for (let l = 0; l < 10; l++) {
      let x = Math.random() * canvas.width;
      let y = Math.random() * canvas.height;
      let size = Math.random() * 140 + 70;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Expand continents with smaller blobs
      for (let i = 0; i < 18; i++) {
        x += (Math.random() - 0.5) * size * 0.7;
        y += (Math.random() - 0.5) * size * 0.7;
        size *= 0.85;
        ctx.fillStyle = Math.random() > 0.4 ? '#3e7c30' : '#728040'; // Green vs Desert brown
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Ice caps
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, 24);
    ctx.fillRect(0, canvas.height - 24, canvas.width, 24);
    
    // Jagged cap detail
    for (let x = 0; x < canvas.width; x += 4) {
      const hTop = Math.random() * 10 + 20;
      const hBot = Math.random() * 10 + 20;
      ctx.fillRect(x, 24, 4, hTop - 24);
      ctx.fillRect(x, canvas.height - hBot, 4, hBot - 24);
    }
  }
  else if (name === 'earth_clouds') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Streaky white clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const rx = Math.random() * 220 + 60;
      const ry = Math.random() * 40 + 10;
      const tilt = Math.PI * (Math.random() * 0.08 - 0.04);
      
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, tilt, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  else if (name === 'mars') {
    ctx.fillStyle = '#b7410e'; // Red base
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Rusty iron dust dark zones
    ctx.fillStyle = '#542007';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width;
      const y = canvas.height / 2 + (Math.random() - 0.5) * 200;
      const rx = Math.random() * 200 + 40;
      const ry = Math.random() * 90 + 15;
      
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Bright polar ice caps
    ctx.fillStyle = '#fef5eb';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 0, 35, 0, Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height, 28, Math.PI, 0);
    ctx.fill();
  }
  else if (name === 'jupiter') {
    // Draw gaseous stripes
    const bands = [
      { y: 0, h: 50, color: '#5c3e35' },
      { y: 50, h: 30, color: '#a08575' },
      { y: 80, h: 40, color: '#d8c5b2' },
      { y: 120, h: 55, color: '#744e3b' },
      { y: 175, h: 45, color: '#cca58c' },
      { y: 220, h: 60, color: '#ece0d5' },
      { y: 280, h: 50, color: '#88583c' },
      { y: 330, h: 45, color: '#baa290' },
      { y: 375, h: 65, color: '#dec3ad' },
      { y: 440, h: 72, color: '#4d342b' }
    ];
    
    bands.forEach(b => {
      ctx.fillStyle = b.color;
      ctx.fillRect(0, b.y, canvas.width, b.h);
      
      // Fine micro-banding noise
      for (let i = 0; i < 15; i++) {
        const offset = Math.random() * b.h;
        ctx.fillStyle = 'rgba(0,0,0,0.08)';
        ctx.fillRect(0, b.y + offset, canvas.width, Math.random() * 3 + 1);
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fillRect(0, b.y + offset + 3, canvas.width, Math.random() * 2 + 1);
      }
    });

    // Swirling storms waves
    for (let s = 0; s < 25; s++) {
      const y = Math.random() * canvas.height;
      const h = Math.random() * 25 + 6;
      ctx.fillStyle = Math.random() > 0.4 ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.18)';
      ctx.beginPath();
      for (let x = 0; x <= canvas.width; x += 15) {
        const wave = Math.sin(x * 0.02) * 8 + Math.cos(x * 0.04) * 4;
        if (x === 0) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave + h);
      }
      ctx.lineTo(canvas.width, y + h);
      ctx.lineTo(0, y + h);
      ctx.closePath();
      ctx.fill();
    }
    
    // Great Red Spot
    const spotX = canvas.width * 0.65;
    const spotY = canvas.height * 0.68;
    const rx = 65;
    const ry = 38;
    
    const spotGrad = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, rx);
    spotGrad.addColorStop(0, '#912108'); // Crimson center
    spotGrad.addColorStop(0.7, '#cc3b14');
    spotGrad.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = spotGrad;
    ctx.beginPath();
    ctx.ellipse(spotX, spotY, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Great Red Spot white swirling highlight
    ctx.fillStyle = 'rgba(255, 230, 200, 0.5)';
    ctx.beginPath();
    ctx.ellipse(spotX - 8, spotY - 4, rx * 0.35, ry * 0.3, Math.PI * 0.1, 0, Math.PI * 2);
    ctx.fill();
  } 
  else if (name === 'saturn') {
    // Muted golden-yellow bands
    const bands = [
      { y: 0, h: 50, color: '#7a6a4d' },
      { y: 50, h: 40, color: '#bcae88' },
      { y: 90, h: 90, color: '#dec797' },
      { y: 180, h: 70, color: '#ecdcb6' },
      { y: 250, h: 60, color: '#f5e8c4' },
      { y: 310, h: 90, color: '#dfcca2' },
      { y: 400, h: 60, color: '#ab9971' },
      { y: 460, h: 52, color: '#6e5f41' }
    ];
    bands.forEach(b => {
      ctx.fillStyle = b.color;
      ctx.fillRect(0, b.y, canvas.width, b.h);
    });
  } 
  else if (name === 'uranus') {
    ctx.fillStyle = '#a6e3e5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Very subtle horizontal gas gradients
    for (let y = 0; y < canvas.height; y += 8) {
      const alpha = Math.sin(y * 0.015) * 0.07 + 0.05;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(0, y, canvas.width, 4);
    }
  } 
  else if (name === 'neptune') {
    ctx.fillStyle = '#2147a1'; // Royal blue
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Deep dark bands
    for (let y = 0; y < canvas.height; y += 4) {
      const val = Math.sin(y * 0.02) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(10, 20, 60, ${val * 0.4})`;
      ctx.fillRect(0, y, canvas.width, 3);
    }
    // Great Dark Spot storm
    const spotX = canvas.width * 0.3;
    const spotY = canvas.height * 0.6;
    const rx = 48;
    const ry = 28;
    ctx.fillStyle = '#091538';
    ctx.beginPath();
    ctx.ellipse(spotX, spotY, rx, ry, -Math.PI * 0.06, 0, Math.PI * 2);
    ctx.fill();
    
    // Methane ice clouds (white/cyan)
    ctx.fillStyle = 'rgba(100, 220, 255, 0.45)';
    for (let i = 0; i < 10; i++) {
      const x = spotX + (Math.random() - 0.5) * 110;
      const y = spotY + (Math.random() - 0.5) * 50;
      ctx.beginPath();
      ctx.ellipse(x, y, Math.random() * 25 + 8, Math.random() * 2.5 + 0.8, 0.02, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Procedural Saturn/Uranus Rings Texture (Gradient along the Y axis)
function createRingsTexture(mainColor, secondaryColor) {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.12, 'rgba(0,0,0,0)');
  grad.addColorStop(0.16, 'rgba(80, 70, 55, 0.2)');
  grad.addColorStop(0.24, mainColor.replace('1)', '0.6)'));
  grad.addColorStop(0.38, mainColor);
  grad.addColorStop(0.48, secondaryColor);
  // Cassini/Rings divisions
  grad.addColorStop(0.50, 'rgba(5, 5, 10, 0.05)');
  grad.addColorStop(0.53, 'rgba(5, 5, 10, 0.05)');
  // Outer segment
  grad.addColorStop(0.56, secondaryColor);
  grad.addColorStop(0.72, mainColor.replace('1)', '0.8)'));
  grad.addColorStop(0.85, 'rgba(80, 70, 55, 0.4)');
  grad.addColorStop(0.96, 'rgba(80, 70, 55, 0.1)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Procedural Sun Corona glow sprite texture
function createCoronaTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  
  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(255, 248, 220, 1.0)');
  grad.addColorStop(0.15, 'rgba(255, 200, 0, 0.95)');
  grad.addColorStop(0.4, 'rgba(255, 72, 0, 0.4)');
  grad.addColorStop(0.75, 'rgba(255, 0, 0, 0.08)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
  
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(128, 128, 128, 0, Math.PI * 2);
  ctx.fill();
  
  return new THREE.CanvasTexture(canvas);
}

// --- Application Core Setup ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 4000);
camera.position.set(0, 70, 120);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
container.appendChild(renderer.domElement);

// Orbit Controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 1000;
controls.minDistance = 3;

// --- Lighting Setup ---
// Central Solar Light (non-physical decay to keep outer planets perfectly lit)
const sunLight = new THREE.PointLight(0xffffff, 3.5, 0, 0); // Decay = 0
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 500;
scene.add(sunLight);

// Space ambient lighting (illuminates shadow sides of planets slightly)
const ambientLight = new THREE.AmbientLight(0x0a0c20, 0.55);
scene.add(ambientLight);

// --- Star Field background particle system ---
function createStarField() {
  const starCount = 3500;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount * 3; i += 3) {
    // Shell placement
    const radius = 900 + Math.random() * 1100;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i+1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i+2] = radius * Math.cos(phi);
    
    // Spectral Star colors
    const rand = Math.random();
    if (rand < 0.55) {
      // White Class A/F
      colors[i] = 1.0; colors[i+1] = 1.0; colors[i+2] = 1.0;
    } else if (rand < 0.8) {
      // Blue/White Class O/B
      colors[i] = 0.78; colors[i+1] = 0.88; colors[i+2] = 1.0;
    } else if (rand < 0.95) {
      // Yellow Class G
      colors[i] = 1.0; colors[i+1] = 0.95; colors[i+2] = 0.75;
    } else {
      // Red/Orange Dwarf Class K/M
      colors[i] = 1.0; colors[i+1] = 0.65; colors[i+2] = 0.5;
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Circular fuzzy particle texture
  const pCanvas = document.createElement('canvas');
  pCanvas.width = 16;
  pCanvas.height = 16;
  const pCtx = pCanvas.getContext('2d');
  const pGrad = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
  pGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  pGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.7)');
  pGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  pCtx.fillStyle = pGrad;
  pCtx.fillRect(0, 0, 16, 16);
  
  const material = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    map: new THREE.CanvasTexture(pCanvas),
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  return new THREE.Points(geometry, material);
}
const starField = createStarField();
scene.add(starField);

// --- Build Solar System Nodes ---
const planets = {};
let sunNode = null;
let isRealisticScale = false;

// Create label overlay container
const labelsContainer = document.createElement('div');
labelsContainer.id = 'labels-container';
labelsContainer.style.position = 'absolute';
labelsContainer.style.top = '0';
labelsContainer.style.left = '0';
labelsContainer.style.width = '100%';
labelsContainer.style.height = '100%';
labelsContainer.style.pointerEvents = 'none';
labelsContainer.style.zIndex = '5';
document.body.appendChild(labelsContainer);

// Setup Object Node Objects
Object.keys(celestialData).forEach(key => {
  const data = celestialData[key];
  const group = new THREE.Group();
  
  let mesh;
  if (key === 'sun') {
    // Sun Glowing Mesh
    const geo = new THREE.SphereGeometry(data.visibleSize, 32, 32);
    const mat = new THREE.MeshBasicMaterial({
      map: createPlanetTexture('sun')
    });
    mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);
    
    // Volumetric glow corona sprite overlay
    const coronaGeo = createCoronaTexture();
    const coronaMat = new THREE.SpriteMaterial({
      map: coronaGeo,
      color: 0xffaa44,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.65
    });
    const corona = new THREE.Sprite(coronaMat);
    corona.scale.set(data.visibleSize * 2.8, data.visibleSize * 2.8, 1);
    group.add(corona);
    
    sunNode = { group, mesh, corona, size: data.visibleSize };
  } 
  else {
    // Standard Planets
    const geo = new THREE.SphereGeometry(data.visibleSize, 32, 32);
    const mat = new THREE.MeshStandardMaterial({
      map: createPlanetTexture(key),
      roughness: 0.85,
      metalness: 0.05
    });
    
    mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    
    // Additional cloud layers for Earth
    let cloudsMesh = null;
    if (key === 'earth') {
      const cloudGeo = new THREE.SphereGeometry(data.visibleSize * 1.018, 32, 32);
      const cloudMat = new THREE.MeshStandardMaterial({
        map: createPlanetTexture('earth_clouds'),
        transparent: true,
        opacity: 0.5,
        blending: THREE.NormalBlending,
        depthWrite: false
      });
      cloudsMesh = new THREE.Mesh(cloudGeo, cloudMat);
      group.add(cloudsMesh);
    }
    
    // Planetary rings (Saturn, Uranus)
    let ringMesh = null;
    if (data.hasRings) {
      const rInner = data.visibleSize * (data.ringInner / data.visibleSize);
      const rOuter = data.visibleSize * (data.ringOuter / data.visibleSize);
      const ringGeo = new THREE.RingGeometry(rInner, rOuter, 64);
      
      // Orient horizontally
      ringGeo.rotateX(-Math.PI / 2);
      
      // Map radial textures
      let ringTexture;
      if (key === 'saturn') {
        ringTexture = createRingsTexture('rgba(222, 199, 151, 1)', 'rgba(236, 220, 182, 1)');
      } else {
        ringTexture = createRingsTexture('rgba(164, 228, 230, 1)', 'rgba(100, 200, 255, 1)');
      }
      
      const ringMat = new THREE.MeshStandardMaterial({
        map: ringTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: key === 'saturn' ? 0.85 : 0.4,
        roughness: 0.7,
        metalness: 0.1
      });
      
      ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.castShadow = true;
      ringMesh.receiveShadow = true;
      group.add(ringMesh);
    }
    
    // Establish orbital trajectory lines
    const orbitLine = createOrbitLine(data.visibleDistance, data.color);
    scene.add(orbitLine);
    
    // Setup HUD Screen Space HTML labels
    const label = document.createElement('div');
    label.className = 'planet-lbl';
    label.innerHTML = data.name;
    label.style.position = 'absolute';
    label.style.color = 'var(--text-primary)';
    label.style.fontFamily = 'var(--font-mono)';
    label.style.fontSize = '10px';
    label.style.fontWeight = 'bold';
    label.style.letterSpacing = '1px';
    label.style.textTransform = 'uppercase';
    label.style.background = 'rgba(10, 10, 25, 0.75)';
    label.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    label.style.padding = '3px 7px';
    label.style.borderRadius = '4px';
    label.style.pointerEvents = 'none';
    label.style.whiteSpace = 'nowrap';
    label.style.transform = 'translate(-50%, -100%)';
    label.style.boxShadow = '0 2px 8px rgba(0,0,0,0.5)';
    labelsContainer.appendChild(label);
    
    // Apply axial tilt to the entire planet group coordinates
    group.rotation.z = THREE.MathUtils.degToRad(data.axialTilt);
    
    planets[key] = {
      key,
      group,
      mesh,
      cloudsMesh,
      ringMesh,
      orbitLine,
      labelElement: label,
      size: data.visibleSize,
      distance: data.visibleDistance,
      angle: Math.random() * Math.PI * 2 // Random start orbits position
    };
  }
  
  // Tag mesh for Raycasting double click focuses
  mesh.userData = { planetKey: key };
  scene.add(group);
});

// Orbit line visual geometry generation helper
function createOrbitLine(radius, colorHex) {
  const points = [];
  const segments = 180;
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: new THREE.Color(colorHex),
    transparent: true,
    opacity: 0.16,
    blending: THREE.AdditiveBlending
  });
  return new THREE.LineLoop(geometry, material);
}

// --- Dynamic Scale Mode Toggler ---
function updateScaleSystem() {
  // Update Sun sizes
  const sunSize = isRealisticScale ? celestialData.sun.realisticSize : celestialData.sun.visibleSize;
  sunNode.mesh.geometry.dispose();
  sunNode.mesh.geometry = new THREE.SphereGeometry(sunSize, 32, 32);
  sunNode.corona.scale.set(sunSize * 2.8, sunSize * 2.8, 1);
  sunNode.size = sunSize;

  // Update Planet sizes and distances
  Object.keys(planets).forEach(key => {
    const p = planets[key];
    const data = celestialData[key];
    
    const size = isRealisticScale ? data.realisticSize : data.visibleSize;
    const distance = isRealisticScale ? data.realisticDistance : data.visibleDistance;
    
    p.size = size;
    p.distance = distance;
    
    // Update sphere geometry
    p.mesh.geometry.dispose();
    p.mesh.geometry = new THREE.SphereGeometry(size, 32, 32);
    
    // Update Ring scale if Saturn/Uranus
    if (p.ringMesh) {
      p.ringMesh.geometry.dispose();
      const rInner = size * (data.ringInner / data.visibleSize);
      const rOuter = size * (data.ringOuter / data.visibleSize);
      p.ringMesh.geometry = new THREE.RingGeometry(rInner, rOuter, 64);
      p.ringMesh.geometry.rotateX(-Math.PI / 2);
    }
    
    // Redraw orbits circles
    scene.remove(p.orbitLine);
    p.orbitLine.geometry.dispose();
    p.orbitLine = createOrbitLine(distance, data.color);
    scene.add(p.orbitLine);
  });
  
  // Re-adjust camera distance focus if zoom is set on Sun
  if (focusedObjectKey === 'sun') {
    const presetDist = isRealisticScale ? 300 : 150;
    controls.maxDistance = isRealisticScale ? 2500 : 1000;
  }
}

// --- Simulation Logic variables ---
let simulationSpeed = 1.0;
let isPaused = false;
let focusedObjectKey = 'sun'; // Sun is default target lock
let activePresetView = null;

// Camera Fly transitions tracking variables
let isTransitioning = false;
let transitionProgress = 0;
const camStartPos = new THREE.Vector3();
const camEndPos = new THREE.Vector3();
const targetStartPos = new THREE.Vector3();
const targetEndPos = new THREE.Vector3();

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function startCameraTransition(endPos, endTarget) {
  isTransitioning = true;
  transitionProgress = 0;
  camStartPos.copy(camera.position);
  camEndPos.copy(endPos);
  targetStartPos.copy(controls.target);
  targetEndPos.copy(endTarget);
}

// Cancel camera glides if user manual orbits starts
controls.addEventListener('start', () => {
  isTransitioning = false;
  activePresetView = null;
  // Deselect active preset button highlighting
  document.querySelectorAll('.view-grid .btn').forEach(btn => btn.classList.remove('active'));
});

// Helper: Get active coordinate position of focused target
function getTargetPosition(key) {
  if (key === 'sun') return new THREE.Vector3(0, 0, 0);
  const p = planets[key];
  if (p) {
    return new THREE.Vector3(
      Math.cos(p.angle) * p.distance,
      0,
      Math.sin(p.angle) * p.distance
    );
  }
  return new THREE.Vector3(0, 0, 0);
}

// Select planet focus interface
function selectPlanet(key) {
  focusedObjectKey = key;
  
  // Highlight UI elements
  const dropdown = document.getElementById('planet-select');
  dropdown.value = key;
  
  // Retrieve target data
  const data = celestialData[key];
  
  // Update Details card text panel (Right panel)
  document.getElementById('planet-info-name').innerText = data.name;
  document.getElementById('planet-info-type').innerText = data.type;
  document.getElementById('planet-info-desc').innerText = data.desc;
  
  document.getElementById('stat-diameter').innerHTML = `${data.diameter}`;
  document.getElementById('stat-mass').innerHTML = `${data.mass} <span>x Earth</span>`;
  document.getElementById('stat-velocity').innerHTML = `${data.velocity}`;
  document.getElementById('stat-temp').innerHTML = `${data.temp}`;
  
  // Update details card color icon
  document.getElementById('planet-info-icon').style.background = `radial-gradient(circle, #fff 0%, ${data.color} 60%, #000 100%)`;
  
  // Compute flight zoom endpoint position
  const targetPos = getTargetPosition(key);
  let zoomDist = 28;
  
  if (key === 'sun') {
    zoomDist = isRealisticScale ? 90 : 45;
  } else {
    zoomDist = planets[key].size * 4.2;
    // Add rings clearance spacer
    if (data.hasRings) {
      const ringOuterVal = planets[key].size * (data.ringOuter / data.visibleSize);
      zoomDist = ringOuterVal * 1.8;
    }
  }
  
  // Zoom positioning offset (tilted 15 degrees above the horizontal plane)
  const offset = new THREE.Vector3(zoomDist * 0.9, zoomDist * 0.35, zoomDist * 0.9);
  const endCameraPos = targetPos.clone().add(offset);
  
  startCameraTransition(endCameraPos, targetPos);
}

// 6 Direction View Presets Selection
function setPresetView(direction) {
  activePresetView = direction;
  
  // UI active class highlights
  document.querySelectorAll('.view-grid .btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`view-${direction}`).classList.add('active');
  
  const targetPos = getTargetPosition(focusedObjectKey);
  let dist = 100;
  
  if (focusedObjectKey === 'sun') {
    dist = isRealisticScale ? 340 : 160;
  } else {
    const p = planets[focusedObjectKey];
    dist = p.size * 4.5;
    if (celestialData[focusedObjectKey].hasRings) {
      const ringOuterVal = p.size * (celestialData[focusedObjectKey].ringOuter / celestialData[focusedObjectKey].visibleSize);
      dist = ringOuterVal * 2.0;
    }
  }
  
  const offset = new THREE.Vector3();
  switch(direction) {
    case 'top': 
      offset.set(0, dist, 0.001); // 0.001 offset prevents gimbal lock
      break;
    case 'bottom': 
      offset.set(0, -dist, -0.001); 
      break;
    case 'front': 
      offset.set(0, 0, dist); 
      break;
    case 'back': 
      offset.set(0, 0, -dist); 
      break;
    case 'left': 
      offset.set(-dist, 0, 0); 
      break;
    case 'right': 
      offset.set(dist, 0, 0); 
      break;
  }
  
  const endCameraPos = targetPos.clone().add(offset);
  startCameraTransition(endCameraPos, targetPos);
}

// --- Wire up HTML Controls Event Listeners ---
// Focus dropdown change
document.getElementById('planet-select').addEventListener('change', (e) => {
  selectPlanet(e.target.value);
});

// View Preset buttons
document.querySelectorAll('.view-grid .btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const direction = e.target.getAttribute('data-view');
    setPresetView(direction);
  });
});

// Speed slider input
const speedSlider = document.getElementById('speed-slider');
const speedValText = document.getElementById('speed-value');
speedSlider.addEventListener('input', (e) => {
  const val = parseFloat(e.target.value) / 100;
  simulationSpeed = val;
  speedValText.innerText = `${val.toFixed(1)}x`;
  
  isPaused = (val === 0);
  updateSpeedPresetsHighlight(e.target.value);
});

// Speed Quick Presets
document.querySelectorAll('.speed-presets .btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const speedPreset = parseInt(e.target.getAttribute('data-speed'));
    speedSlider.value = speedPreset;
    
    simulationSpeed = speedPreset / 100;
    speedValText.innerText = `${(simulationSpeed).toFixed(1)}x`;
    isPaused = (speedPreset === 0);
    
    updateSpeedPresetsHighlight(speedPreset);
  });
});

function updateSpeedPresetsHighlight(val) {
  document.querySelectorAll('.speed-presets .btn').forEach(btn => btn.classList.remove('active'));
  if (val == 0) document.getElementById('speed-pause').classList.add('active');
  else if (val == 100) document.getElementById('speed-1x').classList.add('active');
  else if (val == 200) document.getElementById('speed-2x').classList.add('active');
  else if (val == 500) document.getElementById('speed-5x').classList.add('active');
}
updateSpeedPresetsHighlight(100);

// Visual Toggles
const toggleOrbits = document.getElementById('toggle-orbits');
toggleOrbits.addEventListener('change', (e) => {
  Object.keys(planets).forEach(key => {
    planets[key].orbitLine.visible = e.target.checked;
  });
});

const toggleLabels = document.getElementById('toggle-labels');
toggleLabels.addEventListener('change', (e) => {
  const visible = e.target.checked;
  document.querySelectorAll('.planet-lbl').forEach(el => {
    el.style.display = visible ? 'block' : 'none';
  });
});

const toggleScale = document.getElementById('toggle-scale');
toggleScale.addEventListener('change', (e) => {
  isRealisticScale = e.target.checked;
  updateScaleSystem();
});

// Double click raycast listener for quick focus
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('dblclick', (e) => {
  // Prevent raycast triggering if user clicked on panels
  if (e.target.closest('.panel') || e.target.closest('header') || e.target.closest('.instructions')) return;

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  
  // Gather children lists
  const meshesToTest = [];
  Object.keys(planets).forEach(k => meshesToTest.push(planets[k].mesh));
  meshesToTest.push(sunNode.mesh);

  const intersects = raycaster.intersectObjects(meshesToTest);
  
  if (intersects.length > 0) {
    const hitObj = intersects[0].object;
    if (hitObj.userData && hitObj.userData.planetKey) {
      selectPlanet(hitObj.userData.planetKey);
    }
  }
});

// Window resize event handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Main Animation Loop ---
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const dt = clock.getDelta();
  const speedMult = isPaused ? 0 : simulationSpeed;

  // 1. Orbital Physics update and self-rotation updates
  // Sun rotation
  sunNode.mesh.rotation.y += celestialData.sun.rotationSpeed * dt * speedMult;

  // Planets rotation
  Object.keys(planets).forEach(key => {
    const p = planets[key];
    const data = celestialData[key];
    
    // Orbital path updates
    p.angle += data.orbitSpeed * dt * speedMult;
    
    // Move group center coordinates
    const targetX = Math.cos(p.angle) * p.distance;
    const targetZ = Math.sin(p.angle) * p.distance;
    p.group.position.set(targetX, 0, targetZ);
    
    // Self rotation of planet mesh inside group
    p.mesh.rotation.y += data.rotationSpeed * dt * speedMult;
    
    // Clouds rotation offset (Earth)
    if (p.cloudsMesh) {
      p.cloudsMesh.rotation.y += (data.rotationSpeed + 0.015) * dt * speedMult;
    }
  });

  // 2. Camera flying tween interpolation
  if (isTransitioning) {
    transitionProgress += dt * 1.5; // transition speed multiplier
    
    if (transitionProgress >= 1.0) {
      transitionProgress = 1.0;
      isTransitioning = false;
    }
    
    const t = easeInOutCubic(transitionProgress);
    
    // Glide controls target focus to dynamic position
    const currentTargetPos = getTargetPosition(focusedObjectKey);
    const activeTarget = new THREE.Vector3().lerpVectors(targetStartPos, currentTargetPos, t);
    controls.target.copy(activeTarget);
    
    // Glide camera position
    // If tracking a moving planet, offset ends must adjust to moving targets
    let endCameraPos;
    if (activePresetView) {
      // Offset calculation for predefined angles
      let presetDist = 100;
      if (focusedObjectKey === 'sun') {
        presetDist = isRealisticScale ? 340 : 160;
      } else {
        presetDist = planets[focusedObjectKey].size * 4.5;
        if (celestialData[focusedObjectKey].hasRings) {
          const ringOuterVal = planets[focusedObjectKey].size * (celestialData[focusedObjectKey].ringOuter / celestialData[focusedObjectKey].visibleSize);
          presetDist = ringOuterVal * 2.0;
        }
      }
      
      const offset = new THREE.Vector3();
      switch(activePresetView) {
        case 'top': offset.set(0, presetDist, 0.001); break;
        case 'bottom': offset.set(0, -presetDist, -0.001); break;
        case 'front': offset.set(0, 0, presetDist); break;
        case 'back': offset.set(0, 0, -presetDist); break;
        case 'left': offset.set(-presetDist, 0, 0); break;
        case 'right': offset.set(presetDist, 0, 0); break;
      }
      endCameraPos = currentTargetPos.clone().add(offset);
    } else {
      // Interpolate to basic zoom frame offset
      let zoomDist = 28;
      if (focusedObjectKey === 'sun') {
        zoomDist = isRealisticScale ? 90 : 45;
      } else {
        zoomDist = planets[focusedObjectKey].size * 4.2;
        if (celestialData[focusedObjectKey].hasRings) {
          const ringOuterVal = planets[focusedObjectKey].size * (celestialData[focusedObjectKey].ringOuter / celestialData[focusedObjectKey].visibleSize);
          zoomDist = ringOuterVal * 1.8;
        }
      }
      const offset = new THREE.Vector3(zoomDist * 0.9, zoomDist * 0.35, zoomDist * 0.9);
      endCameraPos = currentTargetPos.clone().add(offset);
    }

    const currentCameraPos = new THREE.Vector3().lerpVectors(camStartPos, endCameraPos, t);
    camera.position.copy(currentCameraPos);
  } 
  else {
    // Standard locking of camera center to active celestial node
    const targetPos = getTargetPosition(focusedObjectKey);
    
    // Calculate the movement delta of target and shift camera by that delta
    const delta = targetPos.clone().sub(controls.target);
    controls.target.copy(targetPos);
    camera.position.add(delta);
  }

  controls.update();

  // 3. Project 3D labels onto screen coordinates
  const tempV = new THREE.Vector3();
  Object.keys(planets).forEach(key => {
    const p = planets[key];
    const labelEl = p.labelElement;
    
    p.mesh.getWorldPosition(tempV);
    tempV.project(camera);
    
    // Convert NDC (-1 to +1) coordinates to screen CSS coordinates
    const x = (tempV.x * 0.5 + 0.5) * window.innerWidth;
    const y = (tempV.y * -0.5 + 0.5) * window.innerHeight;
    
    labelEl.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
    
    // Hide labels if behind the camera or out of bounds
    if (tempV.z > 1 || x < 0 || x > window.innerWidth || y < 0 || y > window.innerHeight) {
      labelEl.style.display = 'none';
    } else {
      labelEl.style.display = toggleLabels.checked ? 'block' : 'none';
    }
  });

  renderer.render(scene, camera);
}

// Trigger initial selection load
selectPlanet('sun');
animate();
