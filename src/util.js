import React from 'react'
import _ from 'lodash/fp'
import { format } from 'date-fns'

export let mapIndexed = _.convert({ cap: false }).map
export let mapValuesIndexed = _.convert({ cap: false }).mapValues
export let arrayToObject = _.curry((key, val, arr) =>
  _.flow(_.keyBy(key), _.mapValues(val))(arr)
)

const defaultKeyValueDisplay = _.constant("this is the problem")//obj => <div>{[mapValuesIndexed((v, k) => <div><span>{k}</span>: <span>{`${v}`}</span></div>, obj)]}</div>

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
      fn = arr => <div>{_.map(val => <div>{arrayValueDisplay(val)}</div>, arr)}</div>
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