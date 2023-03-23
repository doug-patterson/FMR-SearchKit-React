// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from 'lodash/fp'
// @ts-expect-error TS(6142): Module './Results' was resolved to '/Users/douglas... Remove this comment to see the full error message
import Results from './Results'
// @ts-expect-error TS(6142): Module './util' was resolved to '/Users/douglaspat... Remove this comment to see the full error message
import { formatCurrency, mapValuesIndexed } from './util'

const makeObject = (keys: any) => (row: any) => _.zipObject(keys, row)

const makeSummaryColumn = _.map((row: any) => ({
  _id: row._id,

  total: _.flow(
    _.omit('_id'),
    _.values,
    _.sumBy(_.identity)
  )(row),

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
    _.map(({
      _id,
      name
    }: any) => [_id, name]),
    _.fromPairs
  )(data)
  data = _.map(_.omit(['name']), data)
  const showKeys = ['_id', ..._.map('key', _.reject('hide', rows))]
  data = _.map(
    (row: any) => ({
      ...row,

      ..._.flow(
        _.filter('sum'),
        _.map(({
          key,
          sum
        }: any) => [key, sum]),
        // @ts-expect-error TS(7031): Binding element 'key' implicitly has an 'any' type... Remove this comment to see the full error message
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
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                k === 'null' || k === '_id' ? <span>&nbsp;</span> : names[k],

              display: (k: any) => _.includes(k, originalInclude) ? (
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <span style={{ display: 'inline-block', minWidth: 120 }}>
                  {_.startCase(k)}
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </span>
              ) : k ? (
                formatCurrency({ amount: k, currency })
              ) : (
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <span>&nbsp;</span>
              )
            }),
            [..._.keys(_.first(data)), 'total']
          )
        )
      }}
    />
  );
}

SummaryTable.displayName = 'SummaryTable'

export default SummaryTable
