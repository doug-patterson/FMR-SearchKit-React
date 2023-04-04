import React from 'react'
import _ from 'lodash/fp'
import { FacetProps, FacetOption } from './types'

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
  hasOptionSearch,
  overrideData
}: FacetProps) => {
  let [optionSearch, setOptionSearch] = React.useState('')
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
              {...(onChange
                ? {
                    onChange: (val: string) => {
                      setOptionSearch(val)
                      debouncedOnChange({ optionSearch: val })
                    },
                    value: optionSearch
                  }
                : {
                    name: `${name}[optionSearch]`, // name is never declared. what's its purpose here?
                    defaultValue: optionSearch
                  })}
            />
          </div>
        )}
        {_.map(
          ({ _id, checked, count, value, lookup }: FacetOption) => (
            <React.Fragment key={`${_id}-${checked ? 'checked' : 'unchecked'}`}>
              <UIComponents.CheckBox
                layout={layout}
                checked={checked}
                textMiddle={display(
                  _.isString(value)
                    ? value
                    : {
                        ...(_.isObject(value) ? { ...value } : {}),
                        ...lookup,
                        _id
                      },
                  null,
                  overrideData
                )}
                textRight={count}
                {...(onChange
                  ? {
                      onChange: (checked: boolean) => {
                        const newValues = checked
                          ? _.concat(values, _id)
                          : _.without([_id], values)
                        onChange({ values: _.compact(newValues) })
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
