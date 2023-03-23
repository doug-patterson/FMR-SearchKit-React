// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
// @ts-expect-error TS(6142): Module './SearchLayoutStateless' was resolved to '... Remove this comment to see the full error message
import SearchLayoutStateless from './SearchLayoutStateless'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from 'lodash/fp'
// @ts-expect-error TS(6142): Module './util' was resolved to '/Users/douglaspat... Remove this comment to see the full error message
import { setUpSchemas } from './util'

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
const HTTPSearchWithOverrides = (props: any) => <SearchLayoutStateless
  {...props}
  schemas={setUpSchemas(
    _.merge(props.defaultOverrides, props.overrides),
    props.schemas
  )}
/>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
const HTTPSearchHOC = (props: any) => <HTTPSearchWithOverrides {...props} />

export default HTTPSearchHOC
