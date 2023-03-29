import { InputHTMLAttributes } from 'react'

export interface CheckBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  textMiddle?: string
  textRight?: string
  layout?: string
  label?: string
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  focus: boolean
}

export interface Schema {

}

type FacetValue = string | number

// temporary: this should be a disjunction of stricter types for the individual
// filters
interface Filter {
  key: string
  type: string
  field: string
  idPath?: string
  label?: string
  values?: FacetValue[]
  checked?: boolean
  from?: Date
  to?: Date
  interval?: string
  isMongoId?: boolean
  offset?: number
  optionSearch?: string
  include?: string[]
  subqueryCollection?: string
  subqueryKey?: string
  optionsAreMongoIds?: boolean
  subqueryField?: string
  subqueryIdPath?: string
  subqueryFieldIsArray?: boolean
  subqueryLocalField?: string
  subqueryLocalIdPath?: string
}

interface TotalsBarColumn {
  key: string
  field: string
  label: string
  agg: string
}

interface SalesTableRow {
  key: string
  field?: string
  agg?: string
  header?: boolean
  subItem?: boolean
  unwind?: boolean
  hide?: boolean
  negative?: boolean
  
}

// should be a disjunction of interfaces for the particular charts
interface Chart {
  key: string
  type: string
  currency?: string
  hideLabel?: boolean
  columns?: TotalsBarColumn[]
  rows?: SalesTableRow[]
}

interface ResultsLookup {
  from: string
  localField: string
  foreignField: string
  as: string
  unwind: boolean
  include: string[]
}

export interface Search {
  id: string,
  collection: string
  filters?: Filter[]
  pageSize?: number
  page?: number
  omitFromResults?: string[]
  charts: Chart[]
  lookup: {
    [key: string]: ResultsLookup
  }
}

type ChartResults = any

interface FacetOption {
  _id: string
  count: number
  checked: boolean
  value: string | number | { [key: string]: string | number }
}

type FacetOptions = FacetOption[]

// right now Facet is the only Filter type that has results
type FilterResults = FacetOptions

type ResultsCount = { _id: null, count: number }

type Results = any[]

interface SchemaPropOverride {
  label: string,
  display: string,
  properties: {
    [key: string]: SchemaPropOverride
  }
}

interface SchemaOverride {
  properties: {
    [key: string]: SchemaPropOverride
  }
}

export interface SchemaOverrides {
  [key: string]: SchemaOverride
}

export interface SearchResponse {
  results: Results
  resultsCount: ResultsCount
  charts: ChartResults
  // we should eventually put filter data on a `filters` key so we don't have to do this
  [key: string]: FilterResults | Results | ResultsCount | ChartResults
}

type SearchConstraint = (search: Search) => Search
type SearchConstraints = {
  [id: string]: SearchConstraint[]
}

export interface ClientRendererInit {
  initialSearch: Search
  schemas: { [key: string]: Schema }
  overrides?: SchemaOverrides
  defaultOverrides?: SchemaOverrides
  UIComponents?: any
  clientOnly?: boolean
  mode?: string
  getApp: any
  getSchemas: any
  useRouter: any
  collapseableFilters?: boolean
  constraints: SearchConstraints
}
