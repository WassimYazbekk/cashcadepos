import { cn } from '@renderer/lib/utils'
import { TOrderProduct, TProduct } from '@renderer/types/types'
import { useState } from 'react'

const ProductCard: React.FC<{ product: TProduct; onClick: (arg0: TOrderProduct) => void }> = ({
  product,
  onClick
}) => {
  const [isClicked, setIsClicked] = useState(false)

  const handleClick = () => {
    setIsClicked(true)
    onClick({
      productId: product.id,
      quantity: 1,
      currency: product.currency,
      pricePerItem: product.price
    })
    setTimeout(() => {
      setIsClicked(false)
    }, 100)
  }

  return (
    <div
      className={cn(
        'max-h-40 max-w-40 min-h-36 min-w-46 relative flex items-center justify-center aspect-square overflow-hidden ease-in hover:opacity-50 transition-opacity',
        isClicked ? 'scale-90 duration-100' : ' scale-100 duration-100'
      )}
      onClick={handleClick}
    >
      <img
        className="z10 select-none  h-full w-full"
        src={product.image ? import.meta.env.VITE_LOCAL_SERVER_URL + product.image : ''}
      />
      <div className="flex w-full h-full min-w-full min-h-full bg-muted opacity-50 absolute z-20"></div>
      <h1 className="text-lg absolute bottom-2 left-1/2 -translate-x-1/2 text-start px-1 text-nowrap overflow-hidden w-full z-30 select-none">
        {product.name}
      </h1>
    </div>
  )
}

export default ProductCard
