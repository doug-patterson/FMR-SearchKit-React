'use client'

import React from 'react'
import SearchLayout from './SearchLayout'
import { FilterDropdown as FilterWrapper } from './FilterDropdown'
import _ from 'lodash/fp'
import { setUpSchemas } from './util'
import { buildRoute } from './util'
import { ClientRendererInit } from './types'

const tld = (hostname: any) =>
  hostname === 'localhost'
    ? 'localhost'
    : _.flow(_.split('.'), ([, ...rest]) => [...rest], _.join('.'))(hostname)

const initApp = async (
  setApp: any,
  setInitialResults: any,
  initialSearch: any,
  getApp: any,
  getSchemas: any,
  setSchemas: any
) => {
  const [app, schemas] = await Promise.all([
    getApp(),
    setSchemas && getSchemas()
  ])
  setApp(app)
  if (setInitialResults) {
    setInitialResults(await app.service('search').create(initialSearch))
  }
  if (schemas) {
    setSchemas(schemas)
  }
  document.cookie = `searchkitTimezoneOffset=${new Date().getTimezoneOffset()};path=/;domain=${tld(
    window.location.hostname
  )};max-age=2592000;`
}

const ClientSearchWithOverrides = (props: ClientRendererInit) => {
  const [app, setApp] = React.useState(null)
  const [schemas, setSchemas] = React.useState(props.schemas)
  const [initialResults, setInitialResults] = React.useState(null)

  const router = props.useRouter()

  // this completely repeats what's done in the parent FeathersClientSearchHOC
  // we need to consolidate to only do this stuff in one place
  const invalidateCache = () => router.refresh()
  React.useEffect(() => {
    const setUp = async () => {
      initApp(
        setApp,
        props.clientOnly ? setInitialResults : null,
        props.initialSearch,
        props.getApp,
        props.getSchemas,
        !props.schemas && setSchemas
      )
    }
    setUp()
    return () => window.removeEventListener('popstate', invalidateCache)
  }, [
    props.clientOnly,
    props.defaultOverrides,
    props.initialSearch,
    props.overrides,
    props.getApp,
    props.schemas
  ])

  return (
    schemas && (
      <SearchLayout
        {...props}
        {...(initialResults ? { initialResults } : {})}
        schemas={setUpSchemas(
          _.merge(props.defaultOverrides, props.overrides),
          schemas
        )}
        {...(props.collapseableFilters ? { FilterWrapper } : {})}
        execute={async (search: any) => {
          const constrainedSearch = _.size(
            _.get(props.initialSearch.id, props.constraints)
          )
            ? _.flow(..._.get(props.initialSearch.id, props.constraints))(
                search
              )
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
                const newUrl = buildRoute(
                  constrainedSearch,
                  typeof window === 'object' && window.location.href
                )
                window.history.replaceState(
                  { ...(window.history.state || {}), as: newUrl, url: newUrl },
                  '',
                  newUrl
                )
                window.addEventListener('popstate', invalidateCache)
              }
            }
            return [result, constrainedSearch]
          }
        }}
      />
    )
  )
}

const ClientSearchHOC = (props: any) => <ClientSearchWithOverrides {...props} />

export default ClientSearchHOC
