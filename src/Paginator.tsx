// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from 'lodash/fp'

const Paginator = ({
  page,
  setPage,
  pageSize,
  resultsCount,
  UIComponents
}: any) => {
  const totalPages = Math.ceil(resultsCount / pageSize) || 0

  return (
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <UIComponents.Nav direction="row">
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <UIComponents.NavItem
        disabled={page === 1}
        onClick={page > 1 ? () => setPage(1) : _.noop}
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        icon={<UIComponents.IconBack />}
      />
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <UIComponents.NavItem
        disabled={page === 1}
        onClick={page > 1 ? () => setPage(page - 1) : _.noop}
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        icon={<UIComponents.IconPrevious />}
      />
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <div className="fmr-pagination-numbers">
        {page} of {totalPages}
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      </div>
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <UIComponents.NavItem
        disabled={page === totalPages}
        onClick={page < totalPages ? () => setPage(page + 1) : _.noop}
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        icon={<UIComponents.IconNext />}
      />
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <UIComponents.NavItem
        disabled={page === totalPages}
        onClick={page < totalPages ? () => setPage(totalPages) : _.noop}
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        icon={<UIComponents.IconForward />}
      />
    </UIComponents.Nav>
  )
}

export default Paginator
