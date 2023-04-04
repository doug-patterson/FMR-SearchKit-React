import React from 'react'
import _ from 'lodash/fp'

const NumericFilter = ({
  from,
  to,
  disableFrom,
  disableTo,
  onChange,
  name,
  UIComponents,
  layout
}: any) => (
  <UIComponents.CardBody
    className={`fmr-numeric-filters fmr-numeric-filters--${
      layout === 'row' ? 'row' : 'column'
    }`}
  >
    {!disableFrom && (
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
