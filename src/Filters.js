import React from 'react'
import _ from 'lodash/fp'
import { mapIndexed, mapValuesIndexed } from './util'

import BooleanFilter from './BooleanFilter'
import Facet from './Facet'
import NumericFilter from './NumericFilter'

let NoComponent = () => 'no filter found'
let Hidden = () => ''

let getFilterComponent = type =>
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
  }[type || 'none'])

let updateFilters = filters => idx => patch =>
  [
    ..._.slice(0, idx, filters),
    mapValuesIndexed(
      (v, k) => (_.has(k, patch) ? _.get(k, patch) : v),
      _.clone(filters[idx])
    ),
    ..._.slice(idx + 1, Infinity, filters),
  ]


export default ({ children, filters, filterOptions, schema, UIComponents, runSearch }) => 
  <div key={_.join(',', _.keys(schema.properties))} style={{ gridArea: 'filters' }}>
    {children}
    {mapIndexed((filter, idx) => {
      let Component = getFilterComponent(filter.type)
      return (
        <Component
          key={filter.key}
          onChange={async patch => runSearch({
            filters: updateFilters(filters)(idx)(patch),
            page: 1
          })}
          title={filter.key}
          {...filter}
          options={_.get(
            'options',
            _.find({ key: filter.key }, filterOptions)
          )}
          display={filter.prop ? schema.properties[filter.field].items.properties[filter.prop].display : schema.properties[filter.field]?.display}
          UIComponents={UIComponents}
        />
      )
    }, filters)}
    <UIComponents.Button
      onClick={() => runSearch({})}
    >Reset Search</UIComponents.Button>
  </div>