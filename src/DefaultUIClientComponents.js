'use client';

import React from 'react'
import _ from 'lodash/fp'
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveCalendar } from '@nivo/calendar'
import { ResponsivePie } from '@nivo/pie'

export let DateLineSingle = ({ data, x, y }) => <ResponsiveLine
data={data}
curve="linear"
colors={{ scheme: 'paired' }}
margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
xScale={{ type: 'point' }} // need to figure point v linear somehow
yScale={{
    type: 'linear',
    min: 'auto',
    max: 'auto',
    stacked: true,
    reverse: false
}}
yFormat=" >-.2f"
axisTop={null}
axisRight={null}
axisBottom={{
    orient: 'bottom',
    tickSize: 5,
    tickPadding: 5,
    tickRotation: -20,
    legend: _.startCase(x),
    legendOffset: 36,
    legendPosition: 'middle'
}}
axisLeft={{
    orient: 'left',
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: _.startCase(y),
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

export let QuantityByPeriodCalendar = ({ data, x, y }) => <ResponsiveCalendar
data={data}
from={_.flow(_.first, _.get('day'))(data)}
to={_.flow(_.last, _.get('day'))(data)}
emptyColor="#eeeeee"
colors={[ '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560' ]}
margin={{ top: 0, right: 40, bottom: 0, left: 40 }}
yearSpacing={40}
monthBorderColor="#ffffff"
dayBorderWidth={2}
dayBorderColor="#ffffff"
legends={[
    {
        anchor: 'bottom-right',
        direction: 'row',
        translateY: 36,
        itemCount: 4,
        itemWidth: 42,
        itemHeight: 36,
        itemsSpacing: 14,
        itemDirection: 'right-to-left'
    }
]}
/>

export let TopNPie = ({ data }) => <ResponsivePie
data={data}
margin={{ top: 0, right: 80, bottom: 80, left: 0 }}
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
defs={[
    {
        id: 'dots',
        type: 'patternDots',
        background: 'inherit',
        color: 'rgba(255, 255, 255, 0.3)',
        size: 4,
        padding: 1,
        stagger: true
    },
    {
        id: 'lines',
        type: 'patternLines',
        background: 'inherit',
        color: 'rgba(255, 255, 255, 0.3)',
        rotation: -45,
        lineWidth: 6,
        spacing: 10
    }
]}
fill={[
    {
        match: {
            id: 'ruby'
        },
        id: 'dots'
    },
    {
        match: {
            id: 'c'
        },
        id: 'dots'
    },
    {
        match: {
            id: 'go'
        },
        id: 'dots'
    },
    {
        match: {
            id: 'python'
        },
        id: 'dots'
    },
    {
        match: {
            id: 'scala'
        },
        id: 'lines'
    },
    {
        match: {
            id: 'lisp'
        },
        id: 'lines'
    },
    {
        match: {
            id: 'elixir'
        },
        id: 'lines'
    },
    {
        match: {
            id: 'javascript'
        },
        id: 'lines'
    }
]}
legends={[
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
]}
/>


