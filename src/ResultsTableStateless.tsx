// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from 'lodash/fp'
// @ts-expect-error TS(6142): Module './ResultsTableHOC' was resolved to '/Users... Remove this comment to see the full error message
import ResultsTable from './ResultsTableHOC'

const HeaderMenu = ({
  field
// @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
}: any) => <span>{_.startCase(field)}</span>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
const ResultsTableStateless = (props: any) => <ResultsTable
  {...props}
  HeaderMenu={HeaderMenu}
  PageSizeSelector={() => ''}
/>

export default ResultsTableStateless
