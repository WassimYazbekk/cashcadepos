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

const formSchema = z.object({
  firstName: z
    .string()
    .toLowerCase()
    .trim()
    .min(1, 'first name is required.')
    .max(16, 'maximum name length is 16 characters.'),
  middleName: z.string().toLowerCase().trim().max(16, 'maximum name length is 16 characters.'),
  lastName: z
    .string()
    .toLowerCase()
    .trim()
    .min(1, 'last name is required.')
    .max(16, 'maximum name length is 16 characters.'),
  phoneNumber: z.string().toLowerCase().trim().max(16, 'maximum phone length is 16 characters.')
})

interface Props {
  handleEdit: (params: Omit<TSupplier, 'id'>) => Promise<Omit<TSupplier, 'id'>>
  loading: boolean
  supplier: Omit<TSupplier, 'id'>
}

export function UpdateSupplierForm(props: Props) {
  const { handleEdit, loading, supplier } = props
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: supplier.firstName,
      middleName: supplier.middleName,
      lastName: supplier.lastName,
      phoneNumber: supplier.phoneNumber
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = await handleEdit(values)
    if (data) {
      form.reset(data)
    }
  }

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
