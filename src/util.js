import React from 'react'
import _ from 'lodash/fp'
import { format } from 'date-fns'

export let mapIndexed = _.convert({ cap: false }).map
export let mapValuesIndexed = _.convert({ cap: false }).mapValues
export let arrayToObject = _.curry((key, val, arr) =>
  _.flow(_.keyBy(key), _.mapValues(val))(arr)
)

const defaultDisplay = prop => {
  let fn = val => val ? `${val}` : ''

  switch (prop.bsonType) {
    case 'date':
      fn = date => format(new Date(date), 'MM/dd/yyyy KK:mm:ss bb')
      break
    case 'object':
      fn = obj => <div>{mapValuesIndexed((v, k) => <div><span>{k}</span>: <span>{v}</span></div>,  obj)}</div>
    default:
      break
  }

  return fn
}

const defaultDisplays = _.mapValues(val => ({ display: defaultDisplay(val), ...val }))

export let addDefaultDisplays = _.mapValues(defaultDisplays)