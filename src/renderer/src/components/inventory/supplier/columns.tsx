import { Button } from '@renderer/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { TSupplier } from '@renderer/types/types'
import { MoreHorizontal } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router-dom'

export const columns: ColumnDef<TSupplier>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const id = Number(row.getValue('id')).toString()
      return <div className=" font-medium">#{id}</div>
    }
  },
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: ({ row }) => {
      const name: string = row.getValue('firstName')
      return <div className="capitalize">{name}</div>
    }
  },
  {
    accessorKey: 'middleName',
    header: 'Middle Name',
    cell: ({ row }) => {
      const name: string = row.getValue('middleName')
      return <div className="capitalize">{name}</div>
    }
  },

  {
    accessorKey: 'lastName',
    header: 'Last Name',
    cell: ({ row }) => {
      const name: string = row.getValue('lastName')
      return <div className="capitalize">{name}</div>
    }
  },

  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number'
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      const supplier = row.original

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
              <Link className="w-full h-full p-2" to={'/inventory/supplier/update/' + supplier.id}>
                Edit
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
