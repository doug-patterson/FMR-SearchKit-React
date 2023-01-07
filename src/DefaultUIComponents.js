import React from 'react'
import _ from 'lodash/fp'
//import { Line } from '@nivo/line'
//import { Calendar } from '@nivo/calendar'
//import { Pie } from '@nivo/pie'
import useOutsideClick from './hooks/useOutsideClick'

export let Box = ({ children, ...props }) => (
  <div className="fmr-box" {...props}>
    {children}
  </div>
)

export let Grid = ({ children, rows, columns, areas, gap, ...props }) => (
  <div
    className="fmr-grid"
    {...props}
    style={{
      gridTemplateAreas: areas,
      gridTemplateRows: rows,
      gridTemplateColumns: columns,
      ...(gap ? { columnGap: gap, rowGap: gap } : {}),
      ...props.style,
      display: 'grid',
    }}
  >
    {children}
  </div>
)

export let Button = ({ onClick, children, ...props }) => (
  <button className="fmr-button" onClick={onClick} {...props}>
    {children}
  </button>
)
export let SubmitButton = ({ children, ...props }) => (
  <button className="fmr-button-submit" type="submit" {...props}>
    {children}
  </button>
)

export let Select = ({ value, options, onChange, name, ...props }) => (
  <select
    className="fmr-select"
    {...(onChange ? {
      onChange: e => e && e.target && onChange(e.target.value),
      value
    } : {
      name,
      ...(value ? { defaultValue: value } : {})
    })}
    {...props}
  >
    {_.map(
      option => (
        <option key={option.label || option} value={option.value || option}>
          {option.label || option}
        </option>
      ),
      options
    )}
  </select>
)

export let Input = ({ type, value, placeholder, name, ...props }) => (
  <input
    className="fmr-input"
    name={name}
    placeholder={placeholder}
    value={value}
    type={type}
    {...props}
  />
)

export let CheckBox = ({ checked, label, name = ''}) => {
  let id = _.uniqueId('fmr-checkbox-')

  return (
    <>
      <input
        type="checkbox"
        defaultChecked={checked}
        id={id}
        className="fmr-checkbox"
        name={name}
      />
      <label htmlFor={id}>{label}</label>
    </>
  )
}

export let Menu = ({ label, open, items }) => {
  let ref = React.useRef()
  let [isOpen, setIsOpen] = React.useState(open)
  useOutsideClick(ref, () => setIsOpen(false))

  return (
    <div
      className={`fmr-menu${open ? ' open' : ''}`}
      style={{ position: 'relative' }}
    >
      <div onClick={() => setIsOpen(!isOpen)} className="fmr-menu-label">
        {label}
      </div>
      {isOpen && (
        <div
          ref={ref}
          className="fmr-sort"
          style={{
            position: 'absolute',
          }}
        >
          {_.map(
            item => (
              <button
                key={item.label}
                onClick={_.over([item.onClick, () => setIsOpen(false)])}
                className="fmr-sort-button"
              >
                {item.label}
              </button>
            ),
            items
          )}
        </div>
      )}
    </div>
  )
}

export let Nav = ({ children, direction, ...props }) => (
  <nav
    className="fmr-nav"
    style={{
      display: 'flex',
      flexDirection: direction === 'row' ? 'row' : 'column',
    }}
    {...props}
  >
    {children}
  </nav>
)
export let NavItem = ({ label, onClick, icon }) => (
  <div onClick={onClick}>
    {icon}
    {label}
  </div>
)

export let Table = ({ children, ...props }) => (
  <table className="fmr-table" {...props}>
    {children}
  </table>
)
export let TableHeader = ({ children, ...props }) => (
  <thead {...props}>{children}</thead>
)
export let TableBody = ({ children, ...props }) => (
  <tbody {...props}>{children}</tbody>
)
export let TableRow = ({ children, ...props }) => <tr {...props}>{children}</tr>
export let TableCell = ({ children, ...props }) => (
  <td {...props}>{children}</td>
)

export let Card = ({ children, ...props }) => (
  <div className="fmr-card" {...props}>
    {children}
  </div>
)
export let CardHeader = ({ children, ...props }) => (
  <div className="fmr-card-header" {...props}>
    {children}
  </div>
)
export let CardBody = ({ children, ...props }) => (
  <div className="fmr-card-body" {...props}>
    {children}
  </div>
)
export let CardFooter = ({ children, ...props }) => (
  <div className="fmr-card-footer" {...props}>
    {children}
  </div>
)

export let IconBack = () => <span style={{ fontSize: '1.5rem' }}>&#171;</span>
export let IconForward = () => (
  <span style={{ fontSize: '1.5rem' }}>&#187;</span>
)
export let IconPrevious = () => (
  <span style={{ fontSize: '1.5rem' }}>&#8249;</span>
)
export let IconNext = () => <span style={{ fontSize: '1.5rem' }}>&#8250;</span>

export let SummaryTable = ({ data, isCurrency }) => {
  let rows = _.first(data)
  
  return <dl className="fmr-searchkit-summary-table" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
    {_.map(label => <>
      <dt style={{ fontWeight: 'bold' }}>{_.startCase(label)}</dt>
      <dd style={{ textAlign: 'right' }}>{isCurrency ? `$${rows[label] / 100}`  : rows[label]}</dd>
    </>, _.keys(rows))}
  </dl>
} 

export let GroupedTotals = ({ data }) => JSON.stringify(data, 0, 2)

