import Home from './pages/Home'
import Prepare from './pages/Prepare'
import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'

import {
  BrowserRouter as Router, 
  Routes,
  Route,
  Navigate 
} from "react-router-dom";

function App() {
  console.log("App component is rendering");

  return (
      <Router>
        <div className='layout'>
        <Header />
        <main className='main'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/prepare" element={<Prepare />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </main>
        <Footer />
        </div>
      </Router>
  )
}

export default App
