'use client';

import React from 'react'
import SearchLayout from './SearchLayout'
import app from '../../feathersClient'
import _ from 'lodash/fp'
import overrides from '../../app/overrides'

// it isn't actually necessary to always do this, is it? we should have a system,
// probably with a React hook, where we can re-use the feathers client on the front end
let authenticate = async (accessToken, setAuthenticated) => {
  const { user } = await app.service('authentication').create({ strategy: 'jwt', accessToken })
  if (user) {
    setAuthenticated(true)
  }
}

export default props => {
  let [authenticated, setAuthenticated] = React.useState(false)
  // need to authenticate before passing this into the SearchLayout - use props.jwt
  const execute = (...args) => app.service('search').create(...args)
  
  React.useEffect(() => {
    authenticate(props.jwt, setAuthenticated)
  }, [])


  let override = overrides[props.collection]

  if (override) {
    for (let prop in override.properties) {
      props.schemas = _.update(`${props.collection}.properties.${prop}`, field => ({ ...field, ...override.properties[prop] }), props.schemas)
    }
  }

  return authenticated && <SearchLayout
    execute={execute}
    initialSearch={{ collection: props.collection }}
    {...props}
  />
} 