'use client'

import React from 'react'
import SearchLayout from './SearchLayout'
import { FilterDropdown as FilterWrapper } from './FilterDropdown'
import _ from 'lodash/fp'
import { setUpSchemas } from './util'
import { buildRoute } from './util'
import { ClientRendererInit, FeathersClientObject, SearchResponse, Search, Schema } from './types'

const tld = (hostname: string) =>
  hostname === 'localhost'
    ? 'localhost'
    : _.flow(_.split('.'), ([, ...rest]) => [...rest], _.join('.'))(hostname)

const initApp = async (
  setApp: (app: FeathersClientObject) => void,
  setInitialResults: (results: any) => void,
  initialSearch: Search,
  getApp: () => FeathersClientObject,
  getSchemas: () => { [id: string]: Schema },
  setSchemas: (schemas: { [id: string]: Schema }) => void,
  initialSchemas: { [id: string]: Schema }
) => {
  const hasInitialSchemas: boolean = !!initialSchemas
  const [app, schemas] = hasInitialSchemas ? [await getApp(), null] :  await Promise.all([
    getApp(),
    getSchemas()
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

type InitialResultsObjectType = SearchResponse | null

const ClientSearchWithOverrides = (props: ClientRendererInit) => {
  const initialFeathersAppObject: FeathersClientObject | null = null
  const [app, setApp] = React.useState(initialFeathersAppObject)
  const [schemas, setSchemas] = React.useState(props.schemas)
  const initialResultsObject: InitialResultsObjectType = null
  const [initialResults, setInitialResults] = React.useState(initialResultsObject)

  const router = props.useRouter()

  // this completely repeats what's done in the parent FeathersClientSearchHOC
  // we need to consolidate to only do this stuff in one place
  const invalidateCache = () => router.refresh()
  React.useEffect(() => {
    const setUp = async () => {
      initApp(
        setApp,
        setInitialResults,
        props.initialSearch,
        props.getApp,
        props.getSchemas,
        setSchemas,
        props.schemas
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
        initialResults={initialResults}
        schemas={setUpSchemas(
          _.merge(props.defaultOverrides, props.overrides),
          schemas
        )}
        {...(props.collapseableFilters ? { FilterWrapper } : {})}
        execute={async (search: any) => {
          const constrainedSearch = _.size(
            _.get(props.initialSearch.id, props.constraints)
          )
            ? _.flow(..._.get(props.initialSearch.id, props.constraints) || [])(
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
            // feed the type-checker
            return [search, { results: [], resultsCount: 0 }]
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

const ClientSearchHOC = (props: ClientRendererInit) => <ClientSearchWithOverrides {...props} />

export default ClientSearchHOC
