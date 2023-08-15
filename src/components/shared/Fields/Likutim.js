import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Form, List, Search } from 'semantic-ui-react';
import noop from 'lodash/noop';
import debounce from 'lodash/debounce';
import escapeRegExp from 'lodash/escapeRegExp';
import moment from 'moment/moment';

import { selectors as sources, actions } from '../../../redux/modules/sources';
import { selectors } from '../../../redux/modules/content_units';
import { CT_LIKUTIM, CONTENT_UNIT_TYPES } from '../../../helpers/consts';
import { extractI18n } from '../../../helpers/utils';

const LikutimField = (props) => {
  const [query, setQuery]             = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const { wip, fetched, err } = useSelector(state => sources.getLikutimStatus(state.sources));
  const denorm                = useSelector(state => selectors.getCUsByFilter(state.content_units));
  const dispatch              = useDispatch();

  const { uids = [], onChange } = props;
  const needFetch               = !wip && !err && !fetched;
  useEffect(() => {
    if (needFetch) dispatch(actions.fetchAllLikutim());
  }, [needFetch]);

  const allLikutim = useMemo(() => denorm(cu => cu.type_id === CONTENT_UNIT_TYPES[CT_LIKUTIM].value), [fetched]);
  const likutim    = allLikutim.filter(cu => uids.includes(cu.uid));

  const add    = (e, { result: { id: uid } }) => onChange([...uids, uid]);
  const remove = (e, { uid }) => onChange(uids.filter(x => x !== uid));

  const renderLikut = (l) => {
    const name = extractI18n(l.i18n, ['name'], 'he')[0];
    return (
      <List.Item key={l.uid}>
        <List.Content>
          {`${name} (${moment.utc(l.film_date).format('YYYY-MM-DD')})`}
          <Button
            onClick={(e) => remove(e, l)}
            circular
            compact
            size="mini"
            icon="remove"
            color="red"
            inverted
            floated="right"
          />
        </List.Content>
      </List.Item>
    );
  };

  const renderSearchItem = (item) => {
    return <div> {`${item.title} (${moment.utc(item.film_date).format('YYYY-MM-DD')})`} </div>;
  };

  const handleSearchChange = debounce((e, data) => {
    const q = escapeRegExp(data.value.trim());
    setQuery(q);
    if (q.length === 0) {
      setSuggestions([]);
      return;
    }

    const regex = new RegExp(q, 'i');
    const resp  = [];
    allLikutim.forEach(l => {
      Object.entries(l.i18n).some(([key, val]) => {
        const title = val.name;
        if (!regex.test(title)) return false;
        resp.push({ id: l.uid, title, film_date: l.properties.film_date });
        return true;
      });
    });
    setSuggestions(resp);
  }, 100);
  console.log('render suggestions', suggestions);
  return (
    <Form.Field error={err}>
      <List>
        {
          likutim.map(renderLikut)
        }
      </List>
      <Search
        fluid
        aligned="right"
        placeholder="הוסף ליקוטי מקובלים"
        className="rtl-dir"
        noResultsMessage="לא נמצאו תגיות."
        onResultSelect={add}
        resultRenderer={renderSearchItem}
        onSearchChange={handleSearchChange}
        results={suggestions}
        value={query}
      />
    </Form.Field>
  );
};

LikutimField.propTypes = {
  uids: PropTypes.arrayOf(PropTypes.string),
  err: PropTypes.bool,
  onChange: PropTypes.func
};

LikutimField.defaultProps = {
  value: [],
  err: false,
  onChange: noop,
  likutim: [],
};

export default LikutimField;
