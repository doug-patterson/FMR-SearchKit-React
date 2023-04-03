'use client'

import React from 'react'
import _ from 'lodash/fp'
import useOutsideClick from './hooks/useOutsideClick'
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveCalendar } from '@nivo/calendar'
import { ResponsivePie } from '@nivo/pie'
import { ResponsiveBar } from '@nivo/bar'
import { formatCurrency } from './util'
import { parse, format, addDays, addWeeks, addMonths } from 'date-fns'
import {
  BarProps,
  CalendarProps,
  CheckBoxProps,
  DateLineByPeriodProps,
  DateLineHourOfDaySummaryProps,
  DateLineProps,
  InputProps,
  MenuProps,
  PieProps
} from './types'

const americanDate = _.flow(
  _.split('/'),
  (values: any) => (_.size(values) < 3 ? [values[0], '', values[1]] : values),
  ([day, month, year]) =>
    `${month || ''}${month ? '/' : ''}${day || ''}${day ? '/' : ''}${year}`
)

const americanDates = _.map(({ id, data }: any) => ({
  id,
  data: _.map(({ x, y }: any) => ({ x: americanDate(x), y }), data)
}))

export const Menu = ({ label, open, items }: MenuProps) => {
  const ref = React.useRef(null)
  const [isOpen, setIsOpen] = React.useState(open)
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
            position: 'absolute'
          }}
        >
          {_.map(item => {
            const label = String(item.label)
            const onClick = () => item.onClick(() => setIsOpen(false))
            return (
              <button key={label} onClick={onClick} className="fmr-sort-button">
                {label}
              </button>
            )
          }, items)}
        </div>
      )}
    </div>
  )
}

export const CheckBox = ({
  checked,
  onChange,
  textMiddle,
  textRight,
  layout
}: CheckBoxProps) => {
  const isRowLayout = layout === 'row'
  return (
    <label
      className={`fmr-checkbox fmr-checkbox--${isRowLayout ? 'row' : 'column'}`}
    >
      <input
        type="checkbox"
        checked={checked}
        className={`fmr-checkbox__input fmr-checkbox__input--${
          isRowLayout ? 'row' : 'column'
        }`}
        {...(onChange
          ? { onChange: (e: any) => e.target && onChange(e.target.checked) }
          : {})}
      />
      {textMiddle && (
        <span
          className={`fmr-checkbox__text-middle fmr-checkbox__text-middle--${
            isRowLayout ? 'row' : 'column'
          }`}
        >
          {textMiddle}
        </span>
      )}
      {textRight && (
        <span
          className={`fmr-checkbox__text-right fmr-checkbox__text-right--${
            isRowLayout ? 'row' : 'column'
          }`}
        >
          {textRight}
        </span>
      )}
    </label>
  )
}

export const Input = ({
  type,
  value,
  placeholder,
  onChange,
  focus,
  ...props
}: InputProps) => {
  const inputEl = React.createRef<HTMLInputElement>()

  React.useEffect(() => {
    if (focus) {
      inputEl.current?.focus()
    }
  }, [focus, inputEl])

  return (
    <input
      className="fmr-input"
      ref={inputEl}
      {...(onChange
        ? { onChange: (e: any) => e.target && onChange(e.target.checked) }
        : {})}
      placeholder={placeholder}
      value={value}
      type={type}
      {...props}
    />
  )
}

let getPeriodAdder = (period: string) =>
  ({
    day: (date: any) => addDays(date, 1),
    week: (date: any) => addWeeks(date, 1),
    month: (date: any) => addMonths(date, 1)
  }[period])

let getDateFormatString = (period: string) =>
  period === 'month' ? 'M/yyyy' : 'd/M/yyyy'

let getInterveningPoints = ({ period, previous, point }: any) => {
  let addPeriod = getPeriodAdder(period)

  let dateFormatString = getDateFormatString(period)
  let previousDate = parse(previous.x, dateFormatString, new Date())
  let pointDate = parse(point.x, dateFormatString, new Date())

  let interveningDates = []

  let nextDate = addPeriod(previousDate)

  while (nextDate < pointDate) {
    interveningDates.push(nextDate)
    nextDate = addPeriod(nextDate)
  }

  return _.map(
    (date: any) => ({
      x: format(date, dateFormatString),
      y: 0
    }),
    interveningDates
  )
}

const addZeroPeriods = (period: any) =>
  _.reduce((acc: any, point: any) => {
    let previous = _.last(acc)
    if (!previous) {
      acc.push(point)
    } else {
      acc.push(...getInterveningPoints({ period, previous, point }), point)
    }

    return acc
  }, [])

const firstXValue = _.flow(_.get('data'), _.first, _.get('x'))
const lastXValue = _.flow(_.get('data'), _.last, _.get('x'))

const extendEndpoints =
  ({ start, end, period }: any) =>
  (line: any) => {
    let extendedLine = line
    let dateFormatString = getDateFormatString(period)

    start = parse(start, dateFormatString, new Date())
    end = parse(end, dateFormatString, new Date())

    if (
      _.flow(_.first, _.get('x'), (date: any) =>
        parse(date, dateFormatString, new Date())
      )(line) > start
    ) {
      extendedLine = [
        { x: format(start, dateFormatString, {}), y: 0 },
        ...extendedLine
      ]
    }
    if (
      _.flow(_.last, _.get('x'), (date: any) =>
        parse(date, dateFormatString, new Date())
      )(line) < end
    ) {
      extendedLine = [
        ...extendedLine,
        { x: format(end, dateFormatString, {}), y: 0 }
      ]
    }

    return extendedLine
  }

const addZeroPeriodsToAllLines = (period: any) => (lines: any) => {
  let start = _.flow(_.minBy(firstXValue), firstXValue)(lines)
  let end = _.flow(_.maxBy(lastXValue), lastXValue)(lines)

  return _.map(
    ({ id, data }: any) => ({
      id,
      data: _.flow(
        extendEndpoints({ start, end, period }),
        addZeroPeriods(period)
      )(data)
    }),
    lines
  )
}

const monthDayYear = _.flow(_.split('/'), _.size, _.eq(3))
const monthYearOnly = _.flow(_.split('/'), _.size, _.eq(2))

const formatAxisBottomDate = ({ date = '', start = '', end = '' }) => {
  if (monthDayYear(date)) {
    const day = format(new Date(date), 'd')
    if (start === date) return format(new Date(start), 'MMM d')
    if (end === date) return format(new Date(end), 'MMM d')
    if (day === '1') return format(new Date(date), 'MMM d')
    return day
  }
  if (monthYearOnly(date)) {
    const [month, year] = _.split('/', date)
    return format(new Date(+year, +month - 1, 1), 'MMM yyyy')
  }
}

const formatTooltipDate = (date: string) => {
  if (monthDayYear(date)) {
    return format(new Date(date), 'MMM d, yyyy')
  }
  if (monthYearOnly(date)) {
    const [month, year] = _.split('/', date)
    return format(new Date(+year, +month - 1, 1), 'MMM yyyy')
  }
}

// date range
const getFirstDateAndConvertToAmerican = _.flow(firstXValue, americanDate)
const getLastDateAndConvertToAmerican = _.flow(lastXValue, americanDate)

export const DateLineSingle = ({
  data,
  isCurrency,
  height,
  colors,
  currency,
  period,
  margin,
  axisBottom,
  axisLeft
}: DateLineByPeriodProps) => {
  return (
    <ResponsiveLine
      data={_.flow(addZeroPeriodsToAllLines(period), americanDates)(data)}
      curve="linear"
      animate={true}
      {...(height ? { height } : {})}
      colors={colors ? colors : { scheme: 'set2' }}
      margin={{
        top: 50,
        right: 60,
        bottom: 50,
        left: 60,
        ...margin
      }}
      xScale={{ type: 'point' }} // need to figure point v linear somehow
      yScale={{
        type: 'linear',
        min: _.minBy('y', data?.results),
        max: 'auto',
        stacked: true,
        reverse: false
      }}
      enableArea={true}
      enablePoints={false}
      yFormat={(value: any) =>
        isCurrency
          ? formatCurrency({
              amount: value,
              currency,
              minimumFractionDigits: 0
            })
          : value
      }
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        format: value =>
          axisBottom.formatDate
            ? formatAxisBottomDate({
                date: value,
                start: getFirstDateAndConvertToAmerican(_.first(data)),
                end: getLastDateAndConvertToAmerican(_.first(data))
              })
            : value,
        ...axisBottom
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        tickValues: 6,
        format: (value: any) =>
          isCurrency &&
          formatCurrency({ amount: value, currency, minimumFractionDigits: 0 }),
        ...axisLeft
      }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      tooltip={({ point }: any) => {
        return (
          <div className="tooltip-dateline">
            <p className="tooltip-dateline__x">
              {formatTooltipDate(point?.data?.x) || point?.data?.x}
            </p>
            <p className="tooltip-dateline__y">
              {point?.data?.yFormatted || point?.data?.y}
            </p>
          </div>
        )
      }}
    />
  )
}

export const DateLineMultiple = ({
  data,
  isCurrency,
  colors,
  currency,
  height,
  period,
  margin,
  axisBottom,
  axisLeft
}: DateLineByPeriodProps) => (
  <ResponsiveLine
    data={_.flow(
      addZeroPeriodsToAllLines(period),
      americanDates
    )(
      _.map(
        (d: any) => ({
          ...d,
          data: _.map(_.omit('group'), d.data)
        }),
        data
      )
    )}
    curve="linear"
    animate={true}
    height={height}
    colors={colors ? colors : { scheme: 'set2' }}
    margin={{
      top: 50,
      right: 60,
      bottom: 50,
      left: 60,
      ...margin
    }}
    xScale={{ type: 'point' }} // need to figure point v linear somehow
    yScale={{
      type: 'linear',
      min: _.minBy('y', data?.results),
      max: 'auto',
      stacked: true,
      reverse: false
    }}
    enableArea={true}
    enablePoints={false}
    yFormat={(value: any) =>
      isCurrency
        ? formatCurrency({
            amount: value,
            currency,
            minimumFractionDigits: 0
          })
        : value
    }
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      format: (value: any) =>
        axisBottom.formatDate
          ? formatAxisBottomDate({
              date: value,
              start: getFirstDateAndConvertToAmerican(_.first(data)),
              end: getLastDateAndConvertToAmerican(_.first(data))
            })
          : value,
      ...axisBottom
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      tickValues: 6,
      format: (value: any) =>
        isCurrency &&
        formatCurrency({ amount: value, currency, minimumFractionDigits: 0 }),
      ...axisLeft
    }}
    pointSize={10}
    pointColor={{ theme: 'background' }}
    pointBorderWidth={2}
    pointBorderColor={{ from: 'serieColor' }}
    pointLabelYOffset={-12}
    useMesh={true}
    tooltip={({ point }: any) => {
      return (
        <div className="tooltip-dateline">
          <p className="tooltip-dateline__x">
            {formatTooltipDate(point?.data?.x) || point?.data?.x}
          </p>
          <p className="tooltip-dateline__y">
            {point?.data?.yFormatted || point?.data?.y}
          </p>
        </div>
      )
    }}
  />
)

export const DateTimeLine = ({
  data,
  isCurrency,
  colors,
  height,
  currency,
  margin,
  axisBottom,
  axisLeft
}: DateLineProps) => {
  // TODO:
  // The data prop expects the below type, therefore we'll need to modify how we handle
  // currencies. I'll cast it to 'any' for now.
  // interface Serie {
  //   id: string | number
  //   data: Datum[]
  //   [key: string]: any
  // }

  return (
    <ResponsiveLine
      data={
        isCurrency
          ? (formatCurrency({
              amount: data,
              currency,
              minimumFractionDigits: 0
            }) as any)
          : data
      }
      curve="linear"
      animate={true}
      {...(height ? { height } : {})}
      colors={colors ? colors : { scheme: 'paired' }}
      margin={{
        top: 50,
        right: 110,
        bottom: 50,
        left: 60,
        ...margin
      }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: true,
        reverse: false
      }}
      yFormat={(value: any) =>
        isCurrency
          ? formatCurrency({
              amount: value,
              currency,
              minimumFractionDigits: 0
            })
          : value
      }
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -20,
        ...axisBottom
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickValues: 6,
        tickRotation: 0,
        format: (value: any) =>
          isCurrency &&
          formatCurrency({ amount: value, currency, minimumFractionDigits: 0 }),
        ...axisLeft
      }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1
              }
            }
          ]
        }
      ]}
    />
  )
}

const addLeadingZeros = (finishedLength: any) => (str: any) => {
  const zeros = _.join('', _.times(_.constant('0'), finishedLength))
  const fixed = `${zeros}${str}`
  return fixed.substr(0 - finishedLength)
}

const fixDate = (str: any) => {
  const [year, month, day] = _.split('-', str)
  const fixedPieces = [year, addLeadingZeros(2)(month), addLeadingZeros(2)(day)]
  const totallyFixed = _.join('-', fixedPieces)
  return totallyFixed
}

const fixDates = _.map((datum: any) => ({
  ...datum,
  day: fixDate(datum.day)
}))

const americanDate2 = _.flow(
  _.split('-'),
  ([year, month, day]) =>
    `${month || ''}${month ? '/' : ''}${day || ''}${day ? '/' : ''}${year}`
)

// likely the only way to size this correctly is to render each year into its own
// parent with one of these inside of it so that the layout can expand naturally
// with css as years are added. That or we'll have to calculatte the height from the
// number of years, but that may cause more flashing on rerender
export const QuantityByPeriodCalendar = ({
  data,
  isCurrency,
  onClick,
  height,
  colors,
  margins = { top: 20, right: 20, bottom: 20, left: 20 }
}: CalendarProps) => (
  <ResponsiveCalendar
    data={fixDates(data)}
    // @ts-expect-error TS(2322): Type '{ data: any; height: any; from: any; to: any... Remove this comment to see the full error message
    height={height}
    from={_.flow(_.first, _.get('day'))(data)}
    to={_.flow(_.last, _.get('day'))(data)}
    emptyColor="#eeeeee"
    colors={colors ? colors : ['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
    margin={{
      ...margins
    }}
    yearSpacing={40}
    //monthSpacing={10}
    monthBorderColor="#ffffff"
    dayBorderWidth={2}
    // using this you could wire up a click handler to set the dates on a
    // date range filter in a search to startOfDay and endOfDay for the clicked day
    onClick={onClick}
    dayBorderColor="#ffffff"
    tooltip={({ day, value }: any) => (
      <div style={{ backgroundColor: 'white', padding: 4 }}>
        <b>{americanDate2(day)}</b>: {isCurrency ? '$' : ''}
        {isCurrency ? _.toNumber(value).toFixed(2) : value}
      </div>
    )}
  />
)

const uniqueIdMaker = (ids: any) => (label: any) => {
  if (!ids[label]) {
    ids[label] = 1
    return label
  } else {
    ids[label]++
    return `${label} (${_.size(ids[label])})`
  }
}

export const TopNPie = ({
  data,
  field,
  schema,
  legend,
  height,
  chartKey,
  margin
}: PieProps) => {
  const getId = uniqueIdMaker({})

  // TODO
  data = _.map((datum: any) => {
    const display = _.get(
      ['properties', chartKey, 'properties', field, 'display'],
      schema
    )
    const label = display ? display(datum) : datum.label
    const id = getId(label)

    return {
      ..._.omit('lookup', datum),
      id,
      label: id
    }
  }, data)

  return (
    <ResponsivePie
      data={data}
      // @ts-expect-error TS(2322): Type '{ data: any; height: any; margin: any; inner... Remove this comment to see the full error message
      height={height}
      margin={{ top: 50, right: 30, bottom: 50, left: 30, ...margin }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 0.2]]
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: 'color',
        modifiers: [['darker', 2]]
      }}
      legends={
        legend
          ? [
              {
                anchor: 'right',
                direction: 'column',
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 0,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemTextColor: '#000'
                    }
                  }
                ]
              }
            ]
          : []
      }
    />
  )
}

const formatDayAxisBottom = (day: any) => (day ? day.charAt(0) : '')

export const DayOfWeekSummaryBars = ({
  data,
  group,
  isCurrency,
  height,
  colors,
  enableLabel = true,
  label,
  includeLegends = true,
  currency,
  axisBottom,
  axisLeft,
  margin
}: BarProps) => {
  return (
    <ResponsiveBar
      data={data}
      label={label}
      enableLabel={enableLabel}
      height={height}
      layout="vertical"
      indexBy="id"
      animate={true}
      keys={_.flow(_.map(_.keys), _.flatten, _.uniq, _.without(['id']))(data)}
      margin={{
        top: 50,
        right: group ? 130 : 80,
        bottom: 50,
        left: 80,
        ...margin
      }}
      padding={0.3}
      xScale={{ type: 'linear' }}
      colors={colors ? colors : { scheme: 'set2' }}
      // @ts-expect-error TS(2322): Type '(value: number) => string | number' is not a... Remove this comment to see the full error message
      valueFormat={value =>
        isCurrency
          ? formatCurrency({
              amount: value,
              currency,
              minimumFractionDigits: 0
            })
          : value
      }
      borderColor={{
        from: 'color',
        modifiers: [['darker', 1.6]]
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        format: value =>
          axisBottom?.tickFirstCharOnly ? formatDayAxisBottom(value) : value,
        ...axisBottom
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        format: value =>
          isCurrency &&
          formatCurrency({ amount: value, currency, minimumFractionDigits: 0 }),
        ...axisLeft
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: 'color',
        modifiers: [['darker', 1.6]]
      }}
      tooltip={(value: any) => (
        <div className="tooltip-day-of-week-summary-bar">
          <p className="tooltip-day-of-week-summary-bar__x">
            {value?.indexValue || value?.data?.x}
          </p>
          <p className="tooltip-day-of-week-summary-bar__y">
            {value?.formattedValue || value?.data?.y}
          </p>
        </div>
      )}
      {...(group && includeLegends
        ? {
            legends: [
              {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]
          }
        : {})}
    />
  )
}

const addZeroHours = (hours: any) =>
  _.map((x: any) => _.find({ x }, hours) || { x, y: 0 }, _.range(0, 24))

const decorateHour = (hour: any) => {
  if (hour === 0) return '12 am'
  if (hour === 12) return '12 pm'
  return hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`
}

const includeAllHours = _.map(({ id, data }: any) => ({
  id,
  data: addZeroHours(data)
}))

const formatAxisBottomHour = ({ hour, showOnlyEvenHours }: any) => {
  if (showOnlyEvenHours && hour % 2 !== 0) return ''
  if (hour === 0) return '12 am'
  if (hour === 12) return '12 pm'
  return hour < 12 ? `${hour}` : `${hour - 12}`
}

export const HourOfDaySummaryLine = ({
  data,
  isCurrency,
  group,
  height,
  colors,
  includeLegends = true,
  currency,
  axisBottom,
  axisLeft,
  margin
}: DateLineHourOfDaySummaryProps) => {
  return (
    <ResponsiveLine
      data={includeAllHours(data)}
      curve="linear"
      animate={true}
      {...(height ? { height } : {})}
      colors={colors ? colors : { scheme: 'paired' }}
      margin={{
        top: 50,
        right: group ? 130 : 80,
        bottom: 50,
        left: 80,
        ...margin
      }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: true,
        reverse: false
      }}
      enableArea={true}
      enablePoints={false}
      xFormat={decorateHour}
      yFormat={(value: any) =>
        isCurrency
          ? formatCurrency({
              amount: value,
              currency,
              minimumFractionDigits: 0
            })
          : value
      }
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        format: (value: any) =>
          formatAxisBottomHour({
            hour: value,
            showOnlyEvenHours: axisBottom?.showOnlyEvenHours
          }),
        ...axisBottom
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        format: (value: any) =>
          isCurrency &&
          formatCurrency({
            amount: value,
            currency,
            minimumFractionDigits: 0
          }),
        ...axisLeft
      }}
      useMesh={true}
      tooltip={({ point }: any) => (
        <div className="tooltip-hour-of-day-summary-line">
          <p className="tooltip-hour-of-day-summary-line__x">
            {point?.data?.xFormatted || point?.data?.x}
          </p>
          <p className="tooltip-hour-of-day-summary-line__y">
            {point?.data?.yFormatted || point?.data?.y}
          </p>
        </div>
      )}
      {...(group && includeLegends
        ? {
            legends: [
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]
          }
        : {})}
    />
  )
}
