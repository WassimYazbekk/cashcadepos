import { Button } from '@renderer/components/ui/button'
import { Input } from '../ui/input'
import { Dispatch, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { LucideCheck } from 'lucide-react'

interface IObjectWithId {
  id: number | null
}
interface IItem extends IObjectWithId {}
type Props = {
  data: IItem[]
  valueKey: string[]
  value: number | null
  setValue: Dispatch<number | null>
  title: string
  className?: string
}

const SearchDropdown: React.FC<Props> = ({ data, valueKey, value, setValue, title, className }) => {
  const [search, setSearch] = useState('')
  const filteredData = data
    ? [...data].filter((item) => {
        let temp = false
        for (let i = 0; i < valueKey.length; ++i) {
          const key = valueKey[i]
          const value = item[key]

          if (typeof value === 'string' && value.toLowerCase().includes(search.toLowerCase())) {
            temp = true
          }
        }
        return temp
      })
    : []

  const currentItem = data.find((item) => item.id === value)
  const currentTitle = !currentItem
    ? title
    : valueKey.map((key) => {
        return currentItem[key] + ' '
      })
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={className}>
          {currentTitle}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 max-h-96 p-1">
        <Input
          value={search}
          placeholder="Search"
          className="mb-2"
          onChange={(e) => {
            e.preventDefault()
            setSearch(e.target.value)
          }}
        />
        <div className="overflow-y-scroll h-80 overflow-x-auto">
          <Button
            type="button"
            variant={'ghost'}
            className="capitalize flex w-full text-sm justify-start p-2"
            onClick={() => setValue(null)}
          >
            <LucideCheck size={18} className={`mr-2 ${value !== null ? 'invisible' : ''}`} />
            None
          </Button>
          {filteredData.length > 0 ? (
            filteredData.map((item) => {
              return (
                <Button
                  type="button"
                  variant={'ghost'}
                  className="capitalize flex w-full text-sm justify-start p-2"
                  onClick={() => setValue(item.id)}
                  key={item[valueKey[0]] + item.id}
                >
                  <LucideCheck
                    size={18}
                    className={`mr-2 ${value !== item.id ? 'invisible' : ''}`}
                  />
                  {valueKey.map((key) => {
                    return item[key] + ' '
                  })}
                </Button>
              )
            })
          ) : (
            <h1>No Results...</h1>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
export default SearchDropdown
