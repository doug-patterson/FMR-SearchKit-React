import React from 'react'
import _ from 'lodash/fp'
import FieldStats from './FieldStats'
import SummaryTable from './SummaryTable'
import TotalsBar from './TotalsBar'

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
      if (chart.type === 'totalsBar') {
        Component = TotalsBar
      }

      return (
        <div
          className={`fmr-chart ${chart.key}`}
          key={chart.key}
          style={{ gridArea: chart.key }}
        >
          {!chart.hideLabel && (
            <h2>{_.toString(chart.label) || _.startCase(chart.key)}</h2>
          )}
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
        </div>
      )
    }, charts)}
  </>
)

Charts.displayName = 'Charts'

export default Charts
