import React from 'react'
import _ from 'lodash/fp'
import { mapIndexed, mapValuesIndexed } from './util'
import BooleanFilter from './BooleanFilter'
import Facet from './Facet'
import NumericFilter from './NumericFilter'
import DateTimeInterval from './DateTimeInterval'

// TODO: dry up with `Filters`
const NoComponent = () => 'no filter found'
const Hidden = () => ''

const getFilterComponent = (type: any) =>
  ({
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
  }[type || 'none'])

const updateFilters = (filters: any) => (idx: any) => (patch: any) =>
  [
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
  <div
    key={_.join(',', _.keys(schema.properties))}
    style={{ gridArea: 'filters' }}
  >
    {!runSearch && (
      <UIComponents.Button type="submit">Search</UIComponents.Button>
    )}
    {children}
    {mapIndexed((filter: any, idx: any) => {
      const Component = getFilterComponent(filter.type)
      return (
        <Component
          key={filter.key}
          {...(runSearch
            ? {
                onChange: async (patch: any) =>
                  runSearch({
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
      )
    }, _.reject('hide', filters))}
    {runSearch && (
      <UIComponents.Button onClick={() => runSearch({})}>
        Reset Search
      </UIComponents.Button>
    )}
  </div>
)

export default FiltersStateless
