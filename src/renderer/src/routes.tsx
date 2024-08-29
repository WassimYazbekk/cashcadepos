import { createBrowserRouter } from 'react-router-dom'
import LoginPage from './views/login'
import SplashScreen from './views'
import PosLayout from './layouts/pos-layout'
import Pos from './views/pos'
import Customers from './views/pos/customer'
import CreateCustomer from './views/pos/customer/create'
import ShowCustomer from './views/pos/customer/show'
import UpdateCustomer from './views/pos/customer/update'
import InventoryLayout from './layouts/inventory-layout'
import Inventory from './views/inventory'
import Categories from './views/inventory/category'
import CreateCategory from './views/inventory/category/create'
import ShowCategory from './views/inventory/category/show'
import UpdateCategory from './views/inventory/category/update'
import Products from './views/inventory/product'
import CreateProduct from './views/inventory/product/create'
import ShowProduct from './views/inventory/product/show'
import UpdateProduct from './views/inventory/product/update'
import Stocks from './views/inventory/stock'
import CreateStock from './views/inventory/stock/create'
import ShowStock from './views/inventory/stock/show'
import UpdateStock from './views/inventory/stock/update'
import Bills from './views/inventory/bill'
import CreateBill from './views/inventory/bill/create'
import ShowBill from './views/inventory/bill/show'
import UpdateBill from './views/inventory/bill/update'
import Suppliers from './views/inventory/supplier'
import CreateSupplier from './views/inventory/supplier/create'
import ShowSupplier from './views/inventory/supplier/show'
import UpdateSupplier from './views/inventory/supplier/update'
import AppSettings from './views/app-settings'

const basename = window.location.pathname

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <SplashScreen />
    },
    {
      path: '/login',
      element: <LoginPage />
    },
    {
      path: '/app-settings',
      element: <AppSettings />
    },
    {
      path: '/pos',
      element: <PosLayout />,
      children: [
        {
          path: '/pos/',
          element: <Pos />
        },
        {
          path: '/pos/customer',
          element: <Customers />
        },
        {
          path: '/pos/customer/add',
          element: <CreateCustomer />
        },
        {
          path: '/pos/customer/:id',
          element: <ShowCustomer />
        },
        {
          path: '/pos/customer/update/:id',
          element: <UpdateCustomer />
        }
      ]
    },
    {
      path: '/inventory',
      element: <InventoryLayout />,
      children: [
        {
          path: '/inventory/',
          element: <Inventory />
        },
        {
          path: '/inventory/category',
          element: <Categories />
        },
        {
          path: '/inventory/category/add',
          element: <CreateCategory />
        },
        {
          path: '/inventory/category/:id',
          element: <ShowCategory />
        },
        {
          path: '/inventory/category/update/:id',
          element: <UpdateCategory />
        },
        {
          path: '/inventory/product',
          element: <Products />
        },
        {
          path: '/inventory/product/add',
          element: <CreateProduct />
        },
        {
          path: '/inventory/product/:id',
          element: <ShowProduct />
        },
        {
          path: '/inventory/product/update/:id',
          element: <UpdateProduct />
        },
        {
          path: '/inventory/stock',
          element: <Stocks />
        },
        {
          path: '/inventory/stock/add',
          element: <CreateStock />
        },
        {
          path: '/inventory/stock/:id',
          element: <ShowStock />
        },
        {
          path: '/inventory/stock/update/:id',
          element: <UpdateStock />
        },
        {
          path: '/inventory/bill',
          element: <Bills />
        },
        {
          path: '/inventory/bill/add',
          element: <CreateBill />
        },
        {
          path: '/inventory/bill/:id',
          element: <ShowBill />
        },
        {
          path: '/inventory/bill/update/:id',
          element: <UpdateBill />
        },
        {
          path: '/inventory/supplier',
          element: <Suppliers />
        },
        {
          path: '/inventory/supplier/add',
          element: <CreateSupplier />
        },
        {
          path: '/inventory/supplier/:id',
          element: <ShowSupplier />
        },
        {
          path: '/inventory/supplier/update/:id',
          element: <UpdateSupplier />
        }
      ]
    }
  ],
  { basename: basename }
)

export default router
