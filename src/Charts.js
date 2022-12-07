import React from 'react'
import _ from 'lodash/fp'

export default ({ initialSearch, schema, chartData, UIComponents }) => <>
  {_.map(chart => {
    let Component = UIComponents[_.upperFirst(chart.type)] || _.constant(JSON.stringify(chart))
    return <div
      key={chart.key}
      style={{ height: initialSearch.chartHeight || 320, gridArea: chart.key }}
    >
      <h2>{_.startCase(chart.key)}</h2>
      <Component {...chart} chartKey={chart.key} data={chartData[chart.key] || []} schema={schema} />
    </div>
  }, initialSearch.charts)}
</>
