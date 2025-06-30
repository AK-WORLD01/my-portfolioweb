import { motion, useInView } from 'framer-motion';
import { useContext, useEffect, useRef, useState } from 'react';
import { ThemeContext } from '../App';
import * as THREE from 'three';

function Contact({
  title = 'Contact Me',
  subtitle = 'Reach out for collaborations or opportunities!',
  socialLinks = [],
  customStyles = {},
}) {
  const { theme } = useContext(ThemeContext);
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const [fallStartTimes, setFallStartTimes] = useState([]);
  const [splashCompleted, setSplashCompleted] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('down');
  const lastScrollY = useRef(window.scrollY);

  const defaultSocialLinks = [
    {
      name: 'Email',
      href: 'mailto:kumarabhishek44279@gmail.com',
      icon: 'https://cdn.simpleicons.org/gmail/FF0000',
      label: 'Email',
      neonColor: '#ff4d4d',
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/abhishekkumarai7/',
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAYFBMVEUAd7X///8Ac7NGlMRGk8QAdrUAbLAAbrDZ7PXV6fPy+fw9ir/p9Pkugbo0hr3D2umz0ORUnMh3q9C72eplocoIe7dsps6dxN6lyeCDs9TL4u+WwNzg7vVTmMYhg7uy1OcLxWtDAAABaklEQVRIie3W7Y6CMBAFUBxohwIK8qEIgu//lltou7TortNu9p83MRGSIzgzlEaHwETyU51jr5wrBWsODDzCgNcLrHjkHV5JOIE/hEnCOATGEiYhMHGgLBELgdi1lxlJ1IH8uvS17CjShtiriRCekM1mlm7oBaE2sCEMhA1vBg5+kCUG9n63GmGqXJYTqmNDlhcrrAkXdPsIx3FI+4TidpPDkHNOm7ndrP6U9TH/5VZxDewPsEvaS5t0CK8h9qXKSd4tq9T3EaC73rOl2EVp/X0bcqcddzMMU7YtbFuHHShsqH+lnJwlsUIqFIW7mLZAhPuYOfaGh5nR4fBotgLVQIWik+PE+11h38NCLUGmV+Ypfw9HdQU0j/lAhfr9AKafggizXHc81/VJibA4qvKzk4HE4nzgB/4jfLU8UiA26RqxQn0wfEOhTjTPMEIdZh9EOsw9QXzpPOdvMHgTGLztDN7oBm+twzfzYfkCChobmnKthiYAAAAASUVORK5CYII=',
      label: 'LinkedIn',
      neonColor: '#00d4ff',
    },
    {
      name: 'GitHub',
      href: 'https://github.com/abhishekai0',
      icon: 'https://cdn.simpleicons.org/github/181717',
      label: 'GitHub',
      neonColor: '#ffffff',
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/kumar.abhishek44279/',
      icon: 'https://cdn.simpleicons.org/instagram/E4405F',
      label: 'Instagram',
      neonColor: '#ff2a8d',
    },
    {
      name: 'WhatsApp',
      href: 'https://wa.me/+917518531311',
      icon: 'https://cdn.simpleicons.org/whatsapp/25D366',
      label: 'WhatsApp',
      neonColor: '#00ff7f',
    },
  ];

  const links = socialLinks.length > 0 ? socialLinks : defaultSocialLinks;

  // Detect scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollDirection(currentScrollY > lastScrollY.current ? 'down' : 'up');
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      { radius: 0.5, segments: 16, pos: [-4, -3, -1.5], color: theme === 'dark' ? '#33bbff' : '#0066bb', opacityMod: 0.7, rippleFreq: 1.4 },
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

          if (scrollDirection === 'up') {
            // Upward animation when scrolling up
            const upwardElapsed = (Date.now() - fallStartTimes[index]) / 1000;
            const upwardDuration = 0.8;
            const upwardProgress = Math.min(upwardElapsed / upwardDuration, 1);

            const startY = config.pos[1];
            const targetY = 10; // Move spheres upward out of view
            const startX = config.pos[0];
            const wobble = Math.sin(upwardElapsed * 5) * 0.2;
            mesh.position.x = startX + wobble;
            mesh.position.y = startY + (targetY - startY) * upwardProgress;
            mesh.position.z = config.pos[2];
            mesh.scale.setScalar(1 - 0.2 * upwardProgress);
            mesh.material.uniforms.opacityMod.value = config.opacityMod * (1 - upwardProgress);

            if (upwardProgress >= 1) {
              mesh.position.y = targetY;
              mesh.material.uniforms.opacityMod.value = 0;
            }
          } else {
            // Falling or floating animation
            if (progress < 1) {
              // Falling animation
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
              // Splash effect on landing
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

              // Settled with floating animation
              mesh.position.x = config.pos[0] + Math.sin(elapsedTime * (0.5 + index * 0.1)) * 0.5;
              mesh.position.y = config.pos[1] + Math.cos(elapsedTime * (0.6 + index * 0.15)) * 0.4;
              mesh.position.z = config.pos[2] + Math.sin(elapsedTime * (0.3 + index * 0.05)) * 0.3;
              mesh.rotation.y += 0.01 * (1 - index * 0.2);
              mesh.scale.setScalar(1);
              mesh.material.uniforms.opacityMod.value = config.opacityMod;
            }
          }
        } else {
          mesh.position.y = config.pos[1] - 100;
          mesh.material.uniforms.opacityMod.value = 0;
        }
      });

      if (!splashCompleted && scrollDirection !== 'up') {
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
  }, [theme, isInView, fallStartTimes, splashCompleted, scrollDirection]);

  // Initialize fall start times
  useEffect(() => {
    if (isInView) {
      setFallStartTimes(Array(4).fill().map((_, i) => Date.now() + i * 100));
      setSplashCompleted(false);
    } else {
      setFallStartTimes([]);
      setSplashCompleted(false);
    }
  }, [isInView]);

  return (
    <>
      <style>
        {`
          @keyframes neonFlicker {
            0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
            20%, 24%, 55% { opacity: 0.7; }
          }
          .neon-glow {
            animation: neonFlicker 1.5s infinite;
          }
          .glass-effect {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
          @media (max-width: 640px) {
            .social-link {
              width: 100px;
              padding: 15px;
            }
            .social-link img {
              width: 32px;
              height: 32px;
            }
          }
        `}
      </style>
      <motion.section
        id="contact"
        ref={sectionRef}
        initial={{ x: '-100vw', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut', type: 'spring', stiffness: 50 }}
        style={{
          background: theme === 'dark' ? 'rgb(0,0,0)' : '#f8f9fa',
          padding: '80px 0',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          ...customStyles.section,
        }}
      >
        <motion.canvas
          ref={canvasRef}
          className="w-100"
          style={{
            height: '100vh',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 0,
          }}
          animate={isInView ? { opacity: theme === 'dark' ? 0.5 : 0.4 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        />
        <div
          className="container text-center"
          style={{
            maxWidth: '800px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <motion.h2
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className={theme === 'dark' ? 'neon-glow' : 'glass-effect'}
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: theme === 'dark' ? '#00ffcc' : '#212529',
              textShadow:
                theme === 'dark'
                  ? '0 0 10px #00ffcc, 0 0 20px #00ffcc, 0 0 30px #00ffcc'
                  : '0 2px 4px rgba(0,0,0,0.3)',
              marginBottom: '40px',
              padding: theme === 'light' ? '20px' : '0',
              borderRadius: theme === 'light' ? '10px' : '0',
              ...customStyles.title,
            }}
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className={theme === 'light' ? 'glass-effect' : ''}
            style={{
              fontSize: '1.25rem',
              color: theme === 'dark' ? '#e0e0e0' : '#343a40',
              marginBottom: '40px',
              textShadow:
                theme === 'dark' ? '0 0 5px #ffffff, 0 0 10px #ffffff' : 'none',
              padding: theme === 'light' ? '15px' : '0',
              borderRadius: theme === 'light' ? '10px' : '0',
              ...customStyles.subtitle,
            }}
          >
            {subtitle}
          </motion.p>
          <motion.div
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="d-flex flex-wrap justify-content-center gap-4"
          >
            {links.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.2, ease: 'easeOut' }}
                whileHover={{ scale: 1.1, y: -10 }}
                className={`social-link ${theme === 'dark' ? 'neon-glow' : 'glass-effect'}`}
                style={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: theme === 'dark' ? link.neonColor : '#0d6efd',
                  background: theme === 'dark' ? '#1a252f' : 'rgba(255, 255, 255, 0.2)',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow:
                    theme === 'dark'
                      ? `0 8px 24px rgba(0, 0, 0, 0.5), 0 0 10px ${link.neonColor}, 0 0 20px ${link.neonColor}`
                      : `0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)`,
                  transition: 'all 0.3s ease',
                  width: '120px',
                  ...customStyles.link,
                }}
              >
                <img
                  src={link.icon}
                  alt={`${link.name} icon`}
                  style={{
                    width: '40px',
                    height: '40px',
                    marginBottom: '10px',
                    filter:
                      theme === 'dark'
                        ? `drop-shadow(0 0 5px ${link.neonColor})`
                        : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    textShadow:
                      theme === 'dark'
                        ? `0 0 5px ${link.neonColor}, 0 0 10px ${link.neonColor}`
                        : 'none',
                  }}
                >
                  {link.label}
                </span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}

export default Contact;