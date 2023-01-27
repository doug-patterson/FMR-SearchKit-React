'use client'

import React from 'react'
import SearchLayout from './SearchLayout'
import { FilterDropdown as FilterWrapper } from './FilterDropdown'
import _ from 'lodash/fp'
import { setUpSchemas } from './util'

const initApp = async (setApp, setInitialResults, initialSearch, getApp) => {
  const app = await getApp()
  if (setInitialResults) {
    setInitialResults(await app.service('search').create(initialSearch))
  }
  setApp(app)
}

const ClientSearchWithOverrides = props => {
  const [app, setApp] = React.useState(null)
  const [schemas, setSchemas] = React.useState(null)
  const [initialResults, setInitialResults] = React.useState(null)

  React.useEffect(() => {
    const setUp = async () => {
      initApp(
        setApp,
        props.clientOnly ? setInitialResults : null,
        props.initialSearch,
        props.getApp
      )
      setSchemas(
        setUpSchemas(
          _.merge(props.defaultOverrides, props.overrides),
          props.schemas
        )
      )
    }
    setUp()
  }, [
    props.clientOnly,
    props.defaultOverrides,
    props.initialSearch,
    props.overrides,
    props.getApp,
    props.schemas
  ])

  return (
    app &&
    schemas && (
      <SearchLayout
        initialSearch={{ collection: props?.collection }}
        {...props}
        {...(initialResults ? { initialResults } : {})}
        schemas={schemas}
        {...(props.collapseableFilters ? { FilterWrapper } : {})}
      />
    )
  )
}

const ClientSearchHOC = props => <ClientSearchWithOverrides {...props} />

export default ClientSearchHOC
