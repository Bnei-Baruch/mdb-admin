import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';

// Semantic-compatible Modal on top of Headless UI Dialog (focus trap, Esc, scroll lock).

const SIZES = {
  mini      : 'sm:max-w-sm',
  tiny      : 'sm:max-w-md',
  small     : 'sm:max-w-xl',
  large     : 'sm:max-w-5xl',
  fullscreen: 'sm:max-w-[95vw]',
};

const Modal = ({
  open = false,
  onClose,
  size,
  closeIcon,
  closeOnDimmerClick = true,
  closeOnEscape = true,
  centered, basic, dimmer,
  className,
  children,
}) => {
  const close = e => {
    if (onClose) {
      onClose(e, {});
    }
  };

  // Headless UI reports both Esc and outside click through a single onClose.
  // Distinguish them via the last keyboard event so the Semantic flags keep working.
  const lastKeyRef = React.useRef(null);
  const handleDialogClose = () => {
    const viaEscape = lastKeyRef.current === 'Escape';
    lastKeyRef.current = null;
    if (viaEscape ? closeOnEscape : closeOnDimmerClick) {
      close(undefined);
    }
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} className="relative z-50">
      <DialogBackdrop transition className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-200 data-leave:duration-150" />
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto" onKeyDownCapture={e => { lastKeyRef.current = e.key; }}>
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className={cx(
              'relative w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all',
              'data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-200 data-leave:duration-150',
              SIZES[size] || 'sm:max-w-2xl',
              className
            )}
          >
            {closeIcon && (
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute top-3 right-3 z-10 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <XMarkIcon className="size-5" />
              </button>
            )}
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

Modal.propTypes = {
  open              : PropTypes.bool,
  onClose           : PropTypes.func,
  size              : PropTypes.string,
  closeIcon         : PropTypes.bool,
  closeOnDimmerClick: PropTypes.bool,
  closeOnEscape     : PropTypes.bool,
  centered          : PropTypes.bool,
  basic             : PropTypes.bool,
  dimmer            : PropTypes.any,
  className         : PropTypes.string,
  children          : PropTypes.node,
};

const ModalHeader = ({ content, children, className }) => (
  <DialogTitle as="div" className={cx('border-b border-gray-200 px-6 py-4 pr-12 text-lg font-semibold text-gray-900', className)}>
    {children ?? content}
  </DialogTitle>
);

ModalHeader.propTypes = { content: PropTypes.node, children: PropTypes.node, className: PropTypes.string };

const ModalContent = ({ scrolling, content, children, className }) => (
  <div className={cx('px-6 py-5 text-sm text-gray-800', scrolling && 'max-h-[70vh] overflow-y-auto', className)}>
    {children ?? content}
  </div>
);

ModalContent.propTypes = {
  scrolling: PropTypes.bool,
  content  : PropTypes.node,
  children : PropTypes.node,
  className: PropTypes.string,
};

const ModalActions = ({ children, className }) => (
  <div className={cx('flex flex-wrap items-center justify-end gap-2 border-t border-gray-200 bg-gray-50 px-6 py-3 [&>*]:float-none [&>*]:m-0', className)}>
    {children}
  </div>
);

ModalActions.propTypes = { children: PropTypes.node, className: PropTypes.string };

Modal.Header  = ModalHeader;
Modal.Content = ModalContent;
Modal.Actions = ModalActions;

export default Modal;
