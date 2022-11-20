import React from 'react'
import _ from 'lodash/fp'
import ResultsTable from './ResultsTableHOC'

let HeaderMenu = ({ field }) => <span>{_.startCase(field)}</span>
export default props => <ResultsTable {...props} HeaderMenu={HeaderMenu} PageSizeSelector={() => ''} />
