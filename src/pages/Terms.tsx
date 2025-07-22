export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose max-w-none space-y-6">
        <p>Last updated: {new Date().toLocaleDateString('en-AU')}</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using Legally Legit AI ("Service"), you agree to be bound by these 
          Terms of Service ("Terms").
        </p>

        <h2>2. No Legal Advice</h2>
        <p className="font-semibold">
          THE SERVICE DOES NOT PROVIDE LEGAL ADVICE. No attorney-client relationship is formed 
          through use of this Service.
        </p>

        <h2>3. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY AUSTRALIAN LAW, LEGALLY LEGIT AI SHALL NOT BE LIABLE 
          FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
        </p>
      </div>
    </div>
  )
}