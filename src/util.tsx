// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from 'lodash/fp'
import { format } from 'date-fns'

export const mapIndexed = _.convert({ cap: false }).map
export const mapValuesIndexed = _.convert({ cap: false }).mapValues
export const arrayToObject = _.curry((key: any, val: any, arr: any) =>
  _.flow(_.keyBy(key), _.mapValues(val))(arr)
)
export const reduceIndexed = _.convert({ cap: false }).reduce
export const isFlatObject = _.flow(
  _.overSome,
  _.negate
)([_.isPlainObject, _.isArray])
// @ts-expect-error TS(7006): Parameter 'key' implicitly has an 'any' type.
export const singleObject = _.curry((key, value) => ({
  [key]: value
}))
export const singleObjectRight = _.flip(singleObject)
export const dotJoinWith = (fn: any) => (x: any) => _.join('.', _.filter(fn, x))
export const isEmptyObject = _.flow(_.keys, _.size, _.eq(0))

export const flattenObject = (input: any, paths: any) =>
  reduceIndexed(
    (output: any, value: any, key: any) =>
      _.merge(
        output,
        (isFlatObject(value) ? singleObjectRight : flattenObject)(
          value,
          dotJoinWith(_.negate(_.isNil))([paths, key])
        )
      ),
    {},
    input
  )

// @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
const defaultKeyValueDisplay = (obj: any) => <div>
  {mapIndexed(
    (v: any, k: any) => [
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <div key={`${k}`}>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <span>{k}</span>: <span>{`${v}`}</span>
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      </div>
    ],
    obj
  )}
// @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
</div>

const arrayValueDisplay = (val: any) => _.isObject(val) ? defaultKeyValueDisplay(val) : `${val}`

const defaultDisplay = (prop: any) => {
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  let fn = (val: any) => val ? <span>{`${val._id || val}`}</span> : <span>{''}</span>

  switch (prop.bsonType) {
    case 'bool':
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      fn = bool => (bool ? <span>{'Yes'}</span> : <span>{'No'}</span>)
      break
    case 'date':
      fn = date => (
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <span>
          {date ? format(new Date(date), 'MM/dd/yyyy KK:mm:ss bb') : ''}
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </span>
      )
      break
    case 'object':
      fn = defaultKeyValueDisplay
      break
    case 'array':
      fn = arr => (
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div>
          {_.map(
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            (val: any) => <div key={val?._id}>{arrayValueDisplay(val)}</div>,
            arr
          )}
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </div>
      )
      break
    default:
      break
  }

  return fn
}

const defaultDisplays = (schema: any) => ({
  ...schema,

  properties: _.mapValues(
    (prop: any) => ({
      display: defaultDisplay(prop),
      ...prop
    }),
    schema.properties
  )
})

export const addDefaultDisplays = _.mapValues(defaultDisplays)

const breakpoints = [
  [1000000000000, 'T'],
  [1000000000, 'B'],
  [1000000, 'M'],
  [1000, 'K']
]

export const shortNum = (val: any) => {
  for (const breakpoint of breakpoints) {
    if (val > breakpoint[0]) {
      // @ts-expect-error TS(2363): The right-hand side of an arithmetic operation mus... Remove this comment to see the full error message
      return `${(val / breakpoint[0]).toFixed(2)}${breakpoint[1]}`
    }
  }
  return val
}

export const setUpSchemas = (fullOverrides: any, schemas: any) => {
  let newSchemas = schemas
  const collections = _.keys(schemas)
  for (const key of collections) {
    const override = fullOverrides[key]
    if (override) {
      for (const prop in override.properties) {
        newSchemas = _.update(
          `${key}.properties.${prop}`,
          (field: any) => ({
            ...field,
            ...override.properties[prop]
          }),
          newSchemas
        )
      }
    }
  }

  return newSchemas
}

const urlEncode =
  typeof encodeURIComponent === 'function' ? encodeURIComponent : _.identity

const filterToQueryElements = ({
  key,
  to,
  interval,
  from,
  values,
  checked
}: any) => {
  let elements = _.pickBy(_.identity, {
    to,
    from,
    interval,
    [key]: checked ? 'on' : null
  })

  const valueElements = _.size(values)
    ? _.flow(
        _.map((val: any) => [val, 'on']),
        _.fromPairs
      )(values)
    : {}

  elements = _.mapKeys((k: any) => k === key ? k : `${key}[${k}]`, {
    ...elements,
    ...valueElements
  })

  const queryArray = []
  for (const key in elements) {
    queryArray.push(`${urlEncode(key)}=${urlEncode(elements[key])}`)
  }

  const query = _.join('&', queryArray)

  return query
}

export const buildRoute = (search: any, currentUrl: any) => {
  const filterQueries = _.compact(_.map(filterToQueryElements, search.filters))
  return `${currentUrl.split('?')[0]}?${_.join('&', filterQueries)}`
}

const facetValues = _.flow(
  _.map(_.flow(_.split('['), _.last, (val: any) => val.replace(']', ''))),
  (values: any) => ({
    values
  })
)

// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
const setFilterValues = (type: any) => ({
  facet: facetValues,
  arrayElementPropFacet: facetValues,
  subqueryFacet: facetValues,

  // @ts-expect-error TS(7006): Parameter 'keys' implicitly has an 'any' type.
  boolean: (keys, values) => ({
    checked: _.get(_.first(keys), values) === 'on'
  }),

  // @ts-expect-error TS(7006): Parameter 'keys' implicitly has an 'any' type.
  fieldHasTruthyValue: (keys, values) => ({
    checked: _.get(_.first(keys), values) === 'on'
  }),

  numeric: (keys: any, values: any) =>
    _.pickBy(_.identity, {
      from: _.get(_.find(_.includes('from'), keys), values) || null,
      to: _.get(_.find(_.includes('to'), keys), values) || null
    }),

  dateTimeInterval: (keys: any, values: any) =>
    _.pickBy(_.identity, {
      interval: _.get(_.find(_.includes('interval'), keys), values) || null,
      from: _.get(_.find(_.includes('from'), keys), values) || null,
      to: _.get(_.find(_.includes('to'), keys), values) || null
    })
})[type] || (() => ({}))

export const includeSubmittedSearch = (initialSearch: any, values: any) => initialSearch ||
  _.size(values)
    ? _.update(
        'filters',
        _.map((filter: any) => ({
          ...filter,

          ...setFilterValues(filter.type)(
            ..._.flow(
              _.keys,
              _.filter(
                (k: any) => k === filter.key || _.startsWith(`${filter.key}[`, k)
              ),
              (filterValueKeys: any) => [
                filterValueKeys,
                _.pick(filterValueKeys, values)
              ]
            )(values)
          )
        })),
        initialSearch
      )
    : initialSearch


// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
const minorToMajorCurrencyUnitFactor = (currencySymbol: any) => ({
      CVE: 1,
      DJF: 1,
      GNF: 1,
      IDR: 1,
      IQD: 1000,
      JOD: 1000,
      JPY: 1,
      KMF: 1,
      KRW: 1,
      KWD: 1000,
      LYD: 1000,
      OMR: 1000,
      PYG: 1,
      UGX: 1,
      VUV: 1,
      XAF: 1,
      XOF: 1,
      XPF: 1
  }[currencySymbol]) || 100

export const formatCurrency = ({
  amount,
  locale = 'en-US',
  currency = 'USD',
  ...rest
}: any) => 
  amount ?
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...rest
  }).format(amount / minorToMajorCurrencyUnitFactor(currency)) : ''
