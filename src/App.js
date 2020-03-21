import React, { useState } from 'react'
import Home from './pages/Home'

function App() {
  const [view, setView] = useState(0)

  const onStartHandler = languages => {
    console.log(languages)
    setView(1)
  }

  return (
    <>
      <header>
        <div className="navbar navbar-dark bg-dark shadow-sm">
          <div className="container d-flex justify-content-between">
            <a href="/#" className="navbar-brand d-flex align-items-center">
              <strong>Pengu's Translator</strong>
            </a>
          </div>
        </div>
      </header>
      {view === 0 ? <Home onStart={onStartHandler} /> : ''}

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
