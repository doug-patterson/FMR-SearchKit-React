import React, { ReactNode } from 'react'
import _ from 'lodash/fp'
import {
  ButtonProps,
  CheckBoxProps,
  GridProps,
  InputProps,
  NavItemProps,
  NavProps,
  SelectProps
} from './types'
//import { Line } from '@nivo/line'
//import { Calendar } from '@nivo/calendar'
//import { Pie } from '@nivo/pie'

export const Box = ({ children, ...props }: { children: ReactNode }) => (
  <div className="fmr-box" {...props}>
    {children}
  </div>
)

export const Grid = ({
  children,
  rows,
  columns,
  areas,
  gap,
  ...props
}: GridProps) => (
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

export const Button = ({ onClick, children, ...props }: ButtonProps) => (
  <button className="fmr-button" onClick={onClick} {...props}>
    {children}
  </button>
)
export const SubmitButton = ({ children, ...props }: ButtonProps) => (
  <button className="fmr-button-submit" type="submit" {...props}>
    {children}
  </button>
)

export const Select = ({
  value,
  options,
  onChange,
  name,
  ...props
}: SelectProps) => (
  <select
    className="fmr-select"
    {...(onChange
      ? {
          onChange: (e: any) => e && e.target && onChange(e.target.value),
          value
        }
      : {
          name,
          ...(value ? { defaultValue: value } : {})
        })}
    {...props}
  >
    {options.map(option => {
      const label = String(option.label) || String(option)
      const value = String(option.value) || String(option)
      return (
        <option key={label} value={value}>
          {label}
        </option>
      )
    })}
  </select>
)

export const Input = ({
  type,
  value,
  placeholder,
  name,
  ...props
}: InputProps) => (
  <input
    className="fmr-input"
    name={name}
    placeholder={placeholder}
    value={value}
    type={type}
    {...props}
  />
)

export const CheckBox = ({ checked, label, name = '' }: CheckBoxProps) => {
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

export const Nav = ({ children, direction, ...props }: NavProps) => (
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
export const NavItem = ({ label, onClick, icon }: NavItemProps) => (
  <div onClick={onClick}>
    {icon}
    {label}
  </div>
)

export const Table = ({ children, ...props }: { children: ReactNode }) => (
  <table className="fmr-table" {...props}>
    {children}
  </table>
)
export const TableHeader = ({
  children,
  ...props
}: {
  children: ReactNode
}) => <thead {...props}>{children}</thead>
export const TableBody = ({ children, ...props }: { children: ReactNode }) => (
  <tbody {...props}>{children}</tbody>
)
export const TableRow = ({ children, ...props }: { children: ReactNode }) => (
  <tr {...props}>{children}</tr>
)
export const TableCell = ({ children, ...props }: { children: ReactNode }) => (
  <td {...props}>{children}</td>
)

export const Card = ({ children, ...props }: { children: ReactNode }) => (
  <div className="fmr-card" {...props}>
    {children}
  </div>
)
export const CardHeader = ({ children, ...props }: { children: ReactNode }) => (
  <div className="fmr-card-header" {...props}>
    {children}
  </div>
)
export const CardBody = ({
  children,
  className = '',
  ...props
}: {
  children: ReactNode
  className: string
}) => (
  <div className={`fmr-card-body ${className}`} {...props}>
    {children}
  </div>
)
export const CardFooter = ({ children, ...props }: { children: ReactNode }) => (
  <div className="fmr-card-footer" {...props}>
    {children}
  </div>
)

export const IconBack = () => <span>&#171;</span>
export const IconForward = () => <span>&#187;</span>
export const IconPrevious = () => <span>&#8249;</span>
export const IconNext = () => <span>&#8250;</span>
