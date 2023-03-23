// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
// @ts-expect-error TS(6142): Module './util' was resolved to '/Users/douglaspat... Remove this comment to see the full error message
export { includeSubmittedSearch } from './util'
// @ts-expect-error TS(6142): Module './SearchController' was resolved to '/User... Remove this comment to see the full error message
import SearchController from './SearchController'
// @ts-expect-error TS(6142): Module './HTTPSearchHOC' was resolved to '/Users/d... Remove this comment to see the full error message
import HTTPSearchHOC from './HTTPSearchHOC'

const _searchkit = ({
  preparePage,
  runInitialSearch,
  overridesStateless,
  UIComponentsStateless,
  FeathersSearchClientRenderer
}: any) => {
  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
  const HydratedSearchController = (props: any) => <SearchController
    {...props}
    runInitialSearch={
      runInitialSearch && !props.clientOnly ? runInitialSearch : null
    }
  />

  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
  const FeathersSearch = (props: any) => <HydratedSearchController
    {...props}
    SearchLayout={
      props.FeathersSearchClientRenderer || FeathersSearchClientRenderer
    }
  />

  const FeathersSearchPage = preparePage
    ? async (props: any) => {
        const { hydratedSearch, schemas } = await preparePage(props)

        return (
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <FeathersSearch
            {...props}
            initialSearch={hydratedSearch}
            schemas={schemas}
            isPage={true}
          />
        )
      }
    : null

  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
  const HydratedSearchControllerWithStatelessOverrides = (props: any) => <SearchController
    {...props}
    defaultOverrides={overridesStateless}
    runInitialSearch={
      runInitialSearch && !props.clientOnly ? runInitialSearch : null
    }
  />

  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
  const HTTPSearch = (props: any) => <HydratedSearchControllerWithStatelessOverrides
    {...props}
    UIComponents={UIComponentsStateless}
    SearchLayout={HTTPSearchHOC}
  />

  const HTTPSearchPage = preparePage
    ? async (props: any) => {
        const { hydratedSearch, schemas } = await preparePage(props)

        return (
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <HTTPSearch
            {...props}
            initialSearch={hydratedSearch}
            schemas={schemas}
          />
        )
      }
    : null

  return {
    FeathersSearch,
    FeathersSearchPage,
    HTTPSearchPage
  }
}

export const searchkit = _searchkit
