export { includeSubmittedSearch } from './util'
import Next13Search from './Next13HybridSearchNew'

export default ({
  feathersOrigin,
  preparePage = async val => val,
  overridesStateless,
  UIComponents = {},
  UIComponentsStateless = {},
  FeathersSearchClientRenderer
}) => {
  const Next13HybridSearchWithFeathersOrigin = props => <Next13Search {...props} feathersOrigin={`${feathersOrigin}` } />
  const FeathersSearchController = props => <Next13HybridSearchWithFeathersOrigin {...props} />

  const FeathersSearch = props => {
    return <FeathersSearchController {...props} SearchLayout={FeathersSearchClientRenderer} />
  }

  const FeathersSearchPage = async props => {
    let { hydratedSearch, schemas } = await preparePage(props)
    
    return <FeathersSearch
      {...props}
      initialSearch={hydratedSearch}
      schemas={schemas}
      isPage={true}
    />
  }

  return {
    FeathersSearch,
    FeathersSearchPage
  }
}