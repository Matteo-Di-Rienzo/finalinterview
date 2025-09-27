import Home from './pages/Home'
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

  return (
      <Router>
        <div className='layout'>
        <Header />
        <main className='main'>
          <Routes>
            <Route path="/" element={<Home />} />

          </Routes>
          </main>
        <Footer />
        </div>
      </Router>
  )
}

export default App
