'use client'

// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
// @ts-expect-error TS(6142): Module './ClientSearchHOC' was resolved to '/Users... Remove this comment to see the full error message
import ClientSearch from './ClientSearchHOC'
// @ts-expect-error TS(6142): Module './DefaultUIClientComponents' was resolved ... Remove this comment to see the full error message
import * as DefaultUIClientComponents from './DefaultUIClientComponents'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from 'lodash/fp'

const FeathersSearchRenderer = (props: any) => {
  const offset = new Date().getTimezoneOffset()

  props.initialSearch.filters = _.map(
    (filter: any) => ({
      ...filter,
      ...(_.isNumber(filter.offset) ? { offset } : {})
    }),
    props.initialSearch.filters
  )
  props.initialSearch.charts = _.map(
    (chart: any) => ({
      ...chart,
      ...(_.isNumber(chart.offset) ? { offset } : {})
    }),
    props.initialSearch.charts
  )

  return (
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <ClientSearch
      key={_.uniqueId() /* currently mode="route" doesn't work without this*/}
      {...props}
      defaultOverrides={props.overrides}
      UIComponents={_.merge(DefaultUIClientComponents, props.UIComponents)}
    />
  )
}

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
export const FeathersClientSearchHOC = (props: any) => <FeathersSearchRenderer {...props} />
