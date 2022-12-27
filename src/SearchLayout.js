import React from 'react'
import * as DefaultUIComponents from './DefaultUIComponents'

import _ from 'lodash/fp'
import { addDefaultDisplays } from './util'

import DefaultLayout from './DefaultLayout'
import Results from './Results'
import Charts from './Charts'
import Filters from './Filters'

// move local storage handling up in the component hierarchy
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
  //searchVersion,
  UIComponents: ThemeComponents,
  schemas,
  execute,
  layoutStyle
}) => {
  let UIComponents = _.defaults(DefaultUIComponents, ThemeComponents)

  let Layout = ({ children }) => <DefaultLayout style={layoutStyle}>{children}</DefaultLayout>

  schemas = addDefaultDisplays(schemas)
  let schema = schemas[collection]
  if (!schema) {
    return 'Schema not found'
  }

  storageKey = storageKey || collection

  let [search, setSearch] = React.useState(initialSearch)
  let [filterOptions, setFilterOptions] = React.useState(
    _.map(
      ({ key }) => ({
        key,
        options: initialResults[key],
      }),
      initialSearch.filters
    ) || _.map(_.pick('key'), initialSearch.filters)
  )
  let [rows, setRows] = React.useState(initialResults?.results || [])
  let [resultsCount, setResultsCount] = React.useState(initialResults?.resultsCount?.count || 0)
  let [chartData, setChartData] = React.useState(initialResults.charts)

  let runSearch = async patch => {
    let updatedSearch = {
      ...search,
      ...patch
    }

    let { results, resultsCount: newResultsCount, charts, ...filterResults } = await execute(updatedSearch)

    setResultsCount(_.get('count', newResultsCount) || 0)
    setSearch(updatedSearch)
    setRows(results)
    let newFilterOptions = _.map(
      ({ key }) => ({
        key,
        options: filterResults[key],
      }),
      search.filters
    )
    setFilterOptions(newFilterOptions)
    setChartData(charts)
  }

  return (
    <UIComponents.Box>
      <Layout>
        <Filters
          filters={search.filters}
          filterOptions={filterOptions}
          runSearch={runSearch}
          schema={schema}
          UIComponents={UIComponents}
        >{children}</Filters>
        <Charts
          initialSearch={search}
          UIComponents={UIComponents}
          chartData={chartData}
          updateChartSearch={idx => updatedChartProps => {
            let updatedSearch = _.update(
              `charts.${idx}`,
              chartProps => ({ ...chartProps, ...updatedChartProps }),
              search
            )
            runSearch({ charts: updatedSearch.charts })
          }}
          schemas={schemas}
          schema={_.update('properties', _.omit(initialSearch.omitFromResults), schema)}
        />
        {search.pageSize !== 0 && <Results
          include={_.without(initialSearch.omitFromResults, search.include || _.keys(schema.properties))}
          schema={_.update('properties', _.omit(initialSearch.omitFromResults), schema)}
          rows={rows}
          resultsCount={resultsCount || 0}
          pageSize={search.pageSize}
          page={search.page}
          UIComponents={UIComponents}
          runSearch={runSearch}
        />}
      </Layout>
    </UIComponents.Box>
  )
}
