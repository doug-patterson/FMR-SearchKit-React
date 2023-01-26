import React from 'react'
import _ from 'lodash/fp'
import Results from './Results'
import { formatCurrency, mapValuesIndexed } from './util'

const makeObject = keys => row => _.zipObject(keys, row)

const SummaryTable = ({ data, pivot, group, rows, isCurrency, ...props }) => {
  const names = _.flow(
    _.map(({ _id, name }) => [_id, name]),
    _.fromPairs
  )(data)
  data = _.map(_.omit(['name']), data)
  const orderedKeys = ['_id', ..._.map('key', rows)]
  const negativeKeys = _.map('key', _.filter('negative', rows))
  data = _.map(
    row =>
      mapValuesIndexed(
        (v, k) => (_.includes(k, negativeKeys) ? 0 - v : v),
        row
      ),
    data
  )
  data = _.map(
    row => ({
      ...row,
      ..._.flow(
        _.filter('sum'),
        _.map(({ key, sum }) => [key, sum]),
        _.map(([key, fields]) => [
          key,
          _.sumBy(
            _.identity,
            _.map(field => _.get(field, row), fields)
          )
        ]),
        _.fromPairs
      )(rows)
    }),
    data
  )
  data = _.map(_.pick(orderedKeys), data)
  let include = _.keys(_.first(data))
  const originalInclude = include
  const [, ..._include] = include
  include = _include
  data = _.flow(
    _.first,
    _.keys,
    _.map(key => _.map(key, data))
  )(data)
  const [keys = [], ...values] = data
  data = _.map(makeObject(keys), values)
  data = _.map(
    idx => ({ _id: include[idx], ...data[idx] }),
    _.range(0, _.size(data))
  )
  include = ['_id', ...keys]

  // if !pivot we shoould just display _id with () => name
  // if pivot we should make { label: name } on the schema and make the table use that

  return (
    <Results
      {...props}
      include={include}
      rows={data}
      resultsCount={_.size(data)}
      schema={{
        properties: _.zipObject(
          _.keys(_.first(data)),
          _.map(
            k => ({
              static: true,
              label:
                k === 'null' || k === '_id' ? <span>&nbsp;</span> : names[k],
              display: k =>
                _.includes(k, originalInclude) ? (
                  <span style={{ display: 'inline-block', minWidth: 120 }}>
                    {_.startCase(k)}
                  </span>
                ) : k ? (
                  formatCurrency(k)
                ) : (
                  <span>&nbsp;</span>
                )
            }),
            _.keys(_.first(data))
          )
        )
      }}
    />
  )
}

SummaryTable.displayName = 'SummaryTable'

export default SummaryTable
