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
            options={_.map(label => ({ label, value: label }), [
              'Select',
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
            ])}
            onChange={val => onChange(val === 'Select' ? null : { interval: val, from: null, to: null, offset: null })}
            value={interval}
          ></UIComponents.Select>
        )}
        {!disableFrom && (
          <UIComponents.Input
            type="datetime-local"
            value={from || ''}
            placeholder={'Start'}
            onChange={val => onChange({ from: val, interval: null, offset: new Date().getTimezoneOffset()  }) }
          />
        )}
        {!disableTo && (
          <UIComponents.Input
            type="datetime-local"
            value={to || ''}
            placeholder={'End'}
            onChange={val => onChange({ to: val, interval: null, offset: new Date().getTimezoneOffset() }) }
          />
        )}
      </UIComponents.Grid>
    </UIComponents.CardBody>
  </UIComponents.Card>
)