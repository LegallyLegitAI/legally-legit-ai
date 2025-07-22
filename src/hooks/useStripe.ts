import { useState } from 'react'

export function useStripe() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createCheckoutSession = async (priceId: string) => {
    setLoading(true)
    setError(null)

    try {
      // Stripe logic would go here
      console.log('Creating checkout for:', priceId)
      return { sessionId: 'test-session-id' }
    } catch (err) {
      setError('Payment failed')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { createCheckoutSession, loading, error }
}