# finalinterview - AI-Powered Interview Preparation Platform

finalinterview is a comprehensive interview preparation platform that helps university students and job seekers practice for technical and behavioral interviews using AI-powered feedback. The platform combines structured learning paths with voice-based practice sessions to provide realistic interview preparation.

## 🚀 Features

### Core Functionality
- **AI-Powered Voice Practice**: Record responses to interview questions and receive intelligent feedback
- **Technical Interview Roadmap**: Curated list of coding problems with difficulty levels and LeetCode integration
- **Behavioral Interview Training**: Practice with common behavioral questions using the STAR method
- **Real-time Speech-to-Text**: Convert voice responses to text using ElevenLabs API
- **Intelligent Feedback**: Get AI-generated feedback on your responses using Vellum AI workflows

### Key Components
- **Voice Recording**: Browser-based audio recording with multiple format support
- **Session Management**: Track interview sessions and question progression
- **Company-Specific Preparation**: Tailored content for different companies and roles
- **Responsive Design**: Modern, mobile-friendly interface

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework**: React 19 with React Router for navigation
- **Styling**: Custom CSS with modern design system
- **Components**: Modular component architecture
- **State Management**: React hooks for local state

### Backend (Node.js + Express)
- **API Server**: RESTful API with Express.js
- **File Upload**: Multer for audio file handling
- **AI Integration**: 
  - ElevenLabs for speech-to-text conversion
  - Vellum AI for intelligent feedback generation
- **Session Management**: In-memory session storage

## 📁 Project Structure

```
finalinterview/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── TranscribeMic.jsx    # Voice recording component
│   │   │   ├── Header.jsx           # Navigation header
│   │   │   └── Footer.jsx           # Site footer
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Prepare.jsx          # Preparation hub
│   │   │   ├── Technical.jsx        # Technical interview practice
│   │   │   └── Behavioral.jsx      # Behavioral interview practice
│   │   └── App.jsx         # Main application component
│   └── package.json
├── server/                 # Node.js backend
│   ├── index.js           # Main server file
│   ├── questions.js       # Interview questions database
│   ├── sessionStore.js       # Session management
│   ├── vellumExample.js   # Vellum AI integration
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- API keys for ElevenLabs and Vellum AI

### Environment Variables
Create a `.env` file in the server directory:

```env
ELEVENLABS_API_KEY=your_elevenlabs_api_key
VELLUM_API_KEY=your_vellum_api_key
PORT=5000
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd finalinterview
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Start the development servers**

   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🔧 API Endpoints

### Session Management
- `POST /api/session` - Create a new interview session
- `GET /api/sessions/:id/next` - Get the next question in a session

### Voice Processing
- `POST /api/transcribe` - Upload audio file for transcription and AI feedback
- `GET /api/ping` - Health check endpoint

### Request/Response Format

**Create Session:**
```json
POST /api/session
Response: {
  "ok": true,
  "sessionId": "uuid",
  "question": "Tell me about yourself"
}
```

**Transcribe Audio:**
```json
POST /api/transcribe
Content-Type: multipart/form-data
Body: {
  "sessionId": "uuid",
  "audio": "audio_file"
}
Response: {
  "ok": true,
  "sessionId": "uuid",
  "nextQuestion": "Next question text",
  "text": "Transcribed text",
  "vellumText": "AI feedback",
  "done": false
}
```

## 🎯 Usage

### Getting Started
1. **Landing Page**: Learn about the platform and its benefits
2. **Prepare**: Choose between technical or behavioral interview practice
3. **Technical Practice**: 
   - Browse curated coding problems
   - Filter by difficulty (Easy, Medium, Hard)
   - Access LeetCode links for practice
4. **Behavioral Practice**:
   - Record voice responses to behavioral questions
   - Receive AI feedback on your answers
   - Learn the STAR method for structured responses

### Voice Practice Workflow
1. Click "Start Recording" to begin
2. Answer the displayed question
3. Click "Stop & Send" to process your response
4. Receive AI feedback and move to the next question
5. Complete the session to see your progress

## 🤖 AI Integration

### ElevenLabs Speech-to-Text
- Converts audio recordings to text
- Supports multiple audio formats (WebM, WAV, MP3, etc.)
- Handles various recording qualities

### Vellum AI Workflow
- Processes transcribed text and question context
- Generates intelligent feedback on responses
- Provides structured advice for improvement

## 🎨 Design Features

### Modern UI/UX
- Clean, professional design
- Responsive layout for all devices
- Intuitive navigation
- Visual feedback for user actions

### Component Highlights
- **Hero Section**: Compelling landing page with clear value proposition
- **Benefits Grid**: Feature highlights with icons and descriptions
- **Problem Cards**: Technical problems with difficulty indicators
- **Voice Interface**: Intuitive recording controls with status indicators
- **STAR Method Guide**: Educational content for behavioral interviews

## 🔒 Security & Privacy

- No persistent storage of audio files
- Session-based question progression
- API key protection through environment variables
- CORS configuration for secure cross-origin requests

## 🚀 Deployment

### Production Build
```bash
# Build the client
cd client
npm run build

# Start production server
cd ../server
npm start
```

### Environment Considerations
- Set production API keys
- Configure CORS for production domains
- Set up proper logging and monitoring
- Consider database integration for session persistence

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🆘 Support

For support or questions:
- Create an issue in the repository
- Check the API documentation
- Review the component documentation

---

**TechTO** - Prepare Smarter. Interview Faster. With AI.
