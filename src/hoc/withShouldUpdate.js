import React, { PureComponent } from 'react';
import isEqualWith from 'lodash/isEqualWith';

const shouldUpdate = (WrappedComponent) => {
  return class DataLoader extends PureComponent {
    shouldComponentUpdate(nextProps) {
      const nProps = nextProps.children.props;
      const props  = this.props.children.props;
      if (nextProps.propForUpdate) {
        return !isEqualWith(nProps[nextProps.propForUpdate], props[nextProps.propForUpdate]);
      }
      return !isEqualWith(nProps, props);
    };

    render() {
      const { propForUpdate, ...props } = this.props;
      console.log('render', props);
      return (
        <WrappedComponent {...props} />
      );
    }
  };
};

export default shouldUpdate;
