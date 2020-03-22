import React, { useState } from 'react'

export default ({ onStart }) => {
  const [repoLink, setRepoLink] = useState(
    'https://github.com/penguin-academy/covid-19-py'
  )
  const [branch, setBranch] = useState('jmayalag-feature/i18n')
  const [folder, setFolder] = useState('src/i18n')

  const [error, setError] = useState('')
  const [disabled, setDisabled] = useState('')

  const handleStart = e => {
    e.preventDefault()

    setDisabled(true)
    setError('')

    fetch('https://penguin-utility-server.herokuapp.com/pr/load', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoLink, branch, folder })
    })
      .then(res => {
        if (res.ok) return res.json()
        else throw res.statusText
      })
      .then(res => {
        setDisabled(false)
        if (!res.length) {
          return setError(
            'No files found to translate. I can only work with *.json files at the moment.'
          )
        }
        onStart(res, { repoLink, branch, folder })
      })
      .catch(error => {
        setError(
          'Error. Please provide valid link. e.g. https://github.com/penguin-academy/covid-19-py/tree/develop/src/i18n'
        )
        setDisabled(false)
        console.log(error)
      })
  }

  return (
    <main role="main">
      <section className="jumbotron text-center">
        <div className="container">
          <h1>Album example</h1>
          <p className="lead text-muted">
            Something short and leading about the collection below—its contents,
            the creator, etc. Make it short and sweet, but not too short so
            folks don’t simply skip over it entirely.
          </p>
          <form onSubmit={handleStart}>
            <div className="row">
              <div className="col-md-5 mb-3">
                <label htmlFor="repo">Link to GH repository</label>
                <input
                  required
                  id="repo"
                  type="text"
                  className="form-control"
                  placeholder="http://github.com/organization/your-project"
                  value={repoLink}
                  onChange={({ target }) => setRepoLink(target.value)}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="branch">Branch</label>
                <input
                  required
                  id="branch"
                  type="text"
                  className="form-control"
                  placeholder="master"
                  value={branch}
                  onChange={({ target }) => setBranch(target.value)}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label htmlFor="folder">Folder</label>
                <input
                  required
                  id="folder"
                  type="text"
                  className="form-control"
                  placeholder="src/i18n"
                  value={folder}
                  onChange={({ target }) => setFolder(target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary my-2"
              disabled={disabled}
            >
              {disabled ? 'loading ...' : 'Start'}
            </button>
            {error && (
              <p>
                <small style={{ color: 'red' }}>{error}</small>
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  )
}
