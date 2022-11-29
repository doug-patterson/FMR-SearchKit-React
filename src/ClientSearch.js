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

export default (props) => {
  let [app, setApp] = React.useState(null)
  let schemas = props.schemas || getSchemas()
  let [initialResults, setInitialResults] = React.useState(null)

  let override = overrides[props.collection]

  if (override) {
    for (let prop in override.properties) {
      schemas = _.update(`${props.collection}.properties.${prop}`, field => ({ ...field, ...override.properties[prop] }), schemas)
    }
  }

  React.useEffect(() => {
    initApp(setApp, props.runOnMount ? setInitialResults : null, props.initialSearch)
  }, [])

  return app && <SearchLayout
    execute={(...args) => app.service('search').create(...args)}
    initialSearch={{ collection: props?.collection}}
    {...props}
    {...(initialResults ? { initialResults } : {})}
    schemas={schemas}
  />
}
