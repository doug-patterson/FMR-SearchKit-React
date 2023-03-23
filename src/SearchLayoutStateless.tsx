// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
// @ts-expect-error TS(6142): Module './DefaultUIComponents' was resolved to '/U... Remove this comment to see the full error message
import * as DefaultUIComponents from './DefaultUIComponents'

// @ts-expect-error TS(6142): Module './DefaultLayout' was resolved to '/Users/d... Remove this comment to see the full error message
import DefaultLayout from './DefaultLayout'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from 'lodash/fp'
// @ts-expect-error TS(6142): Module './util' was resolved to '/Users/douglaspat... Remove this comment to see the full error message
import { addDefaultDisplays } from './util'

// @ts-expect-error TS(6142): Module './Results' was resolved to '/Users/douglas... Remove this comment to see the full error message
import Results from './Results'
// @ts-expect-error TS(6142): Module './ResultsTableStateless' was resolved to '... Remove this comment to see the full error message
import ResultsTableStateless from './ResultsTableStateless'
import PaginatorStatic from './PaginatorStatic'

// @ts-expect-error TS(6142): Module './FiltersStateless' was resolved to '/User... Remove this comment to see the full error message
import Filters from './FiltersStateless'

const SearchLayoutStateless = ({
  initialSearch,
  initialResults = {},
  children,
  UIComponents: ThemeComponents,
  schemas,
  layoutStyle
}: any) => {
  const UIComponents = _.defaults(DefaultUIComponents, ThemeComponents)

  const Layout = ({
    children
  }: any) => (
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <DefaultLayout style={layoutStyle}>{children}</DefaultLayout>
  )

  schemas = addDefaultDisplays(schemas)
  const schema = schemas[initialSearch.collection]
  if (!schema) {
    return 'Schema not found'
  }

  const filterOptions =
    _.map(
      ({
        key
      }: any) => ({
        key,
        options: initialResults[key]
      }),
      initialSearch.filters
    ) || _.map(_.pick('key'), initialSearch.filters)

  return (
    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <form method="GET" className="fmr-form">
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <UIComponents.Box>
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <Layout>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <Filters
            filters={initialSearch.filters}
            filterOptions={filterOptions}
            schema={schema}
            UIComponents={UIComponents}
          >
            {children}
          </Filters>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <Results
            {...{
              include: _.without(
                initialSearch.omitFromResults,
                initialSearch.include
              ),
              schema: _.update(
                'properties',
                _.omit(initialSearch.omitFromResults),
                schema
              ),
              rows: initialResults.results,
              resultsCount: initialSearch.resultsCount,
              pageSize: initialSearch.pageSize,
              page: initialSearch.page,
              UIComponents,
              ResultsComponent: ResultsTableStateless,
              Paginator: PaginatorStatic
            }}
          />
        </Layout>
      </UIComponents.Box>
    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    </form>
  )
}

export default SearchLayoutStateless
