// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
// @ts-expect-error TS(6142): Module './Paginator' was resolved to '/Users/dougl... Remove this comment to see the full error message
import DefaultPaginator from './Paginator'
// @ts-expect-error TS(6142): Module './ResultsTableHOC' was resolved to '/Users... Remove this comment to see the full error message
import ResultsTable from './ResultsTableHOC'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from 'lodash/fp'

// we need to make the statless version of this have a normal select
// for page size and a modified radio as noted elsewhere for pagination

const Results = ({
  include,
  runSearch,
  schema,
  rows,
  resultsCount,
  pageSize,
  page = 1,
  ResultsComponent = ResultsTable,
  Paginator = DefaultPaginator,
  UIComponents,
  overrideData
}: any) => (
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  <div className="fmr-results" style={{ gridArea: 'results' }}>
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <UIComponents.Box>
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <ResultsComponent
        {...{
          include,
          setInclude: (newInclude: any) => runSearch({ include: newInclude, page: 1 }),
          setSortField: (newSortField: any) => runSearch({ sortField: newSortField, page: 1 }),
          setSortDir: (newSortDir: any) => runSearch({ sortDir: newSortDir, page: 1 }),
          schema,
          rows,
          UIComponents,
          overrideData
        }}
      />
      {pageSize > 0 && (
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <UIComponents.Grid className="fmr-results-controls" columns="auto 1fr auto">
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <UIComponents.Select
            options={[10, 20, 50, 100]}
            {...(runSearch
              ? {
                  onChange: (option: any) => runSearch({ pageSize: _.toNumber(option) }),
                  value: pageSize
                }
              : {
                  name: 'pageSize',
                  defaultValue: pageSize
                })}
            style={{ backgroundColor: 'white' }}
          />
          // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          <div />
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <Paginator
            {...{
              page,
              ...(runSearch
                ? { setPage: (newPage: any) => runSearch({ page: newPage }) }
                : { name: 'page' }),
              resultsCount,
              pageSize,
              UIComponents
            }}
          />
        </UIComponents.Grid>
      )}
    </UIComponents.Box>
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  </div>
)

Results.DisplayName = 'Results'

export default Results
