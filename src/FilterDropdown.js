'use client'

import React from 'react'
import _ from 'lodash/fp'
import useOutsideClick from './hooks/useOutsideClick'

export const FilterDropdown = ({ title, children }) => {
  const ref = React.useRef()
  const [isOpen, setIsOpen] = React.useState(open)
  useOutsideClick(ref, () => setIsOpen(false))

  return (
    <div
      className={`fmr-menu${open ? ' open' : ''}`}
      style={{ position: 'relative' }}
    >
      <div onClick={() => setIsOpen(!isOpen)} className="fmr-menu-label">
        {title}
      </div>
      {isOpen && <>{children}</>}
    </div>
  )
}
