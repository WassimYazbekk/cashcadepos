import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { Button } from '@renderer/components/ui/button'
import { cn } from '@renderer/lib/utils'

type Props = {
  value: boolean | null
  setValue: (value: boolean | null) => void
  onTrue: string
  onFalse: string
  onNull: string
  className?: string
}

const BooleanFilter: React.FC<Props> = ({
  value,
  setValue,
  onTrue,
  onFalse,
  onNull,
  className
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn('ml-auto', className)}>
          {value === true ? onTrue : value === false ? onFalse : onNull}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuCheckboxItem
          key="true"
          className="capitalize"
          checked={value === true}
          onCheckedChange={() => setValue(true)}
        >
          {onTrue}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          key="false"
          className="capitalize"
          checked={value === false}
          onCheckedChange={() => setValue(false)}
        >
          {onFalse}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          key="null"
          className="capitalize"
          checked={value === null}
          onCheckedChange={() => setValue(null)}
        >
          {onNull}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default BooleanFilter
