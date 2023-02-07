'use client'

import React from 'react'
import SearchLayout from './SearchLayout'
import { FilterDropdown as FilterWrapper } from './FilterDropdown'
import _ from 'lodash/fp'
import { setUpSchemas } from './util'
import { buildRoute } from './util'

const tld = hostname =>
  hostname === 'localhost'
    ? 'localhost'
    : _.flow(_.split('.'), ([, ...rest]) => [...rest], _.join('.'))(hostname)

const initApp = async (setApp, setInitialResults, initialSearch, getApp) => {
  const app = await getApp()
  if (setInitialResults) {
    setInitialResults(await app.service('search').create(initialSearch))
  }
  setApp(app)
  document.cookie = `searchkitTimezoneOffset=${new Date().getTimezoneOffset()};path=/;domain=${tld(
    window.location.hostname
  )};max-age=2592000;`
}

const ClientSearchWithOverrides = props => {
  const [app, setApp] = React.useState(null)
  const [schemas, setSchemas] = React.useState(null)
  const [initialResults, setInitialResults] = React.useState(null)

  const router = props.useRouter()

  // this completely repeats what's done in the parent FeathersClientSearchHOC
  // we need to consolidate to only do this stuff in one place
  React.useEffect(() => {
    const setUp = async () => {
      initApp(
        setApp,
        props.clientOnly ? setInitialResults : null,
        props.initialSearch,
        props.getApp
      )
      setSchemas(
        setUpSchemas(
          _.merge(props.defaultOverrides, props.overrides),
          props.schemas || await props.getSchemas()
        )
      )
    }
    setUp()
  }, [
    props.clientOnly,
    props.defaultOverrides,
    props.initialSearch,
    props.overrides,
    props.getApp,
    props.schemas
  ])

  return (
    <SearchLayout
      initialSearch={{ collection: props?.collection }}
      {...props}
      {...(initialResults ? { initialResults } : {})}
      schemas={props.schemas || schemas}
      {...(props.collapseableFilters ? { FilterWrapper } : {})}
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
          return [result, constrainedSearch]
        }
      }}
    />
  )
}

const ClientSearchHOC = props => <ClientSearchWithOverrides {...props} />

export default ClientSearchHOC
