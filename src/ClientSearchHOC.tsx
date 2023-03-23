'use client'

// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
// @ts-expect-error TS(6142): Module './SearchLayout' was resolved to '/Users/do... Remove this comment to see the full error message
import SearchLayout from './SearchLayout'
// @ts-expect-error TS(6142): Module './FilterDropdown' was resolved to '/Users/... Remove this comment to see the full error message
import { FilterDropdown as FilterWrapper } from './FilterDropdown'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from 'lodash/fp'
// @ts-expect-error TS(6142): Module './util' was resolved to '/Users/douglaspat... Remove this comment to see the full error message
import { setUpSchemas } from './util'
// @ts-expect-error TS(6142): Module './util' was resolved to '/Users/douglaspat... Remove this comment to see the full error message
import { buildRoute } from './util'

const tld = (hostname: any) => hostname === 'localhost'
  ? 'localhost'
  // @ts-expect-error TS(7031): Binding element 'rest' implicitly has an 'any' typ... Remove this comment to see the full error message
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

const ClientSearchWithOverrides = (props: any) => {
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

  return schemas && (
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
          _.get(props.initialSearch?.id, props.constraints)
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
  );
}

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
const ClientSearchHOC = (props: any) => <ClientSearchWithOverrides {...props} />

export default ClientSearchHOC
