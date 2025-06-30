
import { motion, useInView } from 'framer-motion';
import { useContext, useState, useEffect, useRef } from 'react';
import { ThemeContext } from '../App';
import profileImage from '../assets/logo.png';
import codingVideo from '../assets/background.mp4';
import * as THREE from 'three';

function Typewriter({ texts, writeDelay = 100, eraseDelay = 50, pauseDelay = 2000, loop = true, onComplete, theme }) {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const containerRef = useRef(null);
  const [maxWidth, setMaxWidth] = useState('');

  useEffect(() => {
    if (containerRef.current && texts && texts.length > 0) {
      const tempSpan = document.createElement('span');
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.whiteSpace = 'nowrap';
      tempSpan.style.position = 'absolute';
      document.body.appendChild(tempSpan);

      let max = 0;
      texts.forEach(text => {
        tempSpan.textContent = text;
        max = Math.max(max, tempSpan.offsetWidth);
      });

      document.body.removeChild(tempSpan);
      setMaxWidth(`${max}px`);
    }
  }, [texts]);

  useEffect(() => {
    const cursorInterval = setInterval(() => setShowCursor((prev) => !prev), 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (!texts || !texts.length) return;

    const currentText = texts[textIndex];

    if (!isErasing && index < currentText.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + currentText[index]);
        setIndex(index + 1);
      }, writeDelay);
      return () => clearTimeout(timeout);
    } else if (!isErasing && index === currentText.length) {
      const timeout = setTimeout(() => setIsErasing(true), pauseDelay);
      return () => clearTimeout(timeout);
    } else if (isErasing && index > 0) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
        setIndex(index - 1);
      }, eraseDelay);
      return () => clearTimeout(timeout);
    } else if (isErasing && index === 0) {
      setIsErasing(false);
      const nextTextIndex = loop ? (textIndex + 1) % texts.length : textIndex + 1;
      if (nextTextIndex < texts.length) {
        setTextIndex(nextTextIndex);
      } else if (onComplete && !loop) {
        onComplete();
      }
    }
  }, [index, textIndex, isErasing, texts, writeDelay, eraseDelay, pauseDelay, loop, onComplete]);

  return (
    <motion.span
      ref={containerRef}
      style={{
        display: 'inline-block',
        minWidth: maxWidth,
        height: '1.5em',
        verticalAlign: 'bottom',
        whiteSpace: 'nowrap',
        overflowWrap: 'break-word', // Prevent text overflow
        textShadow: theme === 'dark' ? '0 0 8px rgba(255, 255, 255, 0.5), 0 0 12px currentColor, 0 0 16px currentColor' : 'none',
        filter: theme === 'dark' ? 'brightness(1.5)' : 'none',
      }}
      animate={{
        color: theme === 'dark' ? ['#00f', '#0f0', '#ff69b4', '#fff'] : 'inherit',
      }}
      transition={{
        color: { duration: 4, repeat: Infinity, ease: 'linear' },
      }}
    >
      {displayText}
      {showCursor && <span className="blinking-cursor">|</span>}
    </motion.span>
  );
}

function About() {
  const { theme } = useContext(ThemeContext);
  const [showRoles, setShowRoles] = useState(false);
  const canvasRef = useRef(null);
  const aboutRef = useRef(null);
  const aboutInView = useInView(aboutRef, { once: false, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.8 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, type: 'spring' } },
    hover: { y: -15, scale: 1.1, boxShadow: '0 10px 20px rgba(0,0,0,0.3)' },
  };

  const neonColors = ['#ff00ff', '#00ff00', '#00ffff', '#ff3300', '#ff00cc', '#33ccff'];

  // Three.js setup for neon-animated water droplet spheres
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
      { radius: 0.5, segments: 16, pos: [-3, -2, -1.5], color: theme === 'dark' ? '#33ccff' : '#2e4188', opacityMod: 0.7, rippleFreq: 1.4 },
      { radius: 1.0, segments: 32, pos: [3, 2, -1.5], color: theme === 'dark' ? '#00ff00' : '#5c6fbb', opacityMod: 0.85, rippleFreq: 1.2 },
      { radius: 1.5, segments: 32, pos: [-3, 2, -1.5], color: theme === 'dark' ? '#00ffff' : '#4b5eaa', opacityMod: 1.0, rippleFreq: 1.0 },
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
        sphere.mesh.material.uniforms.time.value = elapsedTime;
        const { config } = sphere;
        if (aboutInView) {
          sphere.mesh.position.x = config.pos[0] + Math.sin(elapsedTime * (0.5 + index * 0.1)) * 0.5;
          sphere.mesh.position.y = config.pos[1] + Math.cos(elapsedTime * (0.6 + index * 0.15)) * 0.4;
          sphere.mesh.position.z = config.pos[2] + Math.sin(elapsedTime * (0.3 + index * 0.05)) * 0.3;
          sphere.mesh.rotation.y += 0.01 * (1 - index * 0.2);
        } else {
          sphere.mesh.position.y = config.pos[1] - 100; // Off-screen when not in view
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
  }, [theme, aboutInView]);

  return (
    <motion.section
      id="about"
      className={`min-vh-100 d-flex flex-column justify-content-center py-5 position-relative ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-video-light text-gray-900'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      ref={aboutRef}
    >
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
        animate={aboutInView ? { opacity: theme === 'dark' ? 0.5 : 0.4 } : { opacity: 0, y: '100vh', scale: 0.8 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      {theme === 'light' && (
        <video
          className="video-bg"
          autoPlay
          loop
          muted
          playsInline
          style={{ zIndex: 1 }}
        >
          <source src={codingVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      <div className="code-overlay" style={{ zIndex: 2 }}>
        {[
          { content: ".", top: "10%", left: "5%", delay: 0 },
          { content: "🪐", top: "20%", right: "10%", delay: 5 },
          { content: ".", bottom: "30%", left: "15%", delay: 10 },
          { content: "", bottom: "20%", right: "20%", delay: 15 },
          { content: ".", top: "40%", left: "25%", delay: 20 },
          { content: "", top: "50%", right: "30%", delay: 25 },
          { content: ".", bottom: "40%", left: "35%", delay: 30 },
          { content: "🌎", bottom: "50%", right: "40%", delay: 35 },
        ].map((element, index) => (
          <motion.div
            key={index}
            className="code-element"
            style={{
              position: 'absolute',
              top: element.top,
              left: element.left,
              right: element.right,
              bottom: element.bottom,
              fontFamily: "'Courier New', monospace",
              fontSize: '1.2rem',
            }}
            initial={{ opacity: 0.3, translateX: 0, translateY: 0, rotate: 0, scale: 1 }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              translateX: [0, 50, 100, 0],
              translateY: [0, 100, 200, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.3, 1],
              color: theme === 'dark' ? neonColors : ['#87CEEB', '#98FB98'],
            }}
            transition={{
              duration: 30,
              delay: element.delay,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
              color: { duration: 6, repeat: Infinity, ease: 'linear' },
              times: [0, 0.33, 0.66, 1],
            }}
          >
            {element.content}
          </motion.div>
        ))}
      </div>

      <div className="container px-4" style={{ paddingTop: '20px', position: 'relative', zIndex: 3 }}>
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
        >
          <h1
            className="display-6 font-mono"
            style={{ minHeight: '6.5rem' }}
          >
            <Typewriter
              texts={["Hey!Welcome to portfolio"]}
              writeDelay={50}
              onComplete={() => setShowRoles(true)}
              theme={theme}
            />
          </h1>
        </motion.div>

        <motion.div
          className="row align-items-center mb-5"
          variants={containerVariants}
          initial="hidden"
          animate={aboutInView ? 'visible' : 'hidden'}
        >
          <motion.div
            className="col-md-4 mb-4 mb-md-0 text-center"
            variants={itemVariants}
          >
            <motion.div
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ duration: 0.5 }}
            >
              <div className="water-drop-container">
                <img
                  src={profileImage}
                  alt="Abhishek Kumar"
                  className="img-fluid water-drop-image"
                  style={{
                    width: '300px',
                    height: '300px',
                  }}
                />
              </div>
            </motion.div>
            <motion.h2
              className="mt-3 font-mono fw-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              ABHISHEK KUMAR
            </motion.h2>
            <motion.div
              className="mt-2 font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ minHeight: '1.5rem' }}
            >
              <Typewriter
                texts={["Full-Stack Web Developer",  "Passionate Problem Solver","Innovating with Code","AI Enthusist", ]}
                writeDelay={100}
                eraseDelay={50}
                pauseDelay={2000}
                loop={true}
                theme={theme}
              />
            </motion.div>
            {showRoles && (
              <motion.div
                className="mt-2 font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{ minHeight: '1.5rem' }}
              >
                <Typewriter
                  texts={["Full-Stack Web Developer", "App Developer", "AI Enthusiast"]}
                  writeDelay={100}
                  eraseDelay={50}
                  pauseDelay={2000}
                  loop={true}
                  theme={theme}
                />
              </motion.div>
            )}
          </motion.div>

          <motion.div className="col-md-8" variants={itemVariants}>
            <h2 className="display-5 fw-bold mb-3">About Me</h2>
            <p className="lead">
             <b> "I’m Abhishek, a dedicated full-stack developer with a passion for building efficient, scalable, and user-friendly web applications. I work with modern technologies like React.js, Node.js, Flask, and MongoDB/MySQL to create solutions that not only function smoothly but also deliver great user experiences. I focus on writing clean code, designing intuitive interfaces, and solving real-world problems through technology. My approach blends technical expertise with a deep curiosity to explore, learn, and grow with every project. This portfolio is a reflection of my journey — driven by code, crafted with purpose."</b>
            </p>
            <motion.a
              href="#contact"
              className={`btn granite-button mt-3`}
              whileHover={{ scale: 1.1, background: 'linear-gradient(45deg, #ff69b4, #4169e1)' }}
              whileTap={{ scale: 0.95 }}
            >
              Connect with Me
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .blinking-cursor {
          font-weight: bold;
          animation: blink 0.5s step-end infinite;
          color: ${theme === 'dark' ? '#00ffff' : 'inherit'};
        }

        @keyframes blink {
          50% {
            opacity: 0;
          }
        }

        .bg-black {
          --bs-bg-opacity: 1;
          background-color: rgb(0, 0, 0);
          backdrop-filter: blur(6px);
          position: relative;
          overflow: hidden;
          color: #ffffff;
        }

        .bg-video-light {
          background: #FFFFFF;
          backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
          color:rgb(0, 0, 0);
        }

        .video-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.7;
        }

        .code-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .code-element {
          text-shadow: ${theme === 'dark' ? '0 0 8px rgba(255, 255, 255, 0.5), 0 0 12px currentColor, 0 0 16px currentColor' : '0 0 8px rgba(149, 166, 177, 0.63)'};
          filter: ${theme === 'dark' ? 'brightness(1.5)' : 'none'};
        }

        .bg-black h1,
        .bg-black h2,
        .bg-black h3,
        .bg-black h4,
        .bg-black h5,
        .bg-black h6,
        .bg-black p,
        .bg-black span {
          color: #fffffff0;
        }

        .granite-button {
          background: linear-gradient(45deg, #ff69b4, #4169e1);
          color: white;
          border-radius: 25px;
          border: none;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .granite-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }

        .granite-button:hover::before {
          left: 100%;
        }

        .water-drop-container {
          position: relative;
          width: 300px;
          height: 350px;
          margin: 0 auto;
        }

        .water-drop-image {
          position: absolute;
          top: 20px;
          left: 20px;
          width: 260px;
          height: 260px;
          object-fit: cover;
          clip-path: polygon(50% 0%, 80% 20%, 100% 60%, 80% 100%, 20% 100%, 0% 60%, 20% 20%);
          animation: waterRipple 10s infinite ease-in-out;
        }

        @keyframes waterRipple {
          0%, 100% {
            transform: scale(1);
            clip-path: polygon(50% 0%, 80% 20%, 100% 60%, 80% 100%, 20% 100%, 0% 60%, 20% 20%);
          }
          50% {
            transform: scale(1.05);
            clip-path: polygon(50% 0%, 82% 18%, 100% 62%, 82% 10%, 18%, 100%, 0%, 62%, 18% 18%;
          }
        }

        .btn-outline-light:hover,
        .btn-outline-primary:hover {
          color: white !important;
        }

        /* Responsive adjustments */
        @media (max-width: 767px) {
          .container {
            padding-top: 15px;
            padding-left: 10px;
            padding-right: 10px;
          }
          h1 {
            font-size: 1.5rem !important;
            min-height: 2rem !important;
          }
        }

        @media (max-width: 767px) {
          .container {
            padding-top: 10px;
            padding-left: 5px;
            padding-right: 5px;
          }
          h1 {
            font-size: 1.2rem !important;
            min-height: 1.8rem !important;
          }
        }
      `}</style>
    </motion.section>
  );
}

export default About;
