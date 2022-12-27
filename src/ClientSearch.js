'use client'

import React from 'react'
import SearchLayout from './SearchLayout'
import getApp, { getSchemas } from '../../feathersClient'
import _ from 'lodash/fp'
import overrides from '../../app/overrides'

let initApp = async (setApp, setInitialResults, initialSearch) => {
  let app = await getApp()
  if (setInitialResults) {
    setInitialResults(await app.service('search').create(initialSearch))
  }
  setApp(app)
  // handle localStorage search here
}

const setUpSchemas = async (setSchemas, fullOverrides) => {
  let schemas = await getSchemas()

  let collections = _.keys(fullOverrides)
  for (let key of collections) {
    let override = fullOverrides[key]
    for (let prop in override.properties) {
      schemas = _.update(`${key}.properties.${prop}`, field => ({ ...field, ...override.properties[prop] }), schemas)
    }
  }

  setSchemas(schemas)
}

export default (props) => {
  let [app, setApp] = React.useState(null)
  let [schemas, setSchemas] = React.useState(null)
  let [initialResults, setInitialResults] = React.useState(null)

  React.useEffect(() => {
    initApp(setApp, props.runOnMount ? setInitialResults : null, props.initialSearch)
    // we should also allow for per-instance overrides here
    setUpSchemas(setSchemas, overrides)
  }, [])

  return app && schemas && <SearchLayout
    execute={(...args) => app.service('search').create(...args)}
    initialSearch={{ collection: props?.collection}}
    {...props}
    {...(initialResults ? { initialResults } : {})}
    schemas={schemas}
  />
}
