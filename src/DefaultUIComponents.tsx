// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from 'lodash/fp'
//import { Line } from '@nivo/line'
//import { Calendar } from '@nivo/calendar'
//import { Pie } from '@nivo/pie'

export const Box = ({
  children,
  ...props
}: any) => (
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  <div className="fmr-box" {...props}>
    {children}
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  </div>
)

export const Grid = ({
  children,
  rows,
  columns,
  areas,
  gap,
  ...props
}: any) => (
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
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
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  </div>
)

export const Button = ({
  onClick,
  children,
  ...props
}: any) => (
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  <button className="fmr-button" onClick={onClick} {...props}>
    {children}
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  </button>
)
export const SubmitButton = ({
  children,
  ...props
}: any) => (
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  <button className="fmr-button-submit" type="submit" {...props}>
    {children}
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  </button>
)

export const Select = ({
  value,
  options,
  onChange,
  name,
  ...props
}: any) => (
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
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
    {_.map(
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      (option: any) => <option key={option.label || option} value={option.value || option}>
        {option.label || option}
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      </option>,
      options
    )}
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  </select>
)

export const Input = ({
  type,
  value,
  placeholder,
  name,
  ...props
}: any) => (
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  <input
    className="fmr-input"
    name={name}
    placeholder={placeholder}
    value={value}
    type={type}
    {...props}
  />
)

export const CheckBox = ({
  checked,
  label,
  name = ''
}: any) => {
  const id = _.uniqueId('fmr-checkbox-')

  return (
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <>
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <input
        type="checkbox"
        defaultChecked={checked}
        id={id}
        className="fmr-checkbox"
        name={name}
      />
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <label htmlFor={id}>{label}</label>
    </>
  )
}

export const Nav = ({
  children,
  direction,
  ...props
}: any) => (
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  <nav
    className="fmr-nav"
    style={{
      display: 'flex',
      flexDirection: direction === 'row' ? 'row' : 'column'
    }}
    {...props}
  >
    {children}
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  </nav>
)
export const NavItem = ({
  label,
  onClick,
  icon
}: any) => (
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  <div onClick={onClick}>
    {icon}
    {label}
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  </div>
)

export const Table = ({
  children,
  ...props
}: any) => (
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  <table className="fmr-table" {...props}>
    {children}
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  </table>
)
export const TableHeader = ({
  children,
  ...props
}: any) => (
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  <thead {...props}>{children}</thead>
)
export const TableBody = ({
  children,
  ...props
}: any) => (
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  <tbody {...props}>{children}</tbody>
)
export const TableRow = ({
  children,
  ...props
}: any) => (
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  <tr {...props}>{children}</tr>
)
export const TableCell = ({
  children,
  ...props
}: any) => (
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  <td {...props}>{children}</td>
)

export const Card = ({
  children,
  ...props
}: any) => (
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  <div className="fmr-card" {...props}>
    {children}
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  </div>
)
export const CardHeader = ({
  children,
  ...props
}: any) => (
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  <div className="fmr-card-header" {...props}>
    {children}
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  </div>
)
export const CardBody = ({
  children,
  className = '',
  ...props
}: any) => (
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  <div className={`fmr-card-body ${className}`} {...props}>
    {children}
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  </div>
)
export const CardFooter = ({
  children,
  ...props
}: any) => (
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  <div className="fmr-card-footer" {...props}>
    {children}
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  </div>
)

// @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
export const IconBack = () => <span>&#171;</span>
export const IconForward = () => (
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  <span>&#187;</span>
)
export const IconPrevious = () => (
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  <span>&#8249;</span>
)
export const IconNext = () => (
  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
  <span>&#8250;</span>
)
