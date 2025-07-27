import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { format, isValid, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomCalendarProps {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  accent?: boolean;
  pastDatesOnly?: boolean;
  futureDatesOnly?: boolean;
  yearRange?: number;
  showYearNavigation?: boolean;
}

const CustomCalendar = ({
  name,
  label,
  placeholder = "Pick a date",
  disabled = false,
  className = "",
  required = false,
  accent = false,
  pastDatesOnly = false,
  futureDatesOnly = false,
  yearRange = 50,
  showYearNavigation = false,
}: CustomCalendarProps) => {
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState<Date>(today);
  const { control } = useFormContext();

  // For year navigation
  const fromYear = today.getFullYear() - (pastDatesOnly ? yearRange : 0);
  const toYear =
    today.getFullYear() +
    (futureDatesOnly ? yearRange : pastDatesOnly ? 0 : yearRange);

  const years = Array.from(
    { length: toYear - fromYear + 1 },
    (_, i) => fromYear + i
  ).reverse();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Helper function to safely parse dates
  const parseDate = (
    dateString: string | null | undefined
  ): Date | undefined => {
    if (!dateString) return undefined;

    // Handle various date formats
    let date: Date | undefined;

    // Try parsing as dd-MM-yyyy format
    date = parse(dateString, "dd-MM-yyyy", new Date());
    if (isValid(date)) return date;

    // Try parsing as ISO string
    date = new Date(dateString);
    if (isValid(date)) return date;

    // Return undefined if no format works
    return undefined;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value, ...fieldProps },
        fieldState: { error },
      }) => {
        const parsedDate = parseDate(value);

        return (
          <div className="space-y-1">
            <Label
              htmlFor={name}
              className="text-xs font-medium text-gray-700 block"
            >
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id={name}
                  variant="outline"
                  disabled={disabled}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    "bg-white/50 backdrop-blur-sm transition-all duration-300",
                    "focus-visible:outline-none focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-1",
                    error
                      ? "border-red-500 focus-visible:border-transparent"
                      : "border-input focus-visible:border-transparent",
                    accent ? "border-2 border-primary" : "",
                    !parsedDate && "text-muted-foreground",
                    className
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                  {parsedDate && isValid(parsedDate) ? (
                    format(parsedDate, "dd/MM/yyyy")
                  ) : (
                    <span>{placeholder}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                {showYearNavigation && (
                  <div className="flex justify-between items-center p-2 border-b">
                    {/* Year dropdown */}
                    <Select
                      value={calendarMonth.getFullYear().toString()}
                      onValueChange={(value) => {
                        const newDate = new Date(calendarMonth);
                        newDate.setFullYear(parseInt(value));
                        setCalendarMonth(newDate);
                      }}
                    >
                      <SelectTrigger className="w-[100px] h-8">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Month dropdown */}
                    <Select
                      value={calendarMonth.getMonth().toString()}
                      onValueChange={(value) => {
                        const newDate = new Date(calendarMonth);
                        newDate.setMonth(parseInt(value));
                        setCalendarMonth(newDate);
                      }}
                    >
                      <SelectTrigger className="w-[120px] h-8">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month, index) => (
                          <SelectItem key={month} value={index.toString()}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Calendar
                  mode="single"
                  selected={parsedDate}
                  onSelect={(date) => {
                    if (date) {
                      const formattedDate = format(date, "dd-MM-yyyy");
                      onChange(formattedDate);
                    } else {
                      onChange(null);
                    }
                  }}
                  disabled={(date) => {
                    if (pastDatesOnly && date > today) return true;
                    if (futureDatesOnly && date < today) return true;
                    return disabled;
                  }}
                  month={calendarMonth}
                  onMonthChange={setCalendarMonth}
                  initialFocus
                  fromYear={fromYear}
                  toYear={toYear}
                />
              </PopoverContent>
            </Popover>

            {error && (
              <p className="text-xs text-red-500 mt-1">{error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
};

export default CustomCalendar;
