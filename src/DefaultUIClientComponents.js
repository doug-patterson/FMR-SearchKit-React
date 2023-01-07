'use client';

import React from 'react'
import _ from 'lodash/fp'
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveCalendar } from '@nivo/calendar'
import { ResponsivePie } from '@nivo/pie'
import { ResponsiveBar } from '@nivo/bar'

const americanDate = _.flow(
  _.split('/'),
  values => _.size(values) < 3 ? [values[0], '', values[1]] : values,
  ([day, month, year]) => `${month || ''}${month ? '/' : ''}${day || ''}${day ? '/' : ''}${year}`
)

const americanDates = _.map(({ id, data }) => ({
  id,
  data: _.map(({ x, y }) => ({ x: americanDate(x), y }), data)
}))

export let CheckBox = ({ checked, label, onChange }) => {
  let id = _.uniqueId('fmr-checkbox-')

  return (
    <>
      <input
        type="checkbox"
        checked={checked}
        id={id}
        className="fmr-checkbox"
        {...(onChange
          ? { onChange: e => e.target && onChange(e.target.checked) }
          : {})}
      />
      <label htmlFor={id}>{label}</label>
    </>
  )
}

export let Input = ({ type, value, placeholder, onChange, ...props }) => (
  <input
    className="fmr-input"
    onChange={e => e && e.target && onChange(e.target.value)}
    placeholder={placeholder}
    value={value}
    type={type}
    {...props}
  />
)

export let DateLineSingle = ({ data, x, y, xLabel, yLabel, isCurrency }) => <ResponsiveLine
data={americanDates(data)}
curve="linear"
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
tooltip={({ point }) => <div style={{ padding: 4, backgroundColor: 'white' }}><b>{point?.data?.x}</b>: {isCurrency ? '$' : ''}{point?.data?.y}</div>}
/>

export let DateTimeLine = ({ data, x, y, isCurrency, xLabel, yLabel }) => <ResponsiveLine
data={isCurrency ? formatCurrency(data) : data}
curve="linear"
colors={{ scheme: 'paired' }}
margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
xScale={{ type: 'point' }}
yScale={{
    type: 'linear',
    min: 'auto',
    max: 'auto',
    stacked: true,
    reverse: false
}}
yFormat=""
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

let addLeadingZeros = finishedLength => str => {
  let zeros = _.join('', _.times(_.constant('0'), finishedLength))
  let fixed = `${zeros}${str}`
  return fixed.substr(0 - finishedLength)
}

let fixDate = str => {
  let [year, month, day] = _.split('-', str)
  let fixedPieces = [year, addLeadingZeros(2)(month), addLeadingZeros(2)(day)]
  let totallyFixed =  _.join('-', fixedPieces)
  return totallyFixed
}

let fixDates = _.map(datum => ({ ...datum, day: fixDate(datum.day) }))

let americanDate2 = _.flow(
  _.split('-'),
  ([year, month, day]) => `${month || ''}${month ? '/' : ''}${day || ''}${day ? '/' : ''}${year}`
)

export let QuantityByPeriodCalendar = ({ data, isCurrency, onClick }) => <ResponsiveCalendar
  data={fixDates(data)}
  from={_.flow(_.first, _.get('day'))(data)}
  to={_.flow(_.last, _.get('day'))(data)}
  emptyColor="#eeeeee"
  colors={[ '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560' ]}
  margin={{ top: 0, right: 40, bottom: 0, left: 40 }}
  yearSpacing={40}
  //monthSpacing={10}
  monthBorderColor="#ffffff"
  dayBorderWidth={2}
  // using this you could wire up a click handler to set the dates on a
  // date range filter in a search to startOfDay and endOfDay for the clicked day
  onClick={onClick}
  dayBorderColor="#ffffff"
  tooltip={({ day, value }) => <div style={{ backgroundColor: 'white', padding: 4 }}>
    <b>{americanDate2(day)}</b>: {isCurrency ? '$' : ''}{isCurrency ? _.toNumber(value).toFixed(2) : value}
  </div>}
/>

let uniqueIdMaker = ids => label => {
  if (!ids[label]) {
    ids[label] = 1
    return label
  } else {
    ids[label]++
    return `${label} (${_.size(ids[label])})`
  }
}

export let TopNPie = ({ data, chartKey, field, schema, legend }) => {
  let getId = uniqueIdMaker({})

  data = _.map(datum => {
    let display = _.get(['properties', chartKey, 'properties', field, 'display'], schema)
    let label =  display ? display(datum) : datum.label
    let id = getId(label)

    return  {
      ..._.omit('lookup', datum),
      id,
      label: id
    }
  }, data)

  return <ResponsivePie
    data={data}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    innerRadius={0.5}
    padAngle={0.7}
    cornerRadius={3}
    activeOuterRadiusOffset={8}
    borderWidth={1}
    borderColor={{
        from: 'color',
        modifiers: [
            [
                'darker',
                0.2
            ]
        ]
    }}
    arcLinkLabelsSkipAngle={10}
    arcLinkLabelsTextColor="#333333"
    arcLinkLabelsThickness={2}
    arcLinkLabelsColor={{ from: 'color' }}
    arcLabelsSkipAngle={10}
    arcLabelsTextColor={{
        from: 'color',
        modifiers: [
            [
                'darker',
                2
            ]
        ]
    }}
    legends={legend ? [
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
    ] : []}
  />
}

export let DayOfWeekSummaryBars = ({ data, x, y, xLabel, yLabel, group, isCurrency }) => (
  <ResponsiveBar
      data={data}
      keys={_.flow(
        _.map(_.keys),
        _.flatten,
        _.uniq,
        _.without(['id'])
      )(data)}
      margin={{ top: 50, right: group ? 130 : 80, bottom: 50, left: 80 }}
      padding={0.3}
      xScale={{ type: 'linear' }}
      colors={{ scheme: 'set2' }}
      valueFormat={`>-${isCurrency ? '$' : ''},.2r`}
      borderColor={{
          from: 'color',
          modifiers: [
              [
                  'darker',
                  1.6
              ]
          ]
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -20,
          legend: xLabel || x,
          legendPosition: 'middle',
          legendOffset: 36
      }}
      axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: yLabel || y,
          legendPosition: 'middle',
          legendOffset: -70
      }}

      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
          from: 'color',
          modifiers: [
              [
                  'darker',
                  1.6
              ]
          ]
      }}
      {...(group ? { legends: [
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
      ] } : {})}
      role="application"
      ariaLabel="a11y"
      barAriaLabel={function(e){return e.id+": "+e.formattedValue+" in country: "+e.indexValue}}
  />
)

const addZeroHours = hours => _.map(x => _.find({ x }, hours) || ({ x, y: 0 }), [..._.range(1, 24), 0])

const decorateHour = hour => {
  if (hour === 0) { return 'Midnight' }
  if (hour === 12) { return 'Noon' }

  return (hour < 12 ? `${hour} AM` : `${hour - 12} PM`)
}

const includeAllHours = _.map(({ id, data }) => ({
  id,
  data: _.flow(
    addZeroHours,
    _.map(({ x, y }) => ({ x: decorateHour(x), y }))
  )(data)
}))

export let HourOfDaySummaryLine = ({ data, x, y, isCurrency, xLabel, yLabel, group }) => <ResponsiveLine
  data={includeAllHours(data)}
  curve="linear"
  colors={{ scheme: 'paired' }}
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
  yFormat={`>-${isCurrency ? '$' : ''},.2r`}
  axisTop={null}
  axisRight={null}
  axisBottom={{
      orient: 'bottom',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: -45,
      legend: xLabel || _.startCase(x),
      legendOffset: 40,
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
  useMesh={true}
  {...(group  ? {legends: [
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
  ]} : {})}
/>