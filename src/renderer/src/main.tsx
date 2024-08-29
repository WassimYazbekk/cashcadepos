import './assets/index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import { Toaster } from './components/ui/toaster'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContextProvider } from './contexts/auth-context'
import { ThemeProvider } from './components/common/theme-provider'
import './i18n'
import { SettingnsContextProvider } from './contexts/settings-context'
import { OrdersContextProvider } from './contexts/orders-context'

const client = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthContextProvider>
        <SettingnsContextProvider>
          <OrdersContextProvider>
            <QueryClientProvider client={client}>
              <RouterProvider router={router} />
              <Toaster />
            </QueryClientProvider>
          </OrdersContextProvider>
        </SettingnsContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  </React.StrictMode>
)
