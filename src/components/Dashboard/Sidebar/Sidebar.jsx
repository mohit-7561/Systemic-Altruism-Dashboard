import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaTimes, 
  FaHome, 
  FaUsers, 
  FaProjectDiagram, 
  FaCog,
  FaSignOutAlt,
  FaTags
} from 'react-icons/fa';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, toggleSidebar, user, onNavigate, onLogout }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: <FaHome />, label: 'Dashboard', route: 'dashboard', active: true },
    { icon: <FaUsers />, label: 'Host', route: 'host' },
    { icon: <FaProjectDiagram />, label: 'Join', route: 'join' },
    { icon: <FaTags />, label: 'Interests', route: 'interests' },
  ];

  const handleNavigation = (route) => {
    if (onNavigate) {
      onNavigate(route);
    }
  };

  const handleLogoClick = () => {
    navigate('/');  // Navigate to home page
  };

  return (
    <motion.div 
      className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={{
        open: { x: 0 },
        closed: { x: "-100%" }
      }}
    >
      <div className={styles.sidebarHeader}>
        <h1 className={styles.logo} onClick={handleLogoClick} style={{ cursor: 'pointer' }}>StudyConnect</h1>
        <button className={styles.closeButton} onClick={toggleSidebar}>
          <FaTimes />
        </button>
      </div>

      <div className={styles.userProfile}>
        <div className={styles.userAvatar}>
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {user.name.charAt(0)}
            </div>
          )}
        </div>
        <div className={styles.userInfo}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      </div>

      <nav className={styles.navigation}>
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            className={`${styles.navItem} ${item.active ? styles.active : ''}`}
            onClick={() => handleNavigation(item.route)}
            whileHover={{ x: 10 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <span className={styles.icon}>{item.icon}</span>
            {item.label}
          </motion.button>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <motion.button
          className={styles.navItem}
          onClick={() => handleNavigation('settings')}
          whileHover={{ x: 10 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className={styles.icon}><FaCog /></span>
          Settings
        </motion.button>
        <motion.button
          className={styles.logoutButton}
          onClick={onLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className={styles.icon}><FaSignOutAlt /></span>
          Logout
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar; 