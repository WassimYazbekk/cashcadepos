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
import { TSupplier } from '@renderer/types/types'
import { useEffect } from 'react'

const formSchema = z.object({
  firstName: z
    .string()
    .toLowerCase()
    .trim()
    .min(1, 'field is required.')
    .max(16, 'maximum name length is 16 characters.'),
  middleName: z.string().toLowerCase().trim().max(16, 'maximum name length is 16 characters.'),
  lastName: z
    .string()
    .toLowerCase()
    .trim()
    .min(1, 'field is required.')
    .max(16, 'maximum name length is 16 characters.'),
  phoneNumber: z.string().toLowerCase().trim().max(16, 'maximum phone length is 16 characters.')
})

interface Props {
  handleCreate: (params: Omit<TSupplier, 'id'>) => Promise<boolean>
  loading: boolean
  setIsClean: React.Dispatch<boolean>
}

export function CreateSupplierForm(props: Props) {
  const { handleCreate, loading, setIsClean } = props
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      phoneNumber: ''
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const success = await handleCreate(values)
    if (success) form.reset()
  }

  useEffect(() => {
    form.formState.isDirty ? setIsClean(false) : setIsClean(true)
  }, [form.formState.isDirty])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>{'FIRST NAME'}</FormLabel>
              <FormControl>
                <Input placeholder="first name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="middleName"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>{'MIDDLE NAME'}</FormLabel>
              <FormControl>
                <Input placeholder="middle name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>{'LAST NAME'}</FormLabel>
              <FormControl>
                <Input placeholder="last name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>{'PHONE NUMBER'}</FormLabel>
              <FormControl>
                <Input placeholder="phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit" className="w-full ">
          Submit
        </Button>
      </form>
    </Form>
  )
}
