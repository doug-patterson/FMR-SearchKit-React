'use client'

import React from 'react'
import _ from 'lodash/fp'
import ChevronDown from './Icons/ChevronDown'

export const FilterDropdown = ({ filterKey, children, openFilters, openMode }) => {
  const [isOpen, setIsOpen] = React.useState(
    _.includes(filterKey, openFilters.current)
  )

  const handleToggle = close => {
    let newOpenState = close === 'close' ? false : !isOpen
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
        <div className="fmr-filter-dropdown__outer">
          <div className="fmr-filter-dropdown__inner">{children}</div>
        </div>
      )}
    </div>
  )
}
