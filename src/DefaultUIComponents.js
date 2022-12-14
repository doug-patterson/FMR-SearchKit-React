import React from 'react'
import _ from 'lodash/fp'
import { Line } from '@nivo/line'
import { Calendar } from '@nivo/calendar'
import { Pie } from '@nivo/pie'
import useOutsideClick from './hooks/useOutsideClick'

export let Box = ({ children, ...props }) => (
  <div className="fmr-box" {...props}>
    {children}
  </div>
)

export let Grid = ({ children, rows, columns, areas, gap, ...props }) => (
  <div
    className="fmr-grid"
    {...props}
    style={{
      gridTemplateAreas: areas,
      gridTemplateRows: rows,
      gridTemplateColumns: columns,
      ...(gap ? { columnGap: gap, rowGap: gap } : {}),
      ...props.style,
      display: 'grid',
    }}
  >
    {children}
  </div>
)

export let Button = ({ onClick, children, ...props }) => (
  <button className="fmr-button" onClick={onClick} {...props}>
    {children}
  </button>
)
export let SubmitButton = ({ children, ...props }) => (
  <button className="fmr-button-submit" type="submit" {...props}>
    {children}
  </button>
)

export let Select = ({ value, options, onChange, ...props }) => (
  <select
    className="fmr-select"
    onChange={e => e && e.target && onChange(e.target.value)}
    value={value}
    {...props}
  >
    {_.map(
      option => (
        <option key={option.value || option} value={option.value || option}>
          {option.label || option}
        </option>
      ),
      options
    )}
  </select>
)

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

export let Menu = ({ label, open, items }) => {
  let ref = React.useRef()
  let [isOpen, setIsOpen] = React.useState(open)
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
            position: 'absolute',
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

export let Nav = ({ children, direction, ...props }) => (
  <nav
    className="fmr-nav"
    style={{
      display: 'flex',
      flexDirection: direction === 'row' ? 'row' : 'column',
    }}
    {...props}
  >
    {children}
  </nav>
)
export let NavItem = ({ label, onClick, icon }) => (
  <div onClick={onClick}>
    {icon}
    {label}
  </div>
)

export let Table = ({ children, ...props }) => (
  <table className="fmr-table" {...props}>
    {children}
  </table>
)
export let TableHeader = ({ children, ...props }) => (
  <thead {...props}>{children}</thead>
)
export let TableBody = ({ children, ...props }) => (
  <tbody {...props}>{children}</tbody>
)
export let TableRow = ({ children, ...props }) => <tr {...props}>{children}</tr>
export let TableCell = ({ children, ...props }) => (
  <td {...props}>{children}</td>
)

export let Card = ({ children, ...props }) => (
  <div className="fmr-card" {...props}>
    {children}
  </div>
)
export let CardHeader = ({ children, ...props }) => (
  <div className="fmr-card-header" {...props}>
    {children}
  </div>
)
export let CardBody = ({ children, ...props }) => (
  <div className="fmr-card-body" {...props}>
    {children}
  </div>
)
export let CardFooter = ({ children, ...props }) => (
  <div className="fmr-card-footer" {...props}>
    {children}
  </div>
)

export let IconBack = () => <span style={{ fontSize: '1.5rem' }}>&#171;</span>
export let IconForward = () => (
  <span style={{ fontSize: '1.5rem' }}>&#187;</span>
)
export let IconPrevious = () => (
  <span style={{ fontSize: '1.5rem' }}>&#8249;</span>
)
export let IconNext = () => <span style={{ fontSize: '1.5rem' }}>&#8250;</span>

export let DateLineSingle = ({ data, x, y }) => (
  <Line
    data={data}
    width={960}
    height={320}
    curve="linear"
    colors={{ scheme: 'paired' }}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: 'point' }} // need to figure point v linear somehow
    yScale={{
      type: 'linear',
      min: 'auto',
      max: 'auto',
      stacked: true,
      reverse: false,
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
      legendPosition: 'middle',
    }}
    axisLeft={{
      orient: 'left',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: _.startCase(y),
      legendOffset: -50,
      legendPosition: 'middle',
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
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
  />
)

export let QuantityByPeriodCalendar = ({ data, x, y }) =>
  console.log({ data, x, y }) || (
    <Calendar
      data={data}
      width={960}
      height={320}
      from={_.flow(_.first, _.get('day'))(data)}
      to={_.flow(_.last, _.get('day'))(data)}
      emptyColor="#eeeeee"
      colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
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
          itemDirection: 'right-to-left',
        },
      ]}
    />
  )

export let TopNPie = ({ data }) => (
  <Pie
    data={data}
    width={640}
    height={320}
    margin={{ top: 0, right: 80, bottom: 80, left: 0 }}
    innerRadius={0.5}
    padAngle={0.7}
    cornerRadius={3}
    activeOuterRadiusOffset={8}
    borderWidth={1}
    borderColor={{
      from: 'color',
      modifiers: [['darker', 0.2]],
    }}
    arcLinkLabelsSkipAngle={10}
    arcLinkLabelsTextColor="#333333"
    arcLinkLabelsThickness={2}
    arcLinkLabelsColor={{ from: 'color' }}
    arcLabelsSkipAngle={10}
    arcLabelsTextColor={{
      from: 'color',
      modifiers: [['darker', 2]],
    }}
    defs={[
      {
        id: 'dots',
        type: 'patternDots',
        background: 'inherit',
        color: 'rgba(255, 255, 255, 0.3)',
        size: 4,
        padding: 1,
        stagger: true,
      },
      {
        id: 'lines',
        type: 'patternLines',
        background: 'inherit',
        color: 'rgba(255, 255, 255, 0.3)',
        rotation: -45,
        lineWidth: 6,
        spacing: 10,
      },
    ]}
    fill={[
      {
        match: {
          id: 'ruby',
        },
        id: 'dots',
      },
      {
        match: {
          id: 'c',
        },
        id: 'dots',
      },
      {
        match: {
          id: 'go',
        },
        id: 'dots',
      },
      {
        match: {
          id: 'python',
        },
        id: 'dots',
      },
      {
        match: {
          id: 'scala',
        },
        id: 'lines',
      },
      {
        match: {
          id: 'lisp',
        },
        id: 'lines',
      },
      {
        match: {
          id: 'elixir',
        },
        id: 'lines',
      },
      {
        match: {
          id: 'javascript',
        },
        id: 'lines',
      },
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
              itemTextColor: '#000',
            },
          },
        ],
      },
    ]}
  />
)

export let SummaryTable = ({ data, isCurrency }) => {
  let rows = _.first(data)
  
  return <dl className="fmr-searchkit-summary-table" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
    {_.map(label => <>
      <dt style={{ fontWeight: 'bold' }}>{_.startCase(label)}</dt>
      <dd style={{ textAlign: 'right' }}>{isCurrency ? `$${rows[label] / 100}`  : rows[label]}</dd>
    </>, _.keys(rows))}
  </dl>
} 

export let GroupedTotals = ({ data }) => JSON.stringify(data, 0, 2)

