import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './DashboardHeader.module.css';
import { FaBars } from 'react-icons/fa';

const DashboardHeader = ({ user, toggleSidebar, isMobile }) => {
  return (
    <header className={styles.header}>
      {isMobile && (
        <motion.button
          className={styles.menuButton}
          onClick={toggleSidebar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaBars />
        </motion.button>
      )}
      
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search..."
          className={styles.searchInput}
        />
      </div>

      <div className={styles.userContainer}>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user?.name || 'Guest'}</span>
        </div>
        <div className={styles.userAvatar}>
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {(user?.name || 'G').charAt(0)}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader; 