import React from 'react'
import _ from 'lodash/fp'
import { mapIndexed } from './util'

// longer-term we need to refactor to not pass in collection
// and also only pass in the schema for the collection we're rendering

const moveColumn = ({ include, setInclude, field, increment }) => {
  const currentIdx = _.findIndex(f => f === field, include)
  const newIdx = currentIdx + increment
  const otherField = _.get([newIdx], include)
  const newInclude = _.flow(
    _.set([currentIdx], otherField),
    _.set([newIdx], field)
  )(include)

  setInclude(newInclude)
}

const schemaFields = _.flow(_.get('properties'), _.keys)

const getAddOpts = ({ include, schema, field, setInclude, setIsAdding }) => {
  const addableFields = _.difference(schemaFields(schema), include)
  return [
    ..._.map(
      f => ({
        label: _.startCase(f),
        onClick: () => {
          const idx = _.findIndex(ff => ff === field, include)
          setInclude([
            ..._.slice(0, idx, include),
            f,
            ..._.slice(idx, Infinity, include)
          ])
        }
      }),
      addableFields
    ),
    {
      label: 'None',
      onClick: () => setIsAdding(false)
    }
  ]
}

const DefaultHeaderMenu = ({
  field,
  include,
  setInclude,
  setSortField,
  setSortDir,
  schema,
  UIComponents
}) => {
  const [isAdding, setIsAdding] = React.useState(false)
  const label =
    _.get(['properties', field, 'label'], schema) || _.startCase(field)
  return _.get(['properties', field, 'static'], schema) ? (
    <span>{label}</span>
  ) : (
    <UIComponents.Menu
      key={isAdding}
      label={isAdding ? 'Add Column' : label}
      open={isAdding}
      items={_.compact(
        isAdding
          ? getAddOpts({
              include,
              schema,
              setInclude,
              field,
              setIsAdding,
              setSortField,
              setSortDir
            })
          : [
              {
                label: 'Sort Ascending',
                onClick: () => {
                  setSortField(field)
                  setSortDir('asc')
                }
              },
              {
                label: 'Sort Descending',
                onClick: () => {
                  setSortField(field)
                  setSortDir('desc')
                }
              },
              _.findIndex(f => f === field, include) > 0 && {
                label: 'Move Left',
                onClick: () =>
                  moveColumn({ include, setInclude, field, increment: -1 })
              },
              _.findIndex(f => f === field, include) < _.size(include) - 1 && {
                label: 'Move Right',
                onClick: () =>
                  moveColumn({ include, setInclude, field, increment: 1 })
              },
              _.size(_.difference(schemaFields(schema), include)) && {
                label: 'Add Column',
                onClick: () => setIsAdding(true)
              },
              {
                label: 'Remove Column',
                onClick: () => {
                  const idx = _.findIndex(f => f === field, include)
                  setInclude([
                    ..._.slice(0, idx, include),
                    ..._.slice(idx + 1, Infinity, include)
                  ])
                }
              }
            ]
      )}
    />
  )
}

const renderCell = ({ row, field, schema, idx }) => {
  const display = (
    _.get(`properties.${field}.tableCellDisplay`, schema) ||
    _.get(`properties.${field}.display`, schema) ||
    _.identity
  )(_.get(field, row), row, idx)

  return [display]
}

const Component = ({
  include,
  setInclude,
  setSortField,
  setSortDir,
  schema,
  rows,
  UIComponents,
  HeaderMenu = DefaultHeaderMenu
}) => (
  <UIComponents.Box style={{ width: '100%', overflowX: 'auto' }}>
    <UIComponents.Table className="results-table">
      <UIComponents.TableHeader>
        <UIComponents.TableRow>
          {_.map(
            field => (
              <UIComponents.TableCell key={field}>
                <HeaderMenu
                  {...{
                    field,
                    include,
                    setInclude,
                    setSortField,
                    setSortDir,
                    schema,
                    UIComponents
                  }}
                />
              </UIComponents.TableCell>
            ),
            include
          )}
        </UIComponents.TableRow>
      </UIComponents.TableHeader>
      <UIComponents.TableBody>
        {mapIndexed(
          row => (
            <UIComponents.TableRow key={row._id} id={row._id}>
              {_.map(
                field => (
                  <UIComponents.TableCell key={field}>
                    {renderCell({ row, field, schema })}
                  </UIComponents.TableCell>
                ),
                include
              )}
            </UIComponents.TableRow>
          ),
          rows
        )}
      </UIComponents.TableBody>
    </UIComponents.Table>
  </UIComponents.Box>
)

const ResultsTableHOC = props => <Component {...props} />

export default ResultsTableHOC
