import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import CurrencyInput from 'react-currency-input-field'

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
import { TCategory, TProduct } from '@renderer/types/types'
import { Switch } from '@renderer/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@renderer/components/ui/avatar'
import { useRef, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import SearchDropdown from '@renderer/components/common/search-dropdown'

const formSchema = z.object({
  name: z
    .string()
    .toLowerCase()
    .trim()
    .min(1, 'field is required.')
    .max(16, 'maximum name length is 16 characters.'),
  isViewable: z.boolean(),
  currency: z.enum(['$', '£'])
})

interface Props {
  handleCreate: (params: {
    [K in keyof Omit<TProduct, 'id' | 'remainingQuantity' | 'category'>]: K extends 'image'
      ? File | null
      : Omit<TProduct, 'id' | 'remainingQuantity' | 'category'>[K]
  }) => Promise<boolean>
  loading: boolean
  categories: TCategory[]
}

export function CreateProductForm(props: Props) {
  const { handleCreate, loading, categories } = props
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [imageUploadError, setImageUpoadError] = useState('')
  const [preview, setPreview] = useState('')
  const [price, setPrice] = useState<string>()
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      isViewable: true,
      currency: '$'
    }
  })

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
    console.log(values)

    const success = await handleCreate({
      name: values.name,
      isViewable: values.isViewable,
      image: imageInputRef.current?.files ? imageInputRef.current.files[0] : null,
      categoryId: categoryId,
      price: Number(price),
      currency: values.currency === '$' ? 'USD' : 'LBP'
    })
    if (success) {
      setPreview('')
      if (imageInputRef.current) imageInputRef.current.value = ''
      form.reset()
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
                <Input placeholder="Product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between gap-4">
          <FormItem className="flex-1">
            <FormLabel>Price</FormLabel>
            <FormControl>
              <CurrencyInput
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                prefix={form.getValues().currency}
                placeholder="Price"
                value={price}
                required
                onValueChange={(value) => {
                  setPrice(value)
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem className="w-24">
                <FormLabel>Currency</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="$">USD</SelectItem>
                    <SelectItem value="£">LBP</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full items-end gap-2 justify-between">
          <SearchDropdown
            data={categories}
            className="w-40 justify-start"
            title="Category"
            value={categoryId}
            valueKey={['name']}
            setValue={setCategoryId}
          />

          <FormField
            control={form.control}
            name="isViewable"
            render={({ field }) => (
              <FormItem className="flex-1 flex items-center justify-end gap-4 space-y-0  py-2 px-4">
                <FormLabel>Is Viewable</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
        <Button
          disabled={loading}
          onClick={() => console.log(form.formState.errors)}
          type="submit"
          className="w-full "
        >
          Submit
        </Button>
      </form>
    </Form>
  )
}
