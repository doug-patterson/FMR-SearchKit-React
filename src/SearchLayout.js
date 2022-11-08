import React from 'react'
import * as DefaultUIComponents from './DefaultUIComponents'

import _ from 'lodash/fp'
import { mapIndexed, mapValuesIndexed, arrayToObject, addDefaultDisplays } from './util'

import BooleanFilter from './BooleanFilter'
import Facet from './Facet'
import NumericFilter from './NumericFilter'
import Results from './Results'

let NoComponent = () => 'no filter found'
let Hidden = () => ''
let getFilterComponent = type =>
  ({
    none: NoComponent,
    facet: Facet,
    arrayElementPropFacet: Facet,
    hidden: Hidden,
    numeric: NumericFilter,
    boolean: BooleanFilter,
    arraySize: NumericFilter,
  }[type || 'none'])

let updateFilters = (filters, setFilters) => idx => patch =>
  setFilters([
    ..._.slice(0, idx, filters),
    mapValuesIndexed(
      (v, k) => (_.has(k, patch) ? _.get(k, patch) : v),
      _.clone(filters[idx])
    ),
    ..._.slice(idx + 1, Infinity, filters),
  ])

let getLocalStorageSearch = (storageKey, searchVersion) => {
  let item = localStorage.getItem(storageKey)
  let search
  if (item) {
    let data = JSON.parse(item)
    if (data.searchVersion >= searchVersion) {
      search = data.search
    }
  }

  return search
}

export default ({
  collection,
  initialSearch,
  initialResults = {},
  children,
  storageKey,
  searchVersion,
  UIComponents: ThemeComponents,
  schemas,
  execute
}) => {
  let UIComponents = _.defaults(DefaultUIComponents, ThemeComponents)
  schemas = addDefaultDisplays(schemas)
  console.log({ schemas })
  let schema = schemas[collection]
  if (!schema) {
    return 'Schema not found'
  }
  storageKey = storageKey || collection

  let localStorageSearch =
    _.isNumber(searchVersion) && getLocalStorageSearch(storageKey, searchVersion)

  let [sortField, setSortField] = React.useState(
    _.get('sortField', localStorageSearch || initialSearch) || 'createdAt'
  )
  let [sortDir, setSortDir] = React.useState(
    _.get('sortDir', localStorageSearch || initialSearch) || 'desc'
  )
  let [include, setInclude] = React.useState(
    _.get(
      'include',
      localStorageSearch || initialSearch
    ) || _.keys(schema.properties)
  )

  let [page, setPage] = React.useState(_.get('page', initialSearch) || 1)
  let [pageSize, setPageSize] = React.useState(
    _.get('pageSize', localStorageSearch || initialSearch) || 20
  )
  let [filters, setFilters] = React.useState(
    (localStorageSearch || initialSearch).filters
  )
  let [filterOptions, setFilterOptions] = React.useState(
    _.map(
      ({ key }) => ({
        key,
        options: initialResults[key],
      }),
      filters
    ) || _.map(_.pick('key'), initialSearch.filters)
  )
  let [rows, setRows] = React.useState(initialResults?.results || [])
  let [resultsCount, setResultsCount] = React.useState(initialResults?.resultsCount || '')
  let updateFilter = updateFilters(filters, setFilters)

  React.useEffect(() => {
    let runSearch = async () => {
      let search = {
        collection,
        filters,
        sortField,
        sortDir,
        include,
        page,
        pageSize,
        lookup: initialSearch.lookup,
      }
  
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          searchVersion,
          search,
        })
      )
  
      let { results, resultsCount, ...filterResults } = await execute({
          ...search,
          include: _.concat(include, initialSearch.omitFromResults),
        })
      setRows(results)
      let newFilterOptions = _.map(
        ({ key }) => ({
          key,
          options: filterResults[key],
        }),
        filters
      )
      setResultsCount(_.get('count', _.first(resultsCount)) || 0)
      setFilterOptions(newFilterOptions)
    }
    runSearch()
  }, [sortField, sortDir, include, page, pageSize, filters])

  return (
    <UIComponents.Box>
      <UIComponents.Grid columns="1fr 5fr" gap={10}>
        <UIComponents.Box style={{ overflowY: 'scroll', paddingBottom: 120 }}>
          <Results
            {...{
              include: _.without(initialSearch.omitFromResults, include),
              setInclude,
              setSortField,
              setSortDir,
              schema: _.update('properties', _.omit(initialSearch.omitFromResults), schema),
              rows,
              resultsCount,
              pageSize,
              setPageSize,
              page,
              setPage,
              UIComponents
            }}
          />
        </UIComponents.Box>
      </UIComponents.Grid>
    </UIComponents.Box>
  )
}
