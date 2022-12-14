import React from 'react'
import _ from 'lodash/fp'

// this should maintain state and disable whatever inputs you aren't using
// but always also respect the passed in disable props.

// to make the absolute intervals (previous full week, etc) work we'll need to send 
// a timezone offset along with the selected value. (or set one up on the node and
// check here before including these options that it's set)
// ... actually we also need to send the offset with the endpoints too so we may as
// well do that now

export default ({ title, from, to, interval, disableFrom, disableTo, disableInterval, onChange, UIComponents }) => (
  <UIComponents.Card>
    <UIComponents.CardHeader>
      {_.startCase(title)}
    </UIComponents.CardHeader>
    <UIComponents.CardBody>
      <UIComponents.Grid
        columns={'1fr'}
        rows={'40px 40px 40px'}
      >
        {!disableInterval && (
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
              'Last Day',
              'Last Two Days',
              'Last Three Days',
              'Last Week',
              'Last Month',
              'Last Quarter',
              'Last Year',
              'Last Two Years',
              /*'Previous Full Day',
              'Previous Full Week',
              'Previous Full Month',
              'Previous Full Quarter',
              'Previous Full Year',*/
            ]}
            {...(onChange ? {
              onChange: val => onChange(val === 'Select' ? null : { interval: val, from: null, to: null, offset: null })
            } : {
              name: `${title}[interval]`
            })}
          ></UIComponents.Select>
        )}
        {!disableFrom && (
          <UIComponents.Input
            type="datetime-local"
            placeholder={'Start'}
            {...onChange ? {
              onChange: val => onChange({ from: val, interval: null, offset: new Date().getTimezoneOffset()  }),
              value: from || ''
            } : {
              name: `${title}[from]`,
              defaultValue: from || ''
            }}
          />
        )}
        {!disableTo && (
          <UIComponents.Input
            type="datetime-local"
            placeholder={'End'}
            {...onChange ? {
              onChange: val => onChange({ to: val, interval: null, offset: new Date().getTimezoneOffset() }),
              value: to || ''
            } : {
              name: `${title}[to]`,
              defaultValue: to || ''
            }}
          />
        )}
      </UIComponents.Grid>
    </UIComponents.CardBody>
  </UIComponents.Card>
)