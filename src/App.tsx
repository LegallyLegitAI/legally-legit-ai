import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from './components/layout/Layout'
import ConsentModal from './components/legal/ConsentModal'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Templates from './pages/Templates'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Disclaimer from './pages/Disclaimer'
import Blog from './pages/Blog'

function App() {
  const [hasConsented, setHasConsented] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('legalConsent')
    if (consent === 'true') {
      setHasConsented(true)
    }
  }, [])

  const handleConsent = () => {
    localStorage.setItem('legalConsent', 'true')
    setHasConsented(true)
  }

  return (
    <>
      {!hasConsented && <ConsentModal onConsent={handleConsent} />}
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App