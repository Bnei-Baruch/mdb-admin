import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Divider, Grid } from 'semantic-ui-react';

import { actions, selectors } from '../../redux/modules/sources';
import { selectors as authors } from '../../redux/modules/authors';
import { selectors as system } from '../../redux/modules/system';
import * as shapes from '../shapes';
import { FrownSplash, LoadingSplash } from '../shared/Splash';
import SourceMenu from './SourceMenu';
import SourceInfoForm from './SourceInfoForm';
import SourceI18nForm from './SourceI18nForm';
import SourceChildren from './SourceChildren';

class SourceContainer extends Component {
  static propTypes = {
    match: shapes.RouterMatch.isRequired,
    fetchItem: PropTypes.func.isRequired,
    getWIP: PropTypes.func.isRequired,
    source: shapes.Source,
  };

  static defaultProps = {
    source: null
  };

  componentDidMount() {
    const { match, fetchItem } = this.props;
    fetchItem(match.params.id);
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id } } } = prevProps;
    const nId                           = this.props.match.params.id;
    if (id !== nId) {
      this.props.fetchItem(id);
    }
  }

  render() {
    const { getWIP, source } = this.props;
    const wip                = getWIP('fetchItem');

    if (source) {
      return (
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <SourceMenu source={source} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column width={8}>
              <SourceInfoForm {...this.props} />
              <Divider horizontal hidden />
              <SourceI18nForm {...this.props} />
            </Grid.Column>
            <Grid.Column width={8}>
              <SourceChildren {...this.props} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }

    return wip
      ? <LoadingSplash text="Loading source details" subtext="Hold on tight..." />
      : (
        <FrownSplash
          text="Couldn't find source"
          subtext={<span>Try the <Link to="/sources">sources hierarchy</Link>...</span>}
        />
      );
  }
}

const mapState = (state, props) => ({
  source: selectors.getSourceById(state.sources)(parseInt(props.match.params.id, 10)),
  getSourceById: selectors.getSourceById(state.sources),
  hierarchy: selectors.getHierarchy(state.sources),
  getWIP: selectors.getWIP(state.sources),
  getError: selectors.getError(state.sources),
  getAuthorByCollectionId: authors.getAuthorByCollectionId(state.authors),
  currentLanguage: system.getCurrentLanguage(state.system),
});

function mapDispatch(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapState, mapDispatch)(SourceContainer);
