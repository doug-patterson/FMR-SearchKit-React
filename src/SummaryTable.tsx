import React from 'react'
import _ from 'lodash/fp'
import Results from './Results'
import { formatCurrency } from './util'

const makeObject = (keys: any) => (row: any) => _.zipObject(keys, row)

const makeSummaryColumn = _.map((row: any) => ({
  _id: row._id,

  total: _.flow(_.omit('_id'), _.values, _.sumBy(_.identity))(row),

  ..._.omit('_id', row)
}))

const SummaryTable = ({
  data,
  group,
  rows,
  isCurrency,
  currency,
  ...props
}: any) => {
  const names = _.flow(
    _.map(({ _id, name }: any) => [_id, name]),
    _.fromPairs
  )(data)
  data = _.map(_.omit(['name']), data)
  const showKeys = ['_id', ..._.map('key', _.reject('hide', rows))]
  data = _.map(
    (row: any) => ({
      ...row,

      ..._.flow(
        _.filter('sum'),
        _.map(({ key, sum }: any) => [key, sum]),
        _.map(([key, fields]) => [
          key,
          _.sumBy(
            _.identity,
            _.map((field: any) => _.get(field, row), fields)
          )
        ]),
        _.fromPairs
      )(rows)
    }),
    data
  )
  data = _.map(_.pick(showKeys), data)
  let include = _.keys(_.first(data))
  const originalInclude = include
  const [, ..._include] = include
  include = _include
  data = _.flow(
    _.first,
    _.keys,
    _.map((key: any) => _.map(key, data))
  )(data)
  const [keys = [], ...values] = data
  data = _.map(makeObject(keys), values)
  data = _.map(
    (idx: any) => ({
      _id: include[idx],
      ...data[idx]
    }),
    _.range(0, _.size(data))
  )
  include = ['_id', 'total', ...keys]

  return (
    <Results
      {...props}
      include={include}
      rows={makeSummaryColumn(data)}
      resultsCount={_.size(data)}
      schema={{
        properties: _.zipObject(
          [..._.keys(_.first(data)), 'total'],
          _.map(
            (k: any) => ({
              static: true,

              label:
                k === 'null' || k === '_id' ? <span>&nbsp;</span> : names[k],

              display: (k: any) =>
                _.includes(k, originalInclude) ? (
                  <span style={{ display: 'inline-block', minWidth: 120 }}>
                    {_.startCase(k)}
                  </span>
                ) : k ? (
                  formatCurrency({ amount: k, currency })
                ) : (
                  <span>&nbsp;</span>
                )
            }),
            [..._.keys(_.first(data)), 'total']
          )
        )
      }}
    />
  )
}

SummaryTable.displayName = 'SummaryTable'

export default SummaryTable
