import { motion, AnimatePresence } from 'framer-motion';
import { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { ThemeContext } from '../App';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { debounce } from 'lodash';

function NavigationBar() {
  const { theme, toggleTheme, setTheme } = useContext(ThemeContext);
  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navRefs = useRef({});
  const underlineRef = useRef(null);
  const navContainerRef = useRef(null);

  const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  // Auto-detect system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    // Set initial theme
    setTheme(mediaQuery.matches ? 'dark' : 'light');
    
    // Listen for system theme changes
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setTheme]);

  // Enhanced underline position updater
  const updateUnderline = useCallback(
    (linkId = activeLink) => {
      const activeRef = navRefs.current[linkId];
      const container = navContainerRef.current;

      if (activeRef && underlineRef.current && container) {
        const containerRect = container.getBoundingClientRect();
        const activeRect = activeRef.getBoundingClientRect();

        underlineRef.current.style.left = `${activeRect.left - containerRect.left}px`;
        underlineRef.current.style.width = `${activeRect.width}px`;
        underlineRef.current.style.opacity = '1';
      }
    },
    [activeLink]
  );

  const debouncedUpdateUnderline = debounce(updateUnderline, 50);

  // Scroll handler
  useEffect(() => {
    const handleScroll = debounce(() => {
      setScrolled(window.scrollY > 50);

      const sections = document.querySelectorAll('section');
      let newActiveLink = activeLink;
      let closestDistance = Infinity;

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top - window.innerHeight * 0.3);

        if (distance < closestDistance) {
          closestDistance = distance;
          newActiveLink = section.id;
        }
      });

      if (newActiveLink !== activeLink) {
        setActiveLink(newActiveLink);
        debouncedUpdateUnderline(newActiveLink);
      }
    }, 50);

    window.addEventListener('scroll', handleScroll);
    return () => {
      handleScroll.cancel();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeLink, debouncedUpdateUnderline]);

  // Resize handler
  useEffect(() => {
    const handleResize = debounce(() => {
      debouncedUpdateUnderline();
    }, 100);

    const timer = setTimeout(() => {
      debouncedUpdateUnderline();
    }, 300);

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      handleResize.cancel();
      window.removeEventListener('resize', handleResize);
    };
  }, [debouncedUpdateUnderline]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveLink(id);
      setExpanded(false);
    }
  };

  // Responsive styles
  const getStyles = () => ({
    navbar: {
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      padding: scrolled ? '0.5rem 0' : '1rem 0',
      backdropFilter: 'blur(10px)',
      backgroundColor: scrolled
        ? theme === 'dark' ? 'rgba(10, 10, 20, 0.9)' : 'rgba(255, 255, 255, 0.9)'
        : 'transparent',
      boxShadow: scrolled
        ? theme === 'dark'
          ? '0 2px 10px rgba(0, 128, 255, 0.1)'
          : '0 2px 10px rgba(0, 0, 0, 0.1)'
        : 'none',
      transition: 'all 0.3s ease',
    },
    navLink: {
      color: theme === 'dark' ? '#e0e0ff' : '#1a1a2e',
      fontWeight: 500,
      padding: window.innerWidth < 768 ? '0.75rem 1rem' : '0.5rem 1rem',
      position: 'relative',
      transition: 'color 0.3s ease',
      fontSize: window.innerWidth < 768 ? '1.1rem' : '1rem',
    },
    activeLink: {
      color: theme === 'dark' ? '#00ccff' : '#4B5EAA',
      fontWeight: 600,
    },
    underline: {
      position: 'absolute',
      bottom: 0,
      height: '3px',
      background: theme === 'dark'
        ? 'linear-gradient(90deg, #FF00FF, #00CCFF)'
        : 'linear-gradient(90deg, #4B5EAA, #7B8CDE)',
      borderRadius: '3px',
      transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      opacity: window.innerWidth < 992 ? 0 : 1, // Hide underline on mobile
    },
    themeToggle: {
      width: window.innerWidth < 768 ? '50px' : '60px',
      height: window.innerWidth < 768 ? '25px' : '30px',
      borderRadius: window.innerWidth < 768 ? '12px' : '15px',
      background: theme === 'dark'
        ? 'rgba(128, 0, 255, 0.2)'
        : 'rgba(0, 0, 0, 0.1)',
      position: 'relative',
      cursor: 'pointer',
    },
    toggleCircle: {
      position: 'absolute',
      width: window.innerWidth < 768 ? '20px' : '24px',
      height: window.innerWidth < 768 ? '20px' : '24px',
      borderRadius: '50%',
      background: theme === 'dark' ? '#e0e0ff' : '#4B5EAA',
      top: window.innerWidth < 768 ? '2.5px' : '3px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.3s ease',
      fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem',
    },
    hamburgerLine: {
      display: 'block',
      width: window.innerWidth < 768 ? '20px' : '25px',
      height: '3px',
      background: theme === 'dark' ? '#e0e0ff' : '#1a1a2e',
      margin: window.innerWidth < 768 ? '3px 0' : '4px 0',
      transition: 'all 0.3s ease',
    },
  });

  const styles = getStyles();

  return (
    <>
      <style>
        {`
          .nav-link.active {
            background: transparent !important;
          }
          .nav-underline {
            ${Object.entries(styles.underline)
              .map(([key, value]) => `${key}: ${value};`)
              .join(' ')}
          }
          @media (max-width: 991px) {
            .nav-underline {
              display: none;
            }
            .nav-link {
              padding: 0.75rem 1.5rem !important;
            }
          }
          @media (max-width: 767px) {
            .navbar-brand {
              font-size: 1.1rem !important;
            }
            .navbar {
              padding: ${scrolled ? '0.3rem 0' : '0.5rem 0'} !important;
            }
          }
          @media (min-width: 992px) {
            .mobile-menu {
              display: none;
            }
          }
          @keyframes underlinePulse {
            0% { transform: scaleX(1); }
            50% { transform: scaleX(1.05); }
            100% { transform: scaleX(1); }
          }
          .active-nav-link {
            animation: underlinePulse 2s infinite ease-in-out;
          }
        `}
      </style>

      <Navbar
        expand="lg"
        expanded={expanded}
        style={styles.navbar}
        className="px-2 px-sm-3 px-md-4 px-lg-5"
      >
        <Container fluid>
          <Navbar.Brand
            href="#home"
            style={{
              color: theme === 'dark' ? '#e0e0ff' : '#1a1a2e',
              fontWeight: 600,
              fontSize: window.innerWidth < 768 ? '1.1rem' : '1.25rem',
            }}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('home');
            }}
          >
            Abhishek Kumar
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="navbar-nav"
            onClick={() => setExpanded(!expanded)}
            style={{ border: 'none', background: 'transparent' }}
          >
            <div style={{ padding: window.innerWidth < 768 ? '3px' : '5px' }}>
              <span
                style={{
                  ...styles.hamburgerLine,
                  transform: expanded ? 'rotate(45deg) translate(5px, 5px)' : 'none',
                }}
              />
              <span
                style={{
                  ...styles.hamburgerLine,
                  opacity: expanded ? 0 : 1,
                }}
              />
              <span
                style={{
                  ...styles.hamburgerLine,
                  transform: expanded ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
                }}
              />
            </div>
          </Navbar.Toggle>

          <Navbar.Collapse id="navbar-nav">
            <Nav
              className="ms-auto align-items-center position-relative"
              ref={navContainerRef}
            >
              {navLinks.map((link) => (
                <div
                  key={link.id}
                  ref={(el) => (navRefs.current[link.id] = el)}
                  style={{ position: 'relative' }}
                >
                  <Nav.Link
                    href={`#${link.id}`}
                    style={{
                      ...styles.navLink,
                      ...(activeLink === link.id ? styles.activeLink : {}),
                    }}
                    className={activeLink === link.id ? 'active-nav-link' : ''}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.id);
                    }}
                  >
                    {link.label}
                  </Nav.Link>
                </div>
              ))}

              <div
                ref={underlineRef}
                className="nav-underline"
                style={{
                  ...styles.underline,
                  left: 0,
                  width: 0,
                }}
              />

              <div
                style={{
                  ...styles.themeToggle,
                  marginLeft: window.innerWidth < 768 ? '1rem' : '1.5rem',
                }}
                onClick={toggleTheme}
              >
                <div
                  style={{
                    ...styles.toggleCircle,
                    transform: theme === 'dark' ? 
                      `translateX(${window.innerWidth < 768 ? '27px' : '32px'})` : 
                      'translateX(3px)',
                  }}
                >
                  {theme === 'dark' ? '☀️' : '🌙'}
                </div>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: '0' }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: '0' }}
            style={{
              position: 'fixed',
              top: window.innerWidth < 768 ? '50px' : '70px',
              left: 0,
              right: 0,
              zIndex: 999,
              backdropFilter: 'blur(10px)',
              backgroundColor: theme === 'dark'
                ? 'rgba(10, 10, 20, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              overflow: 'hidden',
            }}
          >
            <Container style={{ padding: '1rem 0' }}>
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  style={{ padding: window.innerWidth < 768 ? '0.5rem 1rem' : '0.75rem 1.5rem' }}
                >
                  <Nav.Link
                    href={`#${link.id}`}
                    style={{
                      ...styles.navLink,
                      ...(activeLink === link.id ? styles.activeLink : {}),
                    }}
                    className={activeLink === link.id ? 'active-nav-link' : ''}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.id);
                    }}
                  >
                    {link.label}
                  </Nav.Link>
                </motion.div>
              ))}
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default NavigationBar;
