import React from 'react'
import _ from 'lodash/fp'

export default ({ title, checked, onChange, name, UIComponents }) => (
  <UIComponents.Card>
    <UIComponents.CardHeader>
      {_.startCase(title)}
    </UIComponents.CardHeader>
    <UIComponents.CardBody>
      <UIComponents.CheckBox
        checked={checked}
        label={'Yes'}
        {...(onChange ? {
          onChange: val => onChange({ checked: val }),
        }: {
          name
        })}
      />
    </UIComponents.CardBody>
  </UIComponents.Card>
)
