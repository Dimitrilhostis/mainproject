"use client";
import PropTypes from 'prop-types';

export default function SportProfileCard({ item, onEdit }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer" onClick={() => onEdit(item)}>
      <h3 className="font-bold text-lg mb-2 truncate">Profil Sport: {item.user_id}</h3>
      <p className="text-sm text-gray-600 line-clamp-3">Obj: {item.objectifs}</p>
      <button className="mt-auto py-1 px-3 bg-purple-600 text-white rounded hover:bg-purple-700">Modifier</button>
    </div>
  );
}
SportProfileCard.propTypes = { item: PropTypes.object.isRequired, onEdit: PropTypes.func.isRequired };
