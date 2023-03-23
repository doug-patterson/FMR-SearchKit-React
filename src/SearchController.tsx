// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from 'lodash/fp'

const SearchController = async (props: any) => {
  let initialResults

  if (props.runInitialSearch) {
    initialResults = await props.runInitialSearch(props.initialSearch)
  }

  return (
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <props.SearchLayout
      initialResults={initialResults}
      {..._.omit(['runInitialSearch'], props)}
    />
  )
}

export default SearchController
