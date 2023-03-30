import React from 'react'
import * as DefaultUIComponents from './DefaultUIComponents'

import _ from 'lodash/fp'
import { addDefaultDisplays } from './util'

import DefaultLayout from './DefaultLayout'
import Results from './Results'
import Charts from './Charts'
import Filters from './Filters'

const Layout = ({ layoutStyle, children }: any) => (
  <DefaultLayout style={layoutStyle}>{children}</DefaultLayout>
)

const SearchLayout = ({
  initialSearch,
  initialResults = {},
  children,
  UIComponents: ThemeComponents,
  schemas,
  execute,
  layoutStyle,
  filterLayout,
  onlyOneFilterOpenAtAtime,
  FilterWrapper,
  mode = 'feathers',
  onData = _.noop,
  overrideData
}: any) => {
  const [search, setSearch] = React.useState(initialSearch)
  const [filterOptions, setFilterOptions] = React.useState(
    _.map(
      ({ key }: any) => ({
        key,
        options: initialResults[key]
      }),
      initialSearch.filters
    ) || _.map(_.pick('key'), initialSearch.filters)
  )
  const [rows, setRows] = React.useState(initialResults?.results || [])
  const [resultsCount, setResultsCount] = React.useState(
    initialResults?.resultsCount?.count || 0
  )
  const [chartData, setChartData] = React.useState(initialResults.charts)
  const chartWidths = React.useRef({})

  const UIComponents = _.defaults(DefaultUIComponents, ThemeComponents)

  schemas = addDefaultDisplays(schemas)
  const schema = schemas[initialSearch.collection]
  if (!schema) {
    return <span>Schema not found</span>
  }

  const runSearch = async (patch: any) => {
    const updatedSearch = {
      ...search,
      ...patch
    }

    const [
      { results, resultsCount: newResultsCount, charts, ...filterResults },
      constrainedSearch
    ] = (await execute(updatedSearch)) || {}

    if (mode === 'route') {
      return
    }

    const newFilterOptions = _.map(
      ({ key }: any) => ({
        key,
        options: filterResults[key]
      }),
      search.filters
    )

    setSearch(constrainedSearch)
    setFilterOptions(newFilterOptions)
    setRows(results)
    setResultsCount(_.get('count', newResultsCount) || 0)
    setChartData(charts)
    onData()
  }

  return (
    <UIComponents.Box>
      <Layout layoutStyle={layoutStyle}>
        <Filters
          filters={search.filters}
          filterOptions={filterOptions}
          runSearch={runSearch}
          schema={schema}
          UIComponents={UIComponents}
          onlyOneFilterOpenAtAtime={onlyOneFilterOpenAtAtime}
          layout={filterLayout}
          {...(FilterWrapper ? { Wrapper: FilterWrapper } : {})}
          overrideData={overrideData}
        >
          {children}
        </Filters>
        <Charts
          charts={search.charts}
          chartWidths={chartWidths}
          UIComponents={UIComponents}
          chartData={chartData}
          schemas={schemas}
          schema={_.update(
            'properties',
            _.omit(initialSearch.omitFromResults),
            schema
          )}
        />
        {search.pageSize !== 0 && (
          <Results
            include={_.without(
              initialSearch.omitFromResults,
              search.include || _.keys(schema.properties)
            )}
            schema={_.update(
              'properties',
              _.omit(initialSearch.omitFromResults),
              schema
            )}
            rows={rows}
            resultsCount={resultsCount || 0}
            pageSize={search.pageSize}
            page={search.page}
            UIComponents={UIComponents}
            runSearch={runSearch}
            overrideData={overrideData}
          />
        )}
      </Layout>
    </UIComponents.Box>
  )
}

export default SearchLayout
