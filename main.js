// Create the scene
const scene = new THREE.Scene();

// Create a camera, which determines what we'll see when we render the scene
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 1100;
camera.position.y = 500;
camera.rotation.x = -Math.PI / 6;

// Create a renderer and add it to the DOM
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create geometry and material for the terrain
const cols = 100;
const rows = 60;
const geometry = new THREE.PlaneGeometry(2000, 2000, cols - 1, rows - 1);
const material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, wireframe: true });
const terrain = new THREE.Mesh(geometry, material);
terrain.rotation.x = -Math.PI / 2; // Rotate to make it horizontal
scene.add(terrain);

let flying = 0;

// Initialize the Simplex noise generator
const simplex = new SimplexNoise();

function animate() {
  requestAnimationFrame(animate);

  flying -= 0.1;
  const yoff = flying;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      const index = x + y * cols;
      geometry.attributes.position.array[index * 3 + 2] = THREE.MathUtils.mapLinear(
        simplex.noise2D(x * 0.2, yoff + y * 0.2),
        -1, 1, -100, 100
      );
      xoff += 0.2;
    }
  }
  geometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

animate();
