import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../lib/stripe";

export default async function handle(req: NextApiRequest, res: NextApiResponse){
  const {priceID} = req.body;

  if(!priceID){
    return res.status(400).json({error: 'Price Not Found.'})
  }

  const successURL = `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`
  const cancelURL =  `http://localhost:3000/dsa`

  const checkoutSession = await stripe.checkout.sessions.create({
    success_url:successURL,
    cancel_url: cancelURL,
    mode: 'payment',
    line_items:[
      {
        price: priceID,
        quantity: 1,
      }
    ]
  })

  return res.status(201).json({
    checkoutUrl: checkoutSession.url
  });
}