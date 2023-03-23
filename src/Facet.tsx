// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
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
  hasOptionSearch,
  overrideData
}: any) => {
  let [optionSearch, setOptionSearch] = React.useState('')
  return (
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <UIComponents.CardBody>
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <div
        className="fmr-facet__wrapper"
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {hasOptionSearch && (
          // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          <div
            className={`fmr-facet__option-search fmr-facet__option-search--${layout}`}
          >
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <UIComponents.Input
              type="text"
              placeholder={'Search Options'}
              {...(onChange
                ? {
                    onChange: (val: any) => {
                      setOptionSearch(val)
                      debouncedOnChange({ optionSearch: val })
                    },
                    value: optionSearch
                  }
                : {
                    name: `${name}[optionSearch]`,
                    defaultValue: optionSearch
                  })}
            />
          // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          </div>
        )}
        {_.map(
          ({
            _id,
            checked,
            count,
            value,
            lookup
          }: any) => (
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <React.Fragment key={`${_id}-${checked ? 'checked' : 'unchecked'}`}>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <UIComponents.CheckBox
                layout={layout}
                checked={checked}
                textMiddle={display(_.isString(value) ? value : { ...value, ...lookup, _id }, null, overrideData)}
                textRight={count}
                {...(onChange
                  ? {
                      onChange: (checked: any) => {
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
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      </div>
    </UIComponents.CardBody>
  );
}

export default Facet
