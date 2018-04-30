import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import escapeRegExp from 'lodash/escapeRegExp';
import { Search } from 'semantic-ui-react';

import * as shapes from '../shapes';
import { selectors } from '../../redux/modules/tags';
import { EMPTY_HIERARCHY, EMPTY_MAP } from '../../helpers/consts';
import { selectors as system } from '../../redux/modules/system';
import { extractI18n } from '../../helpers/utils';

class TagsSearch extends Component {

  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    tagsById: PropTypes.instanceOf(Map),
    hierarchy: shapes.Hierarchy,
    placeholder: PropTypes.string,

  };

  static defaultProps = {
    tagsById: EMPTY_MAP,
    hierarchy: EMPTY_HIERARCHY,
    placeholder: 'חפש תגית',
  };

  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () => this.setState({ suggestions: [], query: '' });

  doFilter = debounce(() => {
    const query        = this.state.query;
    const escapedValue = escapeRegExp(query.trim());
    if (escapedValue === '') {
      this.resetComponent();
      return;
    }

    const regex = new RegExp(escapedValue, 'i');

    const { tagsById, hierarchy, currentLanguage } = this.props;

    // search in each tag family
    const suggestions = hierarchy.roots.reduce((acc, rootID) => {
      const children = hierarchy.childMap.get(rootID) || [];

      const results = [];

      // DFS (pre-order) this tag family
      let s = [...children];
      while (s.length > 0) {
        const nodeID = s.shift();
        if (hierarchy.childMap.has(nodeID)) {
          s = hierarchy.childMap.get(nodeID).concat(s);
        }

        const node = tagsById.get(nodeID);
        let title;
        for (const i18n of Object.values(node.i18n)) {
          if (regex.test(i18n.label)) {
            title = i18n.label;
            break;
          }
        }
        if (title) {
          results.push({ id: nodeID, title, key: nodeID });
        }
      }

      if (results.length > 0) {
        const root = tagsById.get(rootID);
        const name = extractI18n(root.i18n, ['label'], currentLanguage)[0];
        acc.push({ name, results });
      }

      return acc;
    }, []);

    this.setState({ query, suggestions });
  }, 150);

  handleResultSelect = (e, data) => {
    this.props.onSelect(data.result);
    this.resetComponent();
  };

  handleSearchChange = (e, data) => {
    this.setState({ query: data.value });
    this.doFilter();
  };

  renderResult = (result) => {
    const { query }     = this.state;
    const { id, title } = result;

    const escapedValue = escapeRegExp(query.trim());
    if (escapedValue === '') {
      return <div key={id}>{title}</div>;
    }

    const regex  = new RegExp(escapedValue, 'i');
    const markup = title.replace(regex, match => `<strong>${match}</strong>`);
    return <div key={id} dangerouslySetInnerHTML={{ __html: markup }} />;
  };

  render() {
    const { placeholder }        = this.props;
    const { query, suggestions } = this.state;

    return (
      <Search
        category
        aligned="right"
        placeholder={placeholder}
        className="rtl-dir"
        noResultsMessage="לא נמצאו תגיות."
        onResultSelect={this.handleResultSelect}
        onSearchChange={this.handleSearchChange}
        resultRenderer={this.renderResult}
        results={suggestions}
        value={query}
      />
    );
  }
}

const mapState = state => ({
  tagsById: selectors.getTags(state.tags),
  hierarchy: selectors.getHierarchy(state.tags),
  currentLanguage: system.getCurrentLanguage(state.system),
});

export default connect(mapState)(TagsSearch);
