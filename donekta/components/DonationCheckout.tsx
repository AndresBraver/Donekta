import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface Props {
  amount: number
  communityName: string
  communityId: string
  stripeAccountId?: string
  donorEmail: string
  donorName: string
  onSuccess: () => void
  onCancel: () => void
}

function CheckoutForm({ onSuccess, onCancel, amount, communityName }: {
  onSuccess: () => void
  onCancel: () => void
  amount: number
  communityName: string
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!stripe || !elements) return
    setLoading(true)
    setError('')

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message || 'Error al procesar')
      setLoading(false)
      return
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (confirmError) {
      setError(confirmError.message || 'Pago rechazado')
      setLoading(false)
    } else {
      onSuccess()
    }
  }

  return (
    <div>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-emerald-800">
          Donando <strong>${amount.toLocaleString()} MXN</strong> a <strong>{communityName}</strong>
        </p>
      </div>

      <PaymentElement />

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !stripe}
        className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors text-base"
      >
        {loading ? 'Procesando pago...' : `Pagar $${amount.toLocaleString()} MXN`}
      </button>

      <button
        onClick={onCancel}
        className="w-full mt-3 text-gray-500 hover:text-gray-700 text-sm py-2 transition-colors"
      >
        Cancelar
      </button>
    </div>
  )
}

export default function DonationCheckout(props: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const initPayment = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: props.amount,
          communityName: props.communityName,
          stripeAccountId: props.stripeAccountId,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setClientSecret(data.clientSecret)
    } catch (e: any) {
      setError(e.message || 'Error al iniciar pago')
    } finally {
      setLoading(false)
    }
  }

  if (!clientSecret) {
    return (
      <div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-emerald-800">
            Vas a donar <strong>${props.amount.toLocaleString()} MXN</strong> a{' '}
            <strong>{props.communityName}</strong>
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <button
          onClick={initPayment}
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors text-base"
        >
          {loading ? 'Cargando...' : `Continuar al pago →`}
        </button>

        <button
          onClick={props.onCancel}
          className="w-full mt-3 text-gray-500 hover:text-gray-700 text-sm py-2 transition-colors"
        >
          Cancelar
        </button>
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: { colorPrimary: '#10b981' },
        },
      }}
    >
      <CheckoutForm
        onSuccess={props.onSuccess}
        onCancel={props.onCancel}
        amount={props.amount}
        communityName={props.communityName}
      />
    </Elements>
  )
}
