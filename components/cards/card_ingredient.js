"use client";
import PropTypes from 'prop-types';
import Image from 'next/image';

export default function IngredientCard({ item, onClick }) {
  return (
    <div className="bg-white w-32 rounded-lg shadow p-4 flex flex-col cursor-pointer hover:scale-105 duration-200" onClick={onClick}>
      <div className="relative h-26 w-full mb-4">
        {item.image_url?.[0] && <Image src={item.image_url} fill objectFit="cover" alt={item.ingredient?.[0] || "Image de l'ingredient"} className="rounded" />}
      </div>
      <h3 className="font-bold text-lg mb-2 truncate">{item.name}</h3>
    </div>
  );
}
IngredientCard.propTypes = { item: PropTypes.object.isRequired, onClick: PropTypes.func, onEdit: PropTypes.func };