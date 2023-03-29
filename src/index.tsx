import React from 'react'
export { includeSubmittedSearch } from './util'
import SearchController from './SearchController'
import HTTPSearchHOC from './HTTPSearchHOC'
import { Schema, Search, SearchResponse } from './types'

type SearchkitSetupFunction = () => ({
  hydratedSearch: Search
  schemas: { [key: string]: Schema }
})

type InitialSearchRunner = (search: Search) => SearchResponse 

interface SearchkitSetup {
  preparePage: SearchkitSetupFunction
  runInitialSearch: InitialSearchRunner
  overridesStateless: any
  UIComponentsStateless: any
  FeathersSearchClientRenderer: any
}

// we start by tping the props of this function argument
const _searchkit = ({
  preparePage,
  runInitialSearch,
  overridesStateless,
  UIComponentsStateless,
  FeathersSearchClientRenderer
}: SearchkitSetup) => {
  const HydratedSearchController = (props: any) => (
    // so do we need to convert this to use useEffect to do its async stuff?
    <SearchController
      {...props}
      runInitialSearch={
        !props.clientOnly ? runInitialSearch : null
      }
    />
  )

  const FeathersSearch = (props: any) => (
    <HydratedSearchController
      {...props}
      SearchLayout={
        props.FeathersSearchClientRenderer || FeathersSearchClientRenderer
      }
    />
  )

  const FeathersSearchPage = preparePage
    ? async (props: any) => {
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

  const HydratedSearchControllerWithStatelessOverrides = (props: any) => (
    <SearchController
      {...props}
      defaultOverrides={overridesStateless}
      runInitialSearch={
        runInitialSearch && !props.clientOnly ? runInitialSearch : null
      }
    />
  )

  const HTTPSearch = (props: any) => (
    <HydratedSearchControllerWithStatelessOverrides
      {...props}
      UIComponents={UIComponentsStateless}
      SearchLayout={HTTPSearchHOC}
    />
  )

  const HTTPSearchPage = preparePage
    ? async (props: any) => {
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
