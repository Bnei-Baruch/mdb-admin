import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, Input, Grid } from 'semantic-ui-react';

class EditDeleteField extends PureComponent {

  static  propTypes = {
    remove: PropTypes.func,
    save: PropTypes.func,
    value: PropTypes.string
  };
  static defaultProps = {
    remove: null,
    save: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      pattern: '',
      error: false,
      isViewMode: true
    };
  }

  onInputChange = (e, { value }) => {
    let error = false;
    if (!value && value !== '0') {
      value = this.state.value;
      error = true;
      return this.setState({ error });
    }

    this.setState({ value, error });
  };

  save = ({ value }) => {
    if (this.state.error) {
      return;
    }
    this.props.save(value);
    this.setMode();
  };

  restore = () => {
    const value = this.props.value;

    this.setState({ isViewMode: true, value });
  };

  setMode = (isView = true) => {
    this.setState({ isViewMode: isView });
  };

  render() {
    const { isViewMode, value, error } = this.state;
    let iconProps = {
      bordered: true,
      corner: true,
    };

    let viewMode = (<Grid>
      <Grid.Column>
        {value}
      </Grid.Column>
      <Grid.Column>
        <Icon name="pencil"
              {...iconProps}
              color="grey"
              onClick={() => this.setMode(false)} />
      </Grid.Column>
      <Grid.Column>
        <Icon name="trash"
              color="grey"
              {...iconProps}
              onClick={this.props.remove} />
      </Grid.Column>
    </Grid>);

    let editMode = (<Grid>
      <Grid.Column>
        <Input
          value={value}
          error={error}
          onChange={this.onInputChange}/>
      </Grid.Column>
      <Grid.Column>
        <Icon name="checkmark"
              color="green"
              inverted={true}
              {...iconProps}
              onClick={this.save} />
      </Grid.Column>
      <Grid.Column>
        <Icon name="remove"
              color="red"
              inverted={true}
              {...iconProps}
              onClick={this.restore} />
      </Grid.Column>
    </Grid>);

    return isViewMode ? viewMode : editMode;
  }
}

export default EditDeleteField;
