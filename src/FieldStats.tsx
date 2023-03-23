// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from 'lodash/fp'
// @ts-expect-error TS(6142): Module './Results' was resolved to '/Users/douglas... Remove this comment to see the full error message
import Results from './Results'

// @ts-expect-error TS(7006): Parameter 'valueInclude' implicitly has an 'any' t... Remove this comment to see the full error message
const fieldStatsSchema = (valueInclude, valueSchema, key) => ({
  properties: {
    _id: {
      bsonType: 'string',
      display: _.identity
    },
    value: {
      bsonType: 'object',
      // somehow we need to be able to pass in the display function for the
      // value field - but how? We need to reuse the schema for the collecion
      // on which we're running stats somehow
      display:
        _.get(`properties.${key}.display`, valueSchema) ||
        _.get('display', valueSchema) ||
        JSON.stringify
    },
    sum: {
      bsonType: 'number'
    },
    count: {
      bsonType: 'number'
    },
    avg: {
      bsonType: 'number'
    },
    max: {
      bsonType: 'number'
    },
    min: {
      bsonType: 'number'
    }
    // other accumulators
  }
})

const FieldStats = ({
  title,
  valueInclude,
  schemas,
  valueSchema,
  data,
  updateChartSearch,
  ...props
}: any) => {
  const resultsCount = _.flow(_.first, _.get('resultsCount'))(data)
  data = _.map(_.omit(['resultsCount']), data)

  return (
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <Results
      {...props}
      runSearch={updateChartSearch}
      include={['value', ...props.include]}
      rows={data}
      resultsCount={resultsCount}
      schema={fieldStatsSchema(
        valueInclude,
        schemas[valueSchema],
        props.chartKey
      )}
    />
  )
}

export default FieldStats
