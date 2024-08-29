import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@renderer/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { TCategory } from '@renderer/types/types'
import { Switch } from '@renderer/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@renderer/components/ui/avatar'
import { useEffect, useRef, useState } from 'react'

const formSchema = z.object({
  name: z
    .string()
    .toLowerCase()
    .trim()
    .min(1, 'field is required.')
    .max(16, 'maximum name length is 16 characters.'),
  isViewable: z.boolean()
})

interface Props {
  handleEdit: (params: {
    [K in keyof Omit<TCategory, 'id'>]: K extends 'image' ? File | null : Omit<TCategory, 'id'>[K]
  }) => Promise<Omit<TCategory, 'id'>>
  loading: boolean
  category: Omit<TCategory, 'id'>
}

export function UpdateCategoryForm(props: Props) {
  const { handleEdit, loading, category } = props
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [imageUploadError, setImageUpoadError] = useState('')
  const [preview, setPreview] = useState('')
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.name,
      isViewable: category.isViewable
    }
  })

  useEffect(() => {
    if (category.image) setPreview(import.meta.env.VITE_LOCAL_SERVER_URL + category.image)
  }, [])

  const handleUploadedFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUpoadError('')
    const file = event.target.files ? event.target.files[0] : null
    if (file) {
      if (file.size > 2097152) {
        setImageUpoadError('Maximum image size is 2MB.')
        return
      }
      const reader = new FileReader()

      reader.onloadend = () => {
        setPreview(reader.result as string)
      }

      reader.readAsDataURL(file)

      return
    }
    setImageUpoadError('Something went wrong.')
  }

  const onUpload = () => {
    if (imageInputRef && imageInputRef.current) imageInputRef.current.click()
  }

  const buttonText = preview ? 'Change image' : 'Upload image'

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = await handleEdit({
      name: values.name,
      isViewable: values.isViewable,
      image: imageInputRef.current?.files ? imageInputRef.current.files[0] : null
    })
    if (data) {
      setPreview(data.image ? import.meta.env.VITE_LOCAL_SERVER_URL + data.image : '')
      if (imageInputRef.current) imageInputRef.current.value = ''
      form.reset({ name: data.name, isViewable: data.isViewable && true })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isViewable"
          render={({ field }) => (
            <FormItem className="w-fit flex items-center gap-4 space-y-0 border py-2 px-4">
              <FormLabel className="text-muted-foreground">Is Viewable</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem className="flex-1">
          <FormLabel>Image</FormLabel>
          <div className="border w-2/3 py-2 px-4 flex items-center justify-between">
            <Avatar className="rounded h-20 w-20">
              <AvatarImage className="rounded" src={preview} alt="@shadcn" />
              <AvatarFallback className="rounded">CC</AvatarFallback>
            </Avatar>
            <input
              ref={imageInputRef}
              onChange={handleUploadedFile}
              type="file"
              className="hidden"
            />
            <Button type="button" variant={'link'} onClick={onUpload}>
              {buttonText}
            </Button>
          </div>
          <FormMessage> {imageUploadError} </FormMessage>
        </FormItem>
        <Button disabled={loading} type="submit" className="w-full ">
          Submit
        </Button>
      </form>
    </Form>
  )
}
