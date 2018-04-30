import React, { PureComponent } from 'react';
import isEqualWith from 'lodash/isEqualWith';

const shouldUpdate = (WrappedComponent) => {
  return class DataLoader extends PureComponent {
    shouldComponentUpdate(nextProps) {
      if (!nextProps.children) {
        return true;
      }
      const nProps = nextProps.children;
      const props  = this.props.children;
      if (nextProps.propForUpdate) {
        return !isEqualWith(nProps[nextProps.propForUpdate], props[nextProps.propForUpdate]);
      }
      return !isEqualWith(nProps, props);
    };

    render() {
      const { propForUpdate, ...props } = this.props;
      return (
        <WrappedComponent {...props} />
      );
    }
  };
};

export default shouldUpdate;
