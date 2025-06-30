import { motion, AnimatePresence } from 'framer-motion';
import { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { ThemeContext } from '../App';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { debounce } from 'lodash';

function NavigationBar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
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

  // Enhanced underline position updater with useCallback
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

  // Wrap with debounce outside useCallback
  const debouncedUpdateUnderline = debounce(updateUnderline, 50);

  // Improved scroll handler
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

  // Initialize and handle resize
  useEffect(() => {
    const handleResize = debounce(() => {
      debouncedUpdateUnderline();
    }, 100);

    // Initial update after everything renders
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

  // Dynamic styles
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
      padding: '0.5rem 1rem',
      position: 'relative',
      transition: 'color 0.3s ease',
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
      opacity: 0,
    },
    themeToggle: {
      width: '60px',
      height: '30px',
      borderRadius: '15px',
      background: theme === 'dark'
        ? 'rgba(128, 0, 255, 0.2)'
        : 'rgba(0, 0, 0, 0.1)',
      position: 'relative',
      cursor: 'pointer',
    },
    toggleCircle: {
      position: 'absolute',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background: theme === 'dark' ? '#e0e0ff' : '#4B5EAA',
      top: '3px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.3s ease',
    },
    hamburgerLine: {
      display: 'block',
      width: '25px',
      height: '3px',
      background: theme === 'dark' ? '#e0e0ff' : '#1a1a2e',
      margin: '4px 0',
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
        className="px-3 px-lg-5"
      >
        <Container fluid>
          <Navbar.Brand
            href="#home"
            style={{
              color: theme === 'dark' ? '#e0e0ff' : '#1a1a2e',
              fontWeight: 600,
              fontSize: '1.25rem',
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
            <div style={{ padding: '5px' }}>
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

              {/* Enhanced Dynamic Underline */}
              <div
                ref={underlineRef}
                className="nav-underline"
                style={{
                  ...styles.underline,
                  left: 0,
                  width: 0,
                }}
              />

              {/* Theme Toggle */}
              <div
                style={{
                  ...styles.themeToggle,
                  marginLeft: '1.5rem',
                }}
                onClick={toggleTheme}
              >
                <div
                  style={{
                    ...styles.toggleCircle,
                    transform: theme === 'dark' ? 'translateX(32px)' : 'translateX(3px)',
                  }}
                >
                  {theme === 'dark' ? '☀️' : '🌙'}
                </div>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile Menu */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: '0' }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: '0' }}
            style={{
              position: 'fixed',
              top: '70px',
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
              {navLinks.map((link) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{ padding: '0.75rem 1.5rem' }}
                >
                  <Nav.Link
                    href={`#${link.id}`}
                    style={{
                      ...styles.navLink,
                      fontSize: '1.1rem',
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
