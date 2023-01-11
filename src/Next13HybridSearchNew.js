import React from 'react'
import { cookies } from 'next/headers'
import _ from 'lodash/fp'
import * as DefaultUIClientComponents from './DefaultUIClientComponents'

export default async props => {
  let initialResults
  const initialSearch = props?.initialSearch ? { ...props.initialSearch, includeSchema: true } : { collection: props?.collection, includeSchema: true }

  if (!props.clientOnly) {
    const nextJSCookies = await cookies()
    const jwt = nextJSCookies.get('feathersJWT')
  
    // we should check a flag for not running data for the charts
    // since some chart solutions aren't server renderable
    const initialResponse = await fetch(`${props.feathersOrigin}/search`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt.value}`
      },
      body: JSON.stringify(initialSearch)
    })

    initialResults = await initialResponse.json()
  }

  return <props.SearchLayout
    initialSearch={initialSearch}
    initialResults={_.omit(['schema'], initialResults)}
    UIComponents={DefaultUIClientComponents}
    {...props}
  />
}
