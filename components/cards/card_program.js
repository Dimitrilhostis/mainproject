import PropTypes from 'prop-types';

/**
 * Card component with fixed dimensions and hover scale effect
 */
export default function Card({ title, content, category }) {
  return (
    <div className="w-64 h-80 rounded-lg shadow-lg overflow-hidden bg-white flex flex-col transform transition-transform duration-200 hover:scale-105">
      <div className="p-4 flex-grow">
        <h2 className="text-lg font-semibold text-gray-800 mb-2 truncate">{title}</h2>
        <p className="text-gray-600 text-sm overflow-auto">{content}</p>
      </div>
      {category && (
        <div className="px-4 py-2 bg-gray-100">
          <span className="text-xs uppercase font-bold text-gray-700">{category}</span>
        </div>
      )}
    </div>
  );
}
Card.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  category: PropTypes.string,
};

/**
 * CardSpecial component with fixed dimensions and hover scale effect
 */
export function CardSpecial({ title, content, extra, category }) {
  return (
    <div className="w-80 h-96 rounded-lg shadow-xl overflow-hidden bg-white flex flex-col transform transition-transform duration-200 hover:scale-105">
      <div className="p-6 flex-grow">
        <h2 className="text-xl font-bold text-gray-800 mb-3 truncate">{title}</h2>
        <p className="text-gray-700 text-base mb-4 overflow-auto">{content}</p>
        <p className="text-gray-500 text-sm italic">{extra}</p>
      </div>
      {category && (
        <div className="px-4 py-2 bg-gray-100">
          <span className="text-xs uppercase font-bold text-gray-700">{category}</span>
        </div>
      )}
    </div>
  );
}
CardSpecial.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  extra: PropTypes.string.isRequired,
  category: PropTypes.string,
};
