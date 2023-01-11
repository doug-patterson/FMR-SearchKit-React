'use client'

import React from 'react'
import ClientSearch from './ClientSearchHOC'
import { buildRoute } from './util'

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

  return schemas && <ClientSearch
    key={_.uniqueId()} // remove
    {...props}
    schemas={schemas}
    defaultOverrides={props.overrides}
    execute={props.mode === 'route'
      ? (...args) => { router.push(buildRoute(...args, typeof window === 'object' && window.location.href)) }
      : (...args) => {
          typeof window === 'object' && props.isPage && window.history.replaceState(null, null, buildRoute(...args, typeof window === 'object' && window.location.href))
          return app.service('search').create(...args)
        }
    }
  />
}

export let FeathersClientSearchHOC = props => <FeathersSearchRenderer {...props} />