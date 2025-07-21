import { useEffect, useState } from "react"
import { visitsService } from "../services/visits.service"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MoreHorizontal, Edit, Trash2, RefreshCw, Plus } from "lucide-react"

function GroupDetail() {
  const [visitors, setVisitors] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedVisitor, setSelectedVisitor] = useState(null)

  useEffect(() => {
    fethVisitors()
    }, [])

  const fethVisitors = async () => {
    setIsLoading(true)
    try {
        const response = await visitsService.getVisits()
        console.log("Ziyaretçiler alındı:", response)
        setVisitors(response)
        setIsLoading(false)
    }
    catch (error) {
      console.error("Ziyaretçiler alınırken hata oluştu:", error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Ziyaretçi düzenleme işlemi
  const handleEditVisitor = (visitor) => {
    setSelectedVisitor(visitor)
    // Burada düzenleme modalını açabilir veya düzenleme sayfasına yönlendirebilirsiniz
    console.log("Düzenlenecek ziyaretçi:", visitor)
    // Örnek: setEditDialogOpen(true)
  }
  
  // Ziyaretçi silme işlemi
  const handleDeleteVisitor = (visitor) => {
    setSelectedVisitor(visitor)
    // Burada silme onayı modalını açabilirsiniz
    console.log("Silinecek ziyaretçi:", visitor)
    // Örnek: setDeleteDialogOpen(true)
    
    // Gerçek silme işlemi için aşağıdaki gibi bir fonksiyon kullanılabilir
    // const confirmDelete = async () => {
    //   try {
    //     await visitsService.deleteVisit(visitor.id)
    //     fethVisitors() // Listeyi yenile
    //     toast.success("Ziyaretçi başarıyla silindi")
    //   } catch (error) {
    //     console.error("Ziyaretçi silinirken hata oluştu:", error)
    //     toast.error("Ziyaretçi silinemedi")
    //   }
    // }
  }

  return (
    <>
        <div className="w-full max-w-6xl p-6">
            <div className='flex justify-between items-center mb-6'>
                <h1 className="text-2xl font-bold mb-6">Grup Detayı</h1>
            </div>
        <div className="flex w-full flex-col gap-6">
            <Tabs defaultValue="account" className="w-full">
                <TabsList>
                <TabsTrigger value="account">Ziyaretçiler</TabsTrigger>
                <TabsTrigger value="password">Boş Tab</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                <Card>
                    <CardHeader>
                    <CardTitle>Ziyaretçiler</CardTitle>
                    <CardDescription>
                        Gruba gelen ziyaretçilerin listesi
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="flex justify-center items-center p-4">
                          <div className="flex items-center gap-2">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <p>Yükleniyor...</p>
                          </div>
                        </div>
                      ) : visitors.length > 0 ? (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Ziyaretçi</TableHead>
                                <TableHead>Şirket</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Ziyaret Tarihi</TableHead>
                                <TableHead>Durum</TableHead>
                                <TableHead>İletişim</TableHead>
                                <TableHead>Notlar</TableHead>
                                <TableHead className="w-[80px]"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {visitors.map((visitor) => (
                                <TableRow key={visitor.id}>
                                  <TableCell className="font-medium">{visitor.full_name}</TableCell>
                                  <TableCell>{visitor.company}</TableCell>
                                  <TableCell>{visitor.category}</TableCell>
                                  <TableCell>{new Date(visitor.visit_date).toLocaleDateString('tr-TR')}</TableCell>
                                  <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${visitor.status === 'Olumlu' ? 'bg-green-100 text-green-800' : visitor.status === 'Olumsuz' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                      {visitor.status}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm">
                                      <div>{visitor.phone}</div>
                                      <div>{visitor.email}</div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="max-w-xs">
                                      {visitor.note && <p className="text-sm mb-1">{visitor.note}</p>}
                                      {visitor.notes && visitor.notes.length > 0 && (
                                        <div className="mt-1">
                                          <details>
                                            <summary className="text-xs text-blue-600 cursor-pointer">
                                              {visitor.notes.length} not
                                            </summary>
                                            <div className="mt-2 text-xs space-y-2">
                                              {visitor.notes.map(note => (
                                                <div key={note.id} className="p-2 bg-gray-50 rounded">
                                                  <p>{note.content}</p>
                                                  <p className="text-gray-500 text-xs mt-1">
                                                    {new Date(note.created_at).toLocaleString('tr-TR')}
                                                  </p>
                                                </div>
                                              ))}
                                            </div>
                                          </details>
                                        </div>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                          onClick={() => handleEditVisitor(visitor)}
                                          variant="default"
                                          className="cursor-pointer"
                                        >
                                          <Edit className="mr-2 h-4 w-4" />
                                          <span>Düzenle</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => handleDeleteVisitor(visitor)}
                                          variant="default"
                                          className="cursor-pointer"
                                        >
                                          <Plus className="mr-2 h-4 w-4" />
                                          <span>Not Ekle</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={() => handleDeleteVisitor(visitor)} 
                                          variant="destructive"
                                          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                        >
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Sil
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <p>Henüz ziyaretçi bulunmuyor.</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button onClick={fethVisitors} disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Yükleniyor...
                          </>
                        ) : (
                          <>Yenile</>
                        )}
                      </Button>
                    </CardFooter>
                </Card>
                </TabsContent>
                <TabsContent value="password">
                <Card>
                    <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                        Change your password here. After saving, you&apos;ll be logged
                        out.
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="tabs-demo-current">Current password</Label>
                        <Input id="tabs-demo-current" type="password" />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="tabs-demo-new">New password</Label>
                        <Input id="tabs-demo-new" type="password" />
                    </div>
                    </CardContent>
                    <CardFooter>
                    <Button>Save password</Button>
                    </CardFooter>
                </Card>
                </TabsContent>
            </Tabs>
        </div>
        </div>
    </>
  )
}

export default GroupDetail