'use client'

// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from 'lodash/fp'
// @ts-expect-error TS(6142): Module './Icons/ChevronDown' was resolved to '/Use... Remove this comment to see the full error message
import ChevronDown from './Icons/ChevronDown'
import useOutsideClick from './hooks/useOutsideClick'

export const FilterDropdown = ({
  filterKey,
  children,
  onlyOneFilterOpenAtAtime
}: any) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const ref = React.useRef()

  useOutsideClick(ref, () =>
    onlyOneFilterOpenAtAtime ? setIsOpen(false) : null
  )

  return (
    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div ref={ref} className="fmr-filter-dropdown">
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fmr-filter-dropdown__button"
      >
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <span className="fmr-filter-dropdown__label">
          {_.startCase(filterKey)}
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </span>
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <ChevronDown
          className={`fmr-filter-dropdown__chevron ${
            isOpen ? 'fmr-filter-dropdown__chevron--open' : ''
          }`}
        />
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      </button>
      {isOpen && (
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div className="fmr-filter-dropdown__outer">
          // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          <div className="fmr-filter-dropdown__inner">{children}</div>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </div>
      )}
    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    </div>
  )
}
