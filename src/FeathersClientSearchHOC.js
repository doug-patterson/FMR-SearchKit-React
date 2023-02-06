'use client'

import React from 'react'
import ClientSearch from './ClientSearchHOC'
import { buildRoute } from './util'
import * as DefaultUIClientComponents from './DefaultUIClientComponents'
import _ from 'lodash/fp'

const tld = hostname =>
  hostname === 'localhost'
    ? 'localhost'
    : _.flow(_.split('.'), ([, ...rest]) => [...rest], _.join('.'))(hostname)

const FeathersSearchRenderer = props => {
  const [schemas, setSchemas] = React.useState(props.schemas)
  const [app, setApp] = React.useState(null)

  const { getSchemas, getApp, useRouter } = props

  const router = useRouter()

  React.useEffect(() => {
    if (!schemas) {
      const fn = async () => {
        setSchemas(await getSchemas())
      }
      fn()
    }
  }, [schemas, getSchemas])
  React.useEffect(() => {
    const fn = async () => {
      setApp(await getApp())
      document.cookie = `searchkitTimezoneOffset=${new Date().getTimezoneOffset()};path=/;domain=${tld(
        window.location.hostname
      )};max-age=2592000;`
    }
    fn()
  }, [getApp])

  const offset = new Date().getTimezoneOffset()

  props.initialSearch.filters = _.map(
    filter => ({
      ...filter,
      ...(_.isNumber(filter.offset) ? { offset } : {})
    }),
    props.initialSearch.filters
  )
  props.initialSearch.charts = _.map(
    chart => ({
      ...chart,
      ...(_.isNumber(chart.offset) ? { offset } : {})
    }),
    props.initialSearch.charts
  )

  return (
    app &&
    schemas && (
      <ClientSearch
        key={_.uniqueId() /* currently mode="route" doesn't work without this*/}
        {..._.omit(['constraints'], props)}
        schemas={schemas}
        defaultOverrides={props.overrides}
        UIComponents={_.merge(DefaultUIClientComponents, props.UIComponents)}
        execute={async search => {
          const constrainedSearch = _.size(_.get(props.initialSearch?.id, props.constraints))
            ? _.flow(..._.get(props.initialSearch.id, props.constraints))(search)
            : search

          if (props.mode === 'route') {
            router.push(
              buildRoute(
                constrainedSearch,
                typeof window === 'object' && window.location.href
              )
            )
          } else {
            const result = await app.service('search').create(constrainedSearch)
            if (typeof window === 'object') {
              if (props.isPage) {
                window.history.replaceState(
                  null,
                  null,
                  buildRoute(
                    constrainedSearch,
                    typeof window === 'object' && window.location.href
                  )
                )
              }
            }
            return result
          }
        }}
      />
    )
  )
}

export const FeathersClientSearchHOC = props => (
  <FeathersSearchRenderer {...props} />
)
