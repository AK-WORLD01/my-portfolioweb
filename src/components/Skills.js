import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useContext, useState, useEffect, useRef } from 'react';
import { ThemeContext } from '../App';
import SoftSkills from './SoftSkills';
import TechnicalSkills from './TechnicalSkills';
import TechnicalLanguages from './TechnicalLanguages';
import Certifications from './Certifications';
import * as THREE from 'three';

const generateGlassyColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsla(${hue}, 60%, 85%, 0.25)`;
};

// Array of coding icons for the background
const codingIcons = ['.', '', '.', '', '.', '', '.', ''];

function Skills() {
  const { theme } = useContext(ThemeContext);
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState(0);
  const sectionRef = useRef(null);
  const skillsInView = useInView(sectionRef, { once: false, amount: 0.3 });
  const canvasRef = useRef(null);
  const [fallStartTimes, setFallStartTimes] = useState([]);

  const skillLinks = [
    { name: 'Soft Skills', component: <SoftSkills /> },
    { name: 'Technical Skills', component: <TechnicalSkills /> },
    { name: 'Technical Languages', component: <TechnicalLanguages /> },
    { name: 'Certifications', component: <Certifications /> },
  ];

  // Initialize fall start times when section comes into view
  useEffect(() => {
    if (skillsInView) {
      setFallStartTimes(Array(4).fill().map((_, i) => Date.now() + i * 100)); // Stagger by 100ms
    } else {
      setFallStartTimes([]);
    }
  }, [skillsInView]);

  // Three.js setup for spheres
  useEffect(() => {
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
        neonColor: { value: new THREE.Color(theme === 'dark' ? '#00ffff' : '#4b5eaa') },
        opacityMod: { value: 1.0 },
        rippleFreq: { value: 1.0 },
      },
      transparent: true,
      side: THREE.DoubleSide,
    });

    const spheres = [
      { radius: 2.0, segments: 32, pos: [0, 0, -2], color: theme === 'dark' ? '#ff00cc' : '#3b4e99', opacityMod: 0.9, rippleFreq: 0.8 },
      { radius: 0.5, segments: 16, pos: [-4, -3, -1.5], color: theme === 'dark' ? '#33ccff' : '#2e4188', opacityMod: 0.7, rippleFreq: 1.4 },
      { radius: 1.0, segments: 32, pos: [4, 3, -1.5], color: theme === 'dark' ? '#00ff00' : '#5c6fbb', opacityMod: 0.85, rippleFreq: 1.2 },
      { radius: 1.5, segments: 32, pos: [-4, 3, -1.5], color: theme === 'dark' ? '#00ffff' : '#4b5eaa', opacityMod: 1.0, rippleFreq: 1.0 },
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

        if (skillsInView && fallStartTimes[index]) {
          const fallElapsed = (Date.now() - fallStartTimes[index]) / 1000;
          const fallDuration = 0.8;
          const progress = Math.min(fallElapsed / fallDuration, 1);

          // Falling animation
          if (progress < 1) {
            const startY = 10; // Start at top
            const targetY = config.pos[1];
            const startX = config.pos[0];
            const wobble = Math.sin(fallElapsed * 5) * 0.2; // X-axis wobble
            mesh.position.x = startX + wobble;
            mesh.position.y = startY + (targetY - startY) * progress;
            mesh.position.z = config.pos[2];
            mesh.scale.setScalar(1 - 0.2 * progress); // Scale from 1 to 0.8
            mesh.material.uniforms.opacityMod.value = config.opacityMod * progress; // Fade in
          } else {
            // Settled with floating animation
            mesh.position.x = config.pos[0] + Math.sin(elapsedTime * (0.5 + index * 0.1)) * 0.5;
            mesh.position.y = config.pos[1] + Math.cos(elapsedTime * (0.6 + index * 0.15)) * 0.4;
            mesh.position.z = config.pos[2] + Math.sin(elapsedTime * (0.3 + index * 0.05)) * 0.3;
            mesh.rotation.y += 0.01 * (1 - index * 0.2);
            mesh.scale.setScalar(1);
            mesh.material.uniforms.opacityMod.value = config.opacityMod;
          }
        } else {
          mesh.position.y = config.pos[1] - 100; // Off-screen when not in view
          mesh.material.uniforms.opacityMod.value = 0;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    sphereMeshes.forEach((sphere, index) => {
      const config = spheres[index];
      sphere.mesh.material.uniforms.neonColor.value.set(theme === 'dark' ? config.color : config.color.replace('#00ffff', '#4b5eaa').replace('#ff00cc', '#3b4e99').replace('#00ff00', '#5c6fbb').replace('#33ccff', '#2e4188'));
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      sphereMeshes.forEach(({ geometry, mesh }) => {
        geometry.dispose();
        mesh.material.dispose();
      });
      renderer.dispose();
    };
  }, [theme, skillsInView, fallStartTimes]);

  // Updated tab variants for right-to-left animation
  const tabVariants = {
    initial: { x: 100, opacity: 0 }, // Start further right
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 }, // Exit to the left
  };

  // Get resume link from environment variable
  const resumeLink = process.env.REACT_APP_RESUME_LINK;

  // Warn if environment variable is not set
  useEffect(() => {
    if (!resumeLink) {
      console.warn('REACT_APP_RESUME_LINK environment variable is not set. The "Download Full Resume" button will be disabled.');
    }
  }, [resumeLink]);

  return (
    <motion.section
      id="skills"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`py-5 py-md-6 overflow-hidden position-relative ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-white text-dark'
      }`}
      ref={sectionRef}
    >
      {/* Three.js Canvas for Spheres */}
      <motion.canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
        animate={skillsInView ? { opacity: theme === 'dark' ? 0.5 : 0.4 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      />

      {/* Background Floating Neon Icons */}
      <div className="floating-icons">
        {[...Array(10)].map((_, index) => (
          <motion.div
            key={index}
            className="coding-icon"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0.3,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: [0.3, 0.5, 0.3],
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 20 + Math.random() * 10, // Slow animation (20-30s)
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
            style={{
              position: 'absolute',
              fontSize: `${1 + Math.random() * 1.5}rem`, // Random size between 1-2.5rem
              color: theme === 'dark' ? '#0ff' : '#007bff',
              textShadow:
                theme === 'dark'
                  ? '0 0 10px #0ff, 0 0 20px #0ff'
                  : '0 0 10px #007bff, 0 0 20px #007bff',
              pointerEvents: 'none', // Prevent interaction
              zIndex: 0, // Behind content
            }}
          >
            {codingIcons[Math.floor(Math.random() * codingIcons.length)]}
          </motion.div>
        ))}
      </div>

      <div className="container px-4 px-lg-5" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          className="row justify-content-center mb-4 mb-md-5"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="col-12 text-center">
            <h2
              className="display-4 fw-bold mb-3 font-mono"
              style={{
                textShadow: theme === 'dark' ? '0 0 15px #0ff' : '0 0 5px #888',
                color: theme === 'dark' ? '#0ff' : '#111',
              }}
            >
              Skills
            </h2>
            <p className="lead mb-0">Explore my diverse skill set across different domains</p>
          </div>
        </motion.div>

        <div className="row justify-content-center">
          <div className="col-12">
            <div className="d-flex justify-content-center mb-4">
              <div
                className="nav nav-pills flex-nowrap flex-sm-wrap overflow-auto pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {skillLinks.map((link, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`nav-link mx-1 mx-sm-2 px-3 px-md-4 py-2 rounded-pill fw-semibold ${
                      index === activeTab ? 'active' : ''
                    }`}
                    style={{
                      backgroundColor: generateGlassyColor(link.name),
                      border: 'none',
                      color: index === activeTab ? '#fff' : theme === 'dark' ? '#ccc' : '#333',
                      position: 'relative',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {link.name}
                    {index === activeTab && (
                      <motion.div
                        layoutId="underline"
                        className="underline"
                        style={{
                          position: 'absolute',
                          bottom: -4,
                          left: '20%',
                          right: '20%',
                          height: '4px',
                          borderRadius: '2px',
                          background: theme === 'dark' ? '#0ff' : '#007bff',
                        }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <motion.div
              key={activeTab}
              variants={shouldReduceMotion ? {} : tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className={`rounded-4 p-4 p-md-5 shadow-lg ${
                theme === 'dark' ? 'bg-black border border-secondary' : 'bg-white border'
              }`}
              style={{
                minHeight: '300px',
                backdropFilter: 'blur(8px)',
                boxShadow:
                  theme === 'dark'
                    ? '0 8px 30px rgba(0, 255, 255, 0.15)'
                    : '0 4px 20px rgba(0,0,0,0.1)',
              }}
            >
              {skillLinks[activeTab].component}
            </motion.div>
          </div>
        </div>

        <div className="row mt-4 mt-md-5">
          <div className="col-12 text-center">
            <motion.div whileHover={{ scale: resumeLink ? 1.05 : 1 }} whileTap={{ scale: resumeLink ? 0.95 : 1 }} className="d-inline-block">
              <a
                href={resumeLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-lg rounded-pill px-4 ${
                  theme === 'dark' ? 'btn-outline-info' : 'btn-outline-primary'
                } ${!resumeLink ? 'disabled' : ''}`}
                download={resumeLink && resumeLink.endsWith('.pdf')}
                onClick={(e) => !resumeLink && e.preventDefault()}
              >
                Download Full Resume
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .font-mono {
          font-family: 'Courier New', monospace;
        }
        .nav-pills::-webkit-scrollbar {
          display: none;
        }
        .nav-link.active {
          background: ${theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(59, 130, 246, 0.8)'} !important;
          color: white !important;
        }
        .nav-link {
          transition: all 0.3s ease;
        }
        body.dark {
          background-color: #000 !important;
        }
        body.light {
          background-color: #FFFFFF !important;
        }
        .floating-icons {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }
      `}</style>
    </motion.section>
  );
}

export default Skills;