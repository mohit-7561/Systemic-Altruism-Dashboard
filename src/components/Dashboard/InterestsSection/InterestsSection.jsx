import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTimes, FaEdit, FaSave } from 'react-icons/fa';
import styles from './InterestsSection.module.css';

const InterestsSection = () => {
  const [interests, setInterests] = useState([
    { id: 1, category: 'Subjects', items: ['Mathematics', 'Computer Science', 'Physics'] },
    { id: 2, category: 'Skills', items: ['Programming', 'Data Analysis', 'Research'] },
    { id: 3, category: 'Project Types', items: ['Group Study', 'Research Papers', 'Presentations'] }
  ]);
  
  const [newInterest, setNewInterest] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Subjects');

  const suggestedInterests = {
    Subjects: ['Chemistry', 'Biology', 'Literature', 'History', 'Economics'],
    Skills: ['Public Speaking', 'Writing', 'Problem Solving', 'Leadership'],
    'Project Types': ['Lab Work', 'Case Studies', 'Workshops', 'Tutorials']
  };

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      setInterests(prevInterests => 
        prevInterests.map(category => 
          category.category === selectedCategory
            ? { ...category, items: [...category.items, newInterest.trim()] }
            : category
        )
      );
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (categoryId, interest) => {
    setInterests(prevInterests =>
      prevInterests.map(category =>
        category.id === categoryId
          ? { ...category, items: category.items.filter(item => item !== interest) }
          : category
      )
    );
  };

  const handleEditCategory = (categoryId) => {
    setEditingCategory(categoryId);
  };

  const handleSaveCategory = (categoryId, newName) => {
    setInterests(prevInterests =>
      prevInterests.map(category =>
        category.id === categoryId
          ? { ...category, category: newName }
          : category
      )
    );
    setEditingCategory(null);
  };

  return (
    <div className={styles.interestsSection}>
      <div className={styles.header}>
        <h2>Your Interests</h2>
        <div className={styles.addInterestContainer}>
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            placeholder="Add new interest..."
            className={styles.addInterestInput}
          />
          <motion.button
            className={styles.addButton}
            onClick={handleAddInterest}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus /> Add
          </motion.button>
        </div>
      </div>

      <div className={styles.categoryTabs}>
        {interests.map(category => (
          <motion.button
            key={category.id}
            className={`${styles.categoryTab} ${selectedCategory === category.category ? styles.active : ''}`}
            onClick={() => setSelectedCategory(category.category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.category}
          </motion.button>
        ))}
      </div>

      <div className={styles.interestsContainer}>
        <AnimatePresence mode="wait">
          {interests.map(category => (
            category.category === selectedCategory && (
              <motion.div
                key={category.id}
                className={styles.categorySection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className={styles.categoryHeader}>
                  {editingCategory === category.id ? (
                    <div className={styles.editCategoryContainer}>
                      <input
                        type="text"
                        defaultValue={category.category}
                        className={styles.editCategoryInput}
                        onBlur={(e) => handleSaveCategory(category.id, e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveCategory(category.id, e.target.value);
                          }
                        }}
                        autoFocus
                      />
                      <FaSave 
                        className={styles.saveIcon}
                        onClick={() => handleSaveCategory(category.id, document.querySelector(`.${styles.editCategoryInput}`).value)}
                      />
                    </div>
                  ) : (
                    <div className={styles.categoryTitle}>
                      <h3>{category.category}</h3>
                      <FaEdit
                        className={styles.editIcon}
                        onClick={() => handleEditCategory(category.id)}
                      />
                    </div>
                  )}
                </div>

                <div className={styles.interestTags}>
                  {category.items.map((interest, index) => (
                    <motion.span
                      key={interest}
                      className={styles.interestTag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {interest}
                      <button
                        onClick={() => handleRemoveInterest(category.id, interest)}
                        className={styles.removeButton}
                      >
                        <FaTimes />
                      </button>
                    </motion.span>
                  ))}
                </div>

                <div className={styles.suggestedInterests}>
                  <h4>Suggested {category.category}</h4>
                  <div className={styles.suggestedTags}>
                    {suggestedInterests[category.category]
                      .filter(interest => !category.items.includes(interest))
                      .map((interest, index) => (
                        <motion.button
                          key={interest}
                          className={styles.suggestedTag}
                          onClick={() => {
                            setNewInterest(interest);
                            handleAddInterest();
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <FaPlus /> {interest}
                        </motion.button>
                      ))}
                  </div>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InterestsSection; 