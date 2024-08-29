export type TCategory = {
  id: number
  name: string
  isViewable: boolean
  image: string | null
}

export type TProduct = {
  id: number
  categoryId: number | null
  category: string
  name: string
  price: number
  remainingQuantity: number
  image: string
  currency: 'USD' | 'LBP'
  isViewable: boolean
}

export type TSupplier = {
  id: number
  firstName: string
  middleName: string
  lastName: string
  phoneNumber: string
}

export type TBill = {
  id: number
  supplierId: number | null
  supplierFirstName: string | null
  supplierMiddleName: string | null
  supplierLastName: string | null
  number: string | null
  cost: number
  date: number
  notes: string
  dollarRate: number
  currency: 'USD' | 'LBP'
  isPaid: boolean
  totalPaid: number
  updateDate: number | null
}

export type TStock = {
  id: number
  productId: number | null
  productName: string | null
  supplierId: number | null
  supplierFirstName: string | null
  supplierMiddleName: string | null
  supplierLastName: string | null
  number: string | null
  cost: number
  quantity: number
  date: number
  notes: string
  dollarRate: number
  currency: 'USD' | 'LBP'
  isPaid: boolean
  totalPaid: number
  updateDate: number | null
}

export type TOrder = {
  id: number
  customerId: number | null
  customerFirstName: string | null
  customerMiddleName: string | null
  customerLastName: string | null
  totalPrice: number
  date: number
  updateDate: number
  dollarRate: number
  currency: 'USD' | 'LBP'
  notes: string
  discount: number
  delivery: number
  products: TOrderProduct[]
  isPaid: boolean
  totalPaid: number
  type: 'SALE' | 'REFUND'
}

export type TOrderProduct = {
  id: number
  productId: number
  orderId: number
  pricePerItem: number
  quantity: number
  currency: 'USD' | 'LBP'
}

export type TUser = {
  id: number
  username: string
}

export type TAuthStateContext = {
  user: TUser | null
  token: string | null
  login: (username: string, password: string) => void
  logout: () => void
  loading: boolean
}
