import { BarDatum, BarSvgProps } from '@nivo/bar'
import { CalendarSvgProps } from '@nivo/calendar'
import { LineSvgProps } from '@nivo/line'
import { DefaultRawDatum, PieSvgProps } from '@nivo/pie'
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

type SchemaProperty = any // there are some commonalities - fill this in

export interface Schema {
  bsonType: string
  additionalProperties?: boolean
  properties: { [key: string]: SchemaProperty }
}

interface SearchNode {
  type: string
  key: string
  field: string
}

interface BooleanFilterSearchNode extends SearchNode {
  type: 'boolean'
  checked?: boolean
  hide?: boolean
}

interface FieldHasTruthyValueSearchNode extends SearchNode {
  type: 'fieldHasTruthyValue'
  checked: boolean
  negate: boolean
}
interface PropExistsSearchNode extends SearchNode {
  type: 'propExists'
  negate: boolean
}

type FacetValue = string | number

interface BaseFacetSearchNode {
  values?: FacetValue[]
  idPath?: string
  isMongoId?: boolean
  hide?: boolean
  optionSearch?: string
  exclude?: boolean
  include?: string[]
}

interface FacetFilterSearchNode extends BaseFacetSearchNode {
  type: 'facet'
}

interface ArrayElementPropFacetSearchNode extends BaseFacetSearchNode {
  type: 'arrayElementPropFacet'
  prop: string
}

interface SubqueryFacetSearchNode extends BaseFacetSearchNode {
  type: 'subqueryFacet'
  subqueryCollection: string
  subqueryKey: string
  optionsAreMongoIds: boolean
  subqueryField: string
  subqueryIdPath: string
  subqueryFieldIsArray: boolean
  subqueryLocalField: string
  subqueryLocalIdPath: string
}

interface DateTimeIntervalSearchNode extends SearchNode {
  type: 'dateTimeInterval'
  from: Date | null
  to: Date | null
  interval: string
  offset: number
}

interface NumericFilterSearchNode extends SearchNode {
  type: 'numeric'
  from: number | null
  to: number | null
}

interface ArraySizeSearchNode extends SearchNode {
  type: 'arraySize'
  from: number | null
  to: number | null
}

export type Filter =
  | BooleanFilterSearchNode
  | FieldHasTruthyValueSearchNode
  | PropExistsSearchNode
  | FacetFilterSearchNode
  | ArrayElementPropFacetSearchNode
  | SubqueryFacetSearchNode
  | DateTimeIntervalSearchNode
  | NumericFilterSearchNode
  | ArraySizeSearchNode

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
  id: string
  collection: string
  filters?: Filter[]
  pageSize?: number
  page?: number
  include?: string[]
  omitFromResults?: string[]
  charts: Chart[]
  lookup: {
    [key: string]: ResultsLookup
  }
}

type ChartResults = any

export interface FacetOption {
  _id: string
  count: number
  checked: boolean
  value: string | number | { [key: string]: string | number }
  lookup?: Record<string, ResultsLookup>
}

type FacetOptions = FacetOption[]

export interface FacetProps {
  title: string
  options: FacetOptions
  values?: FacetValue[]
  onChange?: ({ values }: { values: FacetValue[] }) => void
  debouncedOnChange: ({ optionSearch }: { optionSearch?: any }) => void
  display?: any
  UIComponents?: any
  layout?: string
  hasOptionSearch: boolean
  overrideData?: any
}

// right now Facet is the only Filter type that has results
type FilterResults = FacetOptions

type ResultsCount = { _id: null; count: number }

type Results = any[]

interface SchemaPropOverride {
  label: string
  display: string
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

export interface SearchLayoutProps {
  initialSearch: Search
  initialResults: SearchResponse | null
  children?: JSX.Element[]
  UIComponents?: any
  schemas: { [id: string]: Schema }
  execute: (search: Search) => Promise<[SearchResponse, Search]>
  layoutStyle?: any
  filterLayout?: string
  onlyOneFilterOpenAtATime?: boolean
  FilterWrapper?: any
  mode?: string
  onData?: any
  // this can be anything - to be passed in from the consuming project for use
  // in override display functions
  overrideData?: any
}

export interface SearchLayoutInit {
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
  constraints?: SearchConstraints
  isPage?: boolean
  runInitialSearch?: (search: Search) => Promise<SearchResponse>
  SearchLayout: (props: SearchLayoutProps) => JSX.Element
  execute: (search: Search) => Promise<[SearchResponse, Search]>
  FeathersSearchClientRenderer: any
}

// this will need to wait for Feathers 5
export type FeathersClientObject = any

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

export interface MenuProps {
  label: string
  open: boolean
  onClick: (func: () => void) => React.SetStateAction<boolean>
  items: MenuProps[]
}

export interface BarProps extends BarSvgProps<BarDatum> {
  includeLegends?: boolean
  currency?: string
  isCurrency?: boolean
  group?: string
  axisBottom?: {
    tickFirstCharOnly: boolean
  } & BarSvgProps<BarDatum>['axisBottom']
}

// TODO: investigate the field types here:
export interface PieProps extends PieSvgProps<DefaultRawDatum> {
  chartKey: string
  field: string
  schema: string
  legend: string
}

export interface CalendarProps extends CalendarSvgProps {
  isCurrency?: boolean
  margins?: {
    top: number
    right: number
    bottom: number
    left: number
  }
}

export interface DateLineProps extends LineSvgProps {
  isCurrency?: boolean
  currency?: string
  height?: number
  includeLegends?: boolean
  group?: string
}

export interface DateLineByPeriodProps extends DateLineProps {
  period: string
  axisBottom: {
    formatDate?: boolean
  } & DateLineProps['axisBottom']
}

export interface DateLineHourOfDaySummaryProps extends DateLineProps {
  axisBottom: {
    showOnlyEvenHours?: boolean
  } & DateLineProps['axisBottom']
}
