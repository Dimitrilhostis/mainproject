function TabButton({ icon, active, onClick }) {
    return (
      <button
        onClick={onClick}
        className="
          relative z-10 flex items-center justify-center
          px-4 py-1.5 rounded-full 
          text-xs font-medium transition-colors
        "
      >
        <span
          className={
            active ? "text-[var(--background)]" : "text-[var(--text2)]"
          }
        >
          {icon}
        </span>
      </button>
    );
  }
  
  export default TabButton;
  