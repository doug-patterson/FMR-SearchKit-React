import React from 'react'
import _ from 'lodash/fp'
import { mapIndexed } from './util'

const DefaultCardBody = ({
  row,
  include,
  schema,
  collection,
  UIComponents
}: any) => (
  <>
    <UIComponents.CardHeader pad="small">
      {_.capitalize(row.type)}
    </UIComponents.CardHeader>
    <UIComponents.CardBody pad="small">
      <UIComponents.Grid columns="1fr">
        {_.map(
          (field: any) =>
            _.get(`properties.${field}.display`, schema)
              ? _.get(`properties.${field}.display`, schema)(
                  _.get(field, row),
                  row,
                  // @ts-expect-error TS(2304): Cannot find name 'idx'.
                  idx
                )
              : _.get(field, row),
          include
        )}
      </UIComponents.Grid>
    </UIComponents.CardBody>
  </>
)

const ResultsCards = ({
  include,
  collection,
  schema,
  rows,
  columns = `1fr 1fr`,
  action = _.noop,
  actionLabel = 'Remove',
  UIComponents
}: any) => (
  <UIComponents.Grid columns={columns} gap={10}>
    {mapIndexed(
      (row: any, idx: any) => (
        <UIComponents.Card key={row._id}>
          <DefaultCardBody
            row={row}
            rowIdx={idx}
            include={include}
            collection={collection}
            schema={schema}
            action={action}
          />
          <UIComponents.CardFooter
            style={{ display: 'flex', justifyContent: 'flex-end' }}
            pad="small"
          >
            <UIComponents.Button onClick={() => action(row)}>
              {actionLabel}
            </UIComponents.Button>
          </UIComponents.CardFooter>
        </UIComponents.Card>
      ),
      rows
    )}
  </UIComponents.Grid>
)

export default ResultsCards
