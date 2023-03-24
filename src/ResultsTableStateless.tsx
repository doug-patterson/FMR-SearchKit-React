import React from 'react'
import _ from 'lodash/fp'
import ResultsTable from './ResultsTableHOC'

const HeaderMenu = ({ field }: any) => <span>{_.startCase(field)}</span>

const ResultsTableStateless = (props: any) => (
  <ResultsTable
    {...props}
    HeaderMenu={HeaderMenu}
    PageSizeSelector={() => ''}
  />
)

export default ResultsTableStateless
