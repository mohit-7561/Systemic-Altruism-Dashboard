import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaUserPlus, FaChartLine, FaUniversity, FaMobile, FaShoppingBag, FaShare, FaHandHoldingHeart, FaCoins } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import DashboardHeader from './DashboardHeader/DashboardHeader';
import QuickStats from './QuickStats/QuickStats';
import InterestsSection from './InterestsSection/InterestsSection';
import Sidebar from './Sidebar/Sidebar';

import apexcharts from 'apexcharts';
import Chart from 'react-apexcharts';

const Dashboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Dummy data for metrics
  const metricsData = {
    colleges: { current: 42, target: 100 },
    downloads: { current: 12500, monthlyGrowth: 15 },
    revenue: { current: 284500, currency: 'USD' },
    socialMedia: { views: 2.8e6, shares: 125000 },
    donations: { current: 1.2e6, target: 2.5e6 },
    fellowships: { applicants: 850, growth: 35 }
  };

  // Add universal text styling to all charts
  const baseChartOptions = {
    title: {
      style: {
        color: '#ffffff',
        fontSize: '18px',
        fontWeight: 600,
        fontFamily: 'Arial, sans-serif',
        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
      }
    },
    xaxis: {
      labels: {
        style: {
          colors: '#ffffff',
          fontSize: '12px',
          fontWeight: 500
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#ffffff',
          fontSize: '12px',
          fontWeight: 500
        }
      }
    },
    dataLabels: {
      style: {
        colors: ['#ffffff'],
        fontSize: '12px',
        fontWeight: 600,
        background: 'rgba(0,0,0,0.5)',
        padding: '4px 8px',
        borderRadius: '4px'
      }
    },
    legend: {
      labels: {
        colors: '#ffffff',
        fontSize: '12px',
        fontWeight: 500
      }
    }
  };

  // Updated chart configurations
  const chartOptions = {
    colleges: {
      ...baseChartOptions,
      chart: {
        type: 'line',
        height: 300,
        shadow: {
          enabled: true,
          color: '#48BB78',
          top: 5,
          left: 5,
          blur: 5,
          opacity: 0.2
        }
      },
      stroke: {
        width: 4,
        curve: 'smooth',
        dashArray: [0, 0]
      },
      markers: {
        size: 6,
        colors: ['#48BB78'],
        strokeColors: '#ffffff',
        strokeWidth: 2
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#4CA1AF'],
          shadeIntensity: 1,
          type: 'vertical',
          opacityFrom: 0.7,
          opacityTo: 0.2,
        }
      }
    },
    engagement: {
      ...baseChartOptions,
      chart: {
        type: 'area',
        height: 300,
        stacked: true
      },
      stroke: {
        curve: 'straight',
        width: 3,
        dashArray: [0, 5]
      },
      fill: {
        type: 'gradient',
        gradient: {
          inverseColors: false,
          shade: 'dark',
          type: 'vertical',
          opacityFrom: 0.8,
          opacityTo: 0.1
        }
      },
      plotOptions: {
        area: {
          fillTo: 'end'
        }
      }
    },
    revenue: {
      ...baseChartOptions,
      chart: {
        type: 'line',
        height: 300,
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      stroke: {
        width: 4,
        curve: 'stepline'
      },
      markers: {
        shape: 'rect',
        size: 8,
        strokeWidth: 0
      },
      annotations: {
        points: [
          {
            x: '2021',
            y: 250000,
            marker: {
              size: 8,
              fillColor: '#ED8936',
              strokeColor: '#ffffff'
            },
            label: {
              text: 'COVID Impact',
              style: {
                color: '#ffffff',
                background: '#ED8936'
              }
            }
          }
        ]
      }
    },
    social: {
      ...baseChartOptions,
      chart: {
        type: 'bar',
        height: 300
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: '60%',
          dataLabels: {
            position: 'top'
          }
        }
      },
      states: {
        hover: {
          filter: {
            type: 'darken',
            value: 0.8
          }
        }
      }
    },
    donations: {
      ...baseChartOptions,
      chart: {
        type: 'bar',
        height: 300,
        stacked: true
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '80%',
          borderRadius: 6
        }
      },
      dataLabels: {
        enabled: false
      }
    },
    fellowships: {
      ...baseChartOptions,
      chart: {
        type: 'radar',
        height: 300,
        dropShadow: {
          enabled: true,
          blur: 5,
          left: 1,
          top: 1
        }
      },
      plotOptions: {
        radar: {
          size: 120,
          polygons: {
            strokeColors: 'rgba(255,255,255,0.1)',
            connectorColors: 'rgba(255,255,255,0.1)'
          }
        }
      },
      markers: {
        size: 0
      }
    },
    bar: {
      ...baseChartOptions,
      chart: {
        background: 'transparent',
        foreColor: '#ffffff',
        toolbar: {
          tools: {
            download: '<span style="color:white!important">⬇</span>'
          }
        }
      },
      theme: {
        mode: 'dark',
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          colors: {
            ranges: [{
              from: 0,
              to: 10000,
              color: '#48BB78' // Using your secondary color
            }]
          }
        }
      }
    },
    line: {
      ...baseChartOptions,
      chart: {
        background: 'transparent',
        foreColor: '#ffffff'
      },
      stroke: {
        colors: ['#ED8936'] // Using accent color
      },
      markers: {
        colors: ['#ffffff']
      }
    },
    pie: {
      ...baseChartOptions,
      chart: {
        background: 'transparent',
        foreColor: '#ffffff'
      },
      labels: {
        colors: '#ffffff'
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#ffffff'], // White text with black stroke
          fontSize: '16px',
          fontWeight: 'bold',
        },
        dropShadow: {
          enabled: true,
          color: '#000000',
          opacity: 0.8,
          blur: 3
        }
      },
      legend: {
        labels: {
          colors: '#ffffff', // White legend text
          useSeriesColors: false
        }
      }
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'interests':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <InterestsSection />
          </motion.div>
        );
      case 'dashboard':
      default:
        return (
          <div className={styles.dashboardGrid}>
            <div className={styles.quickStatsGrid}>
              <div className={styles.statCard}>
                <h3 className={styles.statTitle}>Monthly Sales</h3>
                <div className={styles.statValue}>$124,420</div>
                <div className={styles.statTrend}>↑ 18% vs last month</div>
              </div>

              <div className={styles.statCard}>
                <h3 className={styles.statTitle}>Active Users</h3>
                <div className={styles.statValue}>3,842</div>
                <div className={styles.statTrend}>↑ 24 new today</div>
              </div>

              <div className={styles.statCard}>
                <h3 className={styles.statTitle}>Conversion Rate</h3>
                <div className={styles.statValue}>4.8%</div>
                <div className={styles.statTrend}>↓ 0.3% from peak</div>
              </div>

              <div className={styles.statCard}>
                <h3 className={styles.statTitle}>Avg. Order Value</h3>
                <div className={styles.statValue}>$89.50</div>
                <div className={styles.statTrend}>→ Stable</div>
              </div>

              <div className={styles.statCard}>
                <h3 className={styles.statTitle}>Total Products</h3>
                <div className={styles.statValue}>1,234</div>
                <div className={styles.statTrend}>↑ 12 new this week</div>
              </div>

              <div className={styles.statCard}>
                <h3 className={styles.statTitle}>Support Tickets</h3>
                <div className={styles.statValue}>48</div>
                <div className={styles.statTrend}>↓ 15% resolved</div>
              </div>
            </div>
            
            <div className={styles.chartsContainer}>
              {/* College Onboarding */}
              <motion.div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <FaUniversity />
                  <h3>College Onboarding</h3>
                </div>
                <Chart
                  options={chartOptions.colleges}
                  series={[{ name: 'Colleges', data: [8, 15, 22, 42] }]}
                  type="line"
                  height={300}
                />
              </motion.div>

              {/* App Engagement */}
              <motion.div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <FaMobile />
                  <h3>Bloom Scrolling Engagement</h3>
                </div>
                <Chart
                  options={chartOptions.engagement}
                  series={[{ 
                    name: 'Active Users', 
                    data: [4500, 6200, 7800, 9200, 11000, 12500] 
                  }]}
                  type="area"
                  height={300}
                />
              </motion.div>

              {/* Revenue */}
              <motion.div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <FaCoins />
                  <h3>Charity Goods Revenue</h3>
                </div>
                <Chart
                  options={chartOptions.revenue}
                  series={[{ 
                    name: 'Revenue', 
                    data: [120000, 145000, 210000, 265000, 284500] 
                  }]}
                  type="line"
                  height={300}
                />
              </motion.div>

              {/* Social Media */}
              <motion.div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <FaShare />
                  <h3>Viral Campaign Impact</h3>
                </div>
                <Chart
                  options={chartOptions.social}
                  series={[{ 
                    name: 'Views', 
                    data: [1200000, 850000, 2100000, 450000] 
                  }]}
                  type="bar"
                  height={300}
                />
              </motion.div>

              {/* Donations */}
              <motion.div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <FaHandHoldingHeart />
                  <h3>Systemic Donations</h3>
                </div>
                <Chart
                  options={chartOptions.donations}
                  series={[{ 
                    name: 'Amount', 
                    data: [450000, 320000, 280000, 150000] 
                  }]}
                  type="bar"
                  height={300}
                />
              </motion.div>

              {/* Fellowships */}
              <motion.div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <FaUsers />
                  <h3>Program Participation</h3>
                </div>
                <Chart
                  options={chartOptions.fellowships}
                  series={[{ 
                    name: 'Applicants', 
                    data: [120, 250, 420, 680, 850] 
                  }]}
                  type="line"
                  height={300}
                />
              </motion.div>
            </div>
          </div>
        );
    }
  };

  useEffect(() => {
    // Remove the modal handling logic from this useEffect
    // This entire useEffect can be removed if it only contained the modal logic
  }, [currentSection]);

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        user={{ name: 'Guest', email: 'guest@example.com' }}
        onNavigate={setCurrentSection}
      />
      
      <main className={`${styles.mainContent} ${sidebarOpen ? styles.shifted : ''}`}>
        <div className={styles.content}>
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
