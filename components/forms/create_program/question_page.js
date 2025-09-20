import { useState } from "react";

export default function QuestionPage({ step, onSubmit, onBack }) {
    const [value, setValue] = useState('');
  
    const isChoice = Array.isArray(step.options); // true si choix unique/multiple
  
    return (
      <div className="…">
        <h2>{step.question}</h2>
  
        {isChoice ? (
          <div className="grid gap-4">
            {step.options.map(opt => (
              <button
                key={opt.value}
                className={`btn ${value === opt.value ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setValue(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : (
          <input
            type={step.type || 'text'}
            value={value}
            onChange={e => setValue(e.target.value)}
            className="…"
            placeholder="Votre réponse"
          />
        )}
  
        <button
          disabled={!value}
          onClick={() => onSubmit(value)}
          className="btn btn-success"
        >
          Suivant
        </button>
      </div>
    );
  }
  