import { motion } from 'framer-motion';
import { useContext } from 'react';
import { ThemeContext } from '../App';


// Enhanced neon color generator with memoization for consistent colors
const generateBoxStyle = (skillName, theme) => {
  const hue = Math.abs(skillName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 360;
  const saturation = 90;
  const lightness = theme === 'dark' ? 70 : 60;
  
  const baseColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const hoverColor = `hsl(${hue}, ${saturation}%, ${lightness + 10}%)`;
  
  return {
    baseColor,
    hoverColor,
    background: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.1)`,
    border: `1.5px solid hsla(${hue}, ${saturation}%, ${lightness}%, 0.3)`,
    boxShadow: `0 4px 20px hsla(${hue}, ${saturation}%, ${lightness}%, ${theme === 'dark' ? 0.3 : 0.2})`,
    neonGlow: `0 0 15px hsla(${hue}, ${saturation}%, ${lightness}%, 0.7)`
  };
};

function SoftSkills() {
  const { theme } = useContext(ThemeContext);

  // Dynamic skills data - could be fetched from an API or config file
  const skills = [
    { name: 'Communication', icon: 'fas fa-comments', description: 'Effective verbal and written communication to collaborate with teams.' },
    { name: 'Teamwork', icon: 'fas fa-users', description: 'Collaborating seamlessly in diverse teams to achieve goals.' },
    { name: 'Problem Solving', icon: 'fas fa-lightbulb', description: 'Analytical approach to tackle complex challenges.' },
    { name: 'Adaptability', icon: 'fas fa-sync-alt', description: 'Quickly adjusting to new technologies and environments.' },
    { name: 'Leadership', icon: 'fas fa-user-tie', description: 'Guiding teams with clear vision and motivation.' },
    { name: 'Time Management', icon: 'fas fa-clock', description: 'Prioritizing tasks to meet deadlines efficiently.' },
  ];

  // Dynamic animations configuration
  const animations = {
    container: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.8 }
    },
    title: {
      initial: { y: -50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.6 }
    },
    skillCard: (index) => ({
      initial: { scale: 0.95, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      transition: { delay: index * 0.1, duration: 0.5 }
    }),
    backButton: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { delay: 0.8 }
    }
  };

  return (
    <motion.section
      {...animations.container}
      className={`py-5 min-vh-100 d-flex align-items-center ${theme === 'dark' ? 'bg-dark' : 'bg-light'}`}
      style={{
        background: theme === 'dark' ? 'linear-gradient(to bottom, #1a1a2e, #16213e)' : 'linear-gradient(to bottom, #f8f9fa, #e9ecef)'
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 text-center mb-5">
            <motion.h2
              {...animations.title}
              className={`display-4 fw-bold mb-4 ${theme === 'dark' ? 'text-info' : 'text-primary'}`}
              style={{
                textShadow: theme === 'dark' ? '0 0 10px rgba(0, 255, 255, 0.5)' : '0 0 10px rgba(11, 63, 252, 0.3)'
              }}
            >
              Soft Skills
            </motion.h2>
            <p className={`lead ${theme === 'dark' ? 'text-white-50' : 'text-muted'}`}>
              The interpersonal skills that complement my technical abilities
            </p>
          </div>

          {/* Dynamic skills grid */}
          <div className="col-12 col-lg-10">
            <div className="row g-4">
              {skills.map((item, index) => {
                const boxStyle = generateBoxStyle(item.name, theme);
                
                return (
                  <div key={index} className="col-12 col-md-6">
                    <motion.div
                      {...animations.skillCard(index)}
                      whileHover={{ 
                        scale: 1.03,
                        boxShadow: boxStyle.neonGlow,
                        y: -5
                      }}
                      className={`h-100 rounded-4 p-4 d-flex flex-column ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}
                      style={{
                        background: boxStyle.background,
                        border: boxStyle.border,
                        boxShadow: boxStyle.boxShadow,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div className="d-flex align-items-center mb-3">
                        <motion.i
                          className={`${item.icon} fs-3 me-3`}
                          style={{
                            color: boxStyle.baseColor,
                            filter: `drop-shadow(0 0 8px ${boxStyle.baseColor}80)`,
                            minWidth: '30px'
                          }}
                          animate={{
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            repeatType: "reverse"
                          }}
                        />
                        <h3 
                          className={`mb-0 fs-4 fw-bold ${theme === 'dark' ? 'text-white' : 'text-dark'}`}
                          style={{
                            textShadow: `0 0 5px ${boxStyle.baseColor}50`
                          }}
                        >
                          {item.name}
                        </h3>
                      </div>
                      <p 
                        className={`flex-grow-1 mb-0 ${theme === 'dark' ? 'text-light' : 'text-dark'} opacity-75`}
                        style={{ fontSize: '0.9rem' }}
                      >
                        {item.description}
                      </p>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Back button */}
          
        </div>
      </div>
    </motion.section>
  );
}

export default SoftSkills;