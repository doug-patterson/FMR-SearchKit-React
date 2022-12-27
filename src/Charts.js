import React from 'react'
import _ from 'lodash/fp'
import { mapIndexed } from './util'
import FieldStats from './FieldStats'

export default ({ initialSearch, schema, schemas, chartData, UIComponents, updateChartSearch }) => <>
  {mapIndexed((chart, idx) => {
    let Component = UIComponents[_.upperFirst(chart.type)] || _.constant(JSON.stringify(chart))
    if (chart.type === 'fieldStats') {
      Component = FieldStats
    }
    return <div
      key={chart.key}
      style={{ height: initialSearch.chartHeight || 320, gridArea: chart.key }}
    >
      <h2>{_.startCase(chart.key)}</h2>
      <Component
        {..._.omit(['key'], chart)}
        key={chart.key}
        chartKey={chart.key}
        data={chartData[chart.key] || []}
        schema={schema}
        schemas={schemas}
        UIComponents={UIComponents}
        updateChartSearch={updateChartSearch(idx)}
      />
    </div>
  }, initialSearch.charts)}
</>
