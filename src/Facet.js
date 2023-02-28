import React from 'react'
import _ from 'lodash/fp'

// we'll need to make a stateless facet for the pure server rendered search

const Facet = ({
  title,
  options,
  values,
  onChange,
  debouncedOnChange,
  display = _.get('_id'),
  UIComponents,
  layout,
  currentInput = {},
  hasOptionSearch,
  overrideData
}) => {
  let [optionSearch, setOptionSearch] = React.useState(
    _.has(`${title}.optionSearch`, currentInput.current)
      ? _.get(`${title}.optionSearch`, currentInput.current)
      : ''
  )
  return (
    <UIComponents.CardBody>
      <div
        className="fmr-facet__wrapper"
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {hasOptionSearch && (
          <div
            className={`fmr-facet__option-search fmr-facet__option-search--${layout}`}
          >
            <UIComponents.Input
              type="text"
              placeholder={'Search Options'}
              focus={_.has(`${title}.optionSearch`, currentInput.current)}
              {...(onChange
                ? {
                    onChange: val => {
                      setOptionSearch(val)
                      currentInput.current = {
                        [`${title}.optionSearch`]: val
                      }
                      debouncedOnChange({ optionSearch: val })
                    },
                    value: optionSearch
                  }
                : {
                    name: `${name}[optionSearch]`,
                    defaultValue: optionSearch
                  })}
            />
          </div>
        )}
        {_.map(
          ({ _id, checked, count, value, lookup }) => (
            <React.Fragment key={`${_id}-${checked ? 'checked' : 'unchecked'}`}>
              <UIComponents.CheckBox
                layout={layout}
                checked={checked}
<<<<<<< HEAD
                textMiddle={display(_.isString(value) ? value : { ...value, ...lookup, _id }, null, overrideData)}
=======
                textMiddle={display({ ...value, ...lookup, _id })}
>>>>>>> f5d5f9bd5113229def5d6cfa97cceb3139dd7b0e
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
}

export default Facet
