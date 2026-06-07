/* ============================================
   THREE.JS 3D SCENE - HERO SECTION
   Elemento 3D minimalista e moderno
   ============================================ */

let scene, camera, renderer, cube, particles;

function initThreeScene() {
    const canvas = document.getElementById('canvas3d');
    
    if (!canvas) return;

    // Scene setup
    scene = new THREE.Scene();
    scene.background = null;

    // Camera setup
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 3;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true, 
        alpha: true 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x667eea, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x764ba2, 0.8, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Create rotating cube
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const material = new THREE.MeshPhongMaterial({
        color: 0x667eea,
        emissive: 0x667eea,
        emissiveIntensity: 0.2,
        wireframe: false,
        shininess: 100
    });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Add edges to cube
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0x00d4ff, linewidth: 2 })
    );
    cube.add(line);

    // Create particle system
    createParticles();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation
    animate();
}

function createParticles() {
    const particleCount = 30;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 10;
        positions[i + 1] = (Math.random() - 0.5) * 10;
        positions[i + 2] = (Math.random() - 0.5) * 10;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x00d4ff,
        size: 0.1,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.6
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate cube
    cube.rotation.x += 0.003;
    cube.rotation.y += 0.005;
    cube.rotation.z += 0.002;

    // Animate particles
    if (particles) {
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.0008;
        
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(Date.now() * 0.0001 + i) * 0.01;
        }
        particles.geometry.attributes.position.needsUpdate = true;
    }

    // Subtle zoom effect
    const scale = 1 + Math.sin(Date.now() * 0.0005) * 0.05;
    cube.scale.set(scale, scale, scale);

    renderer.render(scene, camera);
}

function onWindowResize() {
    const canvas = document.getElementById('canvas3d');
    if (!canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initThreeScene);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (renderer) {
        renderer.dispose();
    }
});
