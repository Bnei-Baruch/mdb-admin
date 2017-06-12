import PropTypes from 'prop-types';

export const RouterMatch = PropTypes.shape({
  path: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  params: PropTypes.object,
  isExact: PropTypes.bool,
});

export const HistoryLocation = PropTypes.shape({
  pathname: PropTypes.string,
  search: PropTypes.string,
  hash: PropTypes.string,
  key: PropTypes.string,
  state: PropTypes.object,
});

const BaseEntity = {
  id: PropTypes.number.isRequired,
  uid: PropTypes.string.isRequired,
  created_at: PropTypes.string.isRequired,
};

const TypedEntity = {
  ...BaseEntity,
  type_id: PropTypes.number.isRequired,
};

const BaseI18n = {
  language: PropTypes.string.isRequired,
  created_at: PropTypes.string,
};

const NameDescriptionI18n = {
  ...BaseI18n,
  name: PropTypes.string,
  description: PropTypes.string,
};

export const CollectionI18n = PropTypes.shape({
  ...NameDescriptionI18n,
  collection_id: PropTypes.number,
});

export const ContentUnitI18n = PropTypes.shape({
  ...NameDescriptionI18n,
  content_unit_id: PropTypes.number,
});

export const SourceI18n = PropTypes.shape({
  ...NameDescriptionI18n,
  source_id: PropTypes.number,
});

export const AuthorI18n = PropTypes.shape({
  ...BaseI18n,
  author_id: PropTypes.number,
  name: PropTypes.string,
  full_name: PropTypes.string,
});

export const TagI18n = PropTypes.shape({
  ...BaseI18n,
  tag_id: PropTypes.number,
  label: PropTypes.string,
});

export const File = PropTypes.shape({
  ...BaseEntity,
  name: PropTypes.string.isRequired,
  sha1: PropTypes.string,
  size: PropTypes.number,
  type: PropTypes.string,
  subtype: PropTypes.string,
  mime_type: PropTypes.string,
  language: PropTypes.string,
});

export const ContentUnit = PropTypes.shape({
  ...TypedEntity,
  i18n: PropTypes.objectOf(ContentUnitI18n),
  files: PropTypes.arrayOf(File),
});

export const Collection = PropTypes.shape({
  ...TypedEntity,
  i18n: PropTypes.objectOf(CollectionI18n),
  content_units: PropTypes.arrayOf(ContentUnit),
});

export const Source = PropTypes.shape({
  ...TypedEntity,
  parent_id: PropTypes.number,
  position: PropTypes.number,
  pattern: PropTypes.string,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  i18n: PropTypes.objectOf(SourceI18n),
});

export const Author = PropTypes.shape({
  id: PropTypes.number.isRequired,
  code: PropTypes.string.isRequired,
  created_at: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  full_name: PropTypes.string,
  i18n: PropTypes.objectOf(AuthorI18n),
  sources: PropTypes.arrayOf(PropTypes.number),
});

export const Tag = PropTypes.shape({
  id: PropTypes.number.isRequired,
  uid: PropTypes.string.isRequired,
  parent_id: PropTypes.number,
  pattern: PropTypes.string,
  description: PropTypes.string,
  i18n: PropTypes.objectOf(TagI18n),
});

export const Hierarchy = PropTypes.shape({
  roots: PropTypes.arrayOf(PropTypes.number),
  childMap: PropTypes.instanceOf(Map),  // ID => [...IDs]
});