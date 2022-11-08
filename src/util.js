import _ from 'lodash/fp'
import { format } from 'date-fns'

export let mapIndexed = _.convert({ cap: false }).map
export let mapValuesIndexed = _.convert({ cap: false }).mapValues
export let arrayToObject = _.curry((key, val, arr) =>
  _.flow(_.keyBy(key), _.mapValues(val))(arr)
)

const defaultDisplay = prop => {
  let propType = typeof prop
  let fn = _.identity

  switch (propType) {
    case 'date':
      fn = date => format(date, 'MM/dd/yyyy KK:mm:ss bb')
      break
    case 'object':
      fn = obj => <div>{mapValuesIndexed((v, k) => <div><span>{k}</span>: <span>{v}</span></div>,  obj)}</div>
    default:
      break
  }

  return fn
}

const defaultDisplays = _.mapValues(defaultDisplay)

export let addDisplays = (schemas, displays) => _.mapValues(_.flow(
  defaultDisplays,
  schema => {
    _.assign(schema, displays[schema.collection])
    return schema
  }
), schemas)