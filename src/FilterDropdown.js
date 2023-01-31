'use client'

import React from 'react'
import _ from 'lodash/fp'
import useOutsideClick from './hooks/useOutsideClick'
import ChevronDown from './Icons/ChevronDown'

export const FilterDropdown = ({ filterKey, children, openFilters }) => {
  const ref = React.useRef()
  const [isOpen, setIsOpen] = React.useState(
    _.includes(filterKey, openFilters.current)
  )
  useOutsideClick(ref, () => setIsOpen(false))

  const handleToggle = () => {
    let newOpenState = !isOpen
    openFilters.current = newOpenState
      ? _.flow(_.concat(filterKey), _.uniq)(openFilters.current)
      : _.without([filterKey], openFilters.current)
    setIsOpen(newOpenState)
  }

  return (
    <div className="fmr-filter-dropdown">
      <button
        onClick={handleToggle}
        className="fmr-filter-dropdown__button"
        ref={ref}
      >
        <span className="fmr-filter-dropdown__label">
          {_.startCase(filterKey)}
        </span>
        <ChevronDown
          className={`fmr-filter-dropdown__chevron ${
            isOpen ? 'fmr-filter-dropdown__chevron--open' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="fmr-filter-dropdown__outer" ref={ref}>
          <div className="fmr-filter-dropdown__inner">{children}</div>
        </div>
      )}
    </div>
  )
}
