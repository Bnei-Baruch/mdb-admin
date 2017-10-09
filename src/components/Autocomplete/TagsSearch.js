import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import escapeRegExp from 'lodash/escapeRegExp';
import { Search } from 'semantic-ui-react';

import * as shapes from '../shapes';
import { selectors } from '../../redux/modules/tags';
import { EMPTY_HIERARCHY, EMPTY_MAP } from '../../helpers/consts';
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

    const { tagsById, hierarchy } = this.props;

    const suggestions = hierarchy.roots
      .map((rootID) => {
        const root     = tagsById.get(rootID);
        const name     = extractI18n(root.i18n, ['label'])[0];
        const children = hierarchy.childMap.get(rootID) || [];
        const results  = children.map((tagId) => {
          const tag = tagsById.get(tagId);
          let title;
          for (const i18n of Object.values(tag.i18n)) {
            if (regex.test(i18n.label)) {
              title = i18n.label;
              break;
            }
          }
          return { id: tagId, title, key: tagId };
        }).filter(x => x.title !== undefined);

        return { name, results };
      })
      .filter(x => x.results.length > 0);

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
});

export default connect(mapState)(TagsSearch);
