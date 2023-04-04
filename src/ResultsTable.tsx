import React from 'react'
import _ from 'lodash/fp'
import ResultsTableHOC from './ResultsTableHOC'

const ResultsTable = ({ UIComponents, ...props }: any) => (
  <ResultsTableHOC {...props} HeaderMenu={UIComponents.HeaderMenu} />
)

export default ResultsTable
