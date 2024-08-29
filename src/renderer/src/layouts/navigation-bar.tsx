import { useAuthContext } from '@renderer/contexts/auth-context'
import { NavLink, Navigate } from 'react-router-dom'
import { UserMenu } from './user-menu'
import { useSettingnsContext } from '@renderer/contexts/settings-context'

export default function NavigationBar() {
  const { token } = useAuthContext()
  const { appSettings } = useSettingnsContext()
  if (!token) return <Navigate to={'/login'} />
  return (
    <div className="h-24 border w-full flex items-center justify-between px-2 select-none">
      <div className="flex flex-col items-center justify-center space-y-1">
        <h1 className="text-primary text-4xl font-semibold capitalize">{appSettings.name}</h1>
        <h2 className=" text-xl font-medium">Tue 9:32 AM</h2>
      </div>
      <nav className="flex items-center justify-center gap-3">
        <NavLink
          className={({ isActive }) =>
            `text-xl font-medium transition-colors duration-300 ${isActive ? 'text-primary ' : ''}`
          }
          to={'/pos'}
        >
          Orders Station
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `text-xl font-medium transition-colors duration-300 ${isActive ? 'text-primary ' : ''}`
          }
          to={'/inventory'}
        >
          Inventory
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `text-xl font-medium transition-colors duration-300 ${isActive ? 'text-primary ' : ''}`
          }
          to={'/dashboard'}
        >
          Dashboard
        </NavLink>
      </nav>
      <div className="flex items-center justify-center gap-2">
        <UserMenu />
      </div>
    </div>
  )
}
