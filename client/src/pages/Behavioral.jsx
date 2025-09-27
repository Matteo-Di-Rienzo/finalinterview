import { Link } from 'react-router-dom';
import TestConnection from '../components/Test'
import TranscribeMic from '../components/TranscribeMic'

function Behavioral() {
  return (
    <div className="behavioral-page">
      <div className="container">
        {/* Header */}
        <div className="behavioral-header">
          <Link to="/prepare" className="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Prepare
          </Link>
          
          <div className="behavioral-title">
            <div className="interview-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Behavioral Interview
            </div>
            <h1>Practice Your Behavioral Responses</h1>
            <p>Use voice input to practice answering common behavioral interview questions with AI feedback</p>
          </div>
        </div>

        {/* Test Connection and Voice Input */}
        <div className="voice-section">
          <div className="voice-card card">
            <div className="voice-header">
              <div className="voice-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/>
                  <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h2>Voice Practice</h2>
              <p>Record your responses to behavioral questions and get AI feedback</p>
            </div>

            <div className="voice-components">
              <TestConnection />
              <TranscribeMic />
            </div>
          </div>
        </div>

        {/* Common Behavioral Questions */}
        <div className="questions-section">
          <h3>Common Behavioral Questions</h3>
          <div className="questions-grid">
            <div className="question-card card">
              <div className="question-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Tell me about a time you failed</h4>
              <p>Use the STAR method: Situation, Task, Action, Result</p>
              <div className="question-tags">
                <span className="tag">Failure</span>
                <span className="tag">Learning</span>
              </div>
            </div>

            <div className="question-card card">
              <div className="question-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Describe a time you worked in a team</h4>
              <p>Focus on collaboration, communication, and conflict resolution</p>
              <div className="question-tags">
                <span className="tag">Teamwork</span>
                <span className="tag">Leadership</span>
              </div>
            </div>

            <div className="question-card card">
              <div className="question-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Tell me about a challenging project</h4>
              <p>Highlight problem-solving skills and how you overcame obstacles</p>
              <div className="question-tags">
                <span className="tag">Problem Solving</span>
                <span className="tag">Persistence</span>
              </div>
            </div>

            <div className="question-card card">
              <div className="question-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 19c-5 0-9-4-9-9s4-9 9-9 9 4 9 9-4 9-9 9zM21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4>How do you handle stress?</h4>
              <p>Show self-awareness and healthy coping mechanisms</p>
              <div className="question-tags">
                <span className="tag">Stress Management</span>
                <span className="tag">Self-Awareness</span>
              </div>
            </div>

            <div className="question-card card">
              <div className="question-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Where do you see yourself in 5 years?</h4>
              <p>Demonstrate career planning and alignment with company goals</p>
              <div className="question-tags">
                <span className="tag">Career Goals</span>
                <span className="tag">Planning</span>
              </div>
            </div>

            <div className="question-card card">
              <div className="question-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Describe a time you had to learn something new</h4>
              <p>Show adaptability and continuous learning mindset</p>
              <div className="question-tags">
                <span className="tag">Learning</span>
                <span className="tag">Adaptability</span>
              </div>
            </div>
          </div>
        </div>

        {/* STAR Method Guide */}
        <div className="star-section">
          <div className="star-card card">
            <h3>Master the STAR Method</h3>
            <div className="star-grid">
              <div className="star-step">
                <div className="step-number">S</div>
                <h4>Situation</h4>
                <p>Set the context and background of your story</p>
              </div>
              <div className="star-step">
                <div className="step-number">T</div>
                <h4>Task</h4>
                <p>Explain your responsibility and what needed to be done</p>
              </div>
              <div className="star-step">
                <div className="step-number">A</div>
                <h4>Action</h4>
                <p>Describe the specific steps you took to address the situation</p>
              </div>
              <div className="star-step">
                <div className="step-number">R</div>
                <h4>Result</h4>
                <p>Share the outcome and what you learned from the experience</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="tips-section">
          <h3>Behavioral Interview Tips</h3>
          <div className="tips-grid">
            <div className="tip-card card">
              <div className="tip-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Prepare Stories</h4>
              <p>Have 5-7 detailed stories ready that demonstrate different skills</p>
            </div>
            
            <div className="tip-card card">
              <div className="tip-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Be Specific</h4>
              <p>Use concrete examples with numbers, names, and specific details</p>
            </div>
            
            <div className="tip-card card">
              <div className="tip-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 19c-5 0-9-4-9-9s4-9 9-9 9 4 9 9-4 9-9 9zM21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4>Stay Positive</h4>
              <p>Even when discussing failures, focus on what you learned</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Behavioral;
