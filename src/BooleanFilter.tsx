import React from 'react'
import _ from 'lodash/fp'

interface BooleanFilterComponentProps {
  checked: boolean,
  onChange: (event: any) => any,
  name: string,
  UIComponents: any,
  layout: string,
  label: string
}

const BooleanFilter = ({
  checked,
  onChange,
  name,
  UIComponents,
  layout,
  label
}: BooleanFilterComponentProps) => (
  <UIComponents.CardBody>
    <UIComponents.CheckBox
      checked={checked}
      label={'Yes'}
      textRight={label}
      layout={layout}
      {...(onChange
        ? {
            onChange: (val: any) => onChange({ checked: val })
          }
        : {
            name
          })}
    />
  </UIComponents.CardBody>
)

export default BooleanFilter
