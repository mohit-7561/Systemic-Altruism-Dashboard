import { motion } from 'framer-motion';
import { FaUsers, FaClock, FaStar, FaGraduationCap, FaUniversity, FaMobile, FaShoppingBag, FaShare, FaHandHoldingHeart } from 'react-icons/fa';
import styles from './QuickStats.module.css';
import { shadeColor } from '../../../utils/helpers';

const QuickStats = ({ metrics }) => {
  const stats = [
    {
      title: 'Colleges Onboarded',
      value: metrics.colleges.current,
      target: metrics.colleges.target,
      icon: <FaUniversity />,
      color: '#4CA1AF'
    },
    {
      title: 'App Downloads',
      value: metrics.downloads.current.toLocaleString(),
      change: `+${metrics.downloads.monthlyGrowth}% MoM`,
      icon: <FaMobile />,
      color: '#FF6B6B'
    },
    {
      title: 'Charity Revenue',
      value: `${metrics.revenue.currency} ${metrics.revenue.current.toLocaleString()}`,
      icon: <FaShoppingBag />,
      color: '#50C878'
    },
    {
      title: 'Social Impact',
      value: `${(metrics.socialMedia.views / 1e6).toFixed(1)}M Views`,
      secondary: `${metrics.socialMedia.shares.toLocaleString()} Shares`,
      icon: <FaShare />,
      color: '#FFD700'
    },
    {
      title: 'Total Donations',
      value: `${metrics.donations.currency} ${metrics.donations.current.toLocaleString()}`,
      target: metrics.donations.target,
      icon: <FaHandHoldingHeart />,
      color: '#FF7E5F'
    },
    {
      title: 'Fellowship Growth',
      value: metrics.fellowships.applicants.toLocaleString(),
      change: `+${metrics.fellowships.growth}% YoY`,
      icon: <FaUsers />,
      color: '#9F7AEA'
    }
  ];

  return (
    <div className={styles.statsGrid}>
      {stats.map((stat, index) => (
        <motion.div 
          key={index}
          className={styles.statCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
          whileHover={{ scale: 1.03, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
        >
          <div className={styles.statContent}>
            <div className={styles.statIconContainer}>
              <div 
                className={styles.statIconBackdrop}
                style={{ background: stat.color }}
              />
              <div 
                className={styles.statIcon}
                style={{ 
                  background: `linear-gradient(45deg, ${stat.color}, ${shadeColor(stat.color, -15)})`,
                  color: 'white'
                }}
              >
                {stat.icon}
              </div>
            </div>
            
            <div className={styles.statText}>
              <h3 className={styles.statTitle}>{stat.title}</h3>
              <div className={styles.statMainValue}>
                {stat.value}
                {stat.change && (
                  <span 
                    className={styles.changePill}
                    style={{ background: shadeColor(stat.color, -20) }}
                  >
                    {stat.change}
                  </span>
                )}
              </div>
              
              {stat.target && (
                <div className={styles.progressSection}>
                  <div className={styles.progressLabels}>
                    <span>Progress</span>
                    <span>{Math.round((stat.value / stat.target) * 100)}%</span>
                  </div>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${(stat.value / stat.target) * 100}%`,
                        background: `linear-gradient(90deg, ${stat.color}, ${shadeColor(stat.color, -10)})`
                      }}
                    />
                  </div>
                  <div className={styles.targetLabel}>
                    Target: {stat.target.toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStats; 