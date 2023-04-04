import React from 'react'
import * as DefaultUIComponents from './DefaultUIComponents'
import DefaultLayout from './DefaultLayout'
import _ from 'lodash/fp'
import { addDefaultDisplays } from './util'
import Results from './Results'
import ResultsTableStateless from './ResultsTableStateless'
import PaginatorStatic from './PaginatorStatic'
import Filters from './FiltersStateless'
import { SearchLayoutProps } from './types'

// server components that return a Promise need to be typed with `any`
const SearchLayoutStateless: any = ({
  initialSearch,
  initialResults,
  children,
  UIComponents: ThemeComponents,
  schemas,
  layoutStyle
}: SearchLayoutProps) => {
  const UIComponents = _.defaults(DefaultUIComponents, ThemeComponents)

  const Layout = ({ children }: any) => (
    <DefaultLayout style={layoutStyle}>{children}</DefaultLayout>
  )

  schemas = addDefaultDisplays(schemas)
  const schema = schemas[initialSearch.collection]
  if (!schema) {
    return 'Schema not found'
  }

  const filterOptions =
    _.map(
      ({ key }: any) => ({
        key,
        options: _.get('key', initialResults)
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
                initialSearch.omitFromResults || [],
                initialSearch.include
              ),
              schema: _.update(
                'properties',
                _.omit(initialSearch.omitFromResults || []),
                schema
              ),
              rows: _.get('results', initialResults),
              resultsCount: _.get('resultsCount', initialSearch),
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
