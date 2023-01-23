'use client'

import React from 'react'
import ClientSearch from './ClientSearchHOC'
import { buildRoute } from './util'
import * as DefaultUIClientComponents from './DefaultUIClientComponents'
import _ from 'lodash/fp'

let FeathersSearchRenderer = props => {
  let [schemas, setSchemas] = React.useState(props.schemas)
  let [app, setApp] = React.useState(null)

  const router = props.useRouter()

  React.useEffect(() => {
    if (!schemas) {
      let fn = async () => {
        setSchemas(await props.getSchemas())
      }
      fn()
    }
  }, [])
  React.useEffect(() => {
    let fn = async () => {
      setApp(await props.getApp())
    }
    fn()
  }, [])

  // reactions need to be supported by `execute` passing the search through
  // a pipeline of search `constraints` that arrives here as props.constraints

  return app && schemas && <ClientSearch
    key={_.uniqueId() /* currently mode="route" doesn't work without this*/} 
    {..._.omit(['constraints'], props)}
    schemas={schemas}
    defaultOverrides={props.overrides}
    UIComponents={_.merge(props.UIComponents, DefaultUIClientComponents)}
    execute={async search => {
      let constrainedSearch =_.size(props.constraints) ? _.flow(...props.constraints)(search) : search

      if (props.mode === 'route') {
        router.push(buildRoute(constrainedSearch, typeof window === 'object' && window.location.href))
      } else {
        let result = await app.service('search').create(constrainedSearch)
        if (typeof window === 'object') {
          if (props.isPage) {
            window.history.replaceState(null, null, buildRoute(constrainedSearch, typeof window === 'object' && window.location.href))
          }
          window.chartResizer && window.chartResizer()
        }
        return result
      }

    }}
  />
}

export let FeathersClientSearchHOC = props => <FeathersSearchRenderer {...props} />