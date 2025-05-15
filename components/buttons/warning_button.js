import { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * WarningMessage component
 * Props:
 * - message: string to display
 * - visible: boolean to control visibility
 * - onClose: function called when the message auto-closes
 */
export default function WarningMessage({ message, visible, onClose }) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <>
      <div className="fixed top-4 right-4 bg-red-400 text-black px-4 py-2 rounded shadow-lg z-50">
        {message}
        <div
          className="absolute bottom-0 left-0 h-1 bg-red-600"
          style={{ animation: 'progress 5s linear forwards' }}
        />
      </div>
      <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0; }
        }
      `}</style>
    </>
  );
}

WarningMessage.propTypes = {
  message: PropTypes.string.isRequired,
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

WarningMessage.defaultProps = {
  visible: false,
};