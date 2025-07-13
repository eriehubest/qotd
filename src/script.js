import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import CANNON from 'cannon'

/**
 * Base
 */

const world = CANNON.World()

// Debug
const gui = new GUI({
    width: 360
})
gui.close()
gui.hide()

window.addEventListener('keydown', function(event){
    if(event.key === 'h'){
        gui.show(gui._hidden)
    }
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 * 
 */
const parameters = {
    count: 82700,
    size: 0.001,
    radius: 1.84,
    branches: 3,
    spin: 5,
    randomness: 0.33,
    randomnessPower: 2.74,
    insideColor: '#ff6030',
    outsideColor: '#1b3984'
}

const textureLoader = new THREE.TextureLoader()

/**
 * Test cube
 */

let geometry = null
let material = null
let points = null

const generateGalaxy = () =>
{
    // Destroy old galaxy
    if(points !== null)
    {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)

    for(let i = 0; i < parameters.count; i++)
    {
        // Position
        const i3 = i * 3

        const radius = Math.random() * parameters.radius

        const spinAngle = radius * parameters.spin
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
        
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius

        positions[i3    ] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = (Math.random()-0.5)* 0.01
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        // Color
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / parameters.radius)
        
        colors[i3    ] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    /**
     * Material
     */
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    /**
     * Points
     */
    points = new THREE.Points(geometry, material)
    scene.add(points)
}

generateGalaxy()

gui.add(parameters, 'count').min(100).max(100000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(0.1).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.01).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 0
camera.position.x = 2
camera.position.y = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

let scrollY = window.scrollY

window.addEventListener('scroll', () => {
    scrollY = window.scrollY
    console.log(scrollY)
})
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{

    camera.position.y = scrollY/1000
    camera.position.x = 0.3

    const elapsedTime = clock.getElapsedTime()

    if (points) {
        points.rotation.y = elapsedTime * 0.03 // adjust speed as needed
        // points.rotation.z = elapsedTime * 0.001
        // points.rotation.x = elapsedTime * 0.001
    }
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

//for web

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }else {
      entry.target.classList.remove('show'); // fade out
    }
  });
}, {
    threshold: 0.5 // triggers when 10% is visible
});
document.querySelectorAll('.hidden-onshow').forEach(el => {
  observer.observe(el);
});

let isRegister = false; // ✅ Global scope

document.addEventListener('DOMContentLoaded', () => {
    const toggleLink = document.getElementById('togglelink');
    const toggleText = document.getElementById('toggleText');
    const formTitle = document.getElementById('formTitle');
    const confirmField = document.getElementById('confirmField');
    const box = document.querySelector('.registerform');

    toggleLink.addEventListener('click', function (e) {
        e.preventDefault();
        isRegister = !isRegister;

        if (isRegister) {
            formTitle.textContent = 'Register';
            confirmField.classList.remove('hidden');
            confirmPasswordInput.required = true; // ✅ make it required
            toggleText.textContent = 'Already have an account?';
            toggleLink.textContent = 'Login';
            box.style.height = '500px';
        } else {
            formTitle.textContent = 'Login';
            confirmField.classList.add('hidden');
            confirmPasswordInput.required = false; // ✅ disable required
            confirmPasswordInput.value = '';       // 🧹 clear field
            toggleText.textContent = "Don't have an account?";
            toggleLink.textContent = 'Register';
            box.style.height = '400px';
        }
    });

});
const form = document.querySelector('.registerform');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const welcomeScreen = document.getElementById('welcomeScreen');
const displayUsername = document.getElementById('displayUsername');
const logoutBtn = document.getElementById('logoutBtn');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (isRegister) {
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (users[username]) {
            alert("Username already taken!");
            return;
        }

        users[username] = {
            password: password,
            score: 0 // initial score
        };
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('loggedInUser', username);
        window.location.href = 'mypage.html';
    } else {
        if (!users[username] || users[username].password !== password) {
            alert("Invalid username or password.");
            return;
        }

        localStorage.setItem('loggedInUser', username);
        window.location.href = 'mypage.html';
    }
});

function showWelcome(username) {
    form.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
    displayUsername.textContent = username;
}

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');

    // Hide welcome screen
    welcomeScreen.classList.add('hidden');

    // Reset form fields
    usernameInput.value = '';
    passwordInput.value = '';
    confirmPasswordInput.value = '';

    // Fade form back in
    form.classList.remove('fade-out');     // ✅ Removes fade-out
});
const loggedInUser = localStorage.getItem('loggedInUser');
if (loggedInUser) {
    form.classList.add('fade-out');         // ✅ Hide the form smoothly
    showWelcome(loggedInUser);              // ✅ Show welcome screen
}
