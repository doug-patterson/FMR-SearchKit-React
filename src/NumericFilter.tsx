// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from 'lodash/fp'

const NumericFilter = ({
  title,
  from,
  to,
  disableFrom,
  disableTo,
  onChange,
  name,
  UIComponents,
  layout
}: any) => (
  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
  <UIComponents.CardBody
    className={`fmr-numeric-filters fmr-numeric-filters--${
      layout === 'row' ? 'row' : 'column'
    }`}
  >
    {!disableFrom && (
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <UIComponents.Input
        type="number"
        placeholder={'Min'}
        {...(onChange
          ? {
              onChange: (val: any) => {
                onChange({ from: val && _.toNumber(val) })
              },
              value: from || ''
            }
          : {
              name: `${name}[from]`,
              defaultValue: from || ''
            })}
      />
    )}
    {!disableTo && (
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <UIComponents.Input
        type="number"
        placeholder={'Max'}
        {...(onChange
          ? {
              onChange: (val: any) => {
                onChange({ to: val && _.toNumber(val) })
              },
              value: to || ''
            }
          : {
              name: `${name}[to]`,
              defaultValue: to || ''
            })}
      />
    )}
  </UIComponents.CardBody>
)

export default NumericFilter
