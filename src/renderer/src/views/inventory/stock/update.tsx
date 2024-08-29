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
import { TStock } from '@renderer/types/types'
import { UpdateStockForm } from '@renderer/components/forms/stock/edit-stock-form'
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
const UpdateStock: React.FC = () => {
  const [loading, setLoading] = React.useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const id = Number(useParams().id)
  const client = useQueryClient()
  const handleEditStock = async (
    params: Omit<
      TStock,
      | 'id'
      | 'supplierFirstName'
      | 'supplierMiddleName'
      | 'supplierLastName'
      | 'updateDate'
      | 'productName'
    >
  ): Promise<
    Omit<
      TStock,
      | 'id'
      | 'supplierFirstName'
      | 'supplierMiddleName'
      | 'supplierLastName'
      | 'updateDate'
      | 'productName'
    >
  > => {
    setLoading(true)
    let stock = {
      ...params,
      number: params.number ? params.number : null,
      cost: Math.round(params.cost * 100),
      totalPaid: Math.round(params.totalPaid * 100),
      dollarRate: Math.round(params.dollarRate * 100)
    }
    try {
      const response = await http.put('stock', { ...stock, id: id })
      if (response.status === 200) {
        client.invalidateQueries({ queryKey: ['stocks'] })
        toast({
          title: 'Success',
          description: 'Stock updated successfully.',
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
            <ToastAction onClick={() => handleEditStock(params)} altText="Try again">
              Try again
            </ToastAction>
          )
        })
      stock = stockQuery.data.data
    } finally {
      setLoading(false)
    }
    return stock
  }

  const stockQuery = useQuery({
    queryKey: ['stocks', id],
    queryFn: async () => {
      const res = await http.get('stock/' + id)
      const data = await res.data
      return data
    }
  })

  const suppliersQuery = useQuery({
    queryKey: ['suppliers', 'all'],
    queryFn: async () => {
      const res = await http.get('supplier/all')
      const data = await res.data
      return data
    },
    placeholderData: keepPreviousData
  })

  const productsQuery = useQuery({
    queryKey: ['products', 'all'],
    queryFn: async () => {
      const res = await http.get('product/all', { params: { categoryId: null, isViewable: null } })
      const data = await res.data
      return data
    },
    placeholderData: keepPreviousData
  })

  return (
    <div className="flex items-center justify-center h-fit  w-full relative">
      <Button onClick={() => navigate(-1)} className=" absolute top-0 left-1" variant={'ghost'}>
        <ArrowLeft />
        Back
      </Button>
      <Card className="w-[750px] my-2">
        <CardHeader>
          <CardTitle>Create stock</CardTitle>
          <CardDescription>Creat a new stock to sort your stocks.</CardDescription>
        </CardHeader>
        <CardContent>
          {stockQuery.isLoading || stockQuery.isError ? (
            <div>loading</div>
          ) : (
            <UpdateStockForm
              handleEdit={handleEditStock}
              suppliers={
                suppliersQuery.isLoading || suppliersQuery.isError ? [] : suppliersQuery.data.data
              }
              products={
                productsQuery.isLoading || productsQuery.isError ? [] : productsQuery.data.data
              }
              loading={loading}
              stock={{
                ...stockQuery.data.data
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
export default UpdateStock
