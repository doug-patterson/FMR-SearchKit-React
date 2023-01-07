import React from 'react'
import SearchLayoutStateless from './SearchLayoutStateless'
import _ from 'lodash/fp'
import { setUpSchemas } from './util'

const HTTPSearchWithOverrides = props => <SearchLayoutStateless
  initialSearch={{ collection: props.collection }}
  schemas={setUpSchemas(_.merge(props.defaultOverrides, props.overrides))}
  {...props}
/>

export default props => <HTTPSearchWithOverrides {...props} />