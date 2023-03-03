import React from 'react'
import _ from 'lodash/fp'

// remove event handlers
// wire up stateless search to use this instead of the other

const FacetStateless = ({
  title,
  options,
  values,
  onChange,
  display = _.get('_id'),
  UIComponents,
  layout,
}) => (
  <UIComponents.CardBody>
    <div
      className="fmr-facet__wrapper"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <div className="fmr-facet__option-search">
        <UIComponents.Input
          type="text"
          placeholder={'Search Options'}
          value={''}
        />
      </div>
      {_.map(
        ({ _id, checked, count, value, lookup }) => (
          <React.Fragment key={`${_id}-${checked ? 'checked' : 'unchecked'}`}>
            <UIComponents.CheckBox
              layout={layout}
              checked={checked}
              textMiddle={display({ ...value, ...lookup, _id })}
              textRight={count}
              {...(onChange
                ? {
                    onChange: checked => {
                      const newValues = checked
                        ? _.concat(values, _id)
                        : _.without([_id], values)
                      onChange({ values: newValues })
                    }
                  }
                : {
                    name: `${title}[${_id}]`
                  })}
            />
          </React.Fragment>
        ),
        options
      )}
    </div>
  </UIComponents.CardBody>
)

export default FacetStateless
