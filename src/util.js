import React from 'react'
import _ from 'lodash/fp'
import { format } from 'date-fns'

export const mapIndexed = _.convert({ cap: false }).map
export const mapValuesIndexed = _.convert({ cap: false }).mapValues
export const arrayToObject = _.curry((key, val, arr) =>
  _.flow(_.keyBy(key), _.mapValues(val))(arr)
)
export const reduceIndexed = _.convert({ cap: false }).reduce
export const isFlatObject = _.flow(
  _.overSome,
  _.negate
)([_.isPlainObject, _.isArray])
export const singleObject = _.curry((key, value) => ({ [key]: value }))
export const singleObjectRight = _.flip(singleObject)
export const dotJoinWith = fn => x => _.join('.', _.filter(fn, x))
export const isEmptyObject = _.flow(_.keys, _.size, _.eq(0))

export const flattenObject = (input, paths) =>
  reduceIndexed(
    (output, value, key) =>
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

const defaultKeyValueDisplay = obj => (
  <div>
    {mapIndexed(
      (v, k) => [
        <div key={`${k}`}>
          <span>{k}</span>: <span>{`${v}`}</span>
        </div>
      ],
      obj
    )}
  </div>
)

const arrayValueDisplay = val =>
  _.isObject(val) ? defaultKeyValueDisplay(val) : `${val}`

const defaultDisplay = prop => {
  let fn = val => (val ? <span>{`${val._id || val}`}</span> : <span>{''}</span>)

  switch (prop.bsonType) {
    case 'bool':
      fn = bool => (bool ? <span>{'Yes'}</span> : <span>{'No'}</span>)
      break
    case 'date':
      fn = date => (
        <span>
          {date ? format(new Date(date), 'MM/dd/yyyy KK:mm:ss bb') : ''}
        </span>
      )
      break
    case 'object':
      fn = defaultKeyValueDisplay
      break
    case 'array':
      fn = arr => (
        <div>
          {_.map(
            val => (
              <div key={val?._id}>{arrayValueDisplay(val)}</div>
            ),
            arr
          )}
        </div>
      )
      break
    default:
      break
  }

  return fn
}

const defaultDisplays = schema => ({
  ...schema,
  properties: _.mapValues(
    prop => ({ display: defaultDisplay(prop), ...prop }),
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

export const shortNum = val => {
  for (const breakpoint of breakpoints) {
    if (val > breakpoint[0]) {
      return `${(val / breakpoint[0]).toFixed(2)}${breakpoint[1]}`
    }
  }
  return val
}

export const setUpSchemas = (fullOverrides, schemas) => {
  let newSchemas = schemas
  const collections = _.keys(schemas)
  for (const key of collections) {
    const override = fullOverrides[key]
    if (override) {
      for (const prop in override.properties) {
        newSchemas = _.update(
          `${key}.properties.${prop}`,
          field => ({ ...field, ...override.properties[prop] }),
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
}) => {
  let elements = _.pickBy(_.identity, {
    to,
    from,
    interval,
    [key]: checked ? 'on' : null
  })

  const valueElements = _.size(values)
    ? _.flow(
        _.map(val => [val, 'on']),
        _.fromPairs
      )(values)
    : {}

  elements = _.mapKeys(k => (k === key ? k : `${key}[${k}]`), {
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

export const buildRoute = (search, currentUrl) => {
  const filterQueries = _.compact(_.map(filterToQueryElements, search.filters))
  return `${currentUrl.split('?')[0]}?${_.join('&', filterQueries)}`
}

const facetValues = _.flow(
  _.map(_.flow(_.split('['), _.last, val => val.replace(']', ''))),
  values => ({ values })
)

const setFilterValues = type =>
  ({
    facet: facetValues,
    arrayElementPropFacet: facetValues,
    subqueryFacet: facetValues,
    boolean: (keys, values) => ({
      checked: _.get(_.first(keys), values) === 'on'
    }),
    fieldHasTruthyValue: (keys, values) => ({
      checked: _.get(_.first(keys), values) === 'on'
    }),
    numeric: (keys, values) =>
      _.pickBy(_.identity, {
        from: _.get(_.find(_.includes('from'), keys), values) || null,
        to: _.get(_.find(_.includes('to'), keys), values) || null
      }),
    dateTimeInterval: (keys, values) =>
      _.pickBy(_.identity, {
        interval: _.get(_.find(_.includes('interval'), keys), values) || null,
        from: _.get(_.find(_.includes('from'), keys), values) || null,
        to: _.get(_.find(_.includes('to'), keys), values) || null
      })
  }[type] || (() => ({})))

export const includeSubmittedSearch = (initialSearch, values) => initialSearch ||
  _.size(values)
    ? _.update(
        'filters',
        _.map(filter => ({
          ...filter,
          ...setFilterValues(filter.type)(
            ..._.flow(
              _.keys,
              _.filter(
                k => k === filter.key || _.startsWith(`${filter.key}[`, k)
              ),
              filterValueKeys => [
                filterValueKeys,
                _.pick(filterValueKeys, values)
              ]
            )(values)
          )
        })),
        initialSearch
      )
    : initialSearch


const minorToMajorCurrencyUnitFactor = currencySymbol => ({
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
}) => 
  amount ?
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...rest
  }).format(amount / minorToMajorCurrencyUnitFactor(currency)) : ''
