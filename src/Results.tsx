import React from 'react'
import DefaultPaginator from './Paginator'
import ResultsTable from './ResultsTableHOC'
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
  <div className="fmr-results" style={{ gridArea: 'results' }}>
    <UIComponents.Box>
      <ResultsComponent
        {...{
          include,
          setInclude: (newInclude: any) =>
            runSearch({ include: newInclude, page: 1 }),
          setSortField: (newSortField: any) =>
            runSearch({ sortField: newSortField, page: 1 }),
          setSortDir: (newSortDir: any) =>
            runSearch({ sortDir: newSortDir, page: 1 }),
          schema,
          rows,
          UIComponents,
          overrideData
        }}
      />
      {pageSize > 0 && (
        <UIComponents.Grid
          className="fmr-results-controls"
          columns="auto 1fr auto"
        >
          <UIComponents.Select
            options={[10, 20, 50, 100]}
            {...(runSearch
              ? {
                  onChange: (option: any) =>
                    runSearch({ pageSize: _.toNumber(option) }),
                  value: pageSize
                }
              : {
                  name: 'pageSize',
                  defaultValue: pageSize
                })}
            style={{ backgroundColor: 'white' }}
          />
          <div />
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
  </div>
)

Results.DisplayName = 'Results'

export default Results
