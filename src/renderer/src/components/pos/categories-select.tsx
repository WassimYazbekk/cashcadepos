import http from '@renderer/lib/local-axios-client'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Skeleton } from '../ui/skeleton'
import { TCategory } from '@renderer/types/types'
import { Dispatch } from 'react'
import { cn } from '@renderer/lib/utils'

const CategoriesSelect: React.FC<{
  selectedCategory: number | null
  setSelectedCategory: Dispatch<number | null>
}> = ({ selectedCategory, setSelectedCategory }) => {
  const categoriesQuery = useQuery({
    queryKey: ['category', 'all'],
    queryFn: async () => {
      const res = await http.get('category/all', { params: { isViewable: true } })
      const data = await res.data
      return data
    },
    placeholderData: keepPreviousData
  })

  return (
    <div className="flex gap-2 overflow-x-scroll bordre-b h-[9.8rem] p-2 w-full">
      <div
        onClick={() => setSelectedCategory(null)}
        className={cn(
          'h-32 w-32 min-h-32 min-w-32 relative flex items-center justify-center select-none',
          selectedCategory === null ? ' border border-primary ' : ''
        )}
      >
        <img className="z10" src="../../../../../resources/icon.png" />
        <div className="flex w-full h-full min-w-full min-h-full bg-muted opacity-50 absolute z-20"></div>
        <h1 className="text-lg absolute bottom-2 left-1/2 -translate-x-1/2 text-start px-1 text-nowrap overflow-hidden w-full z-30 select-none">
          All Categories
        </h1>
      </div>
      {categoriesQuery.isLoading || categoriesQuery.isError ? (
        <>
          <Skeleton className="h-32 w-32" />
          <Skeleton className="h-32 w-32" />
          <Skeleton className="h-32 w-32" />
          <Skeleton className="h-32 w-32" />
          <Skeleton className="h-32 w-32" />
          <Skeleton className="h-32 w-32" />
          <Skeleton className="h-32 w-32" />
          <Skeleton className="h-32 w-32" />
          <Skeleton className="h-32 w-32" />
          <Skeleton className="h-32 w-32" />
        </>
      ) : (
        categoriesQuery.data.data.map((category: TCategory) => {
          return (
            <div
              key={'category:' + category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                'h-32 w-32 min-h-32 min-w-32 relative flex items-center justify-center select-none hover:opacity-50 transition-opacity',
                selectedCategory === category.id ? ' border border-primary ' : ''
              )}
            >
              <img
                className="z10 w-full h-full"
                src={category.image ? import.meta.env.VITE_LOCAL_SERVER_URL + category.image : ''}
              />
              <div className="flex w-full h-full min-w-full min-h-full bg-muted opacity-50 absolute z-20"></div>
              <h1 className="text-lg absolute bottom-2 left-1/2 -translate-x-1/2 text-start px-1 text-nowrap overflow-hidden w-full z-30 select-none">
                {category.name}
              </h1>
            </div>
          )
        })
      )}
    </div>
  )
}

export default CategoriesSelect
