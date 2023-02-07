'use client'

import React from 'react'
import ClientSearch from './ClientSearchHOC'
import * as DefaultUIClientComponents from './DefaultUIClientComponents'
import _ from 'lodash/fp'

const FeathersSearchRenderer = props => {
  const offset = new Date().getTimezoneOffset()

  props.initialSearch.filters = _.map(
    filter => ({
      ...filter,
      ...(_.isNumber(filter.offset) ? { offset } : {})
    }),
    props.initialSearch.filters
  )
  props.initialSearch.charts = _.map(
    chart => ({
      ...chart,
      ...(_.isNumber(chart.offset) ? { offset } : {})
    }),
    props.initialSearch.charts
  )

  return (
    <ClientSearch
      key={_.uniqueId() /* currently mode="route" doesn't work without this*/}
      {..._.omit(['constraints'], props)}
      defaultOverrides={props.overrides}
      UIComponents={_.merge(DefaultUIClientComponents, props.UIComponents)}
    />
  )
}

export const FeathersClientSearchHOC = props => (
  <FeathersSearchRenderer {...props} />
)
