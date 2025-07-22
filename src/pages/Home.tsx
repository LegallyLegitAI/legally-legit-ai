import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Clock, DollarSign } from 'lucide-react'

export default function Home() {
  const benefits = [
    {
      icon: <Shield className="h-8 w-8 text-[--color-navy]" />,
      title: "Legally Compliant",
      description: "All templates follow Australian law and are regularly updated"
    },
    {
      icon: <Clock className="h-8 w-8 text-[--color-forest]" />,
      title: "Save Time",
      description: "Generate documents in minutes, not hours or days"
    },
    {
      icon: <DollarSign className="h-8 w-8 text-[--color-gold]" />,
      title: "Save Money",
      description: "Fraction of the cost of traditional legal services"
    }
  ]

  return (
    <div className="space-y-16 py-8">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-gradient text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Legal Documents for Australian Businesses
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          AI-powered legal document generation. Compliant with Australian law. 
          Created by lawyers, powered by technology.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/quiz" className="btn-primary flex items-center justify-center">
            Take Our Quick Quiz
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link to="/templates" className="btn-secondary">
            Browse Templates
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-12">
          Why Choose Legally Legit AI?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 md:p-8 text-center">
              <div className="flex justify-center mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-[--color-navy] to-[--color-forest] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of Australian businesses using AI for their legal documents
          </p>
          <Link to="/quiz" className="btn-accent inline-flex items-center">
            Start Free Quiz
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}