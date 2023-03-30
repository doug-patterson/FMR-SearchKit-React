import React from 'react'
import _ from 'lodash/fp'
import { ClientRendererInit } from './types'

const SearchController = async (props: ClientRendererInit) => {
  let initialResults

  if (props.runInitialSearch) {
    initialResults = await props.runInitialSearch(props.initialSearch)
  }

  return (
    (!props.runInitialSearch || initialResults) && <props.SearchLayout
      initialResults={initialResults}
      {..._.omit(['runInitialSearch'], props)}
    />
  )
}

export default SearchController
