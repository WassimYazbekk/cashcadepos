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
import { TBill } from '@renderer/types/types'
import { UpdateBillForm } from '@renderer/components/forms/bill/edit-bill-form'
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
const UpdateBill: React.FC = () => {
  const [loading, setLoading] = React.useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const id = Number(useParams().id)
  const client = useQueryClient()
  const handleEditBill = async (
    params: Omit<
      TBill,
      'id' | 'supplierFirstName' | 'supplierMiddleName' | 'supplierLastName' | 'updateDate'
    >
  ): Promise<
    Omit<
      TBill,
      'id' | 'supplierFirstName' | 'supplierMiddleName' | 'supplierLastName' | 'updateDate'
    >
  > => {
    setLoading(true)
    let bill = {
      ...params,
      number: params.number ? params.number : null,
      cost: Math.round(params.cost * 100),
      totalPaid: Math.round(params.totalPaid * 100),
      dollarRate: Math.round(params.dollarRate * 100)
    }
    try {
      const response = await http.put('bill', { ...bill, id: id })
      if (response.status === 200) {
        client.invalidateQueries({ queryKey: ['bills'] })
        toast({
          title: 'Success',
          description: 'Bill updated successfully.',
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
            <ToastAction onClick={() => handleEditBill(params)} altText="Try again">
              Try again
            </ToastAction>
          )
        })
      bill = billQuery.data.data
    } finally {
      setLoading(false)
    }
    return bill
  }

  const billQuery = useQuery({
    queryKey: ['bills', id],
    queryFn: async () => {
      const res = await http.get('bill/' + id)
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

  return (
    <div className="flex items-center justify-center h-fit w-full relative">
      <Button onClick={() => navigate(-1)} className=" absolute top-0 left-1" variant={'ghost'}>
        <ArrowLeft />
        Back
      </Button>
      <Card className="w-[750px] my-2 ">
        <CardHeader>
          <CardTitle>Create bill</CardTitle>
          <CardDescription>Creat a new bill to sort your bills.</CardDescription>
        </CardHeader>
        <CardContent>
          {billQuery.isLoading || billQuery.isError ? (
            <div>loading</div>
          ) : (
            <UpdateBillForm
              handleEdit={handleEditBill}
              suppliers={
                suppliersQuery.isLoading || suppliersQuery.isError ? [] : suppliersQuery.data.data
              }
              loading={loading}
              bill={{
                ...billQuery.data.data
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
export default UpdateBill
