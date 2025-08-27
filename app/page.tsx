"use client"

import { useCallback, useState } from "react"
import { SearchInput } from "@/components/search-input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { searchAddress } from "@/lib/api"
import { FixedSizeList } from 'react-window';
import debounce from "lodash.debounce";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SearchItem {
  id: string | number
  city: string
  oldCity: string
  province: string
  oldProvince: string
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [selectedItem, setSelectedItem] = useState<SearchItem | null>(null)

  const [isShowFull, setIsShowFull] = useState(false)

  const [sampleData, setSampleData] = useState<SearchItem[]>([])

  const handleSearch = useCallback(
    debounce((query: string) => {
      console.log("Searching for:", query);

      setSearchQuery(query);
      if (query.trim()) {
        searchAddress(query.trim()).then((data) => {
          console.log("Search results:", data);
          setSampleData(data);
        });
      } else {
        setSearchResults([]);
      }
    }, 500), // 500ms debounce delay
    []
  );

  const handleClear = () => {
    setSearchQuery("")
    setSearchResults([])
    setSelectedItem(null)
  }

  const handleSelect = (item: SearchItem) => {
    setSelectedItem(item)
    // setSearchQuery(item.label)
    setSearchResults([])
  }

  const showFullData = (item: SearchItem) => {
    setSelectedItem(item)
    setIsShowFull(true)
  }

  return (
    <main className="min-h-screen bg-background p-6 font-serif">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <p className="text-3xl font-bold text-foreground">Việt Nam</p>
          <p className="text-muted-foreground">
            Tìm kiếm các thành phố, địa điểm cũ và mới ở Việt Nam
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tìm kiếm</CardTitle>
            {/* <CardDescription>Type to search and see dropdown suggestions</CardDescription> */}
          </CardHeader>
          <CardContent className="space-y-6">
            <SearchInput
              placeholder="Tìm kiếm cũ/mới..."
              onSearch={handleSearch}
              onClear={handleClear}
              // onSelect={handleSelect}
              data={sampleData}
              className="w-full"
            />

            {/* {selectedItem && (
              <div className="p-3 rounded-md bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">Selected: {selectedItem.city}</p>
              </div>
            )}

            {searchQuery && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {searchResults.length > 0
                    ? `Found ${searchResults.length} result${searchResults.length === 1 ? "" : "s"} for "${searchQuery}"`
                    : `No results found for "${searchQuery}"`}
                </p>

                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    {searchResults.map((result, index) => (
                      <div key={index} className="p-3 rounded-md bg-muted/50 text-sm">
                        {result}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )} */}
            {renderHeader()}
            <div className="space-y-3">

              <FixedSizeList
                height={600} // Example height
                width={'full'}  // Example width
                itemCount={sampleData.length}
                itemSize={100}
              >
                {({ index, style }) => {
                  const item = sampleData[index];
                  return (
                    <div style={style} key={item.id} className="h-100 mt-2" onClick={() => { showFullData(item) }}>
                      <div className="p-2 grid grid-cols-10 rounded-md bg-muted/30 text-sm">
                        <div className="col-span-2 ">
                          <p>{item.city}</p>
                        </div>
                        <div className="col-span-2">
                          <p>{item.province}</p>
                        </div>
                        <div className="col-span-2 ">
                          <p>{item.oldCity}</p>
                        </div>
                        <div className="col-span-4 flex">
                          <p>{item.oldProvince.slice(0,50)} ... </p> 
                        </div>
                      </div>
                    </div>
                  );
                }}
              </FixedSizeList>
            </div>
          </CardContent>
        </Card>
        <Dialog open={isShowFull} >
          <DialogContent showCloseButton={false}>
            <DialogHeader >
              {/* <DialogTitle>Are you absolutely sure?</DialogTitle> */}
              <div className="flex flex-row-reverse">
                <Button className="w-5 h-5" type="button" variant="secondary" onClick={() => setIsShowFull(false)}>
                  X
                </Button>
              </div>
            </DialogHeader>
            <div className=" grid  rounded-md bg-muted/30 text-sm ">
              <div className="flex">
                <p className="font-bold mr-1">Tên thành phố mới: </p><p>  {selectedItem?.city}</p>
              </div>
              <div className="flex mt-2">
                <p className="font-bold mr-1">Tên phường - xã mới: </p><p> {selectedItem?.province}</p>
              </div>
              <div className="flex mt-2">
                <p className="font-bold mr-1">Gộp từ thành phố cũ: </p> <p> {selectedItem?.oldCity}</p>
              </div>
              <div className="flex mt-2">
                <p className="font-bold mr-1">Gộp từ phường - xã cũ: </p> <p> {selectedItem?.oldProvince}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  )

  function renderHeader() {
    return <>
      <p className="text-sm text-muted-foreground">Kết quả</p>
      <div className="p-2 grid grid-cols-10 rounded-md bg-muted/30 text-sm">
        <div className="col-span-2 ">
          <p className="font-bold">Thành phố mới</p>

        </div>
        <div className="col-span-2">
          <p className="font-bold">Tỉnh mới</p>

        </div>
        <div className="col-span-2 ">
          <p className="font-bold">Tỉnh cũ</p>

        </div>
        <div className="col-span-4 ">
          <p className="font-bold">Phường/Xã cũ</p>

        </div>
      </div>
    </>
  }
}
