import React from 'react'
import _ from 'lodash/fp'

const SearchController = async props => {
  let initialResults

  if (props.runInitialSearch) {
    initialResults = await props.runInitialSearch(props.initialSearch)
  }

  return (
    <props.SearchLayout
      initialResults={initialResults}
      {..._.omit(['runInitialSearch'], props)}
    />
  )
}

export default SearchController
