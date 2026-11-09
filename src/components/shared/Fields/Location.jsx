import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Form, Input } from 'semantic-ui-react';

import { countries } from '../../../helpers/countries';

class LocationField extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      country: props.country,
      city: props.city,
      fullAddress: props.fullAddress,
    };
  }

  handleCountryChange = (e, data) =>
    this.setState({ country: data.value }, () => this.props.onChange(this.state));

  handleCityChange = (e, data) =>
    this.setState({ city: data.value }, () => this.props.onChange(this.state));

  handleFullAddressChange = (e, data) =>
    this.setState({ fullAddress: data.value }, () => this.props.onChange(this.state));

  render() {
    const { country, city, fullAddress, err } = this.props;

    return (
      <div>
        <Form.Group widths="equal">
          <Form.Dropdown
            fluid
            search
            selection
            required
            label="Country"
            placeholder="Country"
            defaultValue={country}
            options={countries}
            error={err.country}
            onChange={this.handleCountryChange}
          />
          <Form.Field required error={err.city}>
            <label htmlFor="city">City</label>
            <Input
              id="city"
              placeholder="City"
              value={city}
              onChange={this.handleCityChange}
            />
          </Form.Field>
        </Form.Group>
        <Form.Field required error={err.fullAddress}>
          <label htmlFor="full_address">Full Address</label>
          <Input
            id="full_address"
            placeholder="Full Address"
            value={fullAddress}
            onChange={this.handleFullAddressChange}
          />
        </Form.Field>
      </div>
    );
  }
}

LocationField.propTypes = {
  country: PropTypes.string,
  city: PropTypes.string,
  fullAddress: PropTypes.string,
  err: PropTypes.shape({
    country: PropTypes.bool,
    city: PropTypes.bool,
    fullAddress: PropTypes.bool,
  }),
  onChange: PropTypes.func,
};

LocationField.defaultProps = {
  country: '',
  city: '',
  fullAddress: '',
  err: false,
  onChange: noop,
};

export default LocationField;
