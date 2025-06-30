import { motion, useReducedMotion } from 'framer-motion';
import { useContext } from 'react';
import { ThemeContext } from '../App';
import { Link } from 'react-router-dom';

// Utility function to hash string
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

// Color generation utilities
const generateGraniteColor = (skillName) => {
  const baseHue = 200 + (Math.abs(hashString(skillName)) % 30);
  const saturation = 15 + (Math.abs(hashString(skillName)) % 15);
  const lightness = 25 + (Math.abs(hashString(skillName)) % 20);
  return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
};

const generateGlowColor = (skillName) => {
  const hue = Math.abs(hashString(skillName)) % 360;
  return `hsla(${hue}, 80%, 70%, 0.5)`;
};

const generateGlassyColor = (skillName) => {
  const hue = Math.abs(hashString(skillName)) % 360;
  return `hsla(${hue}, 50%, 90%, 0.2)`;
};

// Language data with precomputed colors
const languages = [
  {
    name: 'JavaScript',
    icon: 'fab fa-js-square',
    description: 'Dynamic scripting for interactive web applications.',
    proficiency: 90,
  },
  {
    name: 'Python',
    icon: 'fab fa-python',
    description: 'Versatile programming for automation and data analysis.',
    proficiency: 85,
  },
  {
    name: 'Java',
    icon: 'fab fa-java',
    description: 'Robust language for enterprise-level applications.',
    proficiency: 75,
  },
  {
    name: 'C',
    icon: 'fas fa-code',
    description: 'High-performance programming for system software.',
    proficiency: 70,
  },
  {
    name: 'TypeScript',
    icon: 'fas fa-code',
    description: 'Typed superset of JavaScript for scalable applications.',
    proficiency: 80,
  },
  
].map((language) => ({
  ...language,
  colors: {
    granite: generateGraniteColor(language.name),
    glow: generateGlowColor(language.name),
    glassy: generateGlassyColor(language.name),
  },
}));

// Define variants outside component
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: 'beforeChildren',
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  hover: {
    y: -5,
    scale: 1.03,
    transition: { duration: 0.2 },
  },
};

function TechnicalLanguages() {
  const { theme } = useContext(ThemeContext);
  const shouldReduceMotion = useReducedMotion();

  // Inline styles
  const containerStyle = {
    padding: '4rem 1rem',
    minHeight: '100vh',
    backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb',
  };

  const wrapperStyle = {
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '0 1rem',
  };

  const titleWrapperStyle = {
    textAlign: 'center',
    marginBottom: '4rem',
  };

  const titleStyle = {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    fontFamily: 'monospace',
    color: theme === 'dark' ? '#22d3ee' : '#2563eb',
  };

  const subtitleStyle = {
    fontSize: '1.125rem',
    color: theme === 'dark' ? '#d1d5db' : '#4b5563',
  };

  const flexContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
    justifyContent: 'center',
  };

  const boxStyle = (colors) => ({
    position: 'relative',
    width: 'calc(50% - 1rem)',
    minWidth: '280px',
    backgroundColor: theme === 'dark' ? colors.granite : '#ffffff',
    border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: `0 4px 20px ${colors.glow}`,
    overflow: 'hidden',
  });

  const overlayStyle = (colors) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: colors.glassy,
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    backgroundColor: colors.glassy.replace(/hsla\(([^)]+)\)/, 'hsl($1)'),
    zIndex: 0,
  });

  const contentStyle = {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
  };

  const iconStyle = {
    fontSize: '2.25rem',
    marginRight: '1rem',
    color: theme === 'dark' ? '#22d3ee' : '#2563eb',
  };

  const headingStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
  };

  const descriptionStyle = {
    fontSize: '0.875rem',
    marginBottom: '1rem',
    flexGrow: 1,
    color: theme === 'dark' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)',
  };

  const progressBarStyle = {
    width: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: '9999px',
    height: '0.625rem',
  };

  const progressFillStyle = (colors) => ({
    height: '0.625rem',
    borderRadius: '9999px',
    background: theme === 'dark'
      ? `linear-gradient(90deg, ${colors.glow}, #22d3ee)`
      : `linear-gradient(90deg, ${colors.glow}, #3b82f6)`,
  });

  const proficiencyTextStyle = {
    fontSize: '0.75rem',
    marginTop: '0.25rem',
    textAlign: 'right',
    color: theme === 'dark' ? '#d1d5db' : '#4b5563',
  };

  const linkWrapperStyle = {
    textAlign: 'center',
    marginTop: '3rem',
  };

  const linkStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.75rem 1.5rem',
    borderRadius: '9999px',
    fontSize: '1.125rem',
    fontWeight: '500',
    backgroundColor: theme === 'dark' ? '#164e63' : '#dbeafe',
    color: theme === 'dark' ? '#e5e7eb' : '#1e40af',
    textDecoration: 'none',
    transition: 'background-color 0.2s ease, color 0.2s ease',
  };

  const linkHoverStyle = {
    backgroundColor: theme === 'dark' ? '#1e7492' : '#bfdbfe',
    color: theme === 'dark' ? '#f3f4f6' : '#1e3a8a',
  };

  // Animation props
  const sectionProps = shouldReduceMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : { initial: 'hidden', animate: 'visible' };

  const titleProps = shouldReduceMotion
    ? { initial: { y: 0, opacity: 1 }, animate: { y: 0, opacity: 1 } }
    : { initial: { y: -50, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { duration: 0.6 } };

  const linkProps = shouldReduceMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.5 } };

  return (
    <motion.section
      {...sectionProps}
      style={containerStyle}
      role="region"
      aria-labelledby="technical-languages"
    >
      <div style={wrapperStyle}>
        <motion.div style={titleWrapperStyle} {...titleProps}>
          <h2 id="technical-languages" style={titleStyle}>
            Technical Languages
          </h2>
          <p style={subtitleStyle}>Programming languages I work with and their proficiency levels</p>
        </motion.div>

        <motion.div
          style={flexContainerStyle}
          variants={shouldReduceMotion ? {} : containerVariants}
        >
          {languages.map((language) => (
            <motion.div
              key={language.name}
              variants={shouldReduceMotion ? {} : itemVariants}
              whileHover={shouldReduceMotion ? {} : 'hover'}
              style={boxStyle(language.colors)}
            >
              <div style={overlayStyle(language.colors)} />
              <div style={contentStyle}>
                <div style={headerStyle}>
                  <i className={language.icon} style={iconStyle} aria-hidden="true" />
                  <h3 style={headingStyle}>{language.name}</h3>
                </div>
                <p style={descriptionStyle}>{language.description}</p>
                <div
                  style={progressBarStyle}
                  role="progressbar"
                  aria-valuenow={language.proficiency}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${language.name} proficiency`}
                >
                  <motion.div
                    style={progressFillStyle(language.colors)}
                    initial={{ width: 0 }}
                    animate={{ width: `${language.proficiency}%` }}
                    transition={{
                      delay: 0.3,
                      duration: 0.8,
                      ease: 'easeOut',
                    }}
                  />
                </div>
                <span style={proficiencyTextStyle}>{language.proficiency}% proficiency</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div style={linkWrapperStyle} {...linkProps}>
          <Link
            to="/skills"
            style={linkStyle}
            onMouseEnter={(e) => Object.assign(e.target.style, linkHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.target.style, linkStyle)}
          >
            <svg
              style={{ width: '1.25rem', height: '1.25rem', marginLeft: '0.5rem' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default TechnicalLanguages;