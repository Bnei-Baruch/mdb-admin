import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import escapeRegExp from 'lodash/escapeRegExp';
import { Search } from 'semantic-ui-react';

import * as shapes from '../shapes';
import { selectors } from '../../redux/modules/sources';
import { selectors as authorsSelectors } from '../../redux/modules/authors';
import { selectors as system } from '../../redux/modules/system';
import { EMPTY_ARRAY, EMPTY_HIERARCHY, EMPTY_MAP } from '../../helpers/consts';
import { extractI18n } from '../../helpers/utils';

class SourcesSearch extends Component {

  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    authors: PropTypes.arrayOf(shapes.Author),
    sourcesById: PropTypes.instanceOf(Map),
    hierarchy: shapes.Hierarchy,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    authors: EMPTY_ARRAY,
    sourcesById: EMPTY_MAP,
    hierarchy: EMPTY_HIERARCHY,
    placeholder: 'חפש מקור',
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

    const { authors, sourcesById, hierarchy, currentLanguage } = this.props;

    const suggestions = authors.reduce((acc, author) => {
      const authorName  = extractI18n(author.i18n, ['name'], currentLanguage)[0];
      const collections = author.sources || [];

      // search in author's collections themselves
      let results = collections.reduce((res, id) => {
        // collection matches ?
        const node = sourcesById.get(id);
        let title;
        for (const i18n of Object.values(node.i18n)) {
          if (regex.test(i18n.name)) {
            title = i18n.name;
            break;
          }
        }

        if (title) {
          res.push({ id, title, key: id });
        }

        return res;
      }, []);
      if (results.length > 0) {
        acc.push({ name: authorName, results });
      }

      // search in each collection
      collections.forEach((cID) => {
        results = [];

        // DFS (pre-order) this collection
        let s = [...(hierarchy.childMap.get(cID) || [])];
        while (s.length > 0) {
          const id       = s.shift();
          const children = hierarchy.childMap.get(id);
          if (children) {
            s = children.concat(s);
          }

          const node = sourcesById.get(id);
          let title;
          for (const i18n of Object.values(node.i18n)) {
            if (regex.test(i18n.name)) {
              title = i18n.name;
              break;
            }
          }

          if (title) {
            results.push({ id, title, key: id });
          }
        }

        if (results.length > 0) {
          const collection = sourcesById.get(cID);
          const name       = extractI18n(collection.i18n, ['name'], currentLanguage)[0];
          acc.push({ name: `${authorName} - ${name}`, results });
        }
      });

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
    const { suggestions, query } = this.state;

    return (
      <Search
        category
        aligned="right"
        placeholder={placeholder}
        className="rtl-dir"
        noResultsMessage="לא נמצאו מקורות."
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
  authors: authorsSelectors.getAuthorsList(state.authors),
  sourcesById: selectors.getSources(state.sources),
  hierarchy: selectors.getHierarchy(state.sources),
  currentLanguage: system.getCurrentLanguage(state.system),
});

export default connect(mapState)(SourcesSearch);
