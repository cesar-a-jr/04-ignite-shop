import axios from "axios"
import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState } from "react"
import Stripe from "stripe"
import { stripe } from "../../lib/stripe"
import { ImageContainer, ProductContainer, ProductDetails } from "../../styles/pages/product"

interface ProducProps{
  product:{
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    description: string;
    defaultPriceID: string
  }
}


export default function Product({product}: ProducProps){
  const {isFallback} = useRouter()
  const [iCreatingCheckoutSession, setICreatingCheckoutSession] = useState(false)

  if(isFallback){
    return(
      <ProductContainer>
      <ImageContainer>
      </ImageContainer>

      <ProductDetails>
        <h1>...</h1>
        <span>...</span>

        <p>...</p>

        <button>
          Comprar agora
        </button>
      </ProductDetails>

    </ProductContainer>
    )
  }

  async function handleBuyProduct(){
    try{
      setICreatingCheckoutSession(true)
      const response = await axios.post('/api/checkout',{
        priceID: product.defaultPriceID
      })
      const {checkoutUrl} = response.data;

      window.location.href = checkoutUrl;
      
    }catch{
      setICreatingCheckoutSession(false)
      alert('Falha ao redirecionar')
    }
  }
  return(
    <ProductContainer>
      <ImageContainer>
        <Image src={product.imageUrl} width={520} height={480} alt=''/>
      </ImageContainer>

      <ProductDetails>
        <h1>{product.name}</h1>
        <span>{product.price}</span>

        <p>{product.description}</p>

        <button disabled={iCreatingCheckoutSession} onClick={handleBuyProduct}>
          Comprar agora
        </button>
      </ProductDetails>

    </ProductContainer>
  )
}

export const getStaticPaths: GetStaticPaths = async ()=>{
  return {
    paths:[
      {params:{id: 'prod_N97MXOqUz3hZ5I'}}
    ],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<any, {id: string}> = async({params})=>{
  const productId = params.id;

  const product = await stripe.products.retrieve(productId,{
    expand: ['default_price'],
  })

  const price = product.default_price as Stripe.Price;


  return{
    props:{
      product:{
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: price.unit_amount,
        description: product.description,
        defaultPriceID: price.id,
      }
    },
    revalidate: 60 * 60 * 1, //1 hour
  }
}