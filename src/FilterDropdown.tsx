'use client'

import React, { ReactNode } from 'react'
import _ from 'lodash/fp'
import ChevronDown from './Icons/ChevronDown'
import useOutsideClick from './hooks/useOutsideClick'

type Props = {
  children: ReactNode
  filterKey: string
  onlyOneFilterOpenAtAtime: boolean
}

export const FilterDropdown = ({
  filterKey,
  children,
  onlyOneFilterOpenAtAtime
}: Props) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const ref = React.useRef(null)

  useOutsideClick(ref, () =>
    onlyOneFilterOpenAtAtime ? setIsOpen(false) : null
  )

  return (
    <div ref={ref} className="fmr-filter-dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
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
