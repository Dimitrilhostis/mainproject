"use client";
import PropTypes from 'prop-types';
import Image from 'next/image';

export default function TrainingCard({ item, onEdit }) {
  return (
    <div className="bg-white w-32 rounded-lg shadow p-4 flex flex-col cursor-pointer hover:scale-105 duration-200" onClick={() => onEdit(item)}>
      <div className="relative h-26 w-full mb-4">
        {item.image_url && <Image src={item.image_url} fill objectFit="cover" alt={item.training?.[0] || "Image de l'entraînement"} className="rounded" />}
      </div>
      <h3 className="font-bold text-lg truncate">{item.name}</h3>
    </div>
  );
}
TrainingCard.propTypes = { item: PropTypes.object.isRequired, onEdit: PropTypes.func.isRequired };
