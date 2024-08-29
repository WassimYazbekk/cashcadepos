import * as React from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import { useToast } from '@renderer/components/ui/use-toast'
import { ToastAction } from '@renderer/components/ui/toast'
import { Button } from '@renderer/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import http from '@renderer/lib/local-axios-client'
import { TProduct } from '@renderer/types/types'
import { CreateProductForm } from '@renderer/components/forms/product/create-product-form'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
const CreateProduct: React.FC = () => {
  const [loading, setLoading] = React.useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const handleCreateProduct = async (params: {
    [K in keyof Omit<
      TProduct,
      'id' | 'remainingQuantity' | 'averageCost' | 'category'
    >]: K extends 'image'
      ? File | null
      : Omit<TProduct, 'id' | 'remainingQuantity' | 'averageCost' | 'category'>[K]
  }): Promise<boolean> => {
    setLoading(true)
    let success = false
    const product = { ...params, image: '', price: Math.round(params.price * 100) }
    try {
      if (params.image) {
        const formData = new FormData()
        formData.append('file', params.image)
        const response = await http.post('upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (response.status === 201) product.image = await response.data.image
      }
      const response = await http.post('product', product)
      if (response.status === 201) {
        toast({
          title: 'Success',
          duration: 1000,
          description: 'Product created successfully.'
        })
        setLoading(false)
        success = true
      }
    } catch (err: any) {
      if (isAxiosError(err) && err.response)
        toast({
          title: 'Fail',
          variant: 'destructive',
          duration: 3000,
          description: err.response.data.error
        })
      else
        toast({
          title: 'Fail',
          variant: 'destructive',
          description: 'Something went wrong!',
          duration: 3000,
          action: (
            <ToastAction onClick={() => handleCreateProduct(params)} altText="Try again">
              Try again
            </ToastAction>
          )
        })
      success = false
    } finally {
      setLoading(false)
    }
    return success
  }

  const categoriesQuery = useQuery({
    queryKey: ['categories', 'all'],
    queryFn: async () => {
      const res = await http.get('category/all')
      const data = await res.data
      return data
    },
    placeholderData: keepPreviousData
  })

  return (
    <div className="flex items-center justify-center h-fit w-full relative">
      <Button onClick={() => navigate(-1)} className=" absolute top-0 left-1" variant={'ghost'}>
        <ArrowLeft />
        Back
      </Button>
      <Card className="w-[750px] my-2">
        <CardHeader>
          <CardTitle>Create product</CardTitle>
          <CardDescription>Creat a new product to sell.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateProductForm
            categories={
              categoriesQuery.isLoading || categoriesQuery.isError ? [] : categoriesQuery.data.data
            }
            handleCreate={handleCreateProduct}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  )
}
export default CreateProduct
