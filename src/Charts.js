import React from 'react'
import _ from 'lodash/fp'
import FieldStats from './FieldStats'

let reloaded = false

const ChartSizer = ({ children, chartWidths, ...props }) => {
  let [hasWidth, setHasWidth] = React.useState(!!chartWidths.current[props.chartKey])

  React.useEffect(() => {
    let resize = () => {
      let containerWidth = document.querySelectorAll(`.fmr-chart.${props.chartKey}`)[0]?.clientWidth
      chartWidths.current = {
        ...chartWidths.current,
        [props.chartKey]: containerWidth || 480
      }
      setHasWidth(true)
    }
    if (!hasWidth) {
      resize()
    }
    let reloader = () => {
      if (!reloaded) {
        window.location.reload()
      }
      reloaded = true
    }
    window.addEventListener('resize', reloader)
    window.addEventListener('orientationchange', reloader)
  }, [])

  return hasWidth && <>{children}</>
}

export default ({ charts, chartWidths, schema, schemas, chartData, UIComponents }) =>
  <>
    {_.map(chart => {
      let Component = UIComponents[_.upperFirst(chart.type)] || _.constant(JSON.stringify(chart))
      if (chart.type === 'fieldStats') {
        Component = FieldStats
      }
  
      return <div
        className={`fmr-chart ${chart.key}`}
        key={chart.key}
        style={{ gridArea: chart.key }}
      >
        <h2>{_.startCase(chart.key)}</h2>
        <ChartSizer
          chartWidths={chartWidths}
          chartKey={chart.key}
        >
          <Component
            {..._.omit(['key'], chart)}
            chartKey={chart.key}
            chartWidths={chartWidths}
            data={chartData ? chartData[chart.key] : []}
            schema={schema}
            schemas={schemas}
            UIComponents={UIComponents}
            height={280}
          />
        </ChartSizer>
      </div>
    }, charts)}
  </>

