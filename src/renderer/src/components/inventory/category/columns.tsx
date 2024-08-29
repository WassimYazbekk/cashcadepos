import { Button } from '@renderer/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { TCategory } from '@renderer/types/types'
import { MoreHorizontal } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router-dom'

export const columns: ColumnDef<TCategory>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const id = Number(row.getValue('id')).toString()
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
      const category = row.original

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
              <Link className="w-full h-full p-2" to={'/inventory/category/' + category.id}>
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <Link className="w-full h-full p-2" to={'/inventory/category/update/' + category.id}>
                Edit
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
