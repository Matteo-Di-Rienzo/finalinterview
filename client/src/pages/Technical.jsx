import { Link } from 'react-router-dom';
import { useState } from 'react';

function Technical() {
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const problems = [
    {
      id: 1,
      title: "Climbing Stairs",
      difficulty: "Easy",
      category: "Dynamic Programming",
      leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/description/",
      description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?"
    },
    {
      id: 2,
      title: "Linked List Cycle",
      difficulty: "Easy",
      category: "Linked List",
      leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle/",
      description: "Detect if linked list has a cycle"
    },
    {
      id: 3,
      title: "Subtree of Another Tree",
      difficulty: "Easy",
      category: "Tree",
      leetcodeUrl: "https://leetcode.com/problems/subtree-of-another-tree/",
      description: "Check if one tree is subtree of another"
    },
    {
      id: 4,
      title: "Product of Array Except Self",
      difficulty: "Medium",
      category: "Array",
      leetcodeUrl: "https://leetcode.com/problems/product-of-array-except-self/description/",
      description: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]."
    },
    {
      id: 5,
      title: "Word Search",
      difficulty: "Medium",
      category: "Backtracking",
      leetcodeUrl: "https://leetcode.com/problems/word-search/description/",
      description: "Given an m x n grid of characters board and a string word, return true if word exists in the grid."
    },
    {
      id: 6,
      title: "Target Sum",
      difficulty: "Medium",
      category: "Dynamic Programming",
      leetcodeUrl: "https://leetcode.com/problems/target-sum/description/",
      description: "You are given an integer array nums and an integer target. Return the number of possible combinations that add up to target."
    },
    {
      id: 7,
      title: "Number of Islands",
      difficulty: "Medium",
      category: "Breadth-First Search",
      leetcodeUrl: "https://leetcode.com/problems/number-of-islands/description/",
      description: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands."
    },
    {
      id: 8,
      title: "Course Schedule II",
      difficulty: "Medium",
      category: "Graph",
      leetcodeUrl: "https://leetcode.com/problems/course-schedule-ii/description/",
      description: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai."
    },
    {
      id: 9,
      title: "Find Median from Data Stream",
      difficulty: "Hard",
      category: "Heap",
      leetcodeUrl: "https://leetcode.com/problems/find-median-from-data-stream/description/",
      description: "The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values."
    },
    {
      id: 10,
      title: "Palindrome Pairs",
      difficulty: "Hard",
      category: "Trie",
      leetcodeUrl: "https://leetcode.com/problems/palindrome-pairs/description/",
      description: "Given a list of unique words, return all the pairs of the distinct indices (i, j) in the given list, so that the concatenation of the two words words[i] + words[j] is a palindrome."
    }
    
  ];

  const filteredProblems = selectedDifficulty === 'all' 
    ? problems 
    : problems.filter(problem => problem.difficulty.toLowerCase() === selectedDifficulty);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="technical-page">
      <div className="container">
        {/* Header */}
        <div className="technical-header">
          <Link to="/prepare" className="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Prepare
          </Link>
          
          <div className="technical-title">
            <div className="company-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Amazon Software Engineering
            </div>
            <h1>Technical Interview Roadmap</h1>
            <p>Master these 10 essential problems to ace your Amazon technical interview</p>
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="difficulty-filter">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${selectedDifficulty === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedDifficulty('all')}
            >
              All Problems
            </button>
            <button 
              className={`filter-btn ${selectedDifficulty === 'easy' ? 'active' : ''}`}
              onClick={() => setSelectedDifficulty('easy')}
            >
              Easy
            </button>
            <button 
              className={`filter-btn ${selectedDifficulty === 'medium' ? 'active' : ''}`}
              onClick={() => setSelectedDifficulty('medium')}
            >
              Medium
            </button>
            <button 
              className={`filter-btn ${selectedDifficulty === 'hard' ? 'active' : ''}`}
              onClick={() => setSelectedDifficulty('hard')}
            >
              Hard
            </button>
          </div>
        </div>

        {/* Problems Grid */}
        <div className="problems-section">
          <div className="problems-grid">
            {filteredProblems.map((problem, index) => (
              <div key={problem.id} className="problem-card card">
                <div className="problem-header">
                  <div className="problem-number">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div 
                    className="difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(problem.difficulty) }}
                  >
                    {problem.difficulty}
                  </div>
                </div>
                
                <div className="problem-content">
                  <h3 className="problem-title">{problem.title}</h3>
                  <p className="problem-category">{problem.category}</p>
                  <p className="problem-description">{problem.description}</p>
                </div>
                
                <div className="problem-actions">
                  <a 
                    href={problem.leetcodeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="leetcode-button primary-button"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Solve on LeetCode
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

    

        {/* Tips Section */}
        <div className="tips-section">
          <h3>Interview Tips</h3>
          <div className="tips-grid">
            <div className="tip-card card">
              <div className="tip-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Think Out Loud</h4>
              <p>Always explain your thought process as you work through the problem</p>
            </div>
            
            <div className="tip-card card">
              <div className="tip-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Start Simple</h4>
              <p>Begin with brute force, then optimize step by step</p>
            </div>
            
            <div className="tip-card card">
              <div className="tip-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 19c-5 0-9-4-9-9s4-9 9-9 9 4 9 9-4 9-9 9zM21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4>Ask Questions</h4>
              <p>Clarify requirements and edge cases before coding</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Technical;
