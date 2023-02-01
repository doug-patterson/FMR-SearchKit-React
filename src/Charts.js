import React from 'react'
import _ from 'lodash/fp'
import FieldStats from './FieldStats'
import SummaryTable from './SummaryTable'

let reloaded = false

const ChartSizer = ({ children, chartWidths, ...props }) => {
  const [hasWidth, setHasWidth] = React.useState(
    !!chartWidths.current[props.chartKey]
  )

  React.useEffect(() => {
    const resize = () => {
      const containerWidth = document.querySelectorAll(
        `.fmr-chart.${props.chartKey}`
      )[0]?.clientWidth
      chartWidths.current = {
        ...chartWidths.current,
        [props.chartKey]: containerWidth || 480
      }
      setHasWidth(true)
    }
    if (!hasWidth) {
      resize()
    }
    const reloader = () => {
      if (!reloaded) {
        window.location.reload()
      }
      reloaded = true
    }
    window.addEventListener('resize', reloader)
    window.addEventListener('orientationchange', reloader)
  }, [chartWidths, hasWidth, props.chartKey])

  return hasWidth && <>{children}</>
}

const Charts = ({
  charts,
  chartWidths,
  schema,
  schemas,
  chartData,
  UIComponents
}) => (
  <>
    {_.map(chart => {
      let Component =
        UIComponents[_.upperFirst(chart.type)] ||
        _.constant(JSON.stringify(chart))
      if (chart.type === 'fieldStats') {
        Component = FieldStats
      }
      if (chart.type === 'summaryTable') {
        Component = SummaryTable
      }

      return (
        <div
          className={`fmr-chart ${chart.key}`}
          key={chart.key}
          style={{ gridArea: chart.key }}
        >
          <h2>{_.toString(chart.label) || _.startCase(chart.key)}</h2>
          <ChartSizer chartWidths={chartWidths} chartKey={chart.key}>
            <Component
              {..._.omit(['key'], chart)}
              chartKey={chart.key}
              chartWidths={chartWidths}
              data={chartData ? chartData[chart.key] : []}
              schema={schema}
              schemas={schemas}
              UIComponents={UIComponents}
              height={_.toNumber(chart.height) || 280}
            />
          </ChartSizer>
        </div>
      )
    }, charts)}
  </>
)

Charts.displayName = 'Charts'

export default Charts
