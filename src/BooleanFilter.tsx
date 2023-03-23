// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from 'lodash/fp'

const BooleanFilter = ({
  checked,
  onChange,
  name,
  UIComponents,
  layout,
  label
}: any) => (
  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
  <UIComponents.CardBody>
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
