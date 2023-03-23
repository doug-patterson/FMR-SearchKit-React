// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from 'lodash/fp'

// this should maintain state and disable whatever inputs you aren't using
// but always also respect the passed in disable props.

// to make the absolute intervals (previous full week, etc) work we'll need to send
// a timezone offset along with the selected value. (or set one up on the node and
// check here before including these options that it's set)
// ... actually we also need to send the offset with the endpoints too so we may as
// well do that now

const DateTimeInterval = ({
  title,
  from,
  to,
  interval,
  disableFrom,
  disableTo,
  disableInterval,
  onChange,
  UIComponents,
  layout
}: any) => (
  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
  <UIComponents.CardBody
    className={`fmr-date-time-intervals fmr-date-time-intervals--${
      layout === 'row' ? 'row' : 'column'
    }`}
  >
    {!disableInterval && (
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <UIComponents.Select
        label={'Interval'}
        value={interval || ''}
        options={[
          '',
          'Today',
          'Current Week',
          'Current Month',
          'Current Quarter',
          'Current Year',
          'Last Hour',
          'Last Two Hours',
          'Last Four Hours',
          'Last Eight Hours',
          'Last Twelve Hours',
          'Last Day',
          'Last Two Days',
          'Last Three Days',
          'Last Week',
          'Last Two Weeks',
          'Last Month',
          'Last Quarter',
          'Last Year',
          'Last Two Years',
          'Previous Full Day',
          'Previous Full Week',
          'Previous Full Month',
          'Previous Full Quarter',
          'Previous Full Year'
        ]}
        {...(onChange
          ? {
              onChange: (val: any) => {
                onChange({
                  interval: val,
                  from: null,
                  to: null,
                  offset: new Date().getTimezoneOffset()
                })
              }
            }
          : {
              name: `${title}[interval]`
            })}
      ></UIComponents.Select>
    )}
    {!disableFrom && (
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <UIComponents.Input
        type="datetime-local"
        placeholder={'Start'}
        {...(onChange
          ? {
              onChange: (val: any) => {
                onChange({
                  from: val,
                  interval: null,
                  offset: new Date().getTimezoneOffset()
                })
              },
              value: from || ''
            }
          : {
              name: `${title}[from]`,
              defaultValue: from || ''
            })}
      />
    )}
    {!disableTo && (
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <UIComponents.Input
        type="datetime-local"
        placeholder={'End'}
        {...(onChange
          ? {
              onChange: (val: any) => {
                onChange({
                  to: val,
                  interval: null,
                  offset: new Date().getTimezoneOffset()
                })
              },
              value: to || ''
            }
          : {
              name: `${title}[to]`,
              defaultValue: to || ''
            })}
      />
    )}
  </UIComponents.CardBody>
)

export default DateTimeInterval
