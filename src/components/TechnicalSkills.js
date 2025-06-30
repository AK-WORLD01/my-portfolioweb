import { motion } from 'framer-motion';
import { useContext } from 'react';
import { ThemeContext } from '../App';


// Utility function to generate background colors
const generateColor = (skillName, type) => {
  let hash = 0;
  for (let i = 0; i < skillName.length; i++) {
    hash = skillName.charCodeAt(i) + ((hash << 5) - hash);
  }

  if (type === 'granite') {
    const baseHue = 200 + (Math.abs(hash) % 60);
    const saturation = 10 + (Math.abs(hash) % 20);
    const lightness = 20 + (Math.abs(hash) % 30);
    return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
  } else {
    const hue = Math.abs(hash) % 360;
    const opacity = 0.2 + ((Math.abs(hash) % 20) / 100);
    return `hsla(${hue}, 70%, 80%, ${opacity})`;
  }
};

// Utility function to generate neon glow
const generateNeonColor = (skillName) => {
  let hash = 0;
  for (let i = 0; i < skillName.length; i++) {
    hash = skillName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsla(${hue}, 100%, 70%, 0.8)`;
};

function TechnicalSkills() {
  const { theme } = useContext(ThemeContext);

  const skills = [
    { name: 'Git', icon: 'fab fa-git-alt', description: 'Version control for collaborative code management.' },
    { name: 'Full-stack-development', icon: 'fas fa-sitemap', description: 'Efficient modern and Dynamic page with using modern technology' },
    { name: 'Algorithms', icon: 'fas fa-cogs', description: 'Designing efficient solutions for computational problems.' },
    { name: 'REST APIs', icon: 'fas fa-server', description: 'Building and integrating scalable web services.' },
    { name: 'Database Management', icon: 'fas fa-database', description: 'Designing and querying relational databases.' },
    { name: 'Unit Testing', icon: 'fas fa-vial', description: 'Ensuring code reliability with automated tests.' },
  ];

  const containerStyle = {
    padding: '4rem 1rem',
    backgroundColor: theme === 'dark' ? '#000' : '#f3f4f6',
    color: theme === 'dark' ? '#fff' : '#1a202c',
    fontFamily: 'sans-serif'
  };

  const titleStyle = {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '3rem',
    fontFamily: "'Courier New', monospace",
    textShadow: theme === 'dark'
      ? '0 0 8px rgba(255, 255, 255, 0.5), 0 0 12px currentColor, 0 0 16px currentColor'
      : '0 0 5px rgba(0, 0, 0, 0.1)',
    filter: theme === 'dark' ? 'brightness(1.5)' : 'none'
  };

  const rowStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '2rem',
    maxWidth: '72rem',
    margin: '0 auto'
  };

  const boxStyle = (skillName) => ({
    position: 'relative',
    width: 'calc(50% - 1rem)',
    minWidth: '280px',
    backgroundColor: theme === 'dark' ? generateColor(skillName, 'granite') : '#fff',
    borderRadius: '1rem',
    padding: '2rem',
    border: theme === 'dark'
      ? `1px solid rgba(255,255,255,0.1)`
      : '1px solid rgba(0,0,0,0.05)',
    boxShadow: `0 0 15px ${generateNeonColor(skillName)}`,
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    textAlign: 'center'
  });

  const overlayStyle = (skillName) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '1rem',
    backgroundColor: generateColor(skillName, 'glassy'),
    backdropFilter: 'blur(10px)',
    zIndex: 0
  });

  const iconStyle = (skillName) => ({
    fontSize: '3rem',
    marginBottom: '1rem',
    color: theme === 'dark' ? generateNeonColor(skillName) : '#3b82f6',
    textShadow: theme === 'dark' ? `0 0 10px ${generateNeonColor(skillName)}` : 'none',
    position: 'relative',
    zIndex: 1
  });

  const headingStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: theme === 'dark' ? '#fff' : '#1a202c',
    position: 'relative',
    zIndex: 1
  };

  const descStyle = {
    fontSize: '0.9rem',
    color: theme === 'dark' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)',
    position: 'relative',
    zIndex: 1
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={containerStyle}
    >
      <motion.h2
        initial={{ x: -100 }}
        animate={{
          x: 0,
          color: theme === 'dark' ? ['#00f', '#0f0', '#ff69b4', '#fff'] : '#333',
        }}
        transition={{
          duration: 0.5,
          color: { duration: 4, repeat: Infinity, ease: 'linear' },
        }}
        style={titleStyle}
      >
        Technical Skills
      </motion.h2>

      <div style={rowStyle}>
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{
              scale: 1.05,
              boxShadow: `0 0 25px ${generateNeonColor(skill.name)}`
            }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={boxStyle(skill.name)}
          >
            <div style={overlayStyle(skill.name)}></div>

            <i className={skill.icon} style={iconStyle(skill.name)}></i>
            <h3 style={headingStyle}>{skill.name}</h3>
            <p style={descStyle}>{skill.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

export default TechnicalSkills;
