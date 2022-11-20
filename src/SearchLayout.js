import React from 'react'
import * as DefaultUIComponents from './DefaultUIComponents'

import _ from 'lodash/fp'
import { mapIndexed, mapValuesIndexed, addDefaultDisplays } from './util'

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
  execute,
}) => {
  let UIComponents = _.defaults(DefaultUIComponents, ThemeComponents)

  schemas = addDefaultDisplays(schemas)
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
  let [chartData, setChartData] = React.useState(initialResults.charts)

  let runSearch = async () => {
    let search = {
      ...initialSearch,
      filters,
      collection,
      sortField,
      sortDir,
      include,
      page,
      pageSize,
    }

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        searchVersion,
        search,
      })
    )

    let { results, resultsCount, charts, ...filterResults } = await execute({
        ...search,
        include: _.concat(include, initialSearch.omitFromResults),
      })

    setRows(results)
    setResultsCount(_.get('count', _.first(resultsCount)) || 0)
    let newFilterOptions = _.map(
      ({ key }) => ({
        key,
        options: filterResults[key],
      }),
      filters
    )
    setFilterOptions(newFilterOptions)
    setChartData(charts)
  }

  React.useEffect(() => {
    runSearch()
  }, [
    filters,
    collection,
    sortField,
    sortDir,
    include,
    page,
    pageSize
  ])

  return (
    <UIComponents.Box>
      <UIComponents.Grid columns="1fr 5fr" gap={10}>
        <UIComponents.Box>
          {children}
          {mapIndexed((filter, idx) => {
            let Component = getFilterComponent(filter.type)
            return (
              <Component
                key={filter.key}
                onChange={async patch => {
                  let updateFilter = updateFilters(filters, setFilters)
                  updateFilter(idx)(patch)
                  setPage(1)
                }}
                title={filter.key}
                {...filter}
                options={_.get(
                  'options',
                  _.find({ key: filter.key }, filterOptions)
                )}
                display={console.log({ schema, filter}) || schema.properties[filter.field].display}
                UIComponents={UIComponents}
              />
            )
          }, filters)}
          <UIComponents.Button
            onClick={() => {
              setSortField(initialSearch.sortField)
              setSortDir(initialSearch.sortDir)
              setFilters(initialSearch.filters)
              setPageSize(initialSearch.pageSize)
              setInclude(
                _.get('include', initialSearch) || _.keys(schema.properties)
              )
            }}
          >Reset Search</UIComponents.Button>
        </UIComponents.Box>
        <UIComponents.Box style={{ overflowY: 'scroll', paddingBottom: 120 }}>
          <UIComponents.Box>
            {_.map(chart => {
              let Component = UIComponents[_.upperFirst(chart.type)] || _.constant(JSON.stringify(chart))

              return <Component key={chart.key} {...chart} data={chartData[chart.key]} />
            }, initialSearch.charts)}
          </UIComponents.Box>
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
