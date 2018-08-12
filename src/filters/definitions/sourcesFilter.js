import { createFilterDefinition } from './util';
import { selectors } from '../../redux/modules/sources';
import { selectors as authors } from '../../redux/modules/authors';

const sourcesFilter = {
  name: 'sources-filter',
  queryKey: 'source',
  valueToQuery: value => value.join('_'),
  queryToValue: queryValue => queryValue.split('_'),
  valueToApiParam: value => ({ [value.length === 1 ? 'author' : 'source']: value[value.length - 1] }),
  tagIcon: 'book',
  valueToTagLabel: (value, props, { getState }) => {
    if (!value) {
      return '';
    }

    const getSourceById   = selectors.getSourceById(getState().sources);
    const getAuthorByCode = authors.getAuthorByCode(getState().authors);
    const path            = value.map(v => (Number.isNaN(v) ? getAuthorByCode(v) : getSourceById(parseFloat(v))));

    // Make sure we have all items.
    // Location hydration probably happens before we receive sources
    return path.some(x => !x) ? '' : path.map(x => x.i18n.he.name).join(' > ');
  }
};

export default createFilterDefinition(sourcesFilter);
