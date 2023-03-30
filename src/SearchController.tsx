import React from 'react'
import _ from 'lodash/fp'
import { ClientRendererInit } from './types'
import { SearchResponse } from './types'

// https://github.com/vercel/next.js/issues/43537#issuecomment-1331054397 
// a component that actually returns a promise needs to be typed with `any` for now
const SearchController: any = async (props: ClientRendererInit) => {
  let initialResults: SearchResponse | null = null

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
