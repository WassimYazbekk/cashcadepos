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
import { CreateSupplierForm } from '@renderer/components/forms/supplier/create-supplier-form'
import { isAxiosError } from 'axios'
import http from '@renderer/lib/local-axios-client'
import { TSupplier } from '@renderer/types/types'
import { useQueryClient } from '@tanstack/react-query'
const CreateSupplier: React.FC = () => {
  const [loading, setLoading] = React.useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isClean, setIsClean] = React.useState(true)
  const handleCreateSupplier = async (params: Omit<TSupplier, 'id'>): Promise<boolean> => {
    setLoading(true)
    let success = false
    try {
      const response = await http.post('supplier', params)
      if (response.status === 201) {
        toast({
          title: 'Success',
          description: 'Supplier created successfully.',
          duration: 1000
        })
        setLoading(false)
        queryClient.invalidateQueries({ queryKey: ['suppliers'] })
        success = true
      }
    } catch (err: any) {
      console.log(err)

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
            <ToastAction onClick={() => handleCreateSupplier(params)} altText="Try again">
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

  const goBack = () => {
    if (isClean) navigate(-1)
    else {
      toast({
        variant: 'destructive',
        title: 'Unsaved Changes',
        description: 'There is unsaved changes.',
        action: (
          <ToastAction altText="Discard" onClick={() => navigate(-1)}>
            Discard
          </ToastAction>
        )
      })
    }
  }

  return (
    <div className="flex items-center justify-center h-fit w-full relative">
      <Button onClick={goBack} className=" absolute top-0 left-1" variant={'ghost'}>
        <ArrowLeft />
        Back
      </Button>
      <Card className="w-[450px] my-2">
        <CardHeader>
          <CardTitle>Create supplier</CardTitle>
          <CardDescription>Creat a new supplier.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateSupplierForm
            setIsClean={setIsClean}
            handleCreate={handleCreateSupplier}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  )
}
export default CreateSupplier
