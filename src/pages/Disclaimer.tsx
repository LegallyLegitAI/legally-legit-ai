import { AlertCircle } from 'lucide-react'

export default function Disclaimer() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Legal Disclaimer</h1>
      
      <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-red-900 text-xl font-bold mb-2">Important Legal Notice</h2>
            <p className="text-red-800">
              This service does not provide legal advice. No lawyer-client relationship 
              is formed. Always consult a qualified Australian legal practitioner.
            </p>
          </div>
        </div>
      </div>

      <div className="prose max-w-none">
        <p>
          Legally Legit AI provides general legal information and document templates only.
        </p>
      </div>
    </div>
  )
}