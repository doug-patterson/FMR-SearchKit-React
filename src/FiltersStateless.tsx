// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from 'lodash/fp'
// @ts-expect-error TS(6142): Module './util' was resolved to '/Users/douglaspat... Remove this comment to see the full error message
import { mapIndexed, mapValuesIndexed } from './util'

// @ts-expect-error TS(6142): Module './BooleanFilter' was resolved to '/Users/d... Remove this comment to see the full error message
import BooleanFilter from './BooleanFilter'
// @ts-expect-error TS(6142): Module './Facet' was resolved to '/Users/douglaspa... Remove this comment to see the full error message
import Facet from './Facet'
// @ts-expect-error TS(6142): Module './NumericFilter' was resolved to '/Users/d... Remove this comment to see the full error message
import NumericFilter from './NumericFilter'
// @ts-expect-error TS(6142): Module './DateTimeInterval' was resolved to '/User... Remove this comment to see the full error message
import DateTimeInterval from './DateTimeInterval'

// TODO: dry up with `Filters`
const NoComponent = () => 'no filter found'
const Hidden = () => ''

// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
const getFilterComponent = (type: any) => ({
  none: NoComponent,
  facet: Facet,
  arrayElementPropFacet: Facet,
  hidden: Hidden,
  hiddenExists: Hidden,
  numeric: NumericFilter,
  boolean: BooleanFilter,
  fieldHasTruthyValue: BooleanFilter,
  arraySize: NumericFilter,
  dateTimeInterval: DateTimeInterval
})[type || 'none']

const updateFilters = (filters: any) => (idx: any) => (patch: any) => [
  ..._.slice(0, idx, filters),
  mapValuesIndexed(
    (v: any, k: any) => (_.has(k, patch) ? _.get(k, patch) : v),
    _.clone(filters[idx])
  ),
  ..._.slice(idx + 1, Infinity, filters)
]

// we need to handle the search button better - needs to move up to the main
// layout and potentially be accompanied by sort controls and column pickers

// so we need to maintain a record of which input is focused and what its contents
// are, that's all, then when rendering the filters that care need to use it

const FiltersStateless = ({
  children,
  filters,
  filterOptions,
  schema,
  UIComponents,
  runSearch
}: any) => (
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  <div
    key={_.join(',', _.keys(schema.properties))}
    style={{ gridArea: 'filters' }}
  >
    {!runSearch && (
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <UIComponents.Button type="submit">Search</UIComponents.Button>
    )}
    {children}
    {mapIndexed((filter: any, idx: any) => {
      const Component = getFilterComponent(filter.type)
      return (
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <Component
          key={filter.key}
          {...(runSearch
            ? {
                onChange: async (patch: any) => runSearch({
                  filters: updateFilters(filters)(idx)(patch),
                  page: 1
                })
              }
            : {
                name: filter.key
              })}
          title={filter.key}
          {..._.omit(['key'], filter)}
          options={_.get('options', _.find({ key: filter.key }, filterOptions))}
          display={
            filter.prop
              ? _.get(
                  filter.prop,
                  _.get(filter.field, schema.properties)?.items.properties
                )?.display
              : _.get(filter.field, schema.properties)?.display
          }
          UIComponents={UIComponents}
        />
      );
    }, _.reject('hide', filters))}
    {runSearch && (
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <UIComponents.Button onClick={() => runSearch({})}>
        Reset Search
      </UIComponents.Button>
    )}
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  </div>
)

export default FiltersStateless
