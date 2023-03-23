// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
// @ts-expect-error TS(6142): Module './DefaultUIComponents' was resolved to '/U... Remove this comment to see the full error message
import * as DefaultUIComponents from './DefaultUIComponents'

// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from 'lodash/fp'
// @ts-expect-error TS(6142): Module './util' was resolved to '/Users/douglaspat... Remove this comment to see the full error message
import { addDefaultDisplays } from './util'

// @ts-expect-error TS(6142): Module './DefaultLayout' was resolved to '/Users/d... Remove this comment to see the full error message
import DefaultLayout from './DefaultLayout'
// @ts-expect-error TS(6142): Module './Results' was resolved to '/Users/douglas... Remove this comment to see the full error message
import Results from './Results'
// @ts-expect-error TS(6142): Module './Charts' was resolved to '/Users/douglasp... Remove this comment to see the full error message
import Charts from './Charts'
// @ts-expect-error TS(6142): Module './Filters' was resolved to '/Users/douglas... Remove this comment to see the full error message
import Filters from './Filters'

const Layout = ({
  layoutStyle,
  children
}: any) => (
  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
      ({
        key
      }: any) => ({
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
    return 'Schema not found'
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
      ({
        key
      }: any) => ({
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
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <UIComponents.Box>
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <Layout layoutStyle={layoutStyle}>
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
