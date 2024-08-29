import { NavLink, Outlet } from 'react-router-dom'
import NavigationBar from './navigation-bar'
import { LucideLayers, LucideLayoutGrid, LucidePackage } from 'lucide-react'

export default function PosLayout() {
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
        </div>
        <div className="w-full h-full">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
