import { motion, useReducedMotion } from 'framer-motion';
import { useContext, useState } from 'react';
import { ThemeContext } from '../App';

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
  const baseHue = 200;
  const saturation = 10 + (Math.abs(hashString(skillName)) % 20);
  const lightness = 20 + (Math.abs(hashString(skillName)) % 30);
  return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
};

const generateGlassyColor = (skillName, theme) => {
  const hue = Math.abs(hashString(skillName)) % 360;
  if (theme === 'dark') {
    // Neon glassy colors for dark theme
    return `hsla(${hue}, 80%, 60%, 0.4)`;
  }
  // Distinct glassy colors for light theme
  return `hsla(${hue}, 50%, 90%, 0.3)`;
};

// Certificate data split into categories
const coursesAndWorkshops = [
  {
    name: 'Achievement: National Quiz Competition - Swaraj Quiz (Episode 70)',
    icon: 'fab fa-aws',
    description: <p>Organized by: Prasar Bharati (India's Public Service Broadcaster)
Details:
Secured 3rd Place in the prestigious Online Swaraj Quiz – Episode 70, a nationally recognized knowledge competition organized by Prasar Bharati, reflecting strong general awareness, quick thinking, and a deep understanding of India’s freedom movement and heritage.</p>,
    imageUrl: 'https://media.licdn.com/dms/image/v2/D4D22AQHUuLCxEzCKhw/feedshare-shrink_800/feedshare-shrink_800/0/1702627292349?e=1753920000&v=beta&t=f1vigkt2CfqThZ0KkcZhGzx4vXlzRORL2U1kMua1jx4',
  },
  {
    name: 'MyGov & Employees’ Provident Fund Organisation (EPFO)',
    icon: 'fas fa-chart-bar',
    description: <p>The certificate recognizes successful participation in the “Know About EPFO Quiz,” which aims to spread awareness about India’s social security system and the workings of the EPFO—one of the largest social security organizations in the world.

The quiz is a part of major national campaigns such as:

Azadi Ka Amrit Mahotsav (celebrating 75 years of India's independence)

G20 India Presidency 2023

MyGov citizen engagement platform

Signed by S.K. Sangma, the Additional Central P.F. Commissioner, this certificate is an acknowledgment of informed citizenship and proactive engagement with government-led awareness programs.</p>,
    imageUrl: 'https://media.licdn.com/dms/image/v2/D4D22AQHklxQwHiGv7g/feedshare-shrink_800/feedshare-shrink_800/0/1702627379429?e=1753920000&v=beta&t=fnyGhn7Nkp2hHhjN8y9Bm0n0PcablZnQCpF2yZ-Mhow',
  },
  {
    name: 'Microsoft Certification on Node.js: Build a Web API with Node.js and Express',
    icon: 'fas fa-chart-bar',
    description: 'Demonstrated proficiency in building RESTful APIs using Node.js and Express. Covered essential concepts such as routing, middleware, HTTP methods, and server-side logic to develop scalable and maintainable web services.',
    imageUrl: 'https://ik.imagekit.io/wog60vhqm/1718968703316.jpeg?updatedAt=1750958986615',
  },
  {
    name: 'IBM Data Science Professional Certificate',
    icon: 'fas fa-chart-bar',
    description: <p>
      completed the IBM Data Science Professional Certificate! 🚀 This intensive and hands-on program sharpened my skills in Python, SQL, data analysis, data visualization, and machine learning. From cleaning messy datasets to building predictive models, I tackled real-world data problems using industry-relevant tools and techniques.
    </p>,
    imageUrl: 'https://media.licdn.com/dms/image/v2/D5622AQEZkILQ1mk-gg/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1719138225830?e=1753920000&v=beta&t=z7StCtRsyJeFy0WfqLw4v1IXghO2sUOy0WvZ4B6GQB0',
  },
  {
    name: 'Enterprise-Grade AI Certification',
    icon: 'fas fa-chart-bar',
    description: <p>Pumped to share that I’ve completed the Enterprise-Grade AI course! 💡 This advanced program dove deep into the realms of machine learning, deep learning, and scalable AI deployment—arming me with the skills to design, build, and launch intelligent systems in real-world, enterprise-level environments.

From hands-on projects to applying state-of-the-art frameworks, I gained practical experience in solving complex business challenges using AI. A massive shoutout to the instructors for this transformative learning journey. I’m ready to bring innovation to the table and turn data into strategic impact!</p>,
    imageUrl: 'https://media.licdn.com/dms/image/v2/D5622AQFVQn7rMIrdCw/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1719041284337?e=1753920000&v=beta&t=GoM_gmWQtIcTYMscaU0dF1cFtVgMkjiceBCBfpyxG6g',
  },
  {
    name: 'Tech Stack: HTML, CSS, JavaScript, MySQL',
    icon: 'fas fa-chart-bar',
    description: <p>
      Built a fully functional Facebook login system during Devtown's workshop. Followed instructor-led guidance to implement secure OAuth-based Facebook authentication using core web technologies.
On successful login, user data (like name, email, and profile picture) is fetched and stored in a MySQL database for future reference. Designed a clean front-end UI using HTML/CSS and managed API communication through JavaScript.
    </p>,
    imageUrl: 'https://media.licdn.com/dms/image/v2/D5622AQHXByTXIIwNog/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1692857293765?e=1753920000&v=beta&t=Hc8UF_ZVbxiesq58v7gPRC_XnZ9G_KtjZN0M2IY8Wvo',
  },
  {
    name: 'IBM "Journey to Cloud: Envisioning Your Solutions',
    icon: 'fas fa-chart-bar',
    description: <p>
       This program provided a deep dive into the core concepts of cloud computing, cloud strategy, and IBM Cloud technologies—covering everything from cloud migration and security best practices to scalability and solution design.

Through hands-on labs and real-world scenarios, I developed a strong foundation in envisioning and implementing effective cloud solutions. Huge thanks to IBM and the instructors for such an impactful and forward-thinking experience. I’m eager to bring this knowledge into my professional work and help build efficient, scalable, cloud-powered systems.
    </p>,
    imageUrl: 'https://media.licdn.com/dms/image/v2/D5622AQEZkILQ1mk-gg/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1719138225830?e=1753920000&v=beta&t=z7StCtRsyJeFy0WfqLw4v1IXghO2sUOy0WvZ4B6GQB0',
  },
  {
    name: 'Tech Stack: HTML, CSS, JavaScript, MySQL',
    icon: 'fas fa-chart-bar',
    description: <p>
      Built a fully functional Facebook login system during Devtown's workshop. Followed instructor-led guidance to implement secure OAuth-based Facebook authentication using core web technologies.
On successful login, user data (like name, email, and profile picture) is fetched and stored in a MySQL database for future reference. Designed a clean front-end UI using HTML/CSS and managed API communication through JavaScript.
    </p>,
    imageUrl: 'https://media.licdn.com/dms/image/v2/D5622AQGKGAJ7tk8xsw/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1692857547005?e=1753920000&v=beta&t=fH6Qmn4Zq2-YybknInpDW3sLId7ZJZ91LXI_IOBDRpU',
  },
  {
    name: '7-Day Python Training Workshop – GIET University',
    icon: 'fas fa-chart-bar',
    description: <p>
      Organized by: AIML Club
Role: Participant
Summary:
Successfully completed a 7-day instructor-led Python training workshop conducted by the AIML Club at GIET University. Gained hands-on experience with core Python concepts through daily practical sessions and mini-projects.
Topics covered included variables, data types, control structures, functions, file handling, and basic data structures.

Key Takeaways:

Built a hands-on mini project in Python during the workshop

Strengthened foundational knowledge of Python programming

Learned under the guidance of mentors and instructors from AIML Club</p>,
    imageUrl: 'https://media.licdn.com/dms/image/v2/D5622AQEuqK1R4RrhnA/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1697356696853?e=1753920000&v=beta&t=8W7fWcy3cNwZHH2Qk-Mqh47tosUWR_ECHrYxqEPXvkA',
  },
  {
    name: 'DevOps for Web Development – AWS',
    icon: 'fas fa-chart-bar',
    description: <p>
      Completed an immersive DevOps training journey focused on web development, conducted by AWS in collaboration with Google Developer Student Clubs (GDSC).

This program covered the end-to-end DevOps lifecycle, emphasizing the importance of automation, continuous integration/deployment (CI/CD), and cloud-based infrastructure management.

Key Concepts Learned:

DevOps culture and practices

CI/CD pipeline setup using GitHub Actions

Docker containerization for application packaging

Deployment workflows on AWS (EC2, S3, etc.)

Monitoring and automation best practices</p>,
    imageUrl: 'https://media.licdn.com/dms/image/v2/D5622AQEoTPlNmdvy4Q/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1715169528827?e=1753920000&v=beta&t=ulNEmaPZBN3YwB60r2f5Mxo3pFcU41LwhBhTcRSzjiU',
  },
].map((skill) => ({
  ...skill,
  colors: {
    granite: generateGraniteColor(skill.name),
    glassy: (theme) => generateGlassyColor(skill.name, theme),
  },
}));

const internships = [
  {
    name: 'IT Helpdesk Management Tool – JK Paper Mills Internship',
    icon: 'fas fa-certificate',
    description: <p>As part of my internship at JK Paper Mills, I developed a Helpdesk Management Tool to streamline internal IT support operations and improve issue tracking and resolution efficiency.

This tool allows employees to raise support tickets, track their status, and communicate with the IT department in real-time. It helped reduce manual effort, improved accountability, and provided visibility into frequently recurring technical issues.

Key Features:

📝 Ticket Creation: Users can submit IT issues with descriptions and priority levels

🚦 Status Tracking: Each ticket has stages (Open, In Progress, Resolved, Closed)

👨‍💻 Admin Dashboard: IT staff can assign, update, and close tickets

🔁 Auto Notifications: Users receive status updates via email or dashboard pop-ups

📊 Report Generation: Logs of resolved tickets for audit and analysis</p>,
    imageUrl: 'https://media.licdn.com/dms/image/v2/D5622AQGsXUDcdh-B0w/feedshare-shrink_800/B56ZeVk.XfHoAs-/0/1750561203041?e=1753920000&v=beta&t=Q_yCQADMRWxtDru9YVOvyEX7PyhYiMvRiPj7Z7p7aC4',
  },
  {
    name: 'Web Development Internship – TechnoHack',
    icon: 'fas fa-network-wired',
    description: <p>Completed a 1-month Web Development Internship with TechnoHack, from 10th October 2023 to 9th November 2023.

Gained hands-on experience building both frontend and backend components of modern web applications. Throughout the internship, I worked on two key projects:

✅ Minor Project: A dynamic To-Do List App built with HTML, CSS, and JavaScript to manage daily tasks with interactive features like add/delete/update.

✅ Major Project: A full-fledged Blog Website, featuring user authentication, post creation, and dynamic rendering of content – simulating a real-world content platform.

Key Skills Gained:

HTML, CSS, JavaScript

DOM Manipulation

Responsive Design

Web App Structure and Deployment</p>,
    imageUrl: 'https://media.licdn.com/dms/image/v2/D5622AQHKI0udL5TG1g/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1701545622474?e=1753920000&v=beta&t=VXpwGzXISoi0tOdKMd9Tim0VW77Rg_O2xuT-UsJHlME',
  },
  {
    name: 'AI & Cloud Internship – Edunet Foundation & AICTE (in collaboration with IBM SkillsBuild)',
    icon: 'fas fa-certificate',
    description: <p>Successfully completed a 4-week internship program with Edunet Foundation, in collaboration with AICTE, from June 5th, 2024 to July 2nd, 2024.

The internship focused on Emerging Technologies, with a strong emphasis on Artificial Intelligence and Cloud Computing, leveraging tools from the IBM Cloud Platform and SkillsBuild.

Key Highlights:

🌐 Gained hands-on experience with real-world AI and cloud-based applications.

🤖 Worked on practical projects involving AI models, cloud deployment, and problem-solving using IBM tools.

🤝 Collaborated with peers and industry mentors, enhancing both technical and teamwork skills.

☁️ Explored IBM Cloud features for app development, testing, and deployment.

This program significantly boosted my confidence in working with modern tech stacks and solving real-world problems using cloud-integrated AI.</p>,
    imageUrl: 'https://media.licdn.com/dms/image/v2/D5622AQEhsw5fuVsGFQ/feedshare-shrink_800/feedshare-shrink_800/0/1720106197259?e=1753920000&v=beta&t=wy5c656qw-zdbHVv56rnMnnqL2Q4XrmWKHIQcAgX_hc',
  },
  {
    name: 'Web Development Internship – Tech OctaNet Services Pvt. Ltd.',
    icon: 'fas fa-certificate',
    description: <p>Successfully completed a Web Development Internship at Tech OctaNet Services Pvt. Ltd. from June 1, 2024 to July 1, 2024.

This 4-week journey provided hands-on experience with full-stack web technologies, helping me sharpen both frontend and backend skills through real-time development tasks and collaborative projects.

Tech Stack Worked On:

🌐 Frontend: React.js, HTML, CSS

🔧 Backend: Node.js

🛢 Database: MongoDB

Key Highlights:

Built and improved dynamic web applications using the MERN stack

Strengthened practical skills in responsive design, REST APIs, and component-based architecture

Collaborated with team members, received mentorship, and tackled real-world dev challenges

Big thanks to the Tech OctaNet team for their support and encouragement throughout the internship!</p>,
    imageUrl: 'https://media.licdn.com/dms/image/v2/D5622AQHBk07AfqK2Ow/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1720364446598?e=1753920000&v=beta&t=0tztzeayqv0BMYio6meaNn0hEej1QGNvlYMzRwWXtH8',
  },
  {
    name: 'Python Programming Internship – CodSoft',
    icon: 'fas fa-certificate',
    description: <p>Just wrapped up a 4-week Python Internship at CodSoft where I built 3 real-world projects that took my coding confidence to the next level!

💻 Projects include:
🔐 A Secure Password Generator + Email Sharer
✅ An Enhanced To-Do List App with time/date features
🧮 A fully-functional Scientific Calculator with both basic and advanced math functions

Learned a lot about GUI programming with Tkinter, problem-solving with Python, and delivering user-friendly tools. On to the next! </p>,
    imageUrl: 'https://media.licdn.com/dms/image/v2/D5622AQEwgGjKxS246g/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1720882042803?e=1753920000&v=beta&t=rVrGugo8csrajWAv5TNx9UMI6MaxZopV8qAYXbOaME4',
  },
  {
    name: 'Full Stack Web Development Internship – TECHISMUST Innovation Lab',
    icon: 'fas fa-certificate',
    description: <p>Completed a 4-week Full Stack Web Development Internship at TECHISMUST Innovation Lab, where I built real-world projects using React.js, Node.js, Express, and MongoDB. Gained hands-on experience in full-stack development, REST APIs, and responsive UI design.</p>,
    imageUrl: 'https://media.licdn.com/dms/image/v2/D561FAQGfql_gVLR-IQ/feedshare-document-images_800/feedshare-document-images_800/1/1721819300396?e=1752105600&v=beta&t=5j5_7S-gev-UUcIgVYrzwIvx8qVWseE-l4Qvp093Pw0',
  },
].map((skill) => ({
  ...skill,
  colors: {
    granite: generateGraniteColor(skill.name),
    glassy: (theme) => generateGlassyColor(skill.name, theme),
  },
}));

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      when: 'beforeChildren',
    },
  },
};

const itemVariants = {
  hidden: { scale: 0.8, opacity: 0, rotateY: -10 },
  visible: {
    scale: 1,
    opacity: 1,
    rotateY: 0,
    transition: {
      duration: 0.6,
      type: 'spring',
      stiffness: 100,
    },
  },
  hover: {
    scale: 1.05,
    rotateY: 5,
    transition: { duration: 0.2 },
  },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, type: 'spring', stiffness: 100 },
  },
};

function Certifications() {
  const { theme } = useContext(ThemeContext);
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedCert, setSelectedCert] = useState(null);

  // Inline styles
  const containerStyle = {
    padding: '4rem 1rem',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: theme === 'dark' ? '#000000' : '#f3f4f6',
    color: theme === 'dark' ? '#ffffff' : '#1a202c',
  };

  const wrapperStyle = {
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '0 1rem',
    position: 'relative',
    zIndex: 2,
  };

  const titleStyle = {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '3rem',
    fontFamily: "'Courier New', monospace",
    color: theme === 'dark' ? '#ffffff' : '#333333',
    textShadow: theme === 'dark'
      ? '0 0 8px rgba(255, 255, 255, 0.5), 0 0 12px currentColor, 0 0 16px currentColor'
      : '0 0 5px rgba(0, 0, 0, 0.1)',
    filter: theme === 'dark' ? 'brightness(1.5)' : 'none',
  };

  const tabContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem',
    gap: '1rem',
  };

  const tabStyle = (isActive) => ({
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    backgroundColor: isActive
      ? theme === 'dark' ? '#22d3ee' : '#2563eb'
      : theme === 'dark' ? '#1a202c' : '#e5e7eb',
    color: isActive ? '#ffffff' : theme === 'dark' ? '#ffffff' : '#1a202c',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  });

  const flexContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
    justifyContent: 'center',
    maxWidth: '80rem',
    margin: '0 auto',
  };

  const boxStyle = (colors) => ({
    position: 'relative',
    width: 'calc(50% - 1rem)',
    minWidth: '280px',
    backgroundColor: theme === 'dark' ? colors.granite : '#ffffff',
    border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
    borderRadius: '1rem',
    padding: '2rem',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  });

  const overlayStyle = (colors) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: colors.glassy(theme),
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    backgroundColor: colors.glassy(theme).replace(/hsla\(([^)]+)\)/, 'hsl($1)'),
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

  const iconStyle = {
    fontSize: '3rem',
    marginBottom: '1rem',
    color: theme === 'dark' ? '#22d3ee' : '#2563eb',
  };

  const headingStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
    color: theme === 'dark' ? '#ffffff' : '#1a202c',
  };

  const descriptionStyle = {
    fontSize: '0.875rem',
    marginBottom: '1rem',
    color: theme === 'dark' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)',
  };

  const imageStyle = {
    maxWidth: '100%',
    maxHeight: '100px',
    width: 'auto',
    height: 'auto',
    borderRadius: '0.5rem',
    marginTop: '1rem',
    border: theme === 'dark' ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.2)',
    objectFit: 'contain',
  };

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalBoxStyle = (colors) => ({
    position: 'relative',
    width: 'min(90%, 600px)',
    backgroundColor: theme === 'dark' ? colors.granite : '#ffffff',
    border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
    borderRadius: '1rem',
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  });

  const modalImageStyle = {
    maxWidth: '100%',
    maxHeight: '400px',
    width: 'auto',
    height: 'auto',
    borderRadius: '0.5rem',
    margin: '1.5rem 0',
    border: theme === 'dark' ? '2px solid rgba(255,255,255,0.3)' : '2px solid rgba(0,0,0,0.3)',
    objectFit: 'contain',
    boxShadow: theme === 'dark' 
      ? '0 0 20px rgba(255,255,255,0.5)' 
      : '0 0 20px rgba(0,0,0,0.3)',
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: theme === 'dark' ? '#ffffff' : '#1a202c',
  };

  // Animation props
  const sectionProps = shouldReduceMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.8 } };

  const titleProps = shouldReduceMotion
    ? { initial: { x: 0 }, animate: { x: 0, color: theme === 'dark' ? '#ffffff' : '#333333' } }
    : {
        initial: { x: -100 },
        animate: {
          x: 0,
          color: theme === 'dark' ? ['#00f', '#0f0', '#ff69b4', '#fff'] : '#333333',
        },
        transition: {
          duration: 0.5,
          color: { duration: 4, repeat: Infinity, ease: 'linear' },
        },
      };

  const currentItems = activeTab === 'courses' ? coursesAndWorkshops : internships;

  return (
    <motion.section
      {...sectionProps}
      style={containerStyle}
      role="region"
      aria-labelledby="certifications"
    >
      <div style={wrapperStyle}>
        <motion.h2
          id="certifications"
          style={titleStyle}
          {...titleProps}
        >
          Certifications
        </motion.h2>

        <div style={tabContainerStyle}>
          <button
            style={tabStyle(activeTab === 'courses')}
            onClick={() => setActiveTab('courses')}
            aria-selected={activeTab === 'courses'}
            role="tab"
          >
            Courses & Workshops
          </button>
          <button
            style={tabStyle(activeTab === 'internships')}
            onClick={() => setActiveTab('internships')}
            aria-selected={activeTab === 'internships'}
            role="tab"
          >
            Internships
          </button>
        </div>

        <motion.div
          style={flexContainerStyle}
          variants={shouldReduceMotion ? {} : containerVariants}
          initial="hidden"
          animate="visible"
        >
          {currentItems.map((item) => (
            <motion.div
              key={item.name}
              variants={shouldReduceMotion ? {} : itemVariants}
              whileHover={
                shouldReduceMotion
                  ? {}
                  : {
                      scale: 1.05,
                      boxShadow: theme === 'dark'
                        ? '0 0 20px rgba(34, 211, 238, 0.8)'
                        : '0 0 20px rgba(59, 130, 246, 0.4)',
                      rotateY: 5,
                    }
              }
              style={boxStyle(item.colors)}
              onClick={() => setSelectedCert(item)}
            >
              <div style={overlayStyle(item.colors)} />
              <div style={contentStyle}>
                <i className={item.icon} style={iconStyle} aria-hidden="true" />
                <h3 style={headingStyle}>{item.name}</h3>
                <p style={descriptionStyle}>{item.description}</p>
                <img
                  src={item.imageUrl}
                  alt={`${item.name} certificate`}
                  style={imageStyle}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {selectedCert && (
        <motion.div
          style={modalStyle}
          initial="hidden"
          animate="visible"
          variants={shouldReduceMotion ? {} : modalVariants}
          onClick={() => setSelectedCert(null)}
        >
          <motion.div
            style={modalBoxStyle(selectedCert.colors)}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={closeButtonStyle}
              onClick={() => setSelectedCert(null)}
              aria-label="Close modal"
            >
              ×
            </button>
            <div style={overlayStyle(selectedCert.colors)} />
            <div style={contentStyle}>
              <img
                src={selectedCert.imageUrl}
                alt={`${selectedCert.name} certificate`}
                style={modalImageStyle}
              />
              <i className={selectedCert.icon} style={{ ...iconStyle, fontSize: '4rem' }} aria-hidden="true" />
              <h3 style={{ ...headingStyle, fontSize: '1.5rem' }}>{selectedCert.name}</h3>
              <p style={{ ...descriptionStyle, fontSize: '1rem' }}>{selectedCert.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.section>
  );
}

export default Certifications;