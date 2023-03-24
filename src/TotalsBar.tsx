import React from 'react'
import _ from 'lodash/fp'

const renderColumn = ({ label, currency = 'USD', val, display }: any) => (
  <div className={_.kebabCase(label)}>
    <div>{val || _.isNumber(val) ? display(val, null, { currency }) : ''}</div>
    <div>{label}</div>
  </div>
)

export default ({ data, schema, chartKey: key, columns, currency }: any) => (
  <div key={_.uniqueId()} className="fmr-totals-bar" style={{ gridArea: key }}>
    {_.map(
      (column: any) =>
        renderColumn({
          key: `${column.key}_${currency}`,
          label: column.label || _.startCase(column.key),
          currency,
          val: _.get(column.key, _.first(data)),
          display:
            _.get(
              ['properties', key, 'properties', column.key, 'display'],
              schema
            ) || _.identity
        }),
      columns
    )}
  </div>
)
