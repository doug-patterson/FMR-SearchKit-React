import React from 'react'
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
  currentInput = {},
  layout
}) => (
  <UIComponents.CardBody
    className={`fmr-numeric-filters fmr-numeric-filters--${
      layout === 'row' ? 'row' : 'column'
    }`}
  >
    {!disableFrom && (
      <UIComponents.Input
        type="number"
        placeholder={'Min'}
        focus={_.has(`${title}.from`, currentInput.current)}
        {...(onChange
          ? {
              onChange: val => {
                currentInput.current = { [`${title}.from`]: val }
                onChange({ from: val && _.toNumber(val) })
              },
              value: _.has(`${title}.from`, currentInput.current)
                ? _.get(`${title}.from`, currentInput.current)
                : from || ''
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
        focus={_.has(`${title}.to`, currentInput.current)}
        {...(onChange
          ? {
              onChange: val => {
                currentInput.current = { [`${title}.to`]: val }
                onChange({ to: val && _.toNumber(val) })
              },
              value: _.has(`${title}.to`, currentInput.current)
                ? _.get(`${title}.to`, currentInput.current)
                : to || ''
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
