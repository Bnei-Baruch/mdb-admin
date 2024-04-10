import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Divider, Grid } from 'semantic-ui-react';
import { selectors as system } from '../../redux/modules/system';

import { actions, selectors } from '../../redux/modules/tags';
import * as shapes from '../shapes';
import { FrownSplash, LoadingSplash } from '../shared/Splash';
import TagChildren from './TagChildren';
import TagI18nForm from './TagI18nForm';
import TagInfoForm from './TagInfoForm';
import TagMenu from './TagMenu';
import { withRouter } from '../../helpers/withRouterPatch';

class TagContainer extends Component {
  static propTypes = {
    match    : shapes.RouterMatch.isRequired,
    fetchItem: PropTypes.func.isRequired,
    fetchAll : PropTypes.func.isRequired,
    getWIP   : PropTypes.func.isRequired,
    tag      : shapes.Tag,
  };

  static defaultProps = {
    tag: null
  };

  componentDidMount() {
    const { match: { params: { id } } } = this.props;
    this.askForData(id);
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id } } } = prevProps;
    const nId                           = this.props.match.params.id;
    if (id !== nId) {
      this.askForData(nId);
    }
  }

  askForData(id) {
    this.props.fetchItem(id);

    // TODO: Maybe we can skip this call if we know for sure that our children are already in the store
    this.props.fetchAll();
  }

  render() {
    const { getWIP, tag } = this.props;
    const wip             = getWIP('fetchItem');

    if (tag) {
      return (
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <TagMenu {...this.props} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column width={8}>
              <TagInfoForm {...this.props} />
              <Divider horizontal hidden />
              <TagI18nForm {...this.props} />
            </Grid.Column>
            <Grid.Column width={8}>
              <TagChildren {...this.props} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }

    return wip
      ? <LoadingSplash text="Loading tag details" subtext="Hold on tight..." />
      : (
        <FrownSplash
          text="Couldn't find tag"
          subtext={<span>Try the <Link to="/tags">tags hierarchy</Link>...</span>}
        />
      );
  }
}

const mapState = (state, props) => ({
  tag            : selectors.getTagById(state.tags)(parseInt(props.match.params.id, 10)),
  getTagById     : selectors.getTagById(state.tags),
  getTags        : selectors.getTags(state.tags),
  hierarchy      : selectors.getHierarchy(state.tags),
  getWIP         : selectors.getWIP(state.tags),
  getError       : selectors.getError(state.tags),
  currentLanguage: system.getCurrentLanguage(state.system),
});

function mapDispatch(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default withRouter(connect(mapState, mapDispatch)(TagContainer));
