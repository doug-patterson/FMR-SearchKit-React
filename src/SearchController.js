import React from 'react'
import _ from 'lodash/fp'

export default async props => {
  let initialResults

  if (props.runInitialSearch) {
    initialResults = await props.runInitialSearch(props.initialSearch)
  }

  return <props.SearchLayout
    initialResults={initialResults}
    {..._.omit(['runInitialSearch'], props)}
  />
}
