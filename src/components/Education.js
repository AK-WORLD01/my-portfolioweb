import { motion, useReducedMotion, useInView } from 'framer-motion';
import { useContext, useEffect, useState, useRef } from 'react';
import { ThemeContext } from '../App';
import * as THREE from 'three';

// Utility function to hash string
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

// Color generation utilities
const generateGlassyColor = (skillName) => {
  const hue = Math.abs(hashString(skillName)) % 360;
  return `hsla(${hue}, 50%, 90%, 0.2)`;
};

// Neon colors for borders and text in dark theme
const neonColors = ['#ff00cc', '#00ffff', '#00ff00'];

// Glassy colors for box background in light theme
const glassyLightColors = ['rgba(255, 0, 0, 0.3)', 'rgba(0, 255, 0, 0.3)', 'rgba(0, 0, 255, 0.3)'];

// Theme-aware sphere colors
const themeSphereColors = {
  dark: {
    '#00ffff': '#00ffff',
    '#ff00cc': '#ff00cc',
    '#00ff00': '#00ff00',
    '#33ccff': '#33ccff',
  },
  light: {
    '#00ffff': '#4b5eaa',
    '#ff00cc': '#3b4e99',
    '#00ff00': '#5c6fbb',
    '#33ccff': '#2e4188',
  },
};

// Education data with precomputed colors
const education = [
  {
    level: "10th",
    institution: "Green Valley Public School",
    year: "2018 - 2019",
  },
  {
    level: "12th",
    institution: "SBMI College",
    year: "2020 - 2022",
  },
  {
    level: "B.Tech",
    institution: "GIET University",
    year: "2022 - 2026",
  },
].map((edu, index) => ({
  ...edu,
  colors: {
    glassy: generateGlassyColor(edu.level),
    neon: neonColors[index % neonColors.length],
    light: glassyLightColors[index % glassyLightColors.length],
  },
}));

// Animation variants for carousel
const carouselVariants = {
  center: { x: '0%', zIndex: 10, scale: 1, opacity: 1 },
  left: { x: '-100%', zIndex: 5, scale: 0.8, opacity: 0.5 },
  right: { x: '100%', zIndex: 5, scale: 0.8, opacity: 0.5 },
};

function Education() {
  const { theme } = useContext(ThemeContext);
  const shouldReduceMotion = useReducedMotion();
  const [codingElements, setCodingElements] = useState([]);
  const canvasRef = useRef(null);
  const educationRef = useRef(null);
  const educationInView = useInView(educationRef, { once: false, amount: 0.3 });
  const [fallStartTimes, setFallStartTimes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotation effect
  useEffect(() => {
    if (!educationInView || shouldReduceMotion) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % education.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [educationInView, shouldReduceMotion]);

  // Handle navigation
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % education.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + education.length) % education.length);
  };

  // Generate random neon multicolored coding elements
  useEffect(() => {
    const elements = ['☄️', '', '', '', '', '👨‍🚀', '', '', '', ''];
    const neonColors = ['#ff00ff', '#00ff00', '#00ffff', '#ff3300', '#ff00cc', '#33ccff'];
    const newElements = Array(20)
      .fill()
      .map((_, i) => ({
        id: i,
        content: elements[Math.floor(Math.random() * elements.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 0.8 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        duration: Math.random() * 10 + 6,
        delay: Math.random() * 3,
        color: neonColors[Math.floor(Math.random() * neonColors.length)],
      }));
    setCodingElements(newElements);
  }, []);

  // Initialize fall start times when section comes into view
  useEffect(() => {
    if (educationInView) {
      setFallStartTimes(Array(4).fill().map((_, i) => Date.now() + i * 200)); // Staggered drops
    } else {
      setFallStartTimes([]);
    }
  }, [educationInView]);

  // Three.js setup for water droplet spheres
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Updated vertex shader for subtle ripple effect
    const vertexShader = `
      varying vec3 vNormal;
      varying vec2 vUv;
      uniform float time;
      uniform float rippleFreq;
      void main() {
        vNormal = normal;
        vUv = uv;
        vec3 pos = position;
        float ripple = 0.1 * sin(time * rippleFreq + pos.x * 4.0);
        pos += ripple * normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    // Updated fragment shader for water-like appearance
    const fragmentShader = `
      varying vec3 vNormal;
      varying vec2 vUv;
      uniform float time;
      uniform vec3 neonColor;
      uniform float opacityMod;
      void main() {
        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
        float diff = max(dot(vNormal, lightDir), 0.3); // Softer lighting
        float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0); // Stronger fresnel
        vec3 baseColor = neonColor * (0.6 + 0.4 * sin(time * 1.5)); // Subtle color pulse
        vec3 color = mix(vec3(0.05, 0.1, 0.15), baseColor, fresnel * 0.8 + diff * 0.4);
        float alpha = (0.7 + 0.3 * fresnel) * opacityMod; // Translucent water effect
        gl_FragColor = vec4(color, alpha);
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

    // Sphere configurations for water droplets
    const spheres = [
      { radius: 1.8, segments: 32, pos: [0, 0, -2], color: '#00ffff', opacityMod: 0.9, rippleFreq: 0.9 },
      { radius: 0.6, segments: 16, pos: [-3.5, -2.5, -1.5], color: '#33ccff', opacityMod: 0.8, rippleFreq: 1.3 },
      { radius: 1.2, segments: 32, pos: [3.5, 2.5, -1.5], color: '#00ff00', opacityMod: 0.85, rippleFreq: 1.1 },
      { radius: 1.5, segments: 32, pos: [-3.5, 2.5, -1.5], color: '#ff00cc', opacityMod: 1.0, rippleFreq: 1.0 },
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
    let animationFrame;
    const animate = () => {
      if (!educationInView) {
        sphereMeshes.forEach(({ mesh }) => {
          mesh.visible = false; // Hide spheres when not in view
        });
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      animationFrame = requestAnimationFrame(animate);
      const elapsedTime = (Date.now() - startTime) / 1000;

      sphereMeshes.forEach((sphere, index) => {
        const { mesh, config } = sphere;
        mesh.visible = true;
        mesh.material.uniforms.time.value = elapsedTime;

        if (fallStartTimes[index]) {
          const fallElapsed = (Date.now() - fallStartTimes[index]) / 1000;
          const fallDuration = 1.2; // Longer drop for effect
          const progress = Math.min(fallElapsed / fallDuration, 1);
          const easeOutBounce = (t) => {
            if (t < 1 / 2.75) return 7.5625 * t * t;
            if (t < 2 / 2.75) {
              t -= 1.5 / 2.75;
              return 7.5625 * t * t + 0.75;
            }
            if (t < 2.5 / 2.75) {
              t -= 2.25 / 2.75;
              return 7.5625 * t * t + 0.9375;
            }
            t -= 2.625 / 2.75;
            return 7.5625 * t * t + 0.984375;
          };

          if (progress < 1) {
            const startY = 15; // Start above viewport
            const targetY = config.pos[1];
            const easedProgress = easeOutBounce(progress); // Bounce effect
            mesh.position.y = startY + (targetY - startY) * easedProgress;
            mesh.position.x = config.pos[0];
            mesh.position.z = config.pos[2];
            // Scale to simulate splash
            const scale = 1 + Math.sin(progress * Math.PI) * 0.3;
            mesh.scale.setScalar(scale);
            mesh.material.uniforms.opacityMod.value = config.opacityMod * progress;
          } else {
            // After landing, gentle float
            mesh.position.x = config.pos[0] + Math.sin(elapsedTime * (0.5 + index * 0.1)) * 0.4;
            mesh.position.y = config.pos[1] + Math.cos(elapsedTime * (0.6 + index * 0.15)) * 0.3;
            mesh.position.z = config.pos[2] + Math.sin(elapsedTime * (0.3 + index * 0.05)) * 0.2;
            mesh.rotation.y += 0.008 * (1 - index * 0.2);
            mesh.scale.setScalar(1);
            mesh.material.uniforms.opacityMod.value = config.opacityMod;
          }
        } else {
          mesh.position.y = -100; // Off-screen initially
          mesh.material.uniforms.opacityMod.value = 0;
        }
      });

      renderer.render(scene, camera);
    };

    if (educationInView) animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Update sphere colors based on theme
    sphereMeshes.forEach((sphere, index) => {
      const config = spheres[index];
      sphere.mesh.material.uniforms.neonColor.value.set(
        themeSphereColors[theme][config.color] || config.color
      );
    });

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
      sphereMeshes.forEach(({ geometry, mesh }) => {
        geometry.dispose();
        mesh.material.dispose();
      });
      renderer.dispose();
    };
  }, [theme, educationInView, fallStartTimes]);

  // Inline styles (unchanged)
  const containerStyle = {
    padding: '4rem 1rem',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#1a202c',
  };

  const backgroundStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  };

  const wrapperStyle = {
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '0 1rem',
    position: 'relative',
    zIndex: 3,
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '2rem',
    color: theme === 'dark' ? '#ffffff' : '#333333',
    textShadow: theme === 'dark' ? '0 0 10px rgba(34, 211, 238, 0.7)' : '0 0 5px rgba(0, 0, 0, 0.1)',
  };

  const carouselContainerStyle = {
    position: 'relative',
    width: '100%',
    height: '300px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    perspective: '1000px',
  };

  const boxStyle = (colors) => ({
    position: 'absolute',
    width: '280px',
    backgroundColor: theme === 'dark' ? 'transparent' : colors.light,
    border: theme === 'dark' ? `2px solid ${colors.neon}` : '2px solid #000000',
    borderRadius: '1rem',
    padding: '2rem',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    boxShadow: theme === 'dark' ? `0 0 15px ${colors.neon}80` : '0 0 20px #000000',
    transition: 'all 0.3s ease',
  });

  const overlayStyle = (colors) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: colors.glassy,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    zIndex: 0,
  });

  const contentStyle = {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  };

  const levelStyle = (neonColor) => ({
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
    color: theme === 'dark' ? neonColor : '#000000',
    textShadow: theme === 'dark' ? `0 0 8px ${neonColor}80` : 'none',
  });

  const institutionStyle = {
    fontSize: '1.125rem',
    marginBottom: '0.5rem',
    color: theme === 'dark' ? neonColors[1] : '#000000',
  };

  const yearStyle = {
    fontSize: '0.875rem',
    color: theme === 'dark' ? neonColors[2] : '#000000',
  };

  const codingElementStyle = (element) => ({
    position: 'absolute',
    fontSize: `${element.size}rem`,
    color: element.color,
    textShadow: `0 0 8px ${element.color}, 0 0 12px ${element.color}, 0 0 16px ${element.color}`,
    filter: 'brightness(1.5)',
    fontFamily: 'monospace',
    zIndex: 2,
  });

  const orbStyle1 = {
    position: 'absolute',
    top: '5rem',
    left: '5rem',
    width: '8rem',
    height: '8rem',
    borderRadius: '50%',
    filter: 'blur(2rem)',
    boxShadow: theme === 'dark' ? '0 0 40px rgba(34, 211, 238, 0.5)' : '0 0 40px rgba(59, 130, 246, 0.3)',
    zIndex: 2,
  };

  const orbStyle2 = {
    position: 'absolute',
    bottom: '5rem',
    right: '5rem',
    width: '10rem',
    height: '10rem',
    borderRadius: '50%',
    filter: 'blur(1rem)',
    boxShadow: theme === 'dark' ? '0 0 40px rgba(147, 51, 234, 0.5)' : '0 0 40px rgba(99, 102, 241, 0.3)',
    zIndex: 2,
  };

  const buttonStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: theme === 'dark' ? '#1a202c' : '#ffffff',
    border: `2px solid ${theme === 'dark' ? '#00ffff' : '#4b5eaa'}`,
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 15,
    boxShadow: theme === 'dark' ? '0 0 10px rgba(34, 211, 238, 0.5)' : '0 0 10px rgba(59, 130, 246, 0.3)',
  };

  const leftButtonStyle = {
    ...buttonStyle,
    left: '10%',
  };

  const rightButtonStyle = {
    ...buttonStyle,
    right: '10%',
  };

  // Animation props
  const sectionProps = shouldReduceMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.8 } };

  const titleProps = shouldReduceMotion
    ? { initial: { x: 0 }, animate: { x: 0 } }
    : { initial: { x: -100 }, animate: { x: 0 }, transition: { duration: 1.0 } };

  return (
    <motion.section
      id="education"
      {...sectionProps}
      style={containerStyle}
      role="region"
      aria-labelledby="education-title"
      ref={educationRef}
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
        animate={educationInView ? { opacity: theme === 'dark' ? 0.5 : 0.4 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      />
      <motion.div
        style={backgroundStyle}
        animate={{ backgroundColor: theme === 'dark' ? '#000000' : '#ffffff', transition: { duration: 1 } }}
      >
        {codingElements.map((element) => (
          <motion.div
            key={element.id}
            initial={{
              x: `${element.x}vw`,
              y: `${element.y}vh`,
              opacity: element.opacity,
              color: element.color,
            }}
            animate={
              shouldReduceMotion
                ? {}
                : {
                    x: [`${element.x}vw`, `${element.x + (Math.random() * 40 - 20)}vw`, `${element.x}vw`],
                    y: [`${element.y}vh`, `${element.y + (Math.random() * 40 - 20)}vh`, `${element.y}vh`],
                    rotate: [0, 150],
                    scale: [element.size, element.size * 1.0, element.size],
                    color: ['#ff00ff', '#00ff00', '#00ffff', '#ff3300', '#ff00cc', '#33ccff'],
                  }
            }
            transition={
              shouldReduceMotion
                ? {}
                : {
                    duration: element.duration,
                    delay: element.delay,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                    times: [0, 0.33, 0.66, 1],
                    color: { duration: element.duration / 2, repeat: Infinity, ease: 'linear' },
                  }
            }
            style={codingElementStyle(element)}
          >
            {element.content}
          </motion.div>
        ))}
        <motion.div
          initial={{ scale: 0, opacity: 0.3 }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  scale: [0, 2, 0],
                  opacity: [0.3, 0.1, 0.3],
                  rotate: 60,
                  backgroundColor: ['#ff00ff', '#00ff00', '#00ffff'],
                }
          }
          transition={
            shouldReduceMotion
              ? {}
              : {
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                  times: [0, 0.5, 1],
                  backgroundColor: { duration: 4, repeat: Infinity, ease: 'linear' },
                }
          }
          style={orbStyle1}
        />
        <motion.div
          initial={{ scale: 0, opacity: 0.3 }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  scale: [0, 1.5, 0],
                  opacity: [0.3, 0.1, 0.3],
                  rotate: -160,
                  backgroundColor: ['#ff3300', '#ff00cc', '#33ccff'],
                }
          }
          transition={
            shouldReduceMotion
              ? {}
              : {
                  duration: 10,
                  repeat: Infinity,
                  ease: 'linear',
                  times: [0, 0.5, 1],
                  backgroundColor: { duration: 5, repeat: Infinity, ease: 'linear' },
                }
          }
          style={orbStyle2}
        />
      </motion.div>

      <div style={wrapperStyle}>
        <motion.h2 id="education-title" style={titleStyle} {...titleProps}>
          Education
        </motion.h2>

        <div style={carouselContainerStyle}>
          <button onClick={handlePrev} style={leftButtonStyle} aria-label="Previous education">
            ←
          </button>
          {education.map((edu, index) => {
            const position =
              index === currentIndex
                ? 'center'
                : index === (currentIndex - 1 + education.length) % education.length
                ? 'left'
                : 'right';
            return (
              <motion.div
                key={edu.level}
                style={boxStyle(edu.colors)}
                variants={shouldReduceMotion ? {} : carouselVariants}
                initial="left"
                animate={position}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              >
                <div style={overlayStyle(edu.colors)} />
                <div style={contentStyle}>
                  <h3 style={levelStyle(edu.colors.neon)}>{edu.level}</h3>
                  <p style={institutionStyle}>{edu.institution}</p>
                  <p style={yearStyle}>{edu.year}</p>
                </div>
              </motion.div>
            );
          })}
          <button onClick={handleNext} style={rightButtonStyle} aria-label="Next education">
            →
          </button>
        </div>
      </div>
    </motion.section>
  );
}

export default Education;