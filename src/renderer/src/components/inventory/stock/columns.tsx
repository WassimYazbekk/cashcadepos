import { Button } from '@renderer/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { TStock } from '@renderer/types/types'
import { MoreHorizontal } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router-dom'
import { formatNumberWithCommas } from '@renderer/lib/format-number-with-commas'
import { format } from 'date-fns'

export const columns: ColumnDef<TStock>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const id = Number(row.getValue('id')).toString()
      return <div className=" font-medium">#{id}</div>
    }
  },
  {
    accessorKey: 'supplierId',
    header: 'SID',
    cell: ({ row }) => {
      const id = Number(row.getValue('supplierId')).toString()
      return <div className=" font-medium">#{id}</div>
    }
  },
  {
    accessorKey: 'productId',
    header: 'PID',
    cell: ({ row }) => {
      const id = Number(row.getValue('productId')).toString()
      return <div className=" font-medium">#{id}</div>
    }
  },
  {
    accessorKey: 'number',
    header: 'Number',
    cell: ({ row }) => {
      const number: string = row.getValue('number')
      return <div className="capitalize">{number}</div>
    }
  },
  {
    accessorKey: 'productName',
    header: 'Product',
    cell: ({ row }) => {
      const product: string | undefined = row.getValue('productName')
      return <div className="capitalize">{product}</div>
    }
  },
  {
    accessorKey: 'supplierFirstName',
    header: 'Supplier',
    cell: ({ row }) => {
      const firstName = row.original.supplierFirstName
      const middleName = row.original.supplierMiddleName
      const lastName = row.original.supplierLastName
      let name = ''
      if (firstName) name = name + firstName + ' '
      if (middleName) name = name + middleName + ' '
      if (lastName) name = name + lastName + ' '
      return <div className="capitalize text-nowrap">{name}</div>
    }
  },
  {
    accessorKey: 'cost',
    header: 'Cost',
    cell: ({ row }) => {
      const dollarRate = Number(row.getValue('dollarRate')) / 100
      const cost: number = Number(row.getValue('cost')) / 100
      const currency: 'USD' | 'LBP' = row.getValue('currency')
      const costLB: string =
        currency === 'LBP'
          ? `${formatNumberWithCommas(cost)} £`
          : `${formatNumberWithCommas(cost * dollarRate)} £`
      const costUS: string =
        currency === 'USD'
          ? `${formatNumberWithCommas(cost)} $`
          : `${formatNumberWithCommas(Math.round((cost / dollarRate) * 100) / 100)} $`

      return (
        <div className="flex flex-col items-start justify-center text-nowrap">
          {costLB}
          <hr />
          {costUS}
        </div>
      )
    }
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: ({ row }) => {
      const quantity = Number(row.getValue('quantity'))
      return <div>{quantity}</div>
    }
  },
  {
    accessorKey: 'totalPaid',
    header: 'Paid',
    cell: ({ row }) => {
      const dollarRate = Number(row.getValue('dollarRate')) / 100
      const cost: number = Number(row.getValue('totalPaid')) / 100
      const currency: 'USD' | 'LBP' = row.getValue('currency')
      const costLB: string =
        currency === 'LBP'
          ? `${formatNumberWithCommas(cost)} £`
          : `${formatNumberWithCommas(cost * dollarRate)} £`
      const costUS: string =
        currency === 'USD'
          ? `${formatNumberWithCommas(cost)} $`
          : `${formatNumberWithCommas(Math.round((cost / dollarRate) * 100) / 100)} $`

      return (
        <div className="flex flex-col items-start justify-center text-nowrap">
          {costLB}
          <hr />
          {costUS}
        </div>
      )
    }
  },
  {
    accessorKey: 'currency',
    header: 'Currency'
  },

  {
    accessorKey: 'dollarRate',
    header: 'Dollar Rate',
    cell: ({ row }) => {
      const dollarRate = Number(row.getValue('category'))
      return (
        <div className="capitalize text-nowrap">{formatNumberWithCommas(dollarRate) + ' £'}</div>
      )
    }
  },

  {
    accessorKey: 'notes',
    header: 'Notes',
    cell: ({ row }) => {
      const notes: string | null = row.getValue('notes') || ''
      return <div>{notes.length < 32 ? notes : `${notes.slice(0, 29)}...`}</div>
    }
  },

  {
    accessorKey: 'isPaid',
    header: 'Is Paid',
    cell: ({ row }) => {
      const isPaid = row.getValue('isPaid')
      return <div>{isPaid ? 'YES' : 'NO'}</div>
    }
  },

  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const timeStamp = Number(row.getValue('date'))
      const date = format(timeStamp, 'd/M/yyyy')
      return <div className="capitalize text-nowrap">{date}</div>
    }
  },

  {
    accessorKey: 'updateDate',
    header: 'Update Date',
    cell: ({ row }) => {
      console.log(row.original)

      const timeStamp = Number(row.getValue('updateDate'))
      const date = timeStamp ? format(timeStamp, 'd/M/yyyy') : 'Not Updated'
      return <div className="capitalize text-nowrap">{date}</div>
    }
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      const stock = row.original

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
              <Link className="w-full h-full p-2" to={'/inventory/stock/update/' + stock.id}>
                Edit
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
