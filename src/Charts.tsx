// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from 'lodash/fp'
// @ts-expect-error TS(6142): Module './FieldStats' was resolved to '/Users/doug... Remove this comment to see the full error message
import FieldStats from './FieldStats'
// @ts-expect-error TS(6142): Module './SummaryTable' was resolved to '/Users/do... Remove this comment to see the full error message
import SummaryTable from './SummaryTable'
// @ts-expect-error TS(6142): Module './TotalsBar' was resolved to '/Users/dougl... Remove this comment to see the full error message
import TotalsBar from './TotalsBar'

const Charts = ({
  charts,
  chartWidths,
  schema,
  schemas,
  chartData,
  UIComponents
}: any) => (
  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
  <>
    {_.map((chart: any) => {
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
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div
          className={`fmr-chart ${chart.key}`}
          key={chart.key}
          style={{ gridArea: chart.key }}
        >
          {!chart.hideLabel && (
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <h2>{_.toString(chart.label) || _.startCase(chart.key)}</h2>
          )}
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </div>
      )
    }, charts)}
  </>
)

Charts.displayName = 'Charts'

export default Charts
