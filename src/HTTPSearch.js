import React from 'react'
import SearchLayoutStateless from './SearchLayoutStateless'
import _ from 'lodash/fp'

import overrides from '../../app/overrides'

export default props => {
  
  let override = overrides[props.collection]

  if (override) {
    for (let prop in override.properties) {
      Object.assign(props.schemas[props.collection].properties[prop], override.properties[prop])
    }
  }

  return <SearchLayoutStateless
    initialSearch={{ collection: props.collection }}
    {...props}
  />
} 