import React from 'react'
import * as DefaultUIComponents from './DefaultUIComponents'

import _ from 'lodash/fp'
import { mapIndexed, mapValuesIndexed, addDefaultDisplays } from './util'

import BooleanFilter from './BooleanFilter'
import Facet from './Facet'
import NumericFilter from './NumericFilter'
import Results from './Results'
import ResultsTableStateless from './ResultsTableStateless'

let NoComponent = () => 'no filter found'
let Hidden = () => ''
let getFilterComponent = type =>
  ({
    none: NoComponent,
    facet: Facet,
    arrayElementPropFacet: Facet,
    hidden: Hidden,
    numeric: NumericFilter,
    boolean: BooleanFilter,
    arraySize: NumericFilter,
  }[type || 'none'])

let updateFilters = initialSearch => idx => patch => ({
  ...initialSearch,
  filters: [
    ..._.slice(0, idx, initialSearch.filters),
    mapValuesIndexed(
      (v, k) => (_.has(k, patch) ? _.get(k, patch) : v),
      _.clone(initialSearch.filters[idx])
    ),
    ..._.slice(idx + 1, Infinity, initialSearch.filters),
  ]
})

export default ({
  collection,
  initialSearch,
  initialResults = [],
  children,
  UIComponents: ThemeComponents,
  schemas,
  execute,
}) => {
  let UIComponents = _.defaults(DefaultUIComponents, ThemeComponents)

  schemas = addDefaultDisplays(schemas)
  let schema = schemas[collection]
  if (!schema) {
    return 'Schema not found'
  }

  let filterOptions =_.map(_.pick('key'), initialSearch.filters)

  return (
    <form action={``} method="POST">
      <UIComponents.Box>
        <UIComponents.Grid columns="1fr 5fr" gap={10}>
          <UIComponents.Box>
            {children}
            {mapIndexed((filter, idx) => {
              let Component = getFilterComponent(filter.type)
              return (
                <Component
                  key={filter.key}
                  title={filter.key}
                  {...filter}
                  options={_.get(
                    'options',
                    _.find({ key: filter.key }, filterOptions)
                  )}
                  display={schema.properties[filter.field].display}
                  UIComponents={UIComponents}
                />
              )
            }, initialSearch.filters)}
            <UIComponents.SubmitButton>Search</UIComponents.SubmitButton>
          </UIComponents.Box>
          <UIComponents.Box style={{ overflowY: 'scroll', paddingBottom: 120 }}>
            <Results
              {...{
                include: _.without(initialSearch.omitFromResults, initialSearch.include),
                setInclude: include => runSeach({ ...initialSearch, include }),
                setSortField: sortField => runSeach({ ...initialSearch, sortField }),
                setSortDir: sortDir => runSeach({ ...initialSearch, sortDir }),
                schema: _.update('properties', _.omit(initialSearch.omitFromResults), schema),
                rows: initialResults,
                resultsCount: initialSearch.resultsCount,
                pageSize: initialSearch.pageSize,
                setPageSize: pageSize => runSeach({ ...initialSearch, pageSize }),
                page: initialSearch.page,
                setPage: page => runSeach({ ...initialSearch, page }),
                UIComponents,
                ResultsComponent: ResultsTableStateless,
                stateless: true
              }}
            />
          </UIComponents.Box>
        </UIComponents.Grid>
      </UIComponents.Box>
    </form>
  )
}
