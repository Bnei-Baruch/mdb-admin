import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Button, Form, List } from 'semantic-ui-react';
import noop from 'lodash/noop';

import { selectors } from '../../../redux/modules/tags';
import TagBreadcrumbs from '../../Tags/TagBreadcrumbs';
import TagsSearch from '../../Autocomplete/TagsSearch';

const TagsField = (props) => {
  const [tags, setTags] = useState([]);

  const getTagById  = useSelector(state => selectors.getTagById(state.tags));
  const getTagByUID = useSelector(state => selectors.getTagByUID(state.tags));
  const hierarchy   = useSelector(state => selectors.getHierarchy(state.tags));

  const { tagsUIDs, dispatch, err, onChange, ...rest } = props;

  useEffect(() => {
    if (!hierarchy.roots.length !== 0 && hierarchy.childMap.length !== 0) {
      const tagz = tagsUIDs.map(getTagByUID).filter(t => t);
      setTags(tagz);
    }
  }, [tagsUIDs, hierarchy.roots, hierarchy.childMap]);

  const addTag = (d) => {
    const uIDs = [...tagsUIDs];
    const tag  = getTagById(d.id);
    if (uIDs.findIndex(uid => uid === tag.uid) !== -1) {
      return;
    }
    uIDs.push(tag.uid);
    onChange(uIDs);
  };

  const removeTag = (e, tag) => {
    const uIDs  = [...tagsUIDs];
    const index = uIDs.findIndex(uid => uid === tag.uid);
    if (index === -1) {
      return;
    }
    uIDs.splice(index, 1);
    onChange(uIDs);
  };

  const renderTag = (t) => {
    return (
      <List.Item key={t.uid}>
        <List.Content>
          <TagBreadcrumbs tag={t} lastIsLink />
          <Button
            onClick={(e) => removeTag(e, t)}
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

  return (
    <Form.Field error={err} {...rest}>
      <List>
        {
          tags.map(renderTag)
        }
      </List>
      <TagsSearch placeholder="הוסף תאג" onSelect={addTag} />
    </Form.Field>
  );
};

TagsField.propTypes = {
  value: PropTypes.arrayOf(PropTypes.any),
  err: PropTypes.bool,
  onChange: PropTypes.func
};

TagsField.defaultProps = {
  value: [],
  err: false,
  onChange: noop,
  tagsUIDs: [],
};

export default TagsField;
