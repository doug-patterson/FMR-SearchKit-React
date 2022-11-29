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

const defaultKeyValueDisplay = obj => <div>{mapIndexed((v, k) => [<div><span>{k}</span>: <span>{`${v}`}</span></div>], obj)}</div>

const arrayValueDisplay = val => _.isObject(val) ? defaultKeyValueDisplay(val) : `${val}`

const defaultDisplay = prop => {
  let fn = val => val ? <span>{`${val}`}</span> : <span>{''}</span>

  switch (prop.bsonType) {
    case 'bool':
      fn = bool => bool ? <span>{'Yes'}</span> : <span>{'No'}</span>
      break
    case 'date':
      fn = date => <span>{date ? format(new Date(date), 'MM/dd/yyyy KK:mm:ss bb') : ''}</span>
      break
    case 'object':
      fn = defaultKeyValueDisplay
      break
    case 'array':
      fn = arr => <div>{_.map(val => <div key={val?._id}>{arrayValueDisplay(val)}</div>, arr)}</div>
      break
    default:
      break
  }

  return fn
}

const defaultDisplays = schema => ({
  ...schema,
  properties: _.mapValues(prop => ({ display: defaultDisplay(prop), ...prop }), schema.properties)
}) 

export let addDefaultDisplays = _.mapValues(defaultDisplays)