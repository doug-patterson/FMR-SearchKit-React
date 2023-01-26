import React from 'react'
export { includeSubmittedSearch } from './util'
import SearchController from './SearchController'
import HTTPSearchHOC from './HTTPSearchHOC'

const _searchkit = ({
  feathersOrigin,
  preparePage,
  runInitialSearch,
  overridesStateless,
  UIComponentsStateless,
  FeathersSearchClientRenderer
}) => {
  const HydratedSearchController = props => (
    <SearchController
      {...props}
      runInitialSearch={
        runInitialSearch && !props.clientOnly ? runInitialSearch : null
      }
    />
  )

  const FeathersSearch = props => (
    <HydratedSearchController
      {...props}
      SearchLayout={
        props.FeathersSearchClientRenderer || FeathersSearchClientRenderer
      }
    />
  )

  const FeathersSearchPage = preparePage
    ? async props => {
        const { hydratedSearch, schemas } = await preparePage(props)

        return (
          <FeathersSearch
            {...props}
            initialSearch={hydratedSearch}
            schemas={schemas}
            isPage={true}
          />
        )
      }
    : null

  const HydratedSearchControllerWithStatelessOverrides = props => (
    <SearchController
      {...props}
      defaultOverrides={overridesStateless}
      runInitialSearch={
        runInitialSearch && !props.clientOnly ? runInitialSearch : null
      }
    />
  )

  const HTTPSearch = props => (
    <HydratedSearchControllerWithStatelessOverrides
      {...props}
      UIComponents={UIComponentsStateless}
      SearchLayout={HTTPSearchHOC}
    />
  )

  const HTTPSearchPage = preparePage
    ? async props => {
        const { hydratedSearch, schemas } = await preparePage(props)

        return (
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
