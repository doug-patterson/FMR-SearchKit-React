// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from 'lodash/fp'
// @ts-expect-error TS(6142): Module './ResultsTableHOC' was resolved to '/Users... Remove this comment to see the full error message
import ResultsTableHOC from './ResultsTableHOC'

const ResultsTable = ({
  UIComponents,
  ...props
}: any) => (
  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
  <ResultsTableHOC {...props} HeaderMenu={UIComponents.HeaderMenu} />
)

export default ResultsTable
