import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
  ArchiveBoxIcon,
  ArrowDownIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ArrowUpIcon,
  BarsArrowDownIcon,
  BookOpenIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CodeBracketIcon,
  DocumentIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  EyeSlashIcon,
  FaceFrownIcon,
  FilmIcon,
  FunnelIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  MusicalNoteIcon,
  NoSymbolIcon,
  PencilIcon,
  PhotoIcon,
  PlusIcon,
  PresentationChartBarIcon,
  ShieldCheckIcon,
  TableCellsIcon,
  TagIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';

import { TEXT } from './colors';

// Semantic UI icon names used in this app -> Heroicons.
export const ICONS = {
  'angle double left' : ChevronDoubleLeftIcon,
  'angle double right': ChevronDoubleRightIcon,
  'angle left'        : ChevronLeftIcon,
  'angle right'       : ChevronRightIcon,
  'left angle'        : ChevronLeftIcon,
  'right angle'       : ChevronRightIcon,
  'dropdown'          : ChevronDownIcon,
  'arrow up'          : ArrowUpIcon,
  'arrow down'        : ArrowDownIcon,
  'ban'               : NoSymbolIcon,
  'book'              : BookOpenIcon,
  'calendar'          : CalendarIcon,
  'checkmark'         : CheckIcon,
  'close'             : XMarkIcon,
  'remove'            : XMarkIcon,
  'download'          : ArrowDownTrayIcon,
  'filter'            : FunnelIcon,
  'frown'             : FaceFrownIcon,
  'pencil'            : PencilIcon,
  'plus'              : PlusIcon,
  'privacy'           : LockClosedIcon,
  'protect'           : ShieldCheckIcon,
  'search'            : MagnifyingGlassIcon,
  'sort numeric down' : BarsArrowDownIcon,
  'spinner'           : ArrowPathIcon,
  'spy'               : EyeSlashIcon,
  'tag'               : TagIcon,
  'trash'             : TrashIcon,
  'warning sign'      : ExclamationTriangleIcon,
  // file types (helpers/utils.js fileIcon)
  'file outline'           : DocumentIcon,
  'file archive outline'   : ArchiveBoxIcon,
  'file audio outline'     : MusicalNoteIcon,
  'file code outline'      : CodeBracketIcon,
  'file excel outline'     : TableCellsIcon,
  'file image outline'     : PhotoIcon,
  'file pdf outline'       : DocumentTextIcon,
  'file powerpoint outline': PresentationChartBarIcon,
  'file text outline'      : DocumentTextIcon,
  'file video outline'     : FilmIcon,
  'file word outline'      : DocumentTextIcon,
};

const SIZES = {
  mini : 'size-3',
  tiny : 'size-3.5',
  small: 'size-4',
  large: 'size-6',
  big  : 'size-8',
  huge : 'size-12',
};

const Icon = ({ name, color, size, loading, className, onClick, ...rest }) => {
  const Svg = ICONS[name];
  if (!Svg) {
    if (name && import.meta.env.DEV) {
      console.warn(`ui/Icon: unknown icon "${name}"`);
    }
    return null;
  }

  return (
    <Svg
      aria-hidden={!onClick}
      onClick={onClick}
      className={cx(
        'inline-block shrink-0 align-[-0.125em]',
        SIZES[size] || 'size-[1.1em]',
        TEXT[color],
        { 'animate-spin': loading || name === 'spinner', 'cursor-pointer': onClick },
        className
      )}
      {...rest}
    />
  );
};

Icon.propTypes = {
  name     : PropTypes.string,
  color    : PropTypes.string,
  size     : PropTypes.string,
  loading  : PropTypes.bool,
  className: PropTypes.string,
  onClick  : PropTypes.func,
};

/** Accepts a Semantic-style `icon` prop: name string, `{ name, ...props }` object, or a ready element. */
export const renderIcon = (icon, props) => {
  if (!icon || icon === true) {
    return null;
  }
  if (React.isValidElement(icon)) {
    return icon;
  }
  if (typeof icon === 'object') {
    return <Icon {...props} {...icon} />;
  }
  return <Icon name={icon} {...props} />;
};

export default Icon;
