import http from '@renderer/lib/local-axios-client'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Skeleton } from '../ui/skeleton'
import { TProduct } from '@renderer/types/types'
import { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import ProductCard from './product-card'
import { useOrdersContext } from '@renderer/contexts/orders-context'

const ProductsList: React.FC<{
  selectedCategory: number | null
}> = ({ selectedCategory }) => {
  const [width, setWidth] = useState(window.innerWidth - 656)
  const { addProduct } = useOrdersContext()
  const [q, setQ] = useState('')
  const productsQuery = useQuery({
    queryKey: ['product', 'all', selectedCategory],
    queryFn: async () => {
      const res = await http.get('product/all', {
        params: { isViewable: true, categoryId: selectedCategory }
      })
      const data = await res.data
      return data
    },
    placeholderData: keepPreviousData
  })

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth - 656)
    }

    window.addEventListener('resize', handleResize)

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const filteredProducts =
    !productsQuery.isLoading && !productsQuery.isError
      ? productsQuery.data.data.filter((product: TProduct) => product.name.toString().includes(q))
      : null

  //@ts-ignore-next-line
  const temp = `
grid-cols-[repeat(1,minmax(0,1fr))]
grid-cols-[repeat(2,minmax(0,1fr))]
grid-cols-[repeat(3,minmax(0,1fr))]
grid-cols-[repeat(4,minmax(0,1fr))]
grid-cols-[repeat(5,minmax(0,1fr))]
grid-cols-[repeat(6,minmax(0,1fr))]
grid-cols-[repeat(7,minmax(0,1fr))]
grid-cols-[repeat(8,minmax(0,1fr))]
grid-cols-[repeat(9,minmax(0,1fr))]
grid-cols-[repeat(10,minmax(0,1fr))]
    `

  return (
    <div className="flex flex-col w-full h-full p-4 pr-0">
      <div className="flex w-full items-center justify-start pb-4">
        <Input
          className="w-1/2"
          placeholder="Search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div
        className={`grid h-fit max-h-[calc(100vh-21rem)] grid-cols-[repeat(${Math.ceil(width / 200)},minmax(0,1fr))] gap-2 gap-y-5 overflow-y-auto overflow-x-clip pr-2 gutter `}
      >
        {productsQuery.isLoading || productsQuery.isError ? (
          <>
            <Skeleton className="h-40 w-40" />
            <Skeleton className="h-40 w-40" />
            <Skeleton className="h-40 w-40" />
            <Skeleton className="h-40 w-40" />
            <Skeleton className="h-40 w-40" />
            <Skeleton className="h-40 w-40" />
            <Skeleton className="h-40 w-40" />
            <Skeleton className="h-40 w-40" />
            <Skeleton className="h-40 w-40" />
            <Skeleton className="h-40 w-40" />
          </>
        ) : (
          filteredProducts.map((product: TProduct) => {
            return (
              <ProductCard onClick={addProduct} key={'product:' + product.id} product={product} />
            )
          })
        )}
      </div>
    </div>
  )
}

export default ProductsList
