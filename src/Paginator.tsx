import React from 'react'
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
    <UIComponents.Nav direction="row">
      <UIComponents.NavItem
        disabled={page === 1}
        onClick={page > 1 ? () => setPage(1) : _.noop}
        icon={<UIComponents.IconBack />}
      />
      <UIComponents.NavItem
        disabled={page === 1}
        onClick={page > 1 ? () => setPage(page - 1) : _.noop}
        icon={<UIComponents.IconPrevious />}
      />
      <div className="fmr-pagination-numbers">
        {page} of {totalPages}
      </div>
      <UIComponents.NavItem
        disabled={page === totalPages}
        onClick={page < totalPages ? () => setPage(page + 1) : _.noop}
        icon={<UIComponents.IconNext />}
      />
      <UIComponents.NavItem
        disabled={page === totalPages}
        onClick={page < totalPages ? () => setPage(totalPages) : _.noop}
        icon={<UIComponents.IconForward />}
      />
    </UIComponents.Nav>
  )
}

export default Paginator
