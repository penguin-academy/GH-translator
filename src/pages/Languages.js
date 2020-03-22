import React, { useState } from 'react'

export default ({ languages, onContinue }) => {
  const [first, setFirst] = useState('')
  const [second, setSecond] = useState('')
  const [error, setError] = useState('')

  if (first !== '' && first === second) setSecond('')

  const firstLanguages = languages.map(l => l.name.split('.json')[0])
  const secondLanguages = languages
    .map(l => l.name.split('.json')[0])
    .filter(e => e != first)

  const continueHandler = () => {
    if (first === '' || second === '')
      return setError('Please select both languages!')

    const f = languages.find(el => el.name === first + '.json')
    const s = languages.find(el => el.name === second + '.json')

    try {
      f.text = JSON.parse(f.text)
      s.text = JSON.parse(s.text)
    } catch {
      console.log('ERROR parsing the json')
      return setError(
        'Could not parse the files! One or both are corrupt or have a not supported format.'
      )
    }
    onContinue([f, s])
  }

  return (
    <section className="jumbotron text-cesnter">
      <div className="container">
        <div className="card text-white bg-secondary mb-3">
          <div className="card-header">Choose your Lanauge</div>
          <div className="card-body">
            <div className="row">
              <div className="col-6">
                <div className="form-group">
                  <label>Primary Language</label>
                  <select
                    className="custom-select"
                    value={first}
                    onChange={({ target }) => setFirst(target.value)}
                  >
                    <option value="">Select a Language</option>
                    {firstLanguages.map(l => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                  <p className="card-text mt-3">
                    This should be the main language of the project. Containing
                    the most translations.
                  </p>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>Secondary Language</label>
                  <select
                    className="custom-select"
                    value={second}
                    onChange={({ target }) => setSecond(target.value)}
                  >
                    <option value="">Select a Language</option>
                    {secondLanguages.map(l => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                  <p className="card-text mt-3">
                    This is the language you want to translate into.
                  </p>
                </div>
              </div>
            </div>
            <button
              className="btn btn-primary float-right"
              onClick={continueHandler}
            >
              Continue
            </button>
            {error && (
              <p>
                <small style={{ color: 'red' }}>{error}</small>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
