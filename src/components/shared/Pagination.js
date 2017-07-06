import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Icon, Menu } from 'semantic-ui-react';

import { PAGE_SIZE } from '../../helpers/consts';

class Pagination extends PureComponent {

  static propTypes = {
    total: PropTypes.number,
    pageNo: PropTypes.number,
    pageSize: PropTypes.number,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    pageNo: 1,
    total: 0,
    pageSize: PAGE_SIZE,
    onChange: noop,
  };

  handleClick = (e, data) => {
    if (data.disabled) {
      return;
    }

    const { total, pageSize, pageNo, onChange } = this.props;

    let val;
    if (data.name === 'first') {
      val = 1;
    } else if (data.name === 'prev') {
      val = pageNo - 1;
    } else if (data.name === 'next') {
      val = pageNo + 1;
    } else if (data.name === 'last') {
      val = Math.ceil(total / pageSize);
    }

    onChange(val);
  };

  render() {
    const { total, pageSize, pageNo } = this.props;

    const current      = pageNo === 0 ? 1 : pageNo;
    const totalBlocks  = Math.ceil(total / pageSize);
    const prevDisabled = current === 1;
    const nextDisabled = current === totalBlocks;

    return (
      <Menu compact pagination size="mini" color="blue">
        <Menu.Item name="first" onClick={this.handleClick} disabled={prevDisabled}>
          <Icon name="angle double left" />
        </Menu.Item>
        <Menu.Item name="prev" onClick={this.handleClick} disabled={prevDisabled}>
          <Icon name="angle left" />
        </Menu.Item>
        <Menu.Item name="next" onClick={this.handleClick} disabled={nextDisabled}>
          <Icon name="angle right" />
        </Menu.Item>
        <Menu.Item name="last" onClick={this.handleClick} disabled={nextDisabled}>
          <Icon name="angle double right" />
        </Menu.Item>
      </Menu>
    );
  }
}

export default Pagination;
