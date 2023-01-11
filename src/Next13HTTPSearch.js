import HTTPSearch from './HTTPSearchHOC'
import { cookies } from 'next/headers'
import _ from 'lodash/fp'

// in order to make this work, fundamentally, the 
// inputs all need HTML `name` attributes, they need to be
// wrapped in a real HTML `form` element with an `action` and `method`
// and this Next13 component needs to handle the incoming query string as
// POST or GET. We'll need to/from functions to convert the JSON search
// to a query string and back

// first step: all the filter inputs need appropriate HTML names
// and the wrapper needs to be a form.

export default async props => {
  const nextJSCookies = await cookies()
  const jwt = nextJSCookies.get(props.feathersCookieName || 'feathersJWT')

  const initialSearch = props.initialSearch ? { ...props.initialSearch } : { collection: props.collection }

  const initialResponse = await fetch(`${props.feathersOrigin}/search`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt.value}`
    },
    body: JSON.stringify(initialSearch)
  })

  const initialResults = await initialResponse.json()

  return <props.SearchLayout
    initialSearch={initialSearch}
    initialResults={initialResults}
    {...props}
  />
}
