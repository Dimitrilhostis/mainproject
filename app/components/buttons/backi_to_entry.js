export default function BackToEntryButton({onClick, text}) {
    return (
        <button
      onClick={onClick}
      className="bg-green-600 text-white px-6 py-3 border-none rounded-lg text-lg text-center inline-block transition-all duration-300 ease-in-out hover:bg-green-700 hover:scale-105"
    >
      {text}
    </button>
    )
}