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
import { TStock } from '@renderer/types/types'
import { CreateStockForm } from '@renderer/components/forms/stock/create-stock-form'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
const CreateStock: React.FC = () => {
  const [loading, setLoading] = React.useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const handleCreateStock = async (
    params: Omit<
      TStock,
      | 'id'
      | 'supplierFirstName'
      | 'supplierMiddleName'
      | 'supplierLastName'
      | 'updateDate'
      | 'productName'
    >
  ): Promise<boolean> => {
    setLoading(true)
    let success = false
    const stock = {
      ...params,
      number: params.number ? params.number : null,
      cost: Math.round(params.cost * 100),
      totalPaid: Math.round(params.totalPaid * 100),
      dollarRate: Math.round(params.dollarRate * 100)
    }
    try {
      const response = await http.post('stock', stock)
      if (response.status === 201) {
        toast({
          title: 'Success',
          duration: 1000,
          description: 'Stock created successfully.'
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
            <ToastAction onClick={() => handleCreateStock(params)} altText="Try again">
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
    <div className="flex items-center justify-center h-fit w-full relative">
      <Button onClick={() => navigate(-1)} className=" absolute top-0 left-1" variant={'ghost'}>
        <ArrowLeft />
        Back
      </Button>
      <Card className="w-[750px] my-2">
        <CardHeader>
          <CardTitle>Create stock</CardTitle>
          <CardDescription>Creat a new stock to sell.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateStockForm
            suppliers={
              suppliersQuery.isLoading || suppliersQuery.isError ? [] : suppliersQuery.data.data
            }
            products={
              productsQuery.isLoading || productsQuery.isError ? [] : productsQuery.data.data
            }
            handleCreate={handleCreateStock}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  )
}
export default CreateStock
