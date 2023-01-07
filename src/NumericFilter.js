import React from 'react'
import _ from 'lodash/fp'

export default ({ title, from, to, disableFrom, disableTo, onChange, name, UIComponents }) => (
  <UIComponents.Card>
    <UIComponents.CardHeader>
      {_.startCase(title)}
    </UIComponents.CardHeader>
    <UIComponents.CardBody>
      <UIComponents.Grid
        columns={_.join(' ', _.compact([!disableFrom && '1fr', !disableTo && '1fr']))}
        rows={'28px'}
      >
        {!disableFrom && (
          <UIComponents.Input
            type="number"
            placeholder={'Min'}
            {...(onChange ? {
              onChange: val => onChange({ from: val && _.toNumber(val) }),
              value: from || ''
            } : {
              name: `${name}[from]`,
              defaultValue: from || ''
            } )}
          />
        )}
        {!disableTo && (
          <UIComponents.Input
            type="number"
            placeholder={'Max'}
            {...(onChange ? {
              onChange: val => onChange({ to: val && _.toNumber(val) }),
              value: to || ''
            } : {
              name: `${name}[to]`,
              defaultValue: to || ''
            } )}
          />
        )}
      </UIComponents.Grid>
    </UIComponents.CardBody>
  </UIComponents.Card>
)
