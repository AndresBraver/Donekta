import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-05-27.dahlia',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { amount, communityName, stripeAccountId } = req.body

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // cents
      currency: 'mxn',
      automatic_payment_methods: { enabled: true },
      metadata: { communityName },
      ...(stripeAccountId ? {
        transfer_data: { destination: stripeAccountId },
        application_fee_amount: Math.round(amount * 100 * 0.05), // 5% fee
      } : {}),
    })

    res.status(200).json({ clientSecret: paymentIntent.client_secret })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
