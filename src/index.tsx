import React from 'react'
export { includeSubmittedSearch } from './util'
import SearchController from './SearchController'
import HTTPSearchHOC from './HTTPSearchHOC'

interface Schema {

}

interface Schemas {

}

type FacetValue = string | number
interface Filter {
  key: string
  type: string
  field: string
  idPath?: string
  label?: string
  values?: FacetValue[]
  checked?: boolean
  from?: Date
  to?: Date
  interval?: string
  isMongoId?: boolean
  offset?: number
  optionSearch?: string
  include?: string[]
  subqueryCollection?: string
  subqueryKey?: string
  optionsAreMongoIds?: boolean
  subqueryField?: string
  subqueryIdPath?: string
  subqueryFieldIsArray?: boolean
  subqueryLocalField?: string
  subqueryLocalIdPath?: string
}

interface TotalsBarColumn {
  key: string
  field: string
  label: string
  agg: string
}

interface SalesTableRow {
  key: string
  field?: string
  agg?: string
  header?: boolean
  subItem?: boolean
  unwind?: boolean
  hide?: boolean
  negative?: boolean
  
}

interface Chart {
  key: string
  type: string
  currency?: string
  hideLabel?: boolean
  columns?: TotalsBarColumn[]
  rows?: SalesTableRow
}

interface Search {
  id?: string,
  collection: string
  filters?: Filter[]
  pageSize?: number
  page?: number
  omitFromResults?: string[]
  charts: Chart[]
}

interface SearchkitSetup {
  preparePage: any
  runInitialSearch: any
  overridesStateless: any
  UIComponentsStateless: any
  FeathersSearchClientRenderer: any
}

// we start by tping the props of this function argument
const _searchkit = ({
  preparePage,
  runInitialSearch,
  overridesStateless,
  UIComponentsStateless, // `any` for now
  FeathersSearchClientRenderer
}: SearchkitSetup) => {
  const HydratedSearchController = (props: any) => (
    // so do we need to convert this to use useEffect to do its async stuff?
    <SearchController
      {...props}
      runInitialSearch={
        runInitialSearch && !props.clientOnly ? runInitialSearch : null
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
