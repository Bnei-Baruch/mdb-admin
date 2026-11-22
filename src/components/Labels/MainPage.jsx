import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Sticky } from '../ui';

import { EMPTY_ARRAY } from '../../helpers/consts';
import * as shapes from '../shapes';
import ErrWip from '../shared/ErrWip';
import Pagination from '../shared/Pagination';
import ResultsPageHeader from '../shared/ResultsPageHeader';

import LabelList from './List';

class LabelsMainPage extends Component {
  static propTypes = {
    pageNo: PropTypes.number,
    total: PropTypes.number,
    items: PropTypes.arrayOf(shapes.Publisher),
    wip: PropTypes.bool,
    err: shapes.Error,
    onPageChange: PropTypes.func.isRequired,
    currentLanguage: PropTypes.string.isRequired,
  };

  static defaultProps = {
    items: EMPTY_ARRAY,
    pageNo: 1,
    total: 0,
    wip: false,
    err: null
  };

  render() {
    const
      {
        pageNo,
        total,
        items,
        wip,
        err,
        onPageChange,
        currentLanguage,
      } = this.props;

    return (
      <div>
        <div style={{ clear: 'both', marginTop: '5px' }}>
          <Grid>
            <Grid.Row className="pt-4">
              <Grid.Column>
                <Sticky className="py-2 text-right">
                  <ErrWip err={err} wip={wip} />
                  <ResultsPageHeader pageNo={pageNo} total={total} />
                  <Pagination pageNo={pageNo} total={total} onChange={onPageChange} />
                </Sticky>
                <LabelList items={items} currentLanguage={currentLanguage} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default LabelsMainPage;
