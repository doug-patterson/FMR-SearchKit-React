import React from 'react'
import _ from 'lodash/fp'

export default ({ initialSearch, chartData, UIComponents }) => <>
  {_.map(chart => {
    let Component = UIComponents[_.upperFirst(chart.type)] || _.constant(JSON.stringify(chart))
    return <div
      key={chart.key}
      style={{ height: initialSearch.chartHeight || 320, gridArea: chart.key }}
    >
      <Component key={chart.key} {...chart} data={chartData[chart.key]} />
    </div>
  }, initialSearch.charts)}
</>
