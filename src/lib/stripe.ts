import Stripe from "stripe";

export const stripe = new Stripe('sk_test_51MOp0qDP8TALnCo8QVf3lrIlu3jDae2gDoxDeOXvXrYJm3KtPKblO9yuQvoIalnwBktacuPhklqepvYaZHXz0m4300StRurOUP',{
  apiVersion:"2022-11-15",
  appInfo:{
    name:'igniteSop'
  }
})