import React from 'react'
import _ from 'lodash/fp'

export default ({
  title,
  idPath,
  options,
  values,
  onChange,
  display = _.get('_id'),
  UIComponents,
}) => (
  <UIComponents.Card>
    <UIComponents.CardHeader>{_.startCase(title)}</UIComponents.CardHeader>
    <UIComponents.CardBody>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {_.map(
          ({ _id, checked, count, value, lookup }) => (
            <div
              style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto' }}
              key={`${_id}-${checked ? 'checked' : 'unchecked'}`}
            >
              <UIComponents.CheckBox
                label={display({ ...value, ...lookup, _id })}
                checked={checked}
                {...(onChange ? {
                  onChange: checked => {
                    let newValues = checked
                      ? _.concat(values, _id)
                      : _.without([_id], values)
                    onChange({ values: newValues })
                  }
                } : {
                  name: `${title}[${_id}]`
                })}
              />
              <span style={{ textAlign: 'right', justifySelf: 'end' }}>
                {count}
              </span>
            </div>
          ),
          options
        )}
      </div>
    </UIComponents.CardBody>
  </UIComponents.Card>
)
