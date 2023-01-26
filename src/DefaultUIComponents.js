import React from 'react'
import _ from 'lodash/fp'
//import { Line } from '@nivo/line'
//import { Calendar } from '@nivo/calendar'
//import { Pie } from '@nivo/pie'

export const Box = ({ children, ...props }) => (
  <div className="fmr-box" {...props}>
    {children}
  </div>
)

export const Grid = ({ children, rows, columns, areas, gap, ...props }) => (
  <div
    className="fmr-grid"
    {...props}
    style={{
      gridTemplateAreas: areas,
      gridTemplateRows: rows,
      gridTemplateColumns: columns,
      ...(gap ? { columnGap: gap, rowGap: gap } : {}),
      ...props.style,
      display: 'grid'
    }}
  >
    {children}
  </div>
)

export const Button = ({ onClick, children, ...props }) => (
  <button className="fmr-button" onClick={onClick} {...props}>
    {children}
  </button>
)
export const SubmitButton = ({ children, ...props }) => (
  <button className="fmr-button-submit" type="submit" {...props}>
    {children}
  </button>
)

export const Select = ({ value, options, onChange, name, ...props }) => (
  <select
    className="fmr-select"
    {...(onChange
      ? {
          onChange: e => e && e.target && onChange(e.target.value),
          value
        }
      : {
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

export const Input = ({ type, value, placeholder, name, ...props }) => (
  <input
    className="fmr-input"
    name={name}
    placeholder={placeholder}
    value={value}
    type={type}
    {...props}
  />
)

export const CheckBox = ({ checked, label, name = '' }) => {
  const id = _.uniqueId('fmr-checkbox-')

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

export const Nav = ({ children, direction, ...props }) => (
  <nav
    className="fmr-nav"
    style={{
      display: 'flex',
      flexDirection: direction === 'row' ? 'row' : 'column'
    }}
    {...props}
  >
    {children}
  </nav>
)
export const NavItem = ({ label, onClick, icon }) => (
  <div onClick={onClick}>
    {icon}
    {label}
  </div>
)

export const Table = ({ children, ...props }) => (
  <table className="fmr-table" {...props}>
    {children}
  </table>
)
export const TableHeader = ({ children, ...props }) => (
  <thead {...props}>{children}</thead>
)
export const TableBody = ({ children, ...props }) => (
  <tbody {...props}>{children}</tbody>
)
export const TableRow = ({ children, ...props }) => (
  <tr {...props}>{children}</tr>
)
export const TableCell = ({ children, ...props }) => (
  <td {...props}>{children}</td>
)

export const Card = ({ children, ...props }) => (
  <div className="fmr-card" {...props}>
    {children}
  </div>
)
export const CardHeader = ({ children, ...props }) => (
  <div className="fmr-card-header" {...props}>
    {children}
  </div>
)
export const CardBody = ({ children, ...props }) => (
  <div className="fmr-card-body" {...props}>
    {children}
  </div>
)
export const CardFooter = ({ children, ...props }) => (
  <div className="fmr-card-footer" {...props}>
    {children}
  </div>
)

export const IconBack = () => <span style={{ fontSize: '1.5rem' }}>&#171;</span>
export const IconForward = () => (
  <span style={{ fontSize: '1.5rem' }}>&#187;</span>
)
export const IconPrevious = () => (
  <span style={{ fontSize: '1.5rem' }}>&#8249;</span>
)
export const IconNext = () => (
  <span style={{ fontSize: '1.5rem' }}>&#8250;</span>
)

export const GroupedTotals = ({ data }) => JSON.stringify(data, 0, 2)
