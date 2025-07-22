import { useState } from 'react'
import { AlertCircle } from 'lucide-react'

interface DocumentFormProps {
  template: any
  onSubmit: (data: Record<string, string>) => void
}

export default function DocumentForm({ template, onSubmit }: DocumentFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldId]
        return newErrors
      })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    template.fields.forEach((field: any) => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label} is required`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {template.fields.map((field: any) => (
        <div key={field.id}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {field.type === 'select' ? (
            <select
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[--color-navy]"
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option: string) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[--color-navy]"
            />
          ) : (
            <input
              type={field.type}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[--color-navy]"
            />
          )}
          
          {field.helpText && (
            <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>
          )}
          
          {field.warning && (
            <div className="mt-2 flex items-start space-x-2 text-amber-600">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{field.warning}</p>
            </div>
          )}
          
          {errors[field.id] && (
            <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>
          )}
        </div>
      ))}

      <div className="pt-6">
        <button type="submit" className="btn-primary w-full">
          Generate Document
        </button>
      </div>
    </form>
  )
}