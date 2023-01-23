import React from 'react'
import SearchLayout from './SearchLayout'
import _ from 'lodash/fp'
import { setUpSchemas } from './util'

let initApp = async (setApp, setInitialResults, initialSearch, getApp) => {
  let app = await getApp()
  if (setInitialResults) {
    setInitialResults(await app.service('search').create(initialSearch))
  }
  setApp(app)
}

const ClientSearchWithOverrides = props => {
  let [app, setApp] = React.useState(null)
  let [schemas, setSchemas] = React.useState(null)
  let [initialResults, setInitialResults] = React.useState(null)

  React.useEffect(() => {
    let setUp = async () => {
      initApp(setApp, props.clientOnly ? setInitialResults : null, props.initialSearch, props.getApp)
      setSchemas(setUpSchemas(_.merge(props.defaultOverrides, props.overrides), props.schemas))
    }
    setUp()
  }, [])

  return app && schemas && <SearchLayout
    initialSearch={{ collection: props?.collection}}
    {...props}
    {...(initialResults ? { initialResults } : {})}
    schemas={schemas}
  />
}

export default props => <ClientSearchWithOverrides {...props} />

