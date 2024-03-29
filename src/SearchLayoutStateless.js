import React from 'react'
import * as DefaultUIComponents from './DefaultUIComponents'

import DefaultLayout from './DefaultLayout'
import _ from 'lodash/fp'
import { addDefaultDisplays } from './util'

import Results from './Results'
import ResultsTableStateless from './ResultsTableStateless'
import PaginatorStatic from './PaginatorStatic'

import Filters from './FiltersStateless'

const SearchLayoutStateless = ({
  initialSearch,
  initialResults = {},
  children,
  UIComponents: ThemeComponents,
  schemas,
  layoutStyle
}) => {
  const UIComponents = _.defaults(DefaultUIComponents, ThemeComponents)

  const Layout = ({ children }) => (
    <DefaultLayout style={layoutStyle}>{children}</DefaultLayout>
  )

  schemas = addDefaultDisplays(schemas)
  const schema = schemas[initialSearch.collection]
  if (!schema) {
    return 'Schema not found'
  }

  const filterOptions =
    _.map(
      ({ key }) => ({
        key,
        options: initialResults[key]
      }),
      initialSearch.filters
    ) || _.map(_.pick('key'), initialSearch.filters)

  return (
    <form method="GET" className="fmr-form">
      <UIComponents.Box>
        <Layout>
          <Filters
            filters={initialSearch.filters}
            filterOptions={filterOptions}
            schema={schema}
            UIComponents={UIComponents}
          >
            {children}
          </Filters>
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
    </form>
  )
}

export default SearchLayoutStateless
