export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose max-w-none space-y-6">
        <p>
          Legally Legit AI is committed to protecting your privacy in accordance with the 
          Australian Privacy Principles (APPs) under the Privacy Act 1988 (Cth).
        </p>

        <h2>1. Information We Collect</h2>
        <ul>
          <li>Name and contact details</li>
          <li>Business information</li>
          <li>Payment information (via Stripe)</li>
          <li>Information in document templates</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use your information to provide and improve our services.</p>
      </div>
    </div>
  )
}