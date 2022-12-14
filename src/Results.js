import React from 'react'
import DefaultPaginator from './Paginator'
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
  Paginator = DefaultPaginator,
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
        <UIComponents.Select
            options={[10, 20, 50, 100]}
            {...(runSearch ? {
              onChange: option => runSearch({ pageSize: _.toNumber(option) }),
              value: pageSize
            } : {
              name: 'pageSize',
              defaultValue: pageSize
            })}
            style={{ backgroundColor: 'white' }}
          />
        <div />
        <Paginator
          {...{
            page,
            ...(runSearch ? { setPage: newPage => runSearch({ page: newPage }) } : { name: 'page' }),
            resultsCount,
            pageSize,
            UIComponents,
          }}
        />
      </UIComponents.Grid>
    </UIComponents.Box>
  </div>
)
