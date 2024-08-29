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
import { useNavigate, useParams } from 'react-router-dom'
import { isAxiosError } from 'axios'
import http from '@renderer/lib/local-axios-client'
import { TProduct } from '@renderer/types/types'
import { UpdateProductForm } from '@renderer/components/forms/product/edit-product-form'
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
const UpdateProduct: React.FC = () => {
  const [loading, setLoading] = React.useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const id = Number(useParams().id)
  const client = useQueryClient()
  const handleEditProduct = async (params: {
    [K in keyof Omit<TProduct, 'id' | 'remainingQuantity' | 'category'>]: K extends 'image'
      ? File | null
      : Omit<TProduct, 'id' | 'remainingQuantity' | 'category'>[K]
  }): Promise<Omit<TProduct, 'id' | 'remainingQuantity' | 'category'>> => {
    setLoading(true)
    let product = {
      ...params,
      price: Math.round(params.price * 100),
      image: productQuery.data.data.image
    }
    try {
      if (params.image) {
        const formData = new FormData()
        formData.append('file', params.image)
        const response = await http.post('upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (response.status === 201) product.image = await response.data.image
      }
      const response = await http.put('product', { ...product, id: id })
      if (response.status === 200) {
        client.invalidateQueries({ queryKey: ['products'] })
        toast({
          title: 'Success',
          description: 'Product updated successfully.',
          duration: 1000
        })
      }
      setLoading(false)
    } catch (err: any) {
      if (isAxiosError(err) && err.response)
        toast({
          title: 'Fail',
          variant: 'destructive',
          description: err.response.data.error,
          duration: 3000
        })
      else
        toast({
          title: 'Fail',
          variant: 'destructive',
          description: 'Something went wrong!',
          duration: 3000,
          action: (
            <ToastAction onClick={() => handleEditProduct(params)} altText="Try again">
              Try again
            </ToastAction>
          )
        })
      product = productQuery.data.data
    } finally {
      setLoading(false)
    }
    return product
  }

  const productQuery = useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const res = await http.get('product/' + id)
      const data = await res.data
      return data
    }
  })

  const categoriesQuery = useQuery({
    queryKey: ['categories', 'all'],
    queryFn: async () => {
      const res = await http.get('category/all', { params: { isViewable: null } })
      const data = await res.data
      return data
    },
    placeholderData: keepPreviousData
  })

  return (
    <div className="flex items-center justify-center h-full w-full relative">
      <Button onClick={() => navigate(-1)} className=" absolute top-0 left-1" variant={'ghost'}>
        <ArrowLeft />
        Back
      </Button>
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Create product</CardTitle>
          <CardDescription>Creat a new product to sort your products.</CardDescription>
        </CardHeader>
        <CardContent>
          {productQuery.isLoading || productQuery.isError ? (
            <div>loading</div>
          ) : (
            <UpdateProductForm
              handleEdit={handleEditProduct}
              categories={
                categoriesQuery.isLoading || categoriesQuery.isError
                  ? []
                  : categoriesQuery.data.data
              }
              loading={loading}
              product={{
                ...productQuery.data.data
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
export default UpdateProduct
