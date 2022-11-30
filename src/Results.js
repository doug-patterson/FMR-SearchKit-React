import React from 'react'
import Paginator from './Paginator'
import ResultsTable from './ResultsTableHOC'
import _ from 'lodash/fp'

// we need to make the statless version of this have a normal select
// for page size and a modified radio as noted elsewhere for pagination

export default ({
  include,
  runSearch,
  schema,
  rows,
  resultsCount,
  pageSize,
  page = 1,
  ResultsComponent = ResultsTable,
  stateless,
  UIComponents,
}) => (
  <div style={{ gridArea: 'results' }}>
    <UIComponents.Box>
      <ResultsComponent
        {...{
          include,
          setInclude: newInclude => runSearch({ include: newInclude, page: 1 }),
          setSortField: newSortField =>
            runSearch({ sortField: newSortField, page: 1 }),
          setSortDir: newSortDir => runSearch({ sortDir: newSortDir, page: 1 }),
          schema,
          rows,
          UIComponents,
        }}
      />
      <UIComponents.Grid columns="auto 1fr auto">
        {stateless ? (
          <div />
        ) : (
          <UIComponents.Select
            options={[10, 20, 50, 100]}
            value={pageSize}
            onChange={option => runSearch({ pageSize: _.toNumber(option) })}
            style={{ backgroundColor: 'white' }}
          />
        )}
        <div />
        {stateless ? (
          <div />
        ) : (
          <Paginator
            {...{
              page,
              setPage: newPage => runSearch({ page: newPage }),
              resultsCount,
              pageSize,
              UIComponents,
            }}
          />
        )}
      </UIComponents.Grid>
    </UIComponents.Box>
  </div>
)
