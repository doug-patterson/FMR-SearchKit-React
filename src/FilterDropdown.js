'use client'

import React from 'react'
import _ from 'lodash/fp'
import useOutsideClick from './hooks/useOutsideClick'

export const FilterDropdown = ({ filterKey, children, openFilters }) => {
  const ref = React.useRef()
  const [isOpen, setIsOpen] = React.useState(_.includes(filterKey, openFilters.current))
  useOutsideClick(ref, () => setIsOpen(false))

  const handleToggle = () => {
    let newOpenState = !isOpen
    openFilters.current = newOpenState ? _.flow(_.concat(filterKey), _.uniq)(openFilters.current) : _.without([filterKey], openFilters.current)
    setIsOpen(newOpenState)
  }

  return (
    <div
      className={`fmr-menu${open ? ' open' : ''}`}
      style={{ position: 'relative' }}
    >
      <div onClick={handleToggle} className="fmr-menu-label">
        {_.startCase(filterKey)}
      </div>
      {isOpen && <>{children}</>}
    </div>
  )
}
