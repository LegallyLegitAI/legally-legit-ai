import { Scale } from 'lucide-react'

interface ConsentModalProps {
  onConsent: () => void
}

export default function ConsentModal({ onConsent }: ConsentModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center space-x-2 mb-6">
          <Scale className="h-8 w-8 text-[--color-navy]" />
          <h2 className="text-2xl font-bold text-[--color-navy]">
            Important Legal Notice
          </h2>
        </div>

        <div className="space-y-4 text-gray-700">
          <p className="font-semibold">
            Welcome to Legally Legit AI - Please Read Carefully
          </p>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <p className="font-semibold text-amber-800">⚖️ Legal Disclaimer</p>
            <p className="text-sm mt-2">
              This service provides general legal document templates only. It does NOT provide legal advice. 
              No lawyer-client relationship is formed by using this service.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">By using this service, you acknowledge:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Templates are for general use only and may not suit your specific situation</li>
              <li>You should have all documents reviewed by a qualified Australian lawyer</li>
              <li>Laws vary by state/territory - ensure compliance with your local laws</li>
              <li>We are not responsible for any losses from using these templates</li>
              <li>You accept our Terms of Service and Privacy Policy</li>
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-sm">
              <strong>Recommendation:</strong> For complex matters or high-value transactions, 
              always consult with a qualified legal professional in your jurisdiction.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button
            onClick={onConsent}
            className="btn-primary flex-1"
          >
            I Understand & Accept
          </button>
          <a
            href="https://www.law.org.au/findlegalhelp"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex-1 text-center"
          >
            Find a Lawyer Instead
          </a>
        </div>
      </div>
    </div>
  )
}