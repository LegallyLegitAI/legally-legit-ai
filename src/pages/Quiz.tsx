import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft } from 'lucide-react'

const questions = [
  {
    id: 'business_type',
    question: 'What type of business do you have?',
    options: ['Sole Trader', 'Company (Pty Ltd)', 'Partnership', 'Trust', 'Not Sure'],
  },
  {
    id: 'employees',
    question: 'Do you have employees or contractors?',
    options: ['Only Employees', 'Only Contractors', 'Both', 'Neither', 'Planning to Hire'],
  },
  {
    id: 'main_need',
    question: 'What\'s your most urgent legal document need?',
    options: ['Employment Agreement', 'Contractor Agreement', 'Privacy Policy', 'Terms & Conditions', 'Not Sure']
  }
]

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const navigate = useNavigate()

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: answer
    }))

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      navigate('/templates', { state: { quizAnswers: answers } })
    }
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[--color-navy] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-8">{question.question}</h2>

        <div className="space-y-3 mb-8">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-[--color-navy] hover:bg-gray-50 transition-all duration-200"
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="flex items-center px-4 py-2 text-gray-600 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </button>
          
          <button
            onClick={() => navigate('/templates')}
            className="text-gray-600 hover:text-[--color-navy]"
          >
            Skip Quiz
          </button>
        </div>
      </div>
    </div>
  )
}