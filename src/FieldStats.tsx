import React from 'react'
import _ from 'lodash/fp'
import Results from './Results'

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
}) => {
  const resultsCount = _.flow(_.first, _.get('resultsCount'))(data)
  data = _.map(_.omit(['resultsCount']), data)

  return (
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
