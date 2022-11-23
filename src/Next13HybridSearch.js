import ClientSearch from './ClientSearch'
import { cookies } from 'next/headers'
import _ from 'lodash/fp'
import * as DefaultUIClientComponents from './DefaultUIClientComponents'

export default async props => {
  const nextJSCookies = await cookies()
  const jwt = nextJSCookies.get('feathersJWT')

  const initialSearch = props.initialSearch ? { ...props.initialSearch, includeSchema: true } : { collection: props.collection, includeSchema: true }

  // we should check a flag for not running data for the charts
  // since some chart solutions aren't server renderable
  const initialResponse = await fetch(props.url || 'http://localhost:3030/search', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`
    },
    body: JSON.stringify(initialSearch)
  })
  const initialResults = await initialResponse.json()

  return <ClientSearch
    initialSearch={initialSearch}
    initialResults={_.omit(['schema'], initialResults)}
    schemas={{ [props.collection]: initialResults.schema }}
    jwt={jwt}
    UIComponents={DefaultUIClientComponents}
    {...props}
  />
}
