// components/cards/PreparationCard.jsx
"use client";
import PropTypes from "prop-types";
import Image from "next/image";

export default function PreparationsCard({ item, onClick }) {
  return (
    <div
      className="bg-white w-36 h-42 rounded-lg shadow p-4 flex flex-col cursor-pointer hover:scale-105 duration-200"
      onClick={onClick}
    >
      <div className="relative h-26 w-full mb-4">
        {item.image_url?.[0] && (
          <Image
            src={item.image_url}
            fill
            objectFit="cover"
            alt={item.name}
            className="rounded"
          />
        )}
      </div>
      <h3 className="font-bold text-lg mb-2 truncate">{item.name}</h3>
    </div>
  );
}

PreparationsCard.propTypes = {
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};


export function ExercisesCard({ item, onClick }) {
    return (
      <div
        className="bg-white w-36 h-42 rounded-lg shadow p-4 flex flex-col cursor-pointer hover:scale-105 duration-200"
        onClick={onClick}
      >
        <div className="relative h-26 w-full mb-4">
          {item.image_url?.[0] && (
            <Image
              src={item.image_url}
              fill
              objectFit="cover"
              alt={item.name}
              className="rounded"
            />
          )}
        </div>
        <h3 className="font-bold text-lg mb-2 truncate">{item.name}</h3>
      </div>
    );
  }
  
  ExercisesCard.propTypes = {
    item: PropTypes.object.isRequired,
    onClick: PropTypes.func,
  };



export function MuscleCard({ item, onClick }) {
  return (
    <div
      className="bg-white w-36 h-42 rounded-lg shadow p-4 flex flex-col cursor-pointer hover:scale-105 duration-200"
      onClick={onClick}
    >
      <div className="relative h-26 w-full mb-4">
        {item.image_url && (
          <Image
            src={item.image_url}
            fill
            objectFit="cover"
            alt={item.name}
            className="rounded"
          />
        )}
      </div>
      <h3 className="font-bold text-lg mb-2 truncate">{item.name}</h3>
    </div>
  );
}

MuscleCard.propTypes = {
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};

export function IngredientCard({ item, onClick }) {
  return (
    <div
      className="bg-white w-36 h-42 rounded-lg shadow p-4 flex flex-col cursor-pointer hover:scale-105 duration-200"
      onClick={onClick}
    >
      <div className="relative h-26 w-full mb-4">
        {item.image_url && (
          <Image
            src={item.image_url}
            fill
            objectFit="cover"
            alt={item.name}
            className="rounded"
          />
        )}
      </div>
      <h3 className="font-bold text-lg mb-2 truncate">{item.name}</h3>
    </div>
  );
}

IngredientCard.propTypes = {
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};