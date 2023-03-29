'use client'

import React from 'react'
import ClientSearch from './ClientSearchHOC'
import * as DefaultUIClientComponents from './DefaultUIClientComponents'
import _ from 'lodash/fp'
import { ClientRendererInit } from './types'

const FeathersSearchRenderer = (props: ClientRendererInit) => {
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
    <ClientSearch
      key={
        _.uniqueId(
          'client-search-'
        ) /* currently mode="route" doesn't work without this*/
      }
      {...props}
      defaultOverrides={props.overrides}
      UIComponents={_.merge(DefaultUIClientComponents, props.UIComponents)}
    />
  )
}

export const FeathersClientSearchHOC = (props: ClientRendererInit) => (
  <FeathersSearchRenderer {...props} />
)
