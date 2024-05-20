// Import Three.js library
import * as THREE from 'three';

// Create a new 3D scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create a cube geometry and material
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// Create a cube mesh and add it to the scene
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Render the 3D scene using Phaser's built-in render function
function render() {
    requestAnimationFrame(render);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
render();