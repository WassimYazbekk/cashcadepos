import { NavLink, Outlet } from 'react-router-dom'
import NavigationBar from './navigation-bar'
import {
  LucideLayers,
  LucideLayoutGrid,
  LucideNotepadText,
  LucidePackage,
  LucideTruck
} from 'lucide-react'

export default function InventoryLayout() {
  return (
    <div className="min-h-screen w-full">
      <NavigationBar />
      <div className="flex w-full h-[calc(100vh-95px)]">
        <div className="flex flex-col h-full w-16 border-x space-y-2 items-center justify-start p-2">
          <NavLink
            to={'/inventory/category'}
            className={({ isActive }) => (isActive ? 'text-primary p-2' : 'p-2')}
          >
            <LucideLayoutGrid className="h-8 w-8" />
          </NavLink>
          <NavLink
            to={'/inventory/product'}
            className={({ isActive }) => (isActive ? 'text-primary p-2' : 'p-2')}
          >
            <LucideLayers className="h-8 w-8" />
          </NavLink>
          <NavLink
            to={'/inventory/stock'}
            className={({ isActive }) => (isActive ? 'text-primary p-2' : 'p-2')}
          >
            <LucidePackage className="h-8 w-8" />
          </NavLink>
          <NavLink
            to={'/inventory/bill'}
            className={({ isActive }) => (isActive ? 'text-primary p-2' : 'p-2')}
          >
            <LucideNotepadText className="h-8 w-8" />
          </NavLink>
          <NavLink
            to={'/inventory/supplier'}
            className={({ isActive }) => (isActive ? 'text-primary p-2' : 'p-2')}
          >
            <LucideTruck className="h-8 w-8" />
          </NavLink>
        </div>
        <div className="w-full h-full overflow-y-auto p-1 gutter">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
