'use client'

// DELETE - HOC is now where it's at

import React from 'react'
import SearchLayout from './SearchLayout'
import getApp, { getSchemas } from '../../feathersClient'
import _ from 'lodash/fp'

// convert to an HOC that receives this as a prop
// then make a component in the project that feeds
// in the project overrides
import overrides from '../../app/overrides'

const initApp = async (setApp, setInitialResults, initialSearch) => {
  const app = await getApp()
  if (setInitialResults) {
    setInitialResults(await app.service('search').create(initialSearch))
  }
  setApp(app)
  // handle localStorage search here
}

const setUpSchemas = async (setSchemas, fullOverrides) => {
  let schemas = await getSchemas()

  const collections = _.keys(fullOverrides)
  for (const key of collections) {
    const override = fullOverrides[key]
    for (const prop in override.properties) {
      schemas = _.update(
        `${key}.properties.${prop}`,
        field => ({ ...field, ...override.properties[prop] }),
        schemas
      )
    }
  }

  setSchemas(schemas)
}

const ClientSearch = props => {
  const [app, setApp] = React.useState(null)
  const [schemas, setSchemas] = React.useState(null)
  const [initialResults, setInitialResults] = React.useState(null)

  React.useEffect(() => {
    initApp(
      setApp,
      props.runOnMount ? setInitialResults : null,
      props.initialSearch
    )
    // we should also allow for per-instance overrides here
    setUpSchemas(setSchemas, overrides)
  }, [props.initialSearch, props.runOnMount])

  return (
    app &&
    schemas && (
      <SearchLayout
        execute={(...args) => app.service('search').create(...args)}
        initialSearch={{ collection: props?.collection }}
        {...props}
        {...(initialResults ? { initialResults } : {})}
        schemas={schemas}
      />
    )
  )
}

export default ClientSearch
