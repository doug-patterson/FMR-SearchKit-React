import React from 'react'
import SearchLayoutStateless from './SearchLayoutStateless'
import _ from 'lodash/fp'
import { setUpSchemas } from './util'

const HTTPSearchWithOverrides = props => (
  <SearchLayoutStateless
    {...props}
    schemas={setUpSchemas(
      _.merge(props.defaultOverrides, props.overrides),
      props.schemas
    )}
  />
)

const HTTPSearchHOC = props => <HTTPSearchWithOverrides {...props} />

export default HTTPSearchHOC
