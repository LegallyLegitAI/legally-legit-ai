import { useState } from 'react'
import { FileText, Download, AlertCircle } from 'lucide-react'
import DocumentForm from '../components/forms/DocumentForm'
import { templates } from '../content/legalTemplates'

export default function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null)

  const handleGenerateDocument = (data: Record<string, string>) => {
    if (!selectedTemplate) return
    
    const content = selectedTemplate.generateContent(data)
    setGeneratedDocument(content)
  }

  const handleDownloadPDF = () => {
    // PDF download functionality would go here
    alert('PDF download feature coming soon!')
  }

  if (selectedTemplate && !generatedDocument) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => setSelectedTemplate(null)}
          className="mb-6 text-[--color-navy] hover:underline flex items-center"
        >
          ← Back to Templates
        </button>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">{selectedTemplate.title}</h2>
          <DocumentForm
            template={selectedTemplate}
            onSubmit={handleGenerateDocument}
          />
        </div>
      </div>
    )
  }

  if (generatedDocument) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6 flex justify-between items-start">
            <h2 className="text-2xl font-bold">Your Document is Ready!</h2>
            <button
              onClick={handleDownloadPDF}
              className="btn-primary flex items-center"
            >
              <Download className="h-5 w-5 mr-2" />
              Download PDF
            </button>
          </div>
          
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> This is a template only. Have it reviewed by a qualified 
                Australian lawyer before use.
              </p>
            </div>
          </div>
          
          <div 
            className="prose max-w-none bg-gray-50 p-8 rounded-lg"
            dangerouslySetInnerHTML={{ __html: generatedDocument }}
          />
          
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => {
                setGeneratedDocument(null)
                setSelectedTemplate(null)
              }}
              className="btn-secondary"
            >
              Create Another Document
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Legal Document Templates</h1>
        <p className="text-xl text-gray-600">
          Choose from our Australian law-compliant templates
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setSelectedTemplate(template)}
          >
            <div className="flex items-start justify-between mb-4">
              <FileText className="h-8 w-8 text-[--color-navy]" />
              <span className="text-sm text-[--color-forest] font-semibold">
                Popular
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{template.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{template.description}</p>
            <button className="text-[--color-navy] font-semibold hover:underline">
              Create Now →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}