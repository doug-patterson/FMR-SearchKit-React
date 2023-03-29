import {
  ButtonHTMLAttributes,
  CSSProperties,
  InputHTMLAttributes,
  OptionHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes
} from 'react'

export interface CheckBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  textMiddle?: string
  textRight?: string
  layout?: string
  label?: string
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  focus: boolean
}

export interface GridProps {
  children: ReactNode
  rows: CSSProperties['gridTemplateRows']
  columns: CSSProperties['gridTemplateColumns']
  areas: CSSProperties['gridTemplateAreas']
  gap: CSSProperties['gap']
  style: CSSProperties
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: OptionHTMLAttributes<HTMLOptionElement>[]
}

export interface NavProps {
  children: ReactNode
  direction: CSSProperties['flexDirection']
}

export interface NavItemProps {
  label: string
  onClick: () => void
  icon: JSX.Element
}
