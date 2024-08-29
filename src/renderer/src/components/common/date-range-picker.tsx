import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { cn } from '@renderer/lib/utils'
import { Button } from '@renderer/components/ui/button'
import { Calendar } from '@renderer/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@renderer/components/ui/popover'

type TProps = {
  className?: string
  startDate: number | null
  endDate: number | null
  setStartDate: React.Dispatch<number | null>
  setEndDate: React.Dispatch<number | null>
}

export function DatePickerWithRange({
  className,
  startDate,
  endDate,
  setStartDate,
  setEndDate
}: TProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startDate ? new Date(startDate) : undefined,
    to: endDate ? new Date(endDate) : undefined
  })

  React.useEffect(() => {
    if (date) {
      date.from ? setStartDate(date.from.getTime() - 86_400_000) : setStartDate(null)
      date.to ? setEndDate(date.to.getTime() + 86_400_000) : setEndDate(null)
    } else {
      setStartDate(null)
      setEndDate(null)
    }
  }, [date])

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[240] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'dd/M/yyyy')} - {format(date.to, 'dd/M/yyyy')}
                </>
              ) : (
                format(date.from, 'dd/M/yyyy')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
