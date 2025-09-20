import { useState } from 'react';
import QuestionPage from './question_page';
import SummaryPage from './summary_page';
import { steps } from './steps';
  

export default function MultiStepForm() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  function handleNext(answer) {
    setAnswers(prev => ({ ...prev, [steps[index].key]: answer }));
    setIndex(i => i + 1);
  }

  return (
    <div className="h-screen flex items-center justify-center">
      {index < steps.length
        ? <QuestionPage
            step={steps[index]}
            onSubmit={handleNext}
          />
        : <SummaryPage answers={answers} />
      }
    </div>
  );
}