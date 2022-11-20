import React from 'react'
import Paginator from './Paginator'
import ResultsTable from './ResultsTableHOC'
import _ from 'lodash/fp'

// we need to make the statless version of this have a normal select
// for page size and a modified radio as noted elsewhere for pagination

export default ({
  include,
  setInclude,
  setSortField,
  setSortDir,
  schema,
  rows,
  resultsCount,
  pageSize,
  setPageSize,
  page = 1,
  setPage,
  ResultsComponent = ResultsTable,
  stateless,
  UIComponents
}) => (
  <UIComponents.Box>
    <ResultsComponent
      {...{
        include,
        setInclude,
        setSortField,
        setSortDir,
        schema,
        rows,
        UIComponents
      }}
    />
    <UIComponents.Grid
      columns="auto 1fr auto"
      style={{ padding: 10, backgroundColor: '#f8f8f8' }}
    >
      {stateless ? <div /> : <UIComponents.Select
        options={[10, 20, 50, 100]}
        value={pageSize}
        onChange={option => setPageSize(_.toNumber(option))}
        style={{ backgroundColor: 'white' }}
      />}
      <div />
      {stateless ? <div /> : <Paginator {...{ page, setPage, resultsCount, pageSize, UIComponents }} />}
    </UIComponents.Grid>
  </UIComponents.Box>
)
