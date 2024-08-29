import { Button } from '@renderer/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { TProduct } from '@renderer/types/types'
import { MoreHorizontal } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router-dom'
import { useSettingnsContext } from '@renderer/contexts/settings-context'
import { formatNumberWithCommas } from '@renderer/lib/format-number-with-commas'

export const columns: ColumnDef<TProduct>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const id = Number(row.getValue('id')).toString()
      return <div className=" font-medium">#{id}</div>
    }
  },
  {
    accessorKey: 'categoryId',
    header: 'CID',
    cell: ({ row }) => {
      const id = Number(row.getValue('categoryId')).toString()
      return <div className=" font-medium">#{id}</div>
    }
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const name: string = row.getValue('name')
      return <div className="capitalize">{name}</div>
    }
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category: string = row.getValue('category')
      return <div className="capitalize">{category}</div>
    }
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const image: string = row.getValue('image')
      return (
        <div className="w-10 h-10 bg-neutral-500 overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={image ? import.meta.env.VITE_LOCAL_SERVER_URL + image : ''}
          />
        </div>
      )
    }
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const { appSettings } = useSettingnsContext()
      const price: number = Number(row.getValue('price')) / 100
      const currency: 'USD' | 'LBP' = row.getValue('currency')
      const priceLB: string =
        currency === 'LBP'
          ? `${formatNumberWithCommas(price)} £`
          : `${formatNumberWithCommas(price * appSettings.dollarRate)} £`
      const priceUS: string =
        currency === 'USD'
          ? `${formatNumberWithCommas(price)} $`
          : `${formatNumberWithCommas(Math.round((price / appSettings.dollarRate) * 100) / 100)} $`

      return (
        <div className="flex flex-col items-start justify-center">
          {priceLB}
          <hr />
          {priceUS}
        </div>
      )
    }
  },
  {
    accessorKey: 'remainingQuantity',
    header: 'Quantity',
    cell: ({ row }) => {
      const quantity: string | undefined = row.getValue('remainingQuantity')
      return <div>{quantity ? quantity : '0'}</div>
    }
  },
  {
    accessorKey: 'currency',
    header: 'Currency'
  },
  {
    accessorKey: 'isViewable',
    header: 'Visibility',
    cell: ({ row }) => {
      const isViewable = row.getValue('isViewable')
      return <div>{isViewable ? 'Visible' : 'Hidden'}</div>
    }
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      const product = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-0">
              <Link className="w-full h-full p-2" to={'/inventory/product/' + product.id}>
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <Link className="w-full h-full p-2" to={'/inventory/product/update/' + product.id}>
                Edit
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
