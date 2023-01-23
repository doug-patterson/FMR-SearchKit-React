import React from 'react'
import * as DefaultUIComponents from './DefaultUIComponents'

import _ from 'lodash/fp'
import { addDefaultDisplays } from './util'

import DefaultLayout from './DefaultLayout'
import Results from './Results'
import Charts from './Charts'
import Filters from './Filters'

const searchRunner = (search, runSearch) => idx => updatedChartProps => {
  let updatedSearch = _.update(
    `charts.${idx}`,
    chartProps => ({ ...chartProps, ...updatedChartProps }),
    search
  )
  runSearch({ charts: updatedSearch.charts })
}

export default ({
  initialSearch,
  initialResults = {},
  children,
  UIComponents: ThemeComponents,
  schemas,
  execute,
  layoutStyle,
  mode = 'feathers',
  onData = _.noop
}) => {
  let UIComponents = _.defaults(DefaultUIComponents, ThemeComponents)

  let Layout = ({ children }) => <DefaultLayout style={layoutStyle}>{children}</DefaultLayout>

  schemas = addDefaultDisplays(schemas)
  let schema = schemas[initialSearch.collection]
  if (!schema) {
    return 'Schema not found'
  }

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
  let currentInput = React.useRef(null)
  let chartWidths = React.useRef({})

  let runSearch = async patch => {
    let updatedSearch = {
      ...search,
      ...patch
    }

    let { results, resultsCount: newResultsCount, charts, ...filterResults } = await execute(updatedSearch) || {}

    if (mode === 'route') {
      return
    }

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
    onData()
  }

  // it may be time to consider more radical approaches...
  // how about something like this? each component listens on the socket for the updates
  // it wants, and each component can call execute, which doesn't cause anything to render.
  // the entire layout is stateless except for the individual charts, filters and tables,
  // each of which only maintains its own state and only pays attention to the parts of the 
  // search delivered up the socket that concern it

  return (
    <UIComponents.Box>
      <Layout>
        <Filters
          filters={search.filters}
          filterOptions={filterOptions}
          runSearch={runSearch}
          schema={schema}
          UIComponents={UIComponents}
          currentInput={currentInput}
        >{children}</Filters>
        <Charts
          charts={search.charts}
          chartWidths={chartWidths}
          UIComponents={UIComponents}
          chartData={chartData}
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
