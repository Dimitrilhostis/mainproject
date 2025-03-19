// components/select/Select.js
export default function SelectSound({selectedSound, sounds, setSelectedSound}) {
    return (
      <div>
        <label className="block text-lg font-bold mb-2 text-gray-800">Choisir un son :</label>
        <select
          className="p-3 border-2 border-gray-300 rounded-md w-full bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ease-in-out"
          value={selectedSound}
          onChange={(e) => setSelectedSound(e.target.value)}
        >
          {sounds.map((sound, index) => (
            <option key={index} value={sound.path} className="bg-white text-gray-800">
              {sound.title}
            </option>
          ))}
        </select>              
      </div>

    );
  }
  