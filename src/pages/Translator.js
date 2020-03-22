import React, { useState, useEffect, useRef } from 'react'

import './Translator.css'

export default ({ languages, gh }) => {
  const [state, setState] = useState(languages[0].text)
  const [state2, setState2] = useState(languages[1].text)
  const [disabled, setDisabled] = useState(false)
  const [error, setError] = useState('')

  const first = languages[0].name.split('.json')[0]
  const second = languages[1].name.split('.json')[0]

  compareObjectKeys(state, state2)

  const saveHandler = () => {
    setDisabled(true)
    setError('')
    fetch('http://localhost:3001/pr/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        files: [
          {
            name: languages[0].name,
            text: JSON.stringify(state, null, 2) + '\n'
          },
          {
            name: languages[1].name,
            text: JSON.stringify(state2, null, 2) + '\n'
          }
        ],
        ...gh
      })
    })
      .then(res => {
        if (res.ok) return res.json()
        else throw res.statusText
      })
      .then(res => {
        window.location = res.html_url
      })
      .catch(err => {
        setDisabled(false)
        setError('Something went wrong. Changes are not saved! Try again.')
        console.log('ERROR! ', err)
      })
  }

  return (
    <>
      <Header
        first={first}
        second={second}
        saveHandler={saveHandler}
        disabled={disabled}
      />
      <div style={{ padding: 15, marginTop: 60 }}>
        {error && (
          <div class="alert alert-dismissible alert-danger">
            <button type="button" class="close" onClick={() => setError(false)}>
              &times;
            </button>
            <h4 class="alert-heading">Error!</h4>
            <p class="mb-0">{error}</p>
          </div>
        )}
        {disabled ? (
          <div className="jumbotron text-center container">
            <img className="heropenguin" src="/hero.svg" />
            <p className="lead">
              Hi it's Pengu! I'm creating a Pull Request with your change. Hold
              on!
            </p>
          </div>
        ) : (
          <>
            <StateInspector
              state={state}
              title={first}
              state2={state2}
              title2={second}
            />
            <Recur
              data={state}
              setParentState={setState}
              title={first}
              data2={state2}
              setParentState2={setState2}
              title2={second}
            />
          </>
        )}
      </div>
    </>
  )
}

const Recur = ({
  data,
  data2,
  name = '',
  setParentState = () => {},
  setParentState2 = () => {},
  title,
  title2
}) => {
  const [state, setRecurState] = useState(data)
  const [state2, setRecurState2] = useState(data2 || {})

  const setState = (data, key) => {
    setRecurState({ ...state, [key]: data })
    setParentState({ ...state, [key]: data })
  }
  const setState2 = (data, key) => {
    setRecurState2({ ...state2, [key]: data })
    setParentState2({ ...state2, [key]: data })
  }

  const mergeKey = (pre, key) => {
    return pre.length ? pre + '.' + key : key
  }

  return (
    <>
      {Object.entries(state).map(([key, value]) =>
        typeof value === 'object' ? (
          <div
            className="card text-white bg-secondary mb-3"
            key={mergeKey(name, key)}
          >
            <div className="card-header">{key}</div>
            <div className="card-body">
              <Recur
                data={value}
                data2={state2[key]}
                name={mergeKey(name, key)}
                setParentState={data => setState(data, key)}
                setParentState2={data => setState2(data, key)}
                title={title}
                title2={title2}
              />
            </div>
          </div>
        ) : (
          <Row
            data={value}
            data2={state2[key]}
            key={mergeKey(name, key)}
            name={mergeKey(name, key)}
            setData={data => setState(data, key)}
            setData2={data => setState2(data, key)}
            title={title}
            title2={title2}
          />
        )
      )}
    </>
  )
}

const Row = ({ data, data2, name, setData, setData2, title, title2 }) => (
  <div className="row mb-3">
    <div className="col-6">
      <label>
        {title}: {name}
      </label>
      <textarea
        className="form-control"
        value={data}
        onChange={({ target }) => setData(target.value)}
      ></textarea>
    </div>
    <div className="col-6">
      <label>
        {title2}: {name}
      </label>
      <textarea
        className="form-control"
        value={data2}
        onChange={({ target }) => setData2(target.value)}
      ></textarea>
    </div>
  </div>
)

const StateInspector = ({ state, state2, title, title2 }) => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <button
        type="button"
        className="btn btn-outline-primary btn-sm mb-4"
        onClick={() => setVisible(!visible)}
      >
        {'< >'}
      </button>

      <div
        style={{
          margin: 15,
          maxHeight: 200,
          overflow: 'scroll',
          display: visible ? 'block' : 'none'
        }}
      >
        <div className="row">
          <div className="col-6">
            <p>{title}</p>
            <pre>
              <code>{JSON.stringify(state, null, 2)}</code>
            </pre>
          </div>
          <div className="col-6">
            <p>{title2}</p>
            <pre>
              <code>{JSON.stringify(state2, null, 2)}</code>
            </pre>
          </div>
        </div>
      </div>
    </>
  )
}

const compareObjectKeys = (A, B) => {
  const flattenObject = (obj, prefix = '') => {
    const x = Object.keys(obj).reduce((acc, k) => {
      const pre = prefix.length ? prefix + '.' : ''
      if (typeof obj[k] === 'object')
        acc = acc.concat(flattenObject(obj[k], pre + k))
      else acc.push(pre + k)

      return acc
    }, [])
    return x
  }

  const Aflat = flattenObject(A)
  const Bflat = flattenObject(B)

  console.log('The second language was missing the following elements:')
  console.log(Aflat.filter(n => !Bflat.includes(n)))

  console.log(
    'The following keys were not in the base language and are not editable:'
  )
  console.log(Bflat.filter(n => !Aflat.includes(n)))
}

const Header = ({ first, second, saveHandler, disabled }) => (
  <header>
    <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <div
        className="row text-center"
        style={{ width: '100%', margin: '5px 15px' }}
      >
        <div className="col-6">
          <h5 className="card-title">{first}</h5>
        </div>
        <div className="col-5">
          <h5 className="card-title">{second}</h5>
        </div>
        <div className="col-1">
          <button
            className="btn btn-primary"
            style={{ marginLeft: '-40' }}
            onClick={saveHandler}
            disabled={disabled}
          >
            {disabled ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </nav>
  </header>
)
