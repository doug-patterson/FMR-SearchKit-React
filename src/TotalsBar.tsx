// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from 'lodash/fp'

const renderColumn = ({
  label,
  currency = 'USD',
  val,
  display
// @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
}: any) => <div className={_.kebabCase(label)}>
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  <div>{val || _.isNumber(val) ? display(val, null, { currency }): ''}</div>
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  <div>{label}</div>
// @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
</div>

export default ({
  data,
  schema,
  chartKey: key,
  columns,
  currency
}: any) =>
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  <div key={_.uniqueId()} className="fmr-totals-bar" style={{ gridArea: key }}>
    {_.map((column: any) => renderColumn({
      key: `${column.key}_${currency}`,
      label: column.label || _.startCase(column.key),
      currency,
      val: _.get(column.key, _.first(data)),
      display: _.get(['properties', key, 'properties', column.key, 'display'], schema) || _.identity,
    }), columns)}
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  </div>