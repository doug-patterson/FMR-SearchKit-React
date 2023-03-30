import React from 'react'
import _ from 'lodash/fp'
import { mapIndexed, mapValuesIndexed } from './util'

import BooleanFilter from './BooleanFilter'
import Facet from './Facet'
import NumericFilter from './NumericFilter'
import DateTimeInterval from './DateTimeInterval'

import { Filter, Schema } from './types'

const NoComponent = () => 'no filter found'
const UseWithHide = () => (
  <div>
    This fitlter should be used with <code>hide: true</code>
  </div>
)

const getFilterComponent = (type: string) =>
  ({
    none: NoComponent,
    facet: Facet,
    subqueryFacet: Facet,
    arrayElementPropFacet: Facet,
    propExists: UseWithHide,
    numeric: NumericFilter,
    boolean: BooleanFilter,
    fieldHasTruthyValue: BooleanFilter,
    arraySize: NumericFilter,
    dateTimeInterval: DateTimeInterval
  }[type || 'none'])

const updateFilters = (filters: Filter[] ) => (idx: number) => (patch: any): Filter[] =>
  [
    ..._.slice(0, idx, filters),
    mapValuesIndexed(
      (v: any, k: string) => (_.has(k, patch) ? _.get(k, patch) : v),
      _.clone(filters[idx])
    ),
    ..._.slice(idx + 1, Infinity, filters)
  ]

// we need to handle the search button better - needs to move up to the main
// layout and potentially be accompanied by sort controls and column pickers

interface WrapperProps {
  filterKey: string
  children: JSX.Element[] | JSX.Element | false | undefined
  UIComponents: any
  onlyOneFilterOpenAtATime?: boolean
}

const DefaultWrapper = ({ filterKey, children, UIComponents }: WrapperProps) => (
  <UIComponents.Card>
    <UIComponents.CardHeader>{_.startCase(filterKey)}</UIComponents.CardHeader>
    <>{children}</>
  </UIComponents.Card>
)

const unsetOptionSearches: (filters: any) => any = _.map(_.set('optionSearch', ''))

interface FiltersComponentProps {
  children: JSX.Element[] | JSX.Element | undefined
  filters: Filter[]
  filterOptions: { [key: string]: any }
  schema: Schema
  UIComponents: any
  runSearch: (patch: any) => Promise<void>
  onlyOneFilterOpenAtATime: boolean
  layout: string
  Wrapper?: (props: any) => JSX.Element
  overrideData: any
}

const FragmentWrapperComponent = ({ children }: WrapperProps) => <>{children}</>

const Filters = ({
  children,
  filters,
  filterOptions,
  schema,
  UIComponents,
  runSearch,
  onlyOneFilterOpenAtATime,
  layout = 'column',
  Wrapper = DefaultWrapper,
  overrideData
}: FiltersComponentProps) => {
  return (
    <div
      key={_.join(',', _.keys(schema.properties))}
      style={{
        gridArea: 'filters',
        ...(layout === 'row' ? { display: 'flex', flexDirection: 'row' } : {})
      }}
      className={`${
        layout === 'row' ? 'fmr-filters--row' : 'fmr-filters--column'
      }`}
    >
      {!runSearch && (
        <UIComponents.Button type="submit">Search</UIComponents.Button>
      )}
      {children}
      {mapIndexed((filter: any, idx: any) => {
        const Component: any = getFilterComponent(filter.type)
        const FinalWrapper = filter.hide ? FragmentWrapperComponent : Wrapper
        return (
          <FinalWrapper
            onlyOneFilterOpenAtATime={onlyOneFilterOpenAtATime}
            filterKey={filter.key}
            UIComponents={UIComponents}
          >
            {!filter.hide && (
              <Component
                key={filter.key}
                layout={layout}
                {...(runSearch
                  ? {
                      onChange: async (patch: any) =>
                        runSearch({
                          filters: updateFilters(unsetOptionSearches(filters))(
                            idx
                          )(patch),
                          page: 1
                        }),
                      debouncedOnChange: _.debounce(1000, async (patch: any) =>
                        runSearch({
                          filters: updateFilters(unsetOptionSearches(filters))(
                            idx
                          )(patch),
                          page: 1
                        })
                      )
                    }
                  : {
                      name: filter.key
                    })}
                {..._.omit(['key'], filter)}
                title={filter.key}
                options={_.get(
                  'options',
                  _.find({ key: filter.key }, filterOptions)
                )}
                hasOptionSearch={_.isString(filter.optionSearch)}
                display={
                  filter.prop
                    ? _.get(
                        filter.prop,
                        _.get(filter.field, schema.properties)?.items.properties
                      )?.display
                    : _.get(
                        filter.subqueryLocalField || filter.field,
                        schema.properties
                      )?.display
                }
                UIComponents={UIComponents}
                overrideData={overrideData}
              />
            )}
          </FinalWrapper>
        )
      }, filters)}
      {runSearch && (
        <UIComponents.Button onClick={() => runSearch({})}>
          Reset Search
        </UIComponents.Button>
      )}
    </div>
  )
}

export default Filters
