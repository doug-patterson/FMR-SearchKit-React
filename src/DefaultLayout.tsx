import React, { CSSProperties } from 'react'

const DefaultLayout = ({
  children,
  style
}: {
  children: React.ReactNode
  style: CSSProperties
}) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      gridTemplateAreas: `
      'filters results results results'
    `,
      gap: 10,
      ...style
    }}
  >
    {children}
  </div>
)

export default DefaultLayout
