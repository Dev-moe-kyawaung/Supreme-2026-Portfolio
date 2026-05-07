// ====== THREE.js Hero Section with Particles ======
const canvas = document.getElementById('threeCanvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Lights
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5,5,5);
scene.add(dirLight);
const ambientLight = new THREE.AmbientLight(0xffffff,0.6);
scene.add(ambientLight);

// Hero Cube
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1.5,1.5,1.5),
    new THREE.MeshStandardMaterial({ color:0x00ffcc, roughness:0.4, metalness:0.6 })
);
cube.position.set(-1.2,0,0);
scene.add(cube);

// Hero Sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.8,32,32),
    new THREE.MeshStandardMaterial({ color:0xff0077, roughness:0.3, metalness:0.5 })
);
sphere.position.set(1.2,0,0);
scene.add(sphere);

// Particle background
const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 400;
const positions = [];
for(let i=0;i<particleCount;i++){
    positions.push((Math.random()-0.5)*20); // x
    positions.push((Math.random()-0.5)*10); // y
    positions.push((Math.random()-0.5)*20); // z
}
particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions,3));
const particlesMaterial = new THREE.PointsMaterial({ color:0xffffff, size:0.05 });
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

camera.position.z = 5;

// Animate hero objects and particles
function animateHero(){
    requestAnimationFrame(animateHero);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    sphere.rotation.y += 0.02;
    sphere.position.y = Math.sin(Date.now()*0.002)*0.5;
    particles.rotation.y += 0.001;
    renderer.render(scene, camera);
}
animateHero();

// Responsive
window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if(window.innerWidth < 768){
        cube.scale.set(0.7,0.7,0.7);
        sphere.scale.set(0.6,0.6,0.6);
    }
});

// Hero Text Animations (GSAP)
gsap.from('.hero-text h1', { opacity:0, y:-50, duration:1 });
gsap.from('.hero-text p', { opacity:0, y:20, delay:0.5, duration:1 });
gsap.from('.hero-text .btn', { opacity:0, y:20, delay:1, duration:1, stagger:0.2 });
gsap.to('.hero-text h1', { y:10, repeat:-1, yoyo:true, duration:2, ease:'sine.inOut' });
gsap.to('.hero-text p', { y:5, repeat:-1, yoyo:true, duration:2, delay:0.3, ease:'sine.inOut' });

// Mouse-interactive rotation
document.addEventListener('mousemove', e=>{
    const x = (e.clientX/window.innerWidth - 0.5)*0.5;
    const y = (e.clientY/window.innerHeight - 0.5)*0.5;
    cube.rotation.x = y;
    cube.rotation.y = x;
});

// ====== Dark/Light Mode Toggle ======
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
if(localStorage.getItem('theme')==='dark'){ body.classList.add('dark-mode'); }
themeToggle.addEventListener('click', ()=>{
    body.classList.toggle('dark-mode');
    localStorage.setItem('theme', body.classList.contains('dark-mode')?'dark':'light');
});

// ====== Filterable Projects ======
const filterBtns = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');
filterBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
        const filter = btn.dataset.filter;
        projectItems.forEach(item=>{
            if(filter==='all'||item.dataset.category===filter){
                item.style.display='block';
                gsap.to(item,{opacity:1,duration:0.5});
            }else{
                gsap.to(item,{opacity:0,duration:0.5,onComplete:()=>item.style.display='none'});
            }
        });
    });
});

// ====== Smooth Scroll ======
document.querySelectorAll('.nav-link').forEach(link=>{
    link.addEventListener('click', e=>{
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        target.scrollIntoView({ behavior:'smooth' });
    });
});

// ====== Skill Bars Animation ======
const skills = document.querySelectorAll('.progress-bar');
const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            const bar = entry.target;
            gsap.to(bar, { width: bar.style.width, duration:1.5, ease:'power2.out' });
        }
    });
},{threshold:0.5});
skills.forEach(bar=>observer.observe(bar));

// ====== Contact Form Confetti Demo ======
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', e=>{
    e.preventDefault();
    for(let i=0;i<100;i++){
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random()*100+'%';
        confetti.style.backgroundColor = `hsl(${Math.random()*360},100%,50%)`;
        document.body.appendChild(confetti);
        gsap.to(confetti,{y:window.innerHeight+100,rotation:Math.random()*360,duration:3+Math.random()*2,onComplete:()=>confetti.remove()});
    }
    alert("Message sent! (Demo only – integrate EmailJS or backend later)");
    contactForm.reset();
});
