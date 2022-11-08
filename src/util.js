import React from 'react'
import _ from 'lodash/fp'
import { format } from 'date-fns'

export let mapIndexed = _.convert({ cap: false }).map
export let mapValuesIndexed = _.convert({ cap: false }).mapValues
export let arrayToObject = _.curry((key, val, arr) =>
  _.flow(_.keyBy(key), _.mapValues(val))(arr)
)

const defaultKeyValueDisplay = obj => <div>{mapValuesIndexed((v, k) => <div><span>{k}</span>: <span>{`${$v}`}</span></div>,  obj)}</div>

const defaultDisplay = prop => {
  let fn = val => val ? <span>{`${val}`}</span> : ''

  switch (prop.bsonType) {
    case 'bool':
      fn = bool => bool ? <span>{'Yes'}</span> : <span>{'No'}</span>
      break
    case 'date':
      fn = date => <span>{format(new Date(date), 'MM/dd/yyyy KK:mm:ss bb')}</span>
      break
    case 'object':
      fn = defaultKeyValueDisplay
      break
    case 'array':
      fn = arr => <div>{_.map(defaultKeyValueDisplay, arr)}</div>
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