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
import { TCategory } from '@renderer/types/types'
import { UpdateCategoryForm } from '@renderer/components/forms/category/edit-category-form'
import { useQuery, useQueryClient } from '@tanstack/react-query'
const UpdateCategory: React.FC = () => {
  const [loading, setLoading] = React.useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const id = Number(useParams().id)
  const client = useQueryClient()
  const handleEditCategory = async (params: {
    [K in keyof Omit<TCategory, 'id'>]: K extends 'image' ? File | null : Omit<TCategory, 'id'>[K]
  }): Promise<Omit<TCategory, 'id'>> => {
    setLoading(true)
    let category = {
      name: params.name,
      isViewable: params.isViewable,
      image: categoryQuery.data.data.image
    }
    try {
      if (params.image) {
        const formData = new FormData()
        formData.append('file', params.image)
        const response = await http.post('upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (response.status === 201) category.image = await response.data.image
      }
      const response = await http.put('category', { ...category, id: id })
      if (response.status === 200) {
        client.invalidateQueries({ queryKey: ['categories'] })
        toast({
          title: 'Success',
          description: 'Category updated successfully.',
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
            <ToastAction onClick={() => handleEditCategory(params)} altText="Try again">
              Try again
            </ToastAction>
          )
        })
      category = categoryQuery.data.data
    } finally {
      setLoading(false)
    }
    return category
  }

  const categoryQuery = useQuery({
    queryKey: ['categories', id],
    queryFn: async () => {
      const res = await http.get('category/' + id)
      const data = await res.data
      return data
    }
  })
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
          {categoryQuery.isLoading || categoryQuery.isError ? (
            <div>loading</div>
          ) : (
            <UpdateCategoryForm
              handleEdit={handleEditCategory}
              loading={loading}
              category={{
                ...categoryQuery.data.data
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
export default UpdateCategory
