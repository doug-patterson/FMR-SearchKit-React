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

const americanDate = _.flow(
  _.split('/'),
  values => (_.size(values) < 3 ? [values[0], '', values[1]] : values),
  ([day, month, year]) =>
    `${month || ''}${month ? '/' : ''}${day || ''}${day ? '/' : ''}${year}`
)

const americanDates = _.map(({ id, data }) => ({
  id,
  data: _.map(({ x, y }) => ({ x: americanDate(x), y }), data)
}))

export const Menu = ({ label, open, items }) => {
  const ref = React.useRef()
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

export const CheckBox = ({
  checked,
  onChange,
  textMiddle,
  textRight,
  layout
}) => {
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
          ? { onChange: e => e.target && onChange(e.target.checked) }
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
  label,
  ...props
}) => {
  const inputEl = React.createRef()

  React.useEffect(() => {
    if (focus) {
      inputEl.current.focus()
    }
  }, [focus, inputEl])

  return (
    <input
      className="fmr-input"
      ref={inputEl}
      onChange={e => e && e.target && onChange(e.target.value)}
      placeholder={placeholder}
      value={value}
      type={type}
      {...props}
    />
  )
}

let getPeriodAdder = period =>
  ({
    day: date => addDays(date, 1),
    week: date => addWeeks(date, 1),
    month: date => addMonths(date, 1)
  }[period])

let getDateFormatString = period => (period === 'month' ? 'M/yyyy' : 'd/M/yyyy')

const getInterveningPoints = ({ period, previous, point }) => {
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
    date => ({ x: format(date, dateFormatString), y: 0 }),
    interveningDates
  )
}

const addZeroPeriods = period =>
  _.reduce((acc, point) => {
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
  ({ start, end, period }) =>
  line => {
    let extendedLine = line
    let dateFormatString = getDateFormatString(period)

    start = parse(start, dateFormatString, new Date())
    end = parse(end, dateFormatString, new Date())

    if (
      _.flow(_.first, _.get('x'), date =>
        parse(date, dateFormatString, new Date())
      )(line) > start
    ) {
      extendedLine = [
        { x: format(start, dateFormatString, {}), y: 0 },
        ...extendedLine
      ]
    }
    if (
      _.flow(_.last, _.get('x'), date =>
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

const addZeroPeriodsToAllLines = period => lines => {
  let start = _.flow(_.minBy(firstXValue), firstXValue)(lines)
  let end = _.flow(_.maxBy(lastXValue), lastXValue)(lines)

  return _.map(
    ({ id, data }) => ({
      id,
      data: _.flow(
        extendEndpoints({ start, end, period }),
        addZeroPeriods(period)
      )(data)
    }),
    lines
  )
}

export const DateLineSingle = ({
  data,
  xLabel,
  yLabel,
  isCurrency,
  height,
  colors,
  currency,
  period,
  margins = { top: 50, right: 60, bottom: 50, left: 60 }
}) => {
  return (
    <ResponsiveLine
      data={_.flow(addZeroPeriodsToAllLines(period), americanDates)(data)}
      curve="linear"
      animate={true}
      height={height}
      colors={colors ? colors : { scheme: 'set2' }}
      margin={{
        ...margins
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
      yFormat={value =>
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
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -20,
        legend: xLabel,
        legendOffset: 36,
        legendPosition: 'middle'
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: yLabel,
        legendOffset: -50,
        legendPosition: 'middle',
        format: value =>
          isCurrency &&
          formatCurrency({ amount: value, currency, minimumFractionDigits: 0 })
      }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      tooltip={({ point }) => (
        <div style={{ padding: 4, backgroundColor: 'white' }}>
          <b>{point?.data?.x}</b>:{' '}
          {isCurrency
            ? formatCurrency({
                amount: point?.data?.y,
                currency,
                minimumFractionDigits: 0
              })
            : point?.data?.y}
        </div>
      )}
    />
  )
}

export const DateLineMultiple = ({
  data,
  xLabel,
  yLabel,
  isCurrency,
  colors,
  currency,
  height,
  period,
  margins = { top: 50, right: 60, bottom: 50, left: 60 }
}) => (
  <ResponsiveLine
    data={_.flow(
      addZeroPeriodsToAllLines(period),
      americanDates
    )(_.map(d => ({ ...d, data: _.map(_.omit('group'), d.data) }), data))}
    curve="linear"
    animate={true}
    height={height}
    colors={colors ? colors : { scheme: 'set2' }}
    margin={{
      ...margins
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
    yFormat={value =>
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
      orient: 'bottom',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: -20,
      legend: xLabel,
      legendOffset: 36,
      legendPosition: 'middle'
    }}
    axisLeft={{
      orient: 'left',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: yLabel,
      legendOffset: -50,
      legendPosition: 'middle',
      format: value =>
        isCurrency &&
        formatCurrency({ amount: value, currency, minimumFractionDigits: 0 })
    }}
    pointSize={10}
    pointColor={{ theme: 'background' }}
    pointBorderWidth={2}
    pointBorderColor={{ from: 'serieColor' }}
    pointLabelYOffset={-12}
    useMesh={true}
    tooltip={({ point }) => (
      <div style={{ padding: 4, backgroundColor: 'white' }}>
        <b>{point?.data?.x}</b>:{' '}
        {isCurrency
          ? formatCurrency({
              amount: point?.data?.y,
              currency,
              minimumFractionDigits: 0
            })
          : point?.data?.y}
      </div>
    )}
  />
)

export const DateTimeLine = ({
  data,
  isCurrency,
  xLabel,
  yLabel,
  height,
  colors,
  currency,
  margins = { top: 50, right: 110, bottom: 50, left: 60 }
}) => (
  <ResponsiveLine
    data={
      isCurrency
        ? formatCurrency({ amount: data, currency, minimumFractionDigits: 0 })
        : data
    }
    curve="linear"
    animate={true}
    height={height}
    colors={colors ? colors : { scheme: 'paired' }}
    margin={{
      ...margins
    }}
    xScale={{ type: 'point' }}
    yScale={{
      type: 'linear',
      min: 'auto',
      max: 'auto',
      stacked: true,
      reverse: false
    }}
    yFormat={value =>
      isCurrency
        ? formatCurrency({ amount: value, currency, minimumFractionDigits: 0 })
        : value
    }
    axisTop={null}
    axisRight={null}
    axisBottom={{
      orient: 'bottom',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: -20,
      legend: xLabel,
      legendOffset: 36,
      legendPosition: 'middle'
    }}
    axisLeft={{
      orient: 'left',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: yLabel,
      legendOffset: -50,
      legendPosition: 'middle',
      format: value =>
        isCurrency &&
        formatCurrency({ amount: value, currency, minimumFractionDigits: 0 })
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

const addLeadingZeros = finishedLength => str => {
  const zeros = _.join('', _.times(_.constant('0'), finishedLength))
  const fixed = `${zeros}${str}`
  return fixed.substr(0 - finishedLength)
}

const fixDate = str => {
  const [year, month, day] = _.split('-', str)
  const fixedPieces = [year, addLeadingZeros(2)(month), addLeadingZeros(2)(day)]
  const totallyFixed = _.join('-', fixedPieces)
  return totallyFixed
}

const fixDates = _.map(datum => ({ ...datum, day: fixDate(datum.day) }))

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
}) => (
  <ResponsiveCalendar
    data={fixDates(data)}
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
    tooltip={({ day, value }) => (
      <div style={{ backgroundColor: 'white', padding: 4 }}>
        <b>{americanDate2(day)}</b>: {isCurrency ? '$' : ''}
        {isCurrency ? _.toNumber(value).toFixed(2) : value}
      </div>
    )}
  />
)

const uniqueIdMaker = ids => label => {
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
  margins = { top: 50, right: 30, bottom: 50, left: 30 }
}) => {
  const getId = uniqueIdMaker({})

  data = _.map(datum => {
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
      height={height}
      margin={{ ...margins }}
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

export const DayOfWeekSummaryBars = ({
  data,
  xLabel,
  yLabel,
  group,
  isCurrency,
  height,
  colors,
  enableLabel = true,
  label,
  includeLegends = true,
  currency,
  margins = { top: 50, right: group ? 130 : 80, bottom: 50, left: 80 }
}) => {
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
        ...margins
      }}
      padding={0.3}
      xScale={{ type: 'linear' }}
      colors={colors ? colors : { scheme: 'set2' }}
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
        tickRotation: -20,
        legend: xLabel,
        legendPosition: 'middle',
        legendOffset: 36
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: yLabel,
        legendPosition: 'middle',
        legendOffset: -70,
        format: value =>
          isCurrency &&
          formatCurrency({ amount: value, currency, minimumFractionDigits: 0 })
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: 'color',
        modifiers: [['darker', 1.6]]
      }}
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

const addZeroHours = hours =>
  _.map(x => _.find({ x }, hours) || { x, y: 0 }, _.range(0, 24))

const decorateHourXFormat = hour => {
  if (hour === 0) return '12 am'
  if (hour === 12) return '12 pm'
  return hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`
}

const includeAllHours = _.map(({ id, data }) => ({
  id,
  data: addZeroHours(data)
}))

const formatAxisBottomHour = hour => {
  if (hour % 2) return ''
  if (hour === 0) return '12 am'
  if (hour === 12) return '12 pm'
  return hour < 12 ? `${hour}` : `${hour - 12}`
}

export const HourOfDaySummaryLine = ({
  data,
  isCurrency,
  xLabel,
  yLabel,
  group,
  height,
  colors,
  includeLegends = true,
  currency,
  margins = { top: 50, right: group ? 130 : 80, bottom: 50, left: 80 }
}) => {
  return (
    <ResponsiveLine
      data={includeAllHours(data)}
      curve="linear"
      animate={true}
      height={height}
      colors={colors ? colors : { scheme: 'paired' }}
      margin={{
        ...margins
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
      xFormat={decorateHourXFormat}
      yFormat={value =>
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
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: xLabel,
        legendOffset: 40,
        legendPosition: 'middle',
        format: formatAxisBottomHour
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: yLabel,
        legendOffset: -50,
        legendPosition: 'middle',
        format: value =>
          isCurrency &&
          formatCurrency({
            amount: value,
            currency,
            minimumFractionDigits: 0
          })
      }}
      useMesh={true}
      tooltip={({ point }) => (
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
