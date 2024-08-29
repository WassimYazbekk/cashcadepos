import { Avatar, AvatarFallback, AvatarImage } from '@renderer/components/ui/avatar'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { useSettingnsContext } from '@renderer/contexts/settings-context'
import http from '@renderer/lib/local-axios-client'
import { ArrowLeft } from 'lucide-react'
import { useRef, useState } from 'react'
import CurrencyInput from 'react-currency-input-field'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function AppSettings() {
  const { t } = useTranslation('forms')
  const {
    appSettings,
    setName,
    setDollarRate,
    setDefaultCurrency,
    setLanguage,
    setPrinterName,
    setPrinterWidth,
    setLogo
  } = useSettingnsContext()
  console.log(appSettings.logo)

  const navigate = useNavigate()
  const [_dollarRate, _setDollarRate] = useState<string | undefined>(
    appSettings.dollarRate.toString()
  )
  const [_name, _setName] = useState<string | undefined>(appSettings.name)
  const [_defaultCurrency, _setDefaultCurrency] = useState<'USD' | 'LBP'>(
    appSettings.defaultCurrency
  )
  const [_language, _setLanguage] = useState<'ar' | 'en'>(appSettings.language)
  const [_printerName, _setPrinterName] = useState<string | undefined>(appSettings.printerName)
  const [_printerWidth, _setPrinterWidth] = useState<
    '80mm' | '78mm' | '76mm' | '58mm' | '57mm' | '44mm'
  >(appSettings.printerWidth)
  const [imageUploadError, setImageUpoadError] = useState<string>('')
  const imageInputRef = useRef<HTMLInputElement>(null)

  const handleUploadedFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUpoadError('')
    const file = event.target.files ? event.target.files[0] : null
    if (file) {
      if (file.size > 2097152) {
        setImageUpoadError('Maximum image size is 2MB.')
        return
      }
      const formData = new FormData()
      formData.append('file', file)
      const response = await http.post('upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (response.status === 201) {
        let image = ''
        image = await response.data.image
        setLogo(image)
        return
      }
    }
    setImageUpoadError('Something went wrong.')
  }

  const onUpload = () => {
    if (imageInputRef && imageInputRef.current) imageInputRef.current.click()
  }

  return (
    <div className="w-full h-screen p-2 overflow-y-scroll">
      <div className="flex flex-col items-center justify-center h-fit w-full relative ">
        <Button onClick={() => navigate(-1)} className=" absolute top-0 left-1" variant={'ghost'}>
          <ArrowLeft />
          Back
        </Button>
        <h1 className="w-full text-3xl text-center my-2">App Settings</h1>
        <div className="w-full max-w-md flex flex-col self-start mt-6 m-4 space-y-4">
          <div className="flex-1 space-y-2">
            <label>{t('label-name')}</label>
            <div className="flex gap-2">
              <Input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Name"
                value={_name}
                onChange={(event) => {
                  _setName(event.target.value)
                }}
              />
              <Button
                disabled={_name === appSettings.name || !_name}
                onClick={() => {
                  if (_name) setName(_name)
                }}
              >
                Save
              </Button>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <label>Dollar Rate</label>
            <div className="flex gap-2">
              <CurrencyInput
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Dollar Rate"
                value={_dollarRate}
                required
                onValueChange={(value) => {
                  _setDollarRate(value)
                }}
              />
              <Button
                disabled={Number(_dollarRate) === appSettings.dollarRate || !_dollarRate}
                onClick={() => {
                  if (_dollarRate) setDollarRate(Number(_dollarRate))
                }}
              >
                Save
              </Button>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <label>Default Currency</label>
            <div className="flex gap-2">
              <Select
                value={_defaultCurrency}
                onValueChange={(value: 'USD' | 'LBP') => _setDefaultCurrency(value)}
                defaultValue={appSettings.defaultCurrency}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">US Dollar</SelectItem>
                  <SelectItem value="LBP">Lebanese Pound</SelectItem>
                </SelectContent>
              </Select>
              <Button
                disabled={_defaultCurrency === appSettings.defaultCurrency}
                onClick={() => {
                  setDefaultCurrency(_defaultCurrency)
                }}
              >
                Save
              </Button>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <label>Language</label>
            <div className="flex gap-2">
              <Select
                value={_language}
                onValueChange={(value: 'en' | 'ar') => _setLanguage(value)}
                defaultValue={appSettings.language}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
              <Button
                disabled={_language === appSettings.language}
                onClick={() => {
                  setLanguage(_language)
                }}
              >
                Save
              </Button>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <label>Printer Name</label>
            <div className="flex gap-2">
              <Input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Default"
                value={_printerName}
                onChange={(event) => {
                  _setPrinterName(event.target.value)
                }}
              />
              <Button
                disabled={_printerName === appSettings.printerName}
                onClick={() => {
                  setPrinterName(_printerName)
                }}
              >
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Leave empty to use default printer</p>
          </div>

          <div className="flex-1 space-y-2">
            <label>Printer Width</label>
            <div className="flex gap-2">
              <Select
                value={_printerWidth}
                onValueChange={(value: '80mm' | '78mm' | '76mm' | '58mm' | '57mm' | '44mm') =>
                  _setPrinterWidth(value)
                }
                defaultValue={appSettings.printerWidth}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="80mm">80mm | 8cm</SelectItem>
                  <SelectItem value="78mm">78mm | 7.8cm</SelectItem>
                  <SelectItem value="76mm">76mm | 7.6cm</SelectItem>
                  <SelectItem value="58mm">58mm | 5.8cm</SelectItem>
                  <SelectItem value="57mm">57mm | 5.7cm</SelectItem>
                  <SelectItem value="44mm">44mm | 4.4cm</SelectItem>
                </SelectContent>
              </Select>
              <Button
                disabled={_printerWidth === appSettings.printerWidth}
                onClick={() => {
                  setPrinterWidth(_printerWidth)
                }}
              >
                Save
              </Button>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <h1>Logo</h1>
            <div className="border w-full py-2 px-4 flex items-center justify-between">
              <Avatar className="rounded h-20 w-20">
                <AvatarImage
                  className="rounded"
                  src={
                    appSettings.logo ? import.meta.env.VITE_LOCAL_SERVER_URL + appSettings.logo : ''
                  }
                  alt="cashcade"
                />
                <AvatarFallback className="rounded">CC</AvatarFallback>
              </Avatar>
              <input
                ref={imageInputRef}
                onChange={handleUploadedFile}
                type="file"
                className="hidden"
              />
              <Button type="button" variant={'link'} onClick={onUpload}>
                Upload
              </Button>
            </div>
            <p className="text-destructive text-sm"> {imageUploadError} </p>
          </div>
        </div>
      </div>
    </div>
  )
}
