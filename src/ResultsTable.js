import React from 'react'
import _ from 'lodash/fp'
import ResultsTable from './ResultsTableHOC'

export default ({ UIComponents, ...props }) => <ResultsTable {...props} HeaderMenu={UIComponents.HeaderMenu} />
