import React from 'react'
import _ from 'lodash/fp'

export default ({
  title,
  idPath,
  options,
  values,
  onChange,
  display,
  UIComponents,
}) => (
  <UIComponents.Card>
    <UIComponents.CardHeader>{_.startCase(title)}</UIComponents.CardHeader>
    <UIComponents.CardBody>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {_.map(
          ({ _id, checked, count, value, lookup, include }) => (
            <div
              style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto' }}
              key={`${_id}-${checked ? 'checked' : 'unchecked'}`}
            >
              <UIComponents.CheckBox
                label={(include || lookup || _.isObject(value))  ? (display({ ...value, ...lookup, _id }) || _id) : _id}
                checked={checked}
                onChange={checked => {
                  let newValues = checked
                    ? _.concat(values, _id)
                    : _.without([_id], values)
                  onChange({ values: newValues })
                }}
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
