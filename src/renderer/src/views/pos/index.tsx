import CategoriesSelect from '@renderer/components/pos/categories-select'
import OrdersBar from '@renderer/components/pos/orders-bar'
import ProductsList from '@renderer/components/pos/products-list'
import { useState } from 'react'

const Pos: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  return (
    <div className="flex h-[calc(100vh-96px)] w-full">
      <div className="flex flex-col h-full max-w-xl min-w-[36rem] w-full ">
        <OrdersBar />
      </div>
      <div className=" flex-1 h-full overflow-clip max-w-[calc(100vw-40rem)]">
        <CategoriesSelect
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <ProductsList selectedCategory={selectedCategory} />
      </div>
    </div>
  )
}

export default Pos
