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
import { TSupplier, TStock, TProduct } from '@renderer/types/types'
import { Switch } from '@renderer/components/ui/switch'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import SearchDropdown from '@renderer/components/common/search-dropdown'
import { Popover, PopoverContent, PopoverTrigger } from '@renderer/components/ui/popover'
import { cn } from '@renderer/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar } from '@renderer/components/ui/calendar'
import { Textarea } from '@renderer/components/ui/textarea'

const formSchema = z.object({
  number: z.string().toLowerCase().trim().max(14, 'maximum number length is 14 characters.'),
  date: z.date(),
  notes: z.string(),
  currency: z.enum(['$', '£']),
  isPaid: z.boolean()
})

interface Props {
  handleEdit: (
    params: Omit<
      TStock,
      | 'id'
      | 'updateDate'
      | 'supplierFirstName'
      | 'supplierMiddleName'
      | 'supplierLastName'
      | 'productName'
    >
  ) => Promise<
    Omit<
      TStock,
      | 'id'
      | 'updateDate'
      | 'supplierFirstName'
      | 'supplierMiddleName'
      | 'supplierLastName'
      | 'productName'
    >
  >
  loading: boolean
  stock: Omit<
    TStock,
    | 'id'
    | 'updateDate'
    | 'supplierFirstName'
    | 'supplierMiddleName'
    | 'supplierLastName'
    | 'productName'
  >
  suppliers: TSupplier[]
  products: TProduct[]
}

export function UpdateStockForm(props: Props) {
  const { handleEdit, loading, suppliers, stock, products } = props
  const [cost, setCost] = useState<string | undefined>((stock.cost / 100).toString())
  const [totalPaid, setTotalPaid] = useState<string | undefined>((stock.totalPaid / 100).toString())
  const [dollarRate, setDollarRate] = useState<string | undefined>(
    (stock.dollarRate / 100).toString()
  )

  const [quantity, setQuantity] = useState<string | undefined>(stock.quantity.toString())
  const [supplierId, setSupplierId] = useState<number | null>(stock.supplierId)
  const [productId, setProductId] = useState<number | null>(stock.productId)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: stock.number ? stock.number : '',
      isPaid: stock.isPaid,
      notes: stock.notes,
      currency: stock.currency === 'USD' ? '$' : '£',
      date: new Date(stock.date)
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)

    const updatedStock = await handleEdit({
      number: values.number,
      isPaid: values.isPaid,
      supplierId: supplierId,
      productId: productId,
      cost: Number(cost),
      totalPaid: totalPaid ? Number(totalPaid) : 0,
      dollarRate: Number(dollarRate),
      currency: values.currency === '$' ? 'USD' : 'LBP',
      date: values.date.getTime(),
      notes: values.notes,
      quantity: Number(quantity)
    })
    if (updatedStock) {
      form.reset({
        number: updatedStock.number ? updatedStock.number : '',
        isPaid: updatedStock.isPaid,
        notes: updatedStock.notes,
        currency: updatedStock.currency === 'USD' ? '$' : '£',
        date: new Date(updatedStock.date)
      })
      setCost((updatedStock.cost / 100).toString())
      setTotalPaid((updatedStock.totalPaid / 100).toString())
      setDollarRate((updatedStock.dollarRate / 100).toString())
      setQuantity(updatedStock.quantity.toString())
      setSupplierId(updatedStock.supplierId)
      setProductId(updatedStock.productId)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Number</FormLabel>
              <FormControl>
                <Input placeholder="Stock number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem className="flex-1">
          <FormLabel>Quantity</FormLabel>
          <FormControl>
            <CurrencyInput
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Quantity"
              value={quantity}
              required
              onValueChange={(value) => {
                if (value && Number(value) > 0) setQuantity(value)
              }}
            />
          </FormControl>
        </FormItem>

        <div className="flex items-center justify-between gap-4">
          <FormItem className="flex-1">
            <FormLabel>Cost</FormLabel>
            <FormControl>
              <CurrencyInput
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                prefix={form.getValues().currency}
                placeholder="Cost"
                value={cost}
                required
                onValueChange={(value) => {
                  setCost(value)
                  if (form.getValues().isPaid) setTotalPaid(value)
                }}
              />
            </FormControl>
          </FormItem>

          <FormItem className="flex-1">
            <FormLabel>Total Paid</FormLabel>
            <FormControl>
              <CurrencyInput
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                prefix={form.getValues().currency}
                placeholder="Total Paid"
                value={totalPaid}
                onValueChange={(value) => {
                  if (!value) {
                    setTotalPaid(undefined)
                    form.setValue('isPaid', false)
                    return
                  }
                  if (cost && value && Number(value) <= Number(cost)) setTotalPaid(value)
                  if (cost && Number(value) === Number(cost)) form.setValue('isPaid', true)
                  if (cost && Number(value) < Number(cost)) form.setValue('isPaid', false)
                }}
              />
            </FormControl>
          </FormItem>
        </div>
        <div className="flex items-center justify-between gap-4">
          <FormItem className="flex-1">
            <FormLabel>Dollar Rate</FormLabel>
            <FormControl>
              <CurrencyInput
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Dollar Rate"
                value={dollarRate}
                required
                onValueChange={(value) => {
                  setDollarRate(value)
                }}
              />
            </FormControl>
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
          <div className="flex gap-2 items-end">
            <SearchDropdown
              data={products}
              className="w-40 justify-start"
              title="Product"
              value={productId}
              valueKey={['name']}
              setValue={setProductId}
            />

            <SearchDropdown
              data={suppliers}
              className="w-40 justify-start"
              title="Supplier"
              value={supplierId}
              valueKey={['firstName', 'middleName', 'lastName']}
              setValue={setSupplierId}
            />
          </div>

          <FormField
            control={form.control}
            name="isPaid"
            render={({ field }) => (
              <FormItem className="flex-1 flex items-center justify-end gap-4 space-y-0  py-2 px-4">
                <FormLabel>Is Paid</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(e) => {
                      if (e) setTotalPaid(cost)
                      else setTotalPaid(undefined)
                      field.onChange(e)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="notes" {...field} />
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
