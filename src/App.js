import React, { useState } from 'react'
import Home from './pages/Home'
import Languages from './pages/Languages'
import Translator from './pages/Translator'

function App() {
  const [view, setView] = useState(0)
  const [languages, setLanguages] = useState([])
  const [gh, setGh] = useState({})

  const onStartHandler = (languages, gh) => {
    setLanguages(languages)
    setGh(gh)
    setView(1)
  }

  const onContinueHandler = languages => {
    setLanguages(languages)
    setView(2)
  }

  return (
    <>
      {view !== 2 ? (
        <header>
          <div className="navbar navbar-dark bg-dark shadow-sm">
            <div className="container d-flex justify-content-between">
              <a href="/#" className="navbar-brand d-flex align-items-center">
                <strong>Pengu's Translator</strong>
              </a>
            </div>
          </div>
        </header>
      ) : (
        ''
      )}
      {view === 0 ? <Home onStart={onStartHandler} /> : ''}
      {view === 1 ? (
        <Languages languages={languages} onContinue={onContinueHandler} />
      ) : (
        ''
      )}
      {view === 2 ? <Translator languages={languages} gh={gh} /> : ''}

      <footer className="text-muted">
        <div className="container">
          <p>
            Pengu's GH Translator PR Tool is created by Penguin Academy, but
            please feel free to contribute on{' '}
            <a href="https://github.com/penguin-academy/gh-translator">
              Github
            </a>
            !
          </p>
          <p>
            Never heared about Penguin Academy?{' '}
            <a href="https://penguin.academy">Visit the homepage</a>.
          </p>
        </div>
      </footer>
    </>
  )
}

export default App
