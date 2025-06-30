import { motion, useInView } from 'framer-motion';
import { useContext, useEffect, useState, useRef } from 'react';
import { ThemeContext } from '../App';
import * as THREE from 'three';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Project.css';

// Import project images (replace with your actual image paths)
import BlogImage from '../assets/blog-project.jpg';
import YoutubeImage from '../assets/youtube-clone.jpg';
import PizzaImage from '../assets/pizza-shop.jpg';
import DeepfakeImage from '../assets/deepfake-detection.jpg';
import MovieImage from '../assets/movie-website.jpg';
import TravelImage from '../assets/travel-website.jpg';
import HealthImage from '../assets/health-prediction.jpg';
import DesktopImage from '../assets/desktop-assistant.jpg';
import BlockchainImage from '../assets/blockchain-project.jpg';

const projects = [
  {
    id: 1,
    name: "AK Blog Platform",
    image: BlogImage,
    description: "A full-featured blogging platform with user authentication, rich text editing, and social sharing features.",
    purpose: "To create a community-driven content platform with modern UI/UX",
    technologies: ["React", "Node.js", "MongoDB", "Firebase Auth", "Quill.js"],
    category: "Web Development",
    demoUrl: "https://ak-blog-iota.vercel.app/",
    githubUrl: "https://github.com/AK-WORLD01/akera"
  },
  {
    id: 2,
    name: "YouTube Clone (Frontend)",
    image: YoutubeImage,
    description: "A responsive YouTube interface clone with video playback, search functionality, and channel pages.",
    purpose: "Demonstrate frontend skills with complex UI replication",
    technologies: ["React", "Material UI", "YouTube API", "Redux"],
    category: "Frontend",
    demoUrl: "https://next13-youtube-clone.vercel.app/",
    githubUrl: "https://github.com/AK-WORLD01/AK-youtube-clone/tree/main/Youtube-Clone-main"
  },
  {
    id: 3,
    name: "Pizza Shop ONLINE",
    image: PizzaImage,
    description: "Complete e-commerce solution for a pizza restaurant with online ordering, payment processing, and admin dashboard.",
    purpose: "Showcase full-stack development capabilities",
    technologies: ["React", "Express", "PostgreSQL", "Stripe API", "Tailwind CSS"],
    category: "Full Stack",
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    id: 4,
    name: "Deepfake Video Detection",
    image: DeepfakeImage,
    description: "AI-powered platform that analyzes videos to detect deepfake manipulation with accuracy metrics.",
    purpose: "Combat misinformation in digital media",
    technologies: ["Python", "TensorFlow", "OpenCV", "Flask", "React"],
    category: "AI/ML",
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    id: 5,
    name: "FILMZOO",
    image: MovieImage,
    description: "Movie discovery platform with showtimes, ratings, and personalized recommendations.",
    purpose: "Modern alternative to traditional movie websites",
    technologies: ["React", "TMDB API", "Firebase", "GSAP Animations"],
    category: "Entertainment",
    demoUrl: "https://ak-world01.github.io/AK-filmzoo/Movie-Website-main/Movie%20Website/",
    githubUrl: "https://github.com/AK-WORLD01/AK-filmzoo"
  },
  {
    id: 6,
    name: "Travel",
    image: TravelImage,
    description: "Comprehensive travel planning website with itinerary builder, destination guides, and booking integration.",
    purpose: "Simplify travel planning experience",
    technologies: ["Next.js", "MongoDB", "Mapbox GL", "Tailwind CSS"],
    category: "Travel",
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    id: 7,
    name: "HealthGuard Predictions",
    image: HealthImage,
    description: "Machine learning system that predicts disease risks based on symptoms and health metrics.",
    purpose: "Early detection of potential health issues",
    technologies: ["Python 3.10", "Scikit-learn", "streamlit", "React"],
    category: "Healthcare",
    demoUrl: "https://multiple-disease-prediction-6pdpkq9rylgp6twjwf46dj.streamlit.app/",
    githubUrl: "https://github.com/AK-WORLD01/multiple-disease-prediction"
  },
  {
    id: 8,
    name: "Help Desk Tool",
    image: DesktopImage,
    description: "Developed a full-stack Help Desk Tool to streamline IT support workflows. The platform allows admins to register engineers and employees, assign tickets, and monitor ticket progress. Employees can raise complaints, track the status of their tickets in real-time, and view ticket history. Engineers receive instant notifications for assigned tickets, take action, and provide feedback to both the employee and admin. The tool focuses on quick resolution and clear communication among all roles.",
    purpose: "To provide an efficient and real-time ticket management system for IT support teams, improving communication and response times.",
    technologies: ["React.js", "Node.js", "MySQL", "Express.js", "Bootstrap", "Inline CSS"],
    category: "Desktop App",
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    id: 9,
    name: "Anti-curruption-portal",
    image: BlockchainImage,
    description: "Blockchain-based platform for reporting and tracking corruption cases with anonymous submissions.",
    purpose: "Promote government and corporate accountability",
    technologies: ["inlinecss", "mysql", "Express.js", "React", "Node.js"],
    category: "Blockchain",
    demoUrl: "#",
    githubUrl: "#"
  }
];

const ProjectPage = () => {
  const { theme } = useContext(ThemeContext);
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const autoSlideTimeoutRef = useRef(null);
  const [fallStartTimes, setFallStartTimes] = useState([]);
  const [splashCompleted, setSplashCompleted] = useState(false);

  // Colors for styling
  const colors = {
    light: {
      border: 'white',
      text: '#007bff',
      buttonBg: 'transparent',
      buttonBorder: '#007bff',
      badgeBg: '#e9ecef',
      badgeText: '#333333',
      shadow: '0 20px 30px rgba(0,0,0,0.3)',
      cardBg: '#ffffff',
    },
    dark: {
      border: 'rgba(0,0,0,0)',
      text: '#ff00ff',
      buttonBg: '#9d00ff',
      buttonBorder: '#ff00ff',
      badgeBg: 'rgba(0,0,0,0.5)',
      badgeText: '#ffffff',
      shadow: '0 0 15px rgba(255, 0, 255, 0.69)',
      cardBg: 'rgba(0,0,0,0)',
    }
  };

  // Automatic sliding every 5 seconds
  useEffect(() => {
    if (isAutoSliding && isInView) {
      autoSlideTimeoutRef.current = setInterval(() => {
        setCurrentProjectIndex((prevIndex) => (prevIndex + 1) % projects.length);
      }, 5000);
    }
    return () => clearInterval(autoSlideTimeoutRef.current);
  }, [isAutoSliding, isInView]);

  // Handle manual navigation
  const handlePrevProject = () => {
    setIsAutoSliding(false);
    setCurrentProjectIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length);
    clearInterval(autoSlideTimeoutRef.current);
    // Resume auto-sliding after 10 seconds of inactivity
    autoSlideTimeoutRef.current = setTimeout(() => setIsAutoSliding(true), 10000);
  };

  const handleNextProject = () => {
    setIsAutoSliding(false);
    setCurrentProjectIndex((prevIndex) => (prevIndex + 1) % projects.length);
    clearInterval(autoSlideTimeoutRef.current);
    // Resume auto-sliding after 10 seconds of inactivity
    autoSlideTimeoutRef.current = setTimeout(() => setIsAutoSliding(true), 10000);
  };

  // Initialize fall start times when section comes into view
  useEffect(() => {
    if (isInView) {
      setFallStartTimes(Array(4).fill().map((_, i) => Date.now() + i * 100));
      setSplashCompleted(false);
    } else {
      setFallStartTimes([]);
      setSplashCompleted(false);
    }
  }, [isInView]);

  // Three.js setup for water-like spheres
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const vertexShader = `
      varying vec3 vNormal;
      varying vec2 vUv;
      uniform float time;
      uniform float rippleFreq;
      void main() {
        vNormal = normal;
        vUv = uv;
        vec3 pos = position;
        pos += 0.15 * sin(time * rippleFreq + pos.x * 5.0) * normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec3 vNormal;
      varying vec2 vUv;
      uniform float time;
      uniform vec3 neonColor;
      uniform float opacityMod;
      void main() {
        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
        float diff = max(dot(vNormal, lightDir), 0.0);
        float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
        vec3 glow = neonColor * (0.5 + 0.5 * sin(time * 2.0));
        vec3 color = mix(vec3(0.1, 0.2, 0.3), glow, fresnel + diff * 0.5);
        gl_FragColor = vec4(color, (0.8 + 0.2 * sin(time)) * opacityMod);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        neonColor: { value: new THREE.Color(theme === 'dark' ? '#00aaff' : '#0077cc') },
        opacityMod: { value: 1.0 },
        rippleFreq: { value: 1.0 },
      },
      transparent: true,
      side: THREE.DoubleSide,
    });

    const spheres = [
      { radius: 2.0, segments: 32, pos: [0, -2, -2], color: theme === 'dark' ? '#00aaff' : '#0077cc', opacityMod: 0.9, rippleFreq: 0.8 },
      { radius: 0.5, segments: 16, pos: [-4, -3, -1.5], color: theme === 'dark' ? '#33bbff' : '#roring6bb', opacityMod: 0.7, rippleFreq: 1.4 },
      { radius: 1.0, segments: 32, pos: [4, -2, -1.5], color: theme === 'dark' ? '#00ccff' : '#0088dd', opacityMod: 0.85, rippleFreq: 1.2 },
      { radius: 1.5, segments: 32, pos: [-4, -1, -1.5], color: theme === 'dark' ? '#0099ff' : '#0055aa', opacityMod: 1.0, rippleFreq: 1.0 },
    ];

    const sphereMeshes = spheres.map((config, index) => {
      const geometry = new THREE.SphereGeometry(config.radius, config.segments, config.segments);
      const sphereMaterial = material.clone();
      sphereMaterial.uniforms.neonColor.value = new THREE.Color(config.color);
      sphereMaterial.uniforms.opacityMod.value = config.opacityMod;
      sphereMaterial.uniforms.rippleFreq.value = config.rippleFreq;
      const sphere = new THREE.Mesh(geometry, sphereMaterial);
      sphere.position.set(...config.pos);
      scene.add(sphere);
      return { mesh: sphere, geometry, config };
    });

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 50;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const lifetimes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      velocities[i * 3] = (Math.random() - 0.5) * 2;
      velocities[i * 3 + 1] = Math.random() * 2 + 1;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 2;
      lifetimes[i] = 0;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    particleGeometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      color: theme === 'dark' ? '#00aaff' : '#0077cc',
      size: 0.1,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const splashSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(splashSystem);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    camera.position.z = 7;

    let startTime = Date.now();
    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = (Date.now() - startTime) / 1000;

      sphereMeshes.forEach((sphere, index) => {
        const { mesh, config } = sphere;
        mesh.material.uniforms.time.value = elapsedTime;

        if (isInView && fallStartTimes[index]) {
          const fallElapsed = (Date.now() - fallStartTimes[index]) / 1000;
          const fallDuration = 0.8;
          const progress = Math.min(fallElapsed / fallDuration, 1);

          if (progress < 1) {
            const startY = 10;
            const targetY = config.pos[1];
            const startX = config.pos[0];
            const wobble = Math.sin(fallElapsed * 5) * 0.2;
            mesh.position.x = startX + wobble;
            mesh.position.y = startY + (targetY - startY) * progress;
            mesh.position.z = config.pos[2];
            mesh.scale.setScalar(1 - 0.2 * progress);
            mesh.material.uniforms.opacityMod.value = config.opacityMod * progress;
          } else {
            if (!splashCompleted) {
              for (let i = 0; i < particleCount; i++) {
                positions[i * 3] = mesh.position.x;
                positions[i * 3 + 1] = mesh.position.y;
                positions[i * 3 + 2] = mesh.position.z;
                lifetimes[i] = Math.random() * 0.5 + 0.5;
              }
              particleGeometry.attributes.position.needsUpdate = true;
              particleGeometry.attributes.lifetime.needsUpdate = true;
            }

            mesh.position.x = config.pos[0] + Math.sin(elapsedTime * (0.5 + index * 0.1)) * 0.5;
            mesh.position.y = config.pos[1] + Math.cos(elapsedTime * (0.6 + index * 0.15)) * 0.4;
            mesh.position.z = config.pos[2] + Math.sin(elapsedTime * (0.3 + index * 0.05)) * 0.3;
            mesh.rotation.y += 0.01 * (1 - index * 0.2);
            mesh.scale.setScalar(1);
            mesh.material.uniforms.opacityMod.value = config.opacityMod;
          }
        } else {
          mesh.position.y = config.pos[1] - 100;
          mesh.material.uniforms.opacityMod.value = 0;
        }
      });

      if (!splashCompleted) {
        for (let i = 0; i < particleCount; i++) {
          if (lifetimes[i] > 0) {
            positions[i * 3] += velocities[i * 3] * 0.05;
            positions[i * 3 + 1] += velocities[i * 3 + 1] * 0.05;
            positions[i * 3 + 2] += velocities[i * 3 + 2] * 0.05;
            velocities[i * 3 + 1] -= 0.1;
            lifetimes[i] -= 0.02;
            if (lifetimes[i] <= 0) lifetimes[i] = 0;
          }
        }
        particleGeometry.attributes.position.needsUpdate = true;
        particleGeometry.attributes.lifetime.needsUpdate = true;
        particleMaterial.opacity = Math.max(0, particleMaterial.opacity - 0.01);
        if (particleMaterial.opacity <= 0) setSplashCompleted(true);
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      sphereMeshes.forEach(({ geometry, mesh }) => {
        geometry.dispose();
        mesh.material.dispose();
      });
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, [theme, isInView, fallStartTimes, splashCompleted]);

  return (
    <section id="projects" className="project-container" style={{
      backgroundColor: theme === 'dark' ? 'rgb(0, 0, 0)' : '#ffffff',
      color: theme === 'dark' ? '#ffffff' : '#333333',
      minHeight: '100vh',
      padding: '2rem',
      transition: 'all 0.5s ease'
    }}>
      {/* Three.js Canvas Header with Water Spheres */}
      <div className="position-relative mb-5">
        <motion.canvas
          ref={canvasRef}
          className="w-100 rounded shadow-lg"
          style={{
            height: '40vh',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 0
          }}
          animate={isInView ? { opacity: theme === 'dark' ? 0.5 : 0.4 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          className="position-absolute top-50 start-50 translate-middle text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="display-3 fw-bold neon-text" style={{
            color: theme === 'dark' ? '#ff00ff' : '#007bff',
            textShadow: theme === 'dark' ? '0 0 10px rgba(255, 0, 255, 0.43)' : 'none'
          }}>
            My Projects
          </h1>
          <p className="lead" style={{ color: theme === 'dark' ? '#00ffff' : '#007bff' }}>
            Interactive showcase of my development work
          </p>
        </motion.div>
      </div>

      {/* Project Slider with Navigation Buttons */}
      <section ref={sectionRef} className="container position-relative">
        <motion.div
          className="d-flex justify-content-center"
          initial={{ opacity: 0 }}
          animate={splashCompleted ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.div
            key={projects[currentProjectIndex].id}
            className="col-12 col-md-8 col-lg-6"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100, damping: 10 }}
          >
            <div className="neon-card h-100 d-flex flex-column" style={{
              backgroundColor: theme === 'dark' ? colors.dark.cardBg : colors.light.cardBg,
              border: `2px solid ${theme === 'dark' ? colors.dark.border : colors.light.border}`,
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: theme === 'dark' ? colors.dark.shadow : colors.light.shadow
            }}>
              {/* Project Image with Glow Effect */}
              <motion.div
                className="project-image-container"
                style={{
                  height: '250px',
                  overflow: 'hidden',
                  position: 'relative'
                }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={projects[currentProjectIndex].image} 
                  alt={projects[currentProjectIndex].name} 
                  className="w-100 h-100 object-fit-cover"
                />
                <div className="image-overlay" style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(to bottom, transparent 70%, ${
                    theme === 'dark' ? 'rgba(10, 10, 10, 0.9)' : 'rgba(248, 249, 250, 0.9)'
                  })`,
                  pointerEvents: 'none'
                }} />
              </motion.div>
              
              <div className="card-body d-flex flex-column p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h3 className="card-title" style={{ 
                    color: theme === 'dark' ? colors.dark.text : colors.light.text,
                    textShadow: theme === 'dark' ? `0 0 5px ${colors.dark.text}` : 'none'
                  }}>
                    {projects[currentProjectIndex].name}
                  </h3>
                  <span className="badge" style={{
                    backgroundColor: theme === 'dark' ? colors.dark.badgeBg : colors.light.badgeBg,
                    color: theme === 'dark' ? colors.dark.badgeText : colors.light.badgeText,
                    border: `1px solid ${theme === 'dark' ? colors.dark.border : colors.light.border}`
                  }}>
                    {projects[currentProjectIndex].category}
                  </span>
                </div>
                
                <p className="card-text flex-grow-1" style={{ minHeight: '80px' }}>
                  {projects[currentProjectIndex].description}
                </p>
                
                <div className="mb-3">
                  <h6 style={{ color: theme === 'dark' ? '#00ffff' : colors.light.text }}>Purpose:</h6>
                  <p>{projects[currentProjectIndex].purpose}</p>
                </div>
                
                <div className="mb-4">
                  <h6 style={{ color: theme === 'dark' ? '#00ffff' : colors.light.text }}>Technologies:</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {projects[currentProjectIndex].technologies.map(tech => (
                      <motion.span 
                        key={tech} 
                        className="badge" 
                        style={{
                          backgroundColor: theme === 'dark' ? colors.dark.badgeBg : colors.light.badgeBg,
                          color: theme === 'dark' ? colors.dark.badgeText : colors.light.badgeText
                        }}
                        whileHover={{ 
                          scale: 1.1,
                          backgroundColor: theme === 'dark' ? colors.dark.text : colors.light.text,
                          color: '#ffffff'
                        }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>
                
                <div className="d-flex gap-3 mt-auto justify-content-center">
                  <motion.a
                    href={projects[currentProjectIndex].demoUrl}
                    className="btn btn-sm"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: theme === 'dark' ? '0 0 10px rgba(23, 90, 184, 0.7)' : colors.light.shadow,
                      filter: 'contrast(1.2)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: 'linear-gradient(45deg, rgb(167, 40, 144), rgb(23, 71, 184))',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '25px',
                      padding: '10px',
                      minWidth: '180px',
                      textAlign: 'center',
                      lineHeight: '1.0'
                    }}
                  >
                    Live Demo
                  </motion.a>
                  <motion.a
                    href={projects[currentProjectIndex].githubUrl}
                    className="btn btn-sm"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: theme === 'dark' ? '0 0 10px rgba(40, 70, 167, 0.7)' : colors.light.shadow,
                      filter: 'contrast(1.2)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: 'linear-gradient(45deg, rgb(167, 40, 161), rgb(23, 71, 184))',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '25px',
                      padding: '10px',
                      minWidth: '180px',
                      textAlign: 'center',
                      lineHeight: '1.0'
                    }}
                  >
                    View Code
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.button
          className="btn btn-outline-primary position-absolute"
          style={{
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            borderColor: theme === 'dark' ? colors.dark.buttonBorder : colors.light.buttonBorder,
            color: theme === 'dark' ? colors.dark.text : colors.light.text,
            backgroundColor: 'transparent',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            zIndex: 1
          }}
          onClick={handlePrevProject}
          whileHover={{ scale: 1.1, backgroundColor: theme === 'dark' ? colors.dark.buttonBg : colors.light.text }}
          whileTap={{ scale: 0.9 }}
        >
          ←
        </motion.button>
        <motion.button
          className="btn btn-outline-primary position-absolute"
          style={{
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            borderColor: theme === 'dark' ? colors.dark.buttonBorder : colors.light.buttonBorder,
            color: theme === 'dark' ? colors.dark.text : colors.light.text,
            backgroundColor: 'transparent',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            zIndex: 1
          }}
          onClick={handleNextProject}
          whileHover={{ scale: 1.1, backgroundColor: theme === 'dark' ? colors.dark.buttonBg : colors.light.text }}
          whileTap={{ scale: 0.9 }}
        >
          →
        </motion.button>
      </section>

      {/* Footer */}
      <motion.footer 
        className="text-center mt-5 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ delay: 0.8 }}
      >
        <p style={{ color: theme === 'dark' ? '#9d00ff' : colors.light.text }}>
          {new Date().getFullYear()}
        </p>
        <div className="d-flex justify-content-center gap-3 mt-3">
          <motion.a
            href="https://github.com/Abhishek-ai966" // Replace with actual GitHub URL
            className="btn btn-sm"
            whileHover={{ 
              scale: 1.05,
              boxShadow: theme === 'dark' ? '0 0 10px rgba(23, 90, 184, 0.7)' : colors.light.shadow,
              filter: 'contrast(1.2)'
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'linear-gradient(45deg, rgb(167, 40, 144), rgb(23, 71, 184))',
              color: '#ffffff',
              border: 'none',
              borderRadius: '25px',
              padding: '8px 20px',
              minWidth: '120px',
              textAlign: 'center',
              lineHeight: '1.0'
            }}
          >
            GitHub 2
          </motion.a>
          <motion.a
            href="https://github.com/abhishekai0" // Replace with actual GitHub URL
            className="btn btn-sm"
            whileHover={{ 
              scale: 1.05,
              boxShadow: theme === 'dark' ? '0 0 10px rgba(23, 90, 184, 0.7)' : colors.light.shadow,
              filter: 'contrast(1.2)'
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'linear-gradient(45deg, rgb(167, 40, 161), rgb(23, 71, 184))',
              color: '#ffffff',
              border: 'none',
              borderRadius: '25px',
              padding: '8px 20px',
              minWidth: '120px',
              textAlign: 'center',
              lineHeight: '1.0'
            }}
          >
            GitHub 1
          </motion.a>
        </div>
        <motion.a
          href="https://github.com/AK-WORLD01" // Replace with actual GitHub profile or repo URL
          className="d-block mt-2"
          whileHover={{ 
            scale: 1.05,
            color: theme === 'dark' ? '#00ffff' : '#007bff'
          }}
          style={{
            color: theme === 'dark' ? '#9d00ff' : colors.light.text,
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}
        >
          See More Here
        </motion.a>
      </motion.footer>
    </section>
  );
};

export default ProjectPage;