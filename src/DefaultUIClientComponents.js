'use client'

import React from 'react'
import _ from 'lodash/fp'
import useOutsideClick from './hooks/useOutsideClick'
import { Line } from '@nivo/line'
import { Calendar } from '@nivo/calendar'
import { Pie } from '@nivo/pie'
import { Bar } from '@nivo/bar'
import { formatCurrency } from './util'

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

export const DateLineSingle = ({
  data,
  xLabel,
  yLabel,
  isCurrency,
  height,
  chartWidths,
  chartKey,
  colors
}) => (
  <Line
    data={americanDates(data)}
    curve="linear"
    width={chartWidths.current[chartKey]}
    height={height}
    animate={false}
    colors={colors ? colors : { scheme: 'set2' }}
    margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
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
    yFormat={value => (isCurrency ? formatCurrency({ amount: value }) : value)}
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
        formatCurrency({ amount: value, minimumFractionDigits: 0 })
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
          ? formatCurrency({ amount: point?.data?.y })
          : point?.data?.y}
      </div>
    )}
  />
)

export const DateLineMultiple = ({
  data,
  x,
  y,
  xLabel,
  yLabel,
  isCurrency,
  height,
  chartWidths,
  chartKey
}) => (
  <Line
    data={americanDates(
      _.map(d => ({ ...d, data: _.map(_.omit('group'), d.data) }), data)
    )}
    curve="linear"
    width={chartWidths.current[chartKey]}
    height={height}
    animate={false}
    colors={{ scheme: 'set2' }}
    margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
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
    yFormat={`>-${isCurrency ? '$' : ''},.2r`}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      orient: 'bottom',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: -20,
      legend: xLabel || _.startCase(x),
      legendOffset: 36,
      legendPosition: 'middle'
    }}
    axisLeft={{
      orient: 'left',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: yLabel || _.startCase(y),
      legendOffset: -50,
      legendPosition: 'middle'
    }}
    pointSize={10}
    pointColor={{ theme: 'background' }}
    pointBorderWidth={2}
    pointBorderColor={{ from: 'serieColor' }}
    pointLabelYOffset={-12}
    useMesh={true}
    tooltip={({ point }) => (
      <div style={{ padding: 4, backgroundColor: 'white' }}>
        <b>{point?.data?.x}</b>: {isCurrency ? '$' : ''}
        {point?.data?.y}
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
  chartWidths,
  chartKey,
  colors
}) => (
  <Line
    data={isCurrency ? formatCurrency({ amount: data }) : data}
    curve="linear"
    height={height}
    width={chartWidths.current[chartKey]}
    animate={false}
    colors={colors ? colors : { scheme: 'paired' }}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: 'point' }}
    yScale={{
      type: 'linear',
      min: 'auto',
      max: 'auto',
      stacked: true,
      reverse: false
    }}
    yFormat={value => (isCurrency ? formatCurrency({ amount: value }) : value)}
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
        formatCurrency({ amount: value, minimumFractionDigits: 0 })
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
  chartWidths,
  chartKey,
  colors
}) => (
  <Calendar
    data={fixDates(data)}
    height={height}
    width={chartWidths.current[chartKey]}
    from={_.flow(_.first, _.get('day'))(data)}
    to={_.flow(_.last, _.get('day'))(data)}
    emptyColor="#eeeeee"
    colors={colors ? colors : ['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
    margin={{ top: 0, right: 40, bottom: 0, left: 40 }}
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
  chartWidths,
  chartKey
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
    <Pie
      data={data}
      height={height}
      width={chartWidths.current[chartKey]}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
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
  chartWidths,
  chartKey,
  colors,
  enableLabel = true,
  label,
  includeLegends = true
}) => (
  <Bar
    data={data}
    width={chartWidths.current[chartKey]}
    label={label}
    height={height}
    enableLabel={enableLabel}
    layout="vertical"
    indexBy="id"
    animate={false}
    keys={_.flow(_.map(_.keys), _.flatten, _.uniq, _.without(['id']))(data)}
    margin={{ top: 50, right: group ? 130 : 80, bottom: 50, left: 80 }}
    padding={0.3}
    xScale={{ type: 'linear' }}
    colors={colors ? colors : { scheme: 'set2' }}
    valueFormat={value =>
      isCurrency
        ? formatCurrency({ amount: value, minimumFractionDigits: 0 })
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
        formatCurrency({ amount: value, minimumFractionDigits: 0 })
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

const addZeroHours = hours =>
  _.map(x => _.find({ x }, hours) || { x, y: 0 }, [..._.range(1, 24), 0])

const decorateHour = hour => {
  if (hour === 0) {
    return 'Midnight'
  }
  if (hour === 12) {
    return 'Noon'
  }

  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`
}

const includeAllHours = _.map(({ id, data }) => ({
  id,
  data: _.flow(
    addZeroHours,
    _.map(({ x, y }) => ({ x: decorateHour(x), y }))
  )(data)
}))

export const HourOfDaySummaryLine = ({
  data,
  isCurrency,
  xLabel,
  yLabel,
  group,
  height,
  chartWidths,
  chartKey,
  colors,
  includeLegends = true
}) => (
  <Line
    data={includeAllHours(data)}
    width={chartWidths.current[chartKey]}
    height={height}
    curve="linear"
    colors={colors ? colors : { scheme: 'paired' }}
    margin={{ top: 50, right: group ? 130 : 80, bottom: 50, left: 80 }}
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
    yFormat={value => (isCurrency ? formatCurrency({ amount: value }) : value)}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      orient: 'bottom',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: -45,
      legend: xLabel,
      legendOffset: 40,
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
        formatCurrency({ amount: value, minimumFractionDigits: 0 })
    }}
    useMesh={true}
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
