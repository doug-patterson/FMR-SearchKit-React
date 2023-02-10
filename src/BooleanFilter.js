import React from 'react'
import _ from 'lodash/fp'

const BooleanFilter = ({
  checked,
  onChange,
  name,
  UIComponents,
  layout,
  label
}) => (
  <UIComponents.CardBody>
    <UIComponents.CheckBox
      checked={checked}
      label={'Yes'}
      textRight={label}
      layout={layout}
      {...(onChange
        ? {
            onChange: val => onChange({ checked: val })
          }
        : {
            name
          })}
    />
  </UIComponents.CardBody>
)

export default BooleanFilter
