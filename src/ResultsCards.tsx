// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from 'lodash/fp'
// @ts-expect-error TS(6142): Module './util' was resolved to '/Users/douglaspat... Remove this comment to see the full error message
import { mapIndexed } from './util'

const DefaultCardBody = ({
  row,
  include,
  schema,
  collection,
  UIComponents
}: any) => (
  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
  <>
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <UIComponents.CardHeader pad="small">
      {_.capitalize(row.type)}
    </UIComponents.CardHeader>
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <UIComponents.CardBody pad="small">
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <UIComponents.Grid columns="1fr">
        {_.map(
          (field: any) => _.get(`properties.${field}.display`, schema)
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
  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
  <UIComponents.Grid columns={columns} gap={10}>
    {mapIndexed(
      (row: any, idx: any) => (
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <UIComponents.Card key={row._id}>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <DefaultCardBody
            row={row}
            rowIdx={idx}
            include={include}
            collection={collection}
            schema={schema}
            action={action}
          />
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <UIComponents.CardFooter
            style={{ display: 'flex', justifyContent: 'flex-end' }}
            pad="small"
          >
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
