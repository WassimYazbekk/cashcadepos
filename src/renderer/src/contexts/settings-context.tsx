import { ReactFCWithChildren } from '@renderer/types/props'
import { createContext, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export type TSettingnsStateContext = {
  appSettings: TAppSettings
  setName: (arg0: string) => void
  setDollarRate: (arg0: number) => void
  setDefaultCurrency: (arg0: 'USD' | 'LBP') => void
  setLanguage: (arg0: 'en' | 'ar') => void
  setPrinterName: (arg0: string | undefined) => void
  setPrinterWidth: (arg0: '80mm' | '78mm' | '76mm' | '58mm' | '57mm' | '44mm') => void
  setLogo: (arg0: string | undefined) => void
}

export type TAppSettings = {
  name: string
  dollarRate: number
  defaultCurrency: 'USD' | 'LBP'
  language: 'en' | 'ar'
  printerName: string | undefined
  printerWidth: '80mm' | '78mm' | '76mm' | '58mm' | '57mm' | '44mm'
  logo: string | undefined
}

const DEFAULT_APP_SETTINGS: TAppSettings = {
  name: 'Cashcade',
  dollarRate: 90000,
  defaultCurrency: 'LBP',
  language: 'en',
  printerName: undefined,
  printerWidth: '80mm',
  logo: undefined
}

const StateContext = createContext<TSettingnsStateContext>({
  appSettings: DEFAULT_APP_SETTINGS,
  setName: () => {},
  setDollarRate: () => {},
  setDefaultCurrency: () => {},
  setLanguage: () => {},
  setPrinterName: () => {},
  setPrinterWidth: () => {},
  setLogo: () => {}
})

export const SettingnsContextProvider: React.FC<ReactFCWithChildren> = ({ children }) => {
  const { i18n } = useTranslation()
  const [appSettings, _setAppSettigns] = useState<TAppSettings>(DEFAULT_APP_SETTINGS)

  function setAppSettigns(data: TAppSettings) {
    localStorage.setItem('APP_SETTINGS', JSON.stringify(data))
    _setAppSettigns(data)
  }

  function setName(newName: string) {
    setAppSettigns({ ...appSettings, name: newName })
  }

  function setDollarRate(newDollarRate: number) {
    setAppSettigns({ ...appSettings, dollarRate: newDollarRate })
  }

  function setDefaultCurrency(currency: 'USD' | 'LBP') {
    setAppSettigns({ ...appSettings, defaultCurrency: currency })
  }

  function setLanguage(language: 'en' | 'ar') {
    setAppSettigns({ ...appSettings, language: language })
    i18n.changeLanguage(language)
  }

  function setPrinterName(name: string | undefined) {
    setAppSettigns({ ...appSettings, printerName: name })
  }

  function setPrinterWidth(width: '80mm' | '78mm' | '76mm' | '58mm' | '57mm' | '44mm') {
    setAppSettigns({ ...appSettings, printerWidth: width })
  }

  function setLogo(logo: string | undefined) {
    setAppSettigns({ ...appSettings, logo: logo })
  }

  useEffect(() => {
    const getSettingsData = () => {
      try {
        const _appSettings = localStorage.getItem('APP_SETTINGS')
        if (_appSettings) _setAppSettigns(JSON.parse(_appSettings))
        else setAppSettigns(DEFAULT_APP_SETTINGS)
      } catch (error) {
        console.log(error)
      }
    }

    getSettingsData()
  }, [])

  return (
    <StateContext.Provider
      value={{
        appSettings: appSettings,
        setName: setName,
        setDollarRate: setDollarRate,
        setDefaultCurrency: setDefaultCurrency,
        setLanguage: setLanguage,
        setPrinterName: setPrinterName,
        setPrinterWidth: setPrinterWidth,
        setLogo: setLogo
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useSettingnsContext = () => useContext(StateContext)
