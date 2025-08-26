"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { on } from "events"

interface SearchItem {
  id: string | number
  city: string
  oldCity: string
  province: string
  oldProvince: string
}

interface SearchInputProps {
  placeholder?: string
  onSearch?: (query: string) => void
  onClear?: () => void
  className?: string
  showClearButton?: boolean
  data?: SearchItem[]
  onSelect?: (item: SearchItem) => void
  maxResults?: number
  showDropdown?: boolean
}

export function SearchInput({
  placeholder = "Search...",
  onSearch,
  onClear,
  className,
  showClearButton = true,
  data = [],
  onSelect,
  maxResults = 10,
  showDropdown = true,
}: SearchInputProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // const filteredData = data
  //   .filter(
  //     (item) =>
  //       item.city.toLowerCase().includes(query.toLowerCase()) ||
  //       item.oldCity?.toLowerCase().includes(query.toLowerCase()) || 
  //       item.province?.toLowerCase().includes(query.toLowerCase()) ||
  //       item.oldProvince?.toLowerCase().includes(query.toLowerCase())
  //   )
  //   .slice(0, maxResults)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   if (selectedIndex >= 0 && filteredData[selectedIndex]) {
  //     handleSelect(filteredData[selectedIndex])
  //   } else {
  //     onSearch?.(query)
  //   }
  // }

  const handleClear = () => {
    setQuery("")
    setIsOpen(false)
    setSelectedIndex(-1)
    onClear?.()
  }

  // const handleKeyDown = (e: React.KeyboardEvent) => {
  //   if (e.key === "Escape") {
  //     handleClear()
  //     return
  //   }

  //   if (!isOpen || filteredData.length === 0) return

  //   switch (e.key) {
  //     case "ArrowDown":
  //       e.preventDefault()
  //       setSelectedIndex((prev) => (prev < filteredData.length - 1 ? prev + 1 : 0))
  //       break
  //     case "ArrowUp":
  //       e.preventDefault()
  //       setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredData.length - 1))
  //       break
  //     case "Enter":
  //       e.preventDefault()
  //       if (selectedIndex >= 0) {
  //         handleSelect(filteredData[selectedIndex])
  //       }
  //       break
  //   }
  // }

  const handleSelect = (item: SearchItem) => {
    setQuery(item.city)
    setIsOpen(false)
    setSelectedIndex(-1)
    onSelect?.(item)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setSelectedIndex(-1)
    onSearch?.(value)
    // if (showDropdown && value.trim() && data.length > 0) {
    //   setIsOpen(true)
    // } else {
    //   setIsOpen(false)
    // }
  }

  return (
    <div className={cn("relative", className)}>
      <form className="relative flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            // onKeyDown={handleKeyDown}
            onFocus={() => {
              if (query.trim() && showDropdown && data.length > 0) {
                setIsOpen(true)
              }
            }}
            className="pl-10 pr-10"
            aria-label="Search input"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            role="combobox"
          />
          {showClearButton && query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-muted"
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </form>

      {/* {isOpen && filteredData.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover p-1 shadow-md"
          role="listbox"
        >
          {filteredData.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                "hover:bg-accent hover:text-accent-foreground",
                selectedIndex === index && "bg-accent text-accent-foreground",
              )}
              onClick={() => handleSelect(item)}
              role="option"
              aria-selected={selectedIndex === index}
            >
              <div>Tên mới</div> {item.city} {item.province} - Tên cũ ({item.oldCity}) ({item.oldProvince})
            </div>
          ))}
        </div>
      )} */}
    </div>
  )
}
