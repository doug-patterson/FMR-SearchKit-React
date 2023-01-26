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
  currentInput = {}
}) => (
  <UIComponents.Card>
    <UIComponents.CardHeader>{_.startCase(title)}</UIComponents.CardHeader>
    <UIComponents.CardBody>
      <UIComponents.Grid
        columns={_.join(
          ' ',
          _.compact([!disableFrom && '1fr', !disableTo && '1fr'])
        )}
        rows={'28px'}
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
      </UIComponents.Grid>
    </UIComponents.CardBody>
  </UIComponents.Card>
)

export default NumericFilter
