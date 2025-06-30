import { motion } from 'framer-motion';
import { useContext } from 'react';
import { ThemeContext } from '../App';

function Footer({
  socialLinks = [],
  customText = '',
  customStyles = {},
}) {
  const { theme } = useContext(ThemeContext);
  const currentYear = new Date().getFullYear();

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
          .gradient-underline {
            background: linear-gradient(90deg, #ff69b4, #00f);
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            text-decoration: underline;
            text-decoration-color: transparent;
            text-decoration-thickness: 2px;
            text-underline-offset: 4px;
          }
          .thin-divider {
            width: 1000px;
            height: ${theme === 'dark' ? '1.5px' : '2px'};
            background: ${theme === 'dark' 
              ? 'linear-gradient(90deg, #ff69b4, #00f)' 
              : '#ff69b4'};
            border: none;
            border-radius: 2px;
            margin: 10px auto;
            opacity: 0.8;
            box-shadow: ${theme === 'dark' 
              ? '0 0 8px rgba(255, 105, 180, 0.5)' 
              : 'none'};
          }
          @media (max-width: 640px) {
            .social-link {
              width: 40px;
              height: 40px;
            }
            .social-link svg {
              width: 20px;
              height: 20px;
            }
          }
        `}
      </style>
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', type: 'spring', stiffness: 50 }}
        style={{
          background: theme === 'dark' ? 'rgb(0,0,0)' : '#f8f9fa',
          padding: '40px 0',
          color: theme === 'dark' ? '#e0e0e0' : '#343a40',
          ...customStyles.section,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            {/* Social Links */}
            {socialLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                className="flex gap-4"
              >
                {socialLinks.map(({ name, url, icon: Icon, neonColor = '#00ffcc' }, index) => (
                  <motion.a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1, ease: 'easeOut' }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`social-link ${theme === 'dark' ? 'neon-glow' : 'glass-effect'}`}
                    aria-label={name}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      background: theme === 'dark' ? '#1a252f' : 'rgba(255, 255, 255, 0.2)',
                      color: theme === 'dark' ? neonColor : '#0d6efd',
                      boxShadow:
                        theme === 'dark'
                          ? `0 8px 24px rgba(0, 0, 0, 0.5), 0 0 10px ${neonColor}, 0 0 20px ${neonColor}`
                          : `0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)`,
                      transition: 'all 0.3s ease',
                      ...customStyles.link,
                    }}
                  >
                    <Icon
                      style={{
                        width: '24px',
                        height: '24px',
                        filter:
                          theme === 'dark'
                            ? `drop-shadow(0 0 5px ${neonColor})`
                            : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                      }}
                    />
                  </motion.a>
                ))}
              </motion.div>
            )}

            {/* Custom Text, Divider, and Copyright */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
              className={`text-center text-sm ${theme === 'dark' ? 'neon-glow' : 'glass-effect'}`}
              style={{
                color: theme === 'dark' ? '#00ffcc' : '#343a40',
                textShadow:
                  theme === 'dark'
                    ? '0 0 5pxrgb(255, 14, 211), 0 0 10pxrgb(20, 7, 202)'
                    : 'none',
                padding: theme === 'light' ? '10px' : '0',
                borderRadius: theme === 'light' ? '8px' : '0',
                ...customStyles.text,
              }}
            >
              {customText && (
                <p className="gradient-underline" style={{ marginBottom: '8px' }}>
                  {customText}
                </p>
              )}
              <hr className="thin-divider" />
              <p>
                © {currentYear} Abhishek Kumar. All rights reserved.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.footer>
    </>
  );
}

export default Footer;