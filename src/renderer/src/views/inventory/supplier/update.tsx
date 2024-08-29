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
import { TSupplier } from '@renderer/types/types'
import { UpdateSupplierForm } from '@renderer/components/forms/supplier/edit-supplier-form'
import { useQuery, useQueryClient } from '@tanstack/react-query'
const UpdateSupplier: React.FC = () => {
  const [loading, setLoading] = React.useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const id = Number(useParams().id)
  const client = useQueryClient()
  const handleEditSupplier = async (
    params: Omit<TSupplier, 'id'>
  ): Promise<Omit<TSupplier, 'id'>> => {
    setLoading(true)
    let supplier = params
    try {
      const response = await http.put('supplier', { ...supplier, id: id })
      if (response.status === 200) {
        client.invalidateQueries({ queryKey: ['suppliers'] })
        toast({
          title: 'Success',
          description: 'Supplier updated successfully.',
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
            <ToastAction onClick={() => handleEditSupplier(params)} altText="Try again">
              Try again
            </ToastAction>
          )
        })
      supplier = supplierQuery.data.data
    } finally {
      setLoading(false)
    }
    return supplier
  }

  const supplierQuery = useQuery({
    queryKey: ['suppliers', id],
    queryFn: async () => {
      const res = await http.get('supplier/' + id)
      const data = await res.data
      return data
    }
  })
  return (
    <div className="flex items-center justify-center h-fit w-full relative">
      <Button onClick={() => navigate(-1)} className=" absolute top-0 left-1" variant={'ghost'}>
        <ArrowLeft />
        Back
      </Button>
      <Card className="w-[450px] my-2">
        <CardHeader>
          <CardTitle>Create supplier</CardTitle>
          <CardDescription>Creat a new supplier to sort your products.</CardDescription>
        </CardHeader>
        <CardContent>
          {supplierQuery.isLoading || supplierQuery.isError ? (
            <div>loading</div>
          ) : (
            <UpdateSupplierForm
              handleEdit={handleEditSupplier}
              loading={loading}
              supplier={{
                ...supplierQuery.data.data
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
export default UpdateSupplier
