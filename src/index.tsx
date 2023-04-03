import React from 'react'
export { includeSubmittedSearch } from './util'
import SearchController from './SearchController'
import HTTPSearchHOC from './HTTPSearchHOC'
import { Schema, Search, SearchResponse, SearchLayoutInit, SchemaOverrides } from './types'

type SearchkitSetupFunction = (props: SearchLayoutInit) => Promise<{
  hydratedSearch: Search
  schemas: { [key: string]: Schema }
}>

type InitialSearchRunner = (search: Search) => SearchResponse 

interface SearchkitSetup {
  preparePage: SearchkitSetupFunction
  runInitialSearch: InitialSearchRunner
  overridesStateless: SchemaOverrides
  UIComponentsStateless: any
  FeathersSearchClientRenderer: JSX.Element
}

const _searchkit = ({
  preparePage,
  runInitialSearch,
  overridesStateless,
  UIComponentsStateless,
  FeathersSearchClientRenderer
}: SearchkitSetup) => {
  const HydratedSearchController = (props: SearchLayoutInit) => (
    <SearchController
      {...props}
      runInitialSearch={
        !props.clientOnly ? runInitialSearch : null
      }
    />
  )

  const FeathersSearch = (props: SearchLayoutInit) => (
    <HydratedSearchController
      {...props}
      SearchLayout={
        props.FeathersSearchClientRenderer || FeathersSearchClientRenderer
      }
    />
  )

  const FeathersSearchPage = preparePage
    ? async (props: SearchLayoutInit) => {
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

  const HydratedSearchControllerWithStatelessOverrides = (props: SearchLayoutInit) => (
    <SearchController
      {...props}
      defaultOverrides={overridesStateless}
      runInitialSearch={
        !props.clientOnly ? runInitialSearch : null
      }
    />
  )

  const HTTPSearch = (props: SearchLayoutInit) => (
    <HydratedSearchControllerWithStatelessOverrides
      {...props}
      UIComponents={UIComponentsStateless}
      SearchLayout={HTTPSearchHOC}
    />
  )

  const HTTPSearchPage = preparePage
    ? async (props: SearchLayoutInit) => {
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
