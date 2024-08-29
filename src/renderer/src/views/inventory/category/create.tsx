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
import { CreateCategoryForm } from '@renderer/components/forms/category/create-category-form'
import { isAxiosError } from 'axios'
import http from '@renderer/lib/local-axios-client'
import { TCategory } from '@renderer/types/types'
import { useQueryClient } from '@tanstack/react-query'
const CreateCategory: React.FC = () => {
  const [loading, setLoading] = React.useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const handleCreateCategory = async (params: {
    [K in keyof Omit<TCategory, 'id'>]: K extends 'image' ? File | null : Omit<TCategory, 'id'>[K]
  }): Promise<boolean> => {
    setLoading(true)
    let success = false
    try {
      const category = { name: params.name, isViewable: params.isViewable, image: '' }
      if (params.image) {
        const formData = new FormData()
        formData.append('file', params.image)
        const response = await http.post('upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (response.status === 201) category.image = await response.data.image
      }
      const response = await http.post('category', category)
      if (response.status === 201) {
        toast({
          title: 'Success',
          description: 'Category created successfully.',
          duration: 1000
        })
        setLoading(false)
        queryClient.invalidateQueries({ queryKey: ['categories'] })
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
            <ToastAction onClick={() => handleCreateCategory(params)} altText="Try again">
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
  return (
    <div className="flex items-center justify-center h-full w-full relative">
      <Button onClick={() => navigate(-1)} className=" absolute top-0 left-1" variant={'ghost'}>
        <ArrowLeft />
        Back
      </Button>
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Create category</CardTitle>
          <CardDescription>Creat a new category to sort your products.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateCategoryForm handleCreate={handleCreateCategory} loading={loading} />
        </CardContent>
      </Card>
    </div>
  )
}
export default CreateCategory
