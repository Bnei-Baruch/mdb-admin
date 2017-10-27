import PropTypes from 'prop-types';

export const Error = PropTypes.object;

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

const SecurePublished = {
  secure: PropTypes.number,
  published: PropTypes.bool,
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
  ...SecurePublished,
  name: PropTypes.string.isRequired,
  sha1: PropTypes.string,
  size: PropTypes.number,
  parent_id: PropTypes.number,
  type: PropTypes.string,
  subtype: PropTypes.string,
  mime_type: PropTypes.string,
  language: PropTypes.string,
  properties: PropTypes.object,
});

export const Operation = PropTypes.shape({
  ...TypedEntity,
  station: PropTypes.string,
  user_id: PropTypes.number,
  details: PropTypes.string,
  properties: PropTypes.object,
});

const BaseContentUnit = {
  ...TypedEntity,
  ...SecurePublished,
  properties: PropTypes.object,
  i18n: PropTypes.objectOf(ContentUnitI18n),
  files: PropTypes.arrayOf(PropTypes.number),
  sources: PropTypes.arrayOf(PropTypes.number),
  tags: PropTypes.arrayOf(PropTypes.number),
};

const BaseCollection = {
  ...TypedEntity,
  ...SecurePublished,
  properties: PropTypes.object,
  i18n: PropTypes.objectOf(CollectionI18n),
};

const BaseCollectionContentUnit = {
  collection_id: PropTypes.number,
  collection: PropTypes.shape(BaseCollection),
  content_unit_id: PropTypes.number,
  content_unit: PropTypes.shape(BaseContentUnit),
  name: PropTypes.string,
};

export const CollectionContentUnit = PropTypes.shape(BaseCollectionContentUnit);

BaseContentUnit.collections = PropTypes.arrayOf(CollectionContentUnit);
export const ContentUnit    = PropTypes.shape(BaseContentUnit);

BaseCollection.content_units = PropTypes.arrayOf(CollectionContentUnit);
export const Collection      = PropTypes.shape(BaseCollection);

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

export const Person = PropTypes.shape({
  id: PropTypes.number.isRequired,
  i18n: PropTypes.objectOf(AuthorI18n),
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

export const Storage = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  access: PropTypes.oneOf(['local', 'internet']),
  status: PropTypes.oneOf(['online', 'nearline', 'offline']),
});

export const filterConfigShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  Component: PropTypes.any, // react component
  props: PropTypes.object // props passed to the component
});

export const AsyncStatusMap = PropTypes.objectOf(PropTypes.shape({
  wip: PropTypes.bool,
  err: Error,
}));
