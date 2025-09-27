import { useState } from 'react';
import { Link } from 'react-router-dom';
import TestConnection from '../components/Test'
import TranscribeMic from '../components/TranscribeMic'

function Prepare() {
  const [isRecording, setIsRecording] = useState(false);
  const [interviewDetails, setInterviewDetails] = useState({
    company: '',
    position: '',
    interviewType: 'behavioral',
    experience: 'entry'
  });

  const handleStartRecording = () => {
    setIsRecording(true);
    // Simulate recording for demo purposes
    setTimeout(() => {
      setIsRecording(false);
      // Simulate voice input results
      setInterviewDetails({
        company: 'Amazon',
        position: 'Software Engineer',
        interviewType: 'technical',
        experience: 'mid'
      });
    }, 3000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  return (
    <div className="prepare-page">
      <div className="container">
        {/* Header */}
        <div className="prepare-header">
          <Link to="/" className="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Home
          </Link>
          <TestConnection />
          <TranscribeMic />
          <div className="prepare-title">
            <h1>Prepare for Your Interview</h1>
            <p>Tell us about your upcoming interview and we'll help you prepare</p>
          </div>
        </div>

        {/* Voice Input Section */}
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
              <h2>Voice Input</h2>
              <p>Click the microphone and tell us about your interview</p>
            </div>

            <div className="voice-controls">
              {!isRecording ? (
                <button 
                  className="record-button primary-button"
                  onClick={handleStartRecording}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="3" fill="currentColor"/>
                  </svg>
                  Start Recording
                </button>
              ) : (
                <div className="recording-state">
                  <div className="recording-animation">
                    <div className="pulse-ring"></div>
                    <div className="pulse-ring delay-1"></div>
                    <div className="pulse-ring delay-2"></div>
                  </div>
                  <button 
                    className="stop-button secondary-button"
                    onClick={handleStopRecording}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>
                    </svg>
                    Stop Recording
                  </button>
                  <p className="recording-text">Listening... Speak clearly about your interview</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interview Details Form */}
        <div className="details-section">
          <div className="details-card card">
            <h3>Interview Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="company">Company Name</label>
                <input 
                  type="text" 
                  id="company"
                  value={interviewDetails.company}
                  onChange={(e) => setInterviewDetails({...interviewDetails, company: e.target.value})}
                  placeholder="e.g., Google, Microsoft, Startup Inc."
                />
              </div>

              <div className="form-group">
                <label htmlFor="position">Position</label>
                <input 
                  type="text" 
                  id="position"
                  value={interviewDetails.position}
                  onChange={(e) => setInterviewDetails({...interviewDetails, position: e.target.value})}
                  placeholder="e.g., Software Engineer, Product Manager"
                />
              </div>

              

              
            </div>
          </div>
        </div>

        {/* Preparation Options */}
        <div className="preparation-section">
          <h3>Choose Your Preparation Focus</h3>
          <div className="preparation-grid">
            <div className="prep-card card">
              <div className="prep-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Behavioral Questions</h4>
              <p>Practice STAR method responses for common behavioral scenarios</p>
              <Link to="/behavioral" className="secondary-button">Start Practice</Link>
            </div>

            <div className="prep-card card">
              <div className="prep-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Technical Questions</h4>
              <p>Code challenges and technical problem-solving practice</p>
              <Link to="/technical" className="secondary-button">Start Practice</Link>
            </div>

            
          </div>
        </div>

        {/* Action Buttons */}
        
      </div>
    </div>
  );
}

export default Prepare;
