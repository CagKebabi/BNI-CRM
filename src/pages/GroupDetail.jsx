import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { visitsService } from "../services/visits.service"
import { groupMeetingsService } from "../services/groupMeetings.service"
import { useGroup } from "../contexts/GroupContext"
import { useUser } from "@/contexts/UserContext"
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "../lib/utils";
import { format } from "date-fns";
import { Calendar } from "../components/ui/calendar";
import { tr } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { MoreHorizontal, Edit, Trash2, RefreshCw, Plus, CalendarIcon, Users, MapPin, Clock, Timer, Undo2 } from "lucide-react"

const addVisitorFormSchema = z.object({
    visit_date: z.string(),
    group: z.string().uuid({
        message: "Geçerli bir grup seçiniz.",
    }),
    meeting: z.string().uuid({
        message: "Geçerli bir toplantı seçiniz.",
    }),
    full_name: z.string().min(2, {
        message: "Ad en az 2 karakter olmalıdır.",
    }),
    category: z.string().min(2, {
        message: "Kategori en az 2 karakter olmalıdır.",
    }),
    company: z.string().min(2, {
        message: "Şirket adı en az 2 karakter olmalıdır.",
    }),
    phone: z.string().min(10, {
        message: "Telefon numarası en az 10 karakter olmalıdır.",
    }),
    email: z.string().email({
        message: "Geçerli bir email adresi giriniz.",
    }),
    invited_by: z.string().uuid({
        message: "Geçerli bir kullanıcının ID'si giriniz.",
    }),
    status: z.string().min(2, {
        message: "Durum en az 2 karakter olmalıdır.",
    }),
    note: z.string().min(2, {
        message: "Not en az 2 karakter olmalıdır.",
    }),
});

const addNoteFormSchema = z.object({
    content: z.string().min(2, {
        message: "Not en az 2 karakter olmalıdır.",
    }),
});

function GroupDetail() {
  const navigate = useNavigate()
  const { selectedGroupContext } = useGroup()
  const { userId } = useUser();
  const [visitors, setVisitors] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedVisitor, setSelectedVisitor] = useState(null)
  const [addVisitorDialogOpen, setAddVisitorDialogOpen] = useState(false)
  const [updateVisitorDialogOpen, setUpdateVisitorDialogOpen] = useState(false)
  const [deleteVisitorDialogOpen, setDeleteVisitorDialogOpen] = useState(false)
  const [addNoteDialogOpen, setAddNoteDialogOpen] = useState(false)
  const [groupMeetings, setGroupMeetings] = useState([])
  const [loadingMeetings, setLoadingMeetings] = useState(false)

  console.log("userId", userId)

  const addVisitorForm = useForm({
    resolver: zodResolver(addVisitorFormSchema),
    defaultValues: {
      visit_date: new Date(),
      group: selectedGroupContext?.id || "",
      meeting: "",
      full_name: "",
      category: "",
      company: "",
      phone: "",
      email: "",
      invited_by: "",
      status: "",
      note: "",
    },
  })

  const updateVisitorForm = useForm({
    resolver: zodResolver(addVisitorFormSchema),
    defaultValues: {
      visit_date: "",
      group: selectedGroupContext?.id || "",
      meeting: "",
      full_name: "",
      category: "",
      company: "",
      phone: "",
      email: "",
      invited_by: "",
      status: "",
      note: "",
    },
  })

  const addNoteForm = useForm({
    resolver: zodResolver(addNoteFormSchema),
    defaultValues: {
      content: "",
    },
  })

  useEffect(() => {
    // Eğer seçili grup yoksa, gruplar listesine yönlendir
    if (!selectedGroupContext) {
      navigate('/group-list')
      return
    }
    
    fethVisitors()
    fetchGroupMeetings()
  }, [selectedGroupContext, navigate])

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
  
  const fetchGroupMeetings = async () => {
    if (!selectedGroupContext?.id) return;
    
    setIsLoading(true)
    try {
      const response = await groupMeetingsService.getGroupMeetings(selectedGroupContext.id)
      console.log("Grup toplantıları alındı:", response)
      setGroupMeetings(response)
    } catch (error) {
      console.error("Grup toplantıları alınırken hata oluştu:", error)
    } finally {
      setIsLoading(false)
      addVisitorForm.reset()
    }
  }


  // Ziyaretçi İşlemleri
  const handleAddVisitor = async (data) => {
    // Grup değerini selectedGroupContext.id'den alıyoruz
    const visitData = {
      ...data,
      group: selectedGroupContext?.id
    }
    
    console.log("Yeni ziyaretçi:", visitData)
    try {
      setIsLoading(true)
      await visitsService.createVisit(visitData)
      fethVisitors()
      setAddVisitorDialogOpen(false) // Form başarıyla gönderildiğinde modalı kapat
      toast.success("Ziyaretçi başarıyla eklendi")
    } catch (error) {
      console.error("Ziyaretçi eklendiğinde hata oluştu:", error)
      toast.error("Ziyaretçi eklenemedi")
    } finally {
      setIsLoading(false)

    }
  }
  
  const handleUpdateVisitor = async (data) => {
    // Grup değerini selectedGroupContext.id'den alıyoruz
    const updateData = {
      ...data,
      group: selectedGroupContext?.id
    }
    
    console.log("Güncellenecek ziyaretçi:", updateData)
    setIsLoading(true)
    try {
      await visitsService.updateVisit(selectedVisitor.id, updateData)
      fethVisitors()
      setUpdateVisitorDialogOpen(false) // Form başarıyla gönderildiğinde modalı kapat
      toast.success("Ziyaretçi başarıyla güncellendi")
    } catch (error) {
      console.error("Ziyaretçi güncellenirken hata oluştu:", error)
      toast.error("Ziyaretçi güncellenemedi")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleVisitorClick = (visitor, dialogType) => {
    setSelectedVisitor(visitor)
    if (dialogType === "update") {
      updateVisitorForm.reset({
        visit_date: visitor.visit_date,
        group: visitor.group,
        meeting: visitor.meeting,
        full_name: visitor.full_name,
        category: visitor.category,
        company: visitor.company,
        phone: visitor.phone,
        email: visitor.email,
        invited_by: visitor.invited_by,
        status: visitor.status,
        note: visitor.note,
      })
      setUpdateVisitorDialogOpen(true)
    } else if (dialogType === "addNote") {
      setAddNoteDialogOpen(true)
    } else if (dialogType === "delete") {
      setDeleteVisitorDialogOpen(true)
    }
    console.log("Silinecek ziyaretçi:", visitor)
  }

  const handleAddNote = async (data) => {
    setIsLoading(true)
    const noteData = {
      ...data,
      visitor: selectedVisitor.id,
      author: userId,
    }
    console.log("Yeni not:", noteData)
    try {
      await visitsService.createVisitorNote(noteData)
      setAddNoteDialogOpen(false)
      toast.success("Not başarıyla eklendi")
      fethVisitors()
    } catch (error) {
      console.error("Not eklendiğinde hata oluştu:", error)
      toast.error("Not eklenemedi")
    } finally {
      setIsLoading(false)
      addNoteForm.reset()
    }
  }

  const handleDeleteVisitor = async () => {
    setIsLoading(true)
    try {
      await visitsService.deleteVisit(selectedVisitor.id)
      setDeleteVisitorDialogOpen(false)
      toast.success("Ziyaretçi başarıyla silindi")
      fethVisitors()
    } catch (error) {
      console.error("Ziyaretçi silindiğinde hata oluştu:", error)
      toast.error("Ziyaretçi silinemedi")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
        <div className="w-full max-w-6xl p-6">
            <div className='flex justify-between items-center mb-6'>
                <div>
                  <div>
                      {/* <h1 className="text-2xl font-bold">{selectedGroupContext?.name || 'Grup Detayı'}</h1>
                      {selectedGroupContext && (
                          <p className="text-gray-500 mt-1">{selectedGroupContext.region_name} Bölgesi</p>
                      )} */}
                      <div className="flex items-center gap-2 text-lg font-semibold">
                        <div className="p-2 rounded-lg bg-blue-50">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex flex-col">
                          <span>{selectedGroupContext?.name}</span>
                          <span className='text-sm text-gray-500'>{" Yönetici: " + selectedGroupContext?.region_exc_director_name}</span>
                        </div>
                      </div>  
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-sm text-red-700 w-fit">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">{selectedGroupContext?.region_name}</span>
                    </div>
                  </div>
                </div>
                <Button 
                    variant="outline" 
                    onClick={() => navigate('/group-list')}
                    className="flex items-center gap-2"
                >
                    <Undo2 className="h-4 w-4" />
                    Gruplara Dön
                </Button>
            </div>
            <div className="flex w-full flex-col gap-6">
                <Tabs defaultValue="visitors" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="info">Grup Bilgileri</TabsTrigger>
                        <TabsTrigger value="visitors">Ziyaretçiler</TabsTrigger>
                        <TabsTrigger value="members">Üyeler</TabsTrigger>
                        <TabsTrigger value="openCategories">Açık Kategoriler</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="info" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Grup Bilgileri</CardTitle>
                                <CardDescription>
                                    Grubun toplantı ve dönem bilgileri
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {selectedGroupContext ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="p-1.5 rounded-md bg-green-50">
                                                        <CalendarIcon className="h-4 w-4 text-green-600" />
                                                    </div>
                                                    <span className="font-medium">Toplantı Günü</span>
                                                </div>
                                                <p className="text-sm pl-9">{selectedGroupContext.meeting_day}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="p-1.5 rounded-md bg-purple-50">
                                                        <Clock className="h-4 w-4 text-purple-600" />
                                                    </div>
                                                    <span className="font-medium">Toplantı Saati</span>
                                                </div>
                                                <p className="text-sm pl-9">{selectedGroupContext.start_time} - {selectedGroupContext.end_time}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="p-1.5 rounded-md bg-teal-50">
                                                        <Timer className="h-4 w-4 text-teal-600" />
                                                    </div>
                                                    <span className="font-medium">Dönem</span>
                                                </div>
                                                <p className="text-sm pl-9">{selectedGroupContext.term_start} - {selectedGroupContext.term_end}</p>
                                            </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p>Grup bilgisi bulunamadı.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="visitors" className="mt-4">
                    <Card>
                        <CardHeader>
                        <div className='flex items-center justify-between'>
                          <div className='flex flex-col gap-2'>
                            <CardTitle>Ziyaretçiler</CardTitle>
                            <CardDescription>
                                Gruba gelen ziyaretçilerin listesi
                            </CardDescription>
                          </div>
                          <div className='flex gap-2'> 
                            <Button onClick={fethVisitors} disabled={isLoading}>
                              {isLoading ? (
                                <>
                                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                  Yükleniyor...
                                </>
                              ) : (
                                <RefreshCw className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="default" size="icon" onClick={() => setAddVisitorDialogOpen(true)}>
                                <Plus className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
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
                                              onClick={() => handleVisitorClick(visitor, "update")}
                                              variant="default"
                                              className="cursor-pointer"
                                            >
                                              <Edit className="mr-2 h-4 w-4" />
                                              <span>Düzenle</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              onClick={() => handleVisitorClick(visitor, "addNote")}
                                              variant="default"
                                              className="cursor-pointer"
                                            >
                                              <Plus className="mr-2 h-4 w-4" />
                                              <span>Not Ekle</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                              onClick={() => handleVisitorClick(visitor, "delete")} 
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
                          {/* <Button onClick={fethVisitors} disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Yükleniyor...
                              </>
                            ) : (
                              <>Yenile</>
                            )}
                          </Button> */}
                        </CardFooter>
                    </Card>
                    </TabsContent>
                    <TabsContent value="members" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Üyeler</CardTitle>
                                <CardDescription>
                                    {selectedGroupContext ? `${selectedGroupContext.name} grubu üye listesi` : 'Grup üyeleri'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {selectedGroupContext && selectedGroupContext.users && selectedGroupContext.users.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedGroupContext.users.map((user) => (
                                            <div key={user.id} className="bg-secondary border border-gray-100 rounded-lg shadow-sm p-3 hover:shadow-md transition-all">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center text-sm font-medium text-indigo-700">
                                                            {user.first_name?.charAt(0).toUpperCase()}{user.last_name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-primary">{user.first_name} {user.last_name}</h4>
                                                            <p className="text-sm text-gray-500">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {user.roles && user.roles.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                                        <p className="text-xs font-medium text-gray-500 mb-2">Roller</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {user.roles.map((role) => (
                                                                <div key={role.id} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                                                                    <span className="font-medium">{role.role}</span>
                                                                    {role.category && (
                                                                        <span className="text-indigo-500 bg-indigo-100 px-1.5 py-0.5 rounded-full text-[10px]">{role.category}</span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p>Bu grupta henüz üye bulunmamaktadır.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="openCategories" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Üyeler</CardTitle>
                                <CardDescription>
                                    {selectedGroupContext ? `${selectedGroupContext.name} grubu açık kategoriler listesi` : 'Açık kategoriler'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <p>Bu grupta henüz açık kategori bulunmamaktadır.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
        <Dialog open={addVisitorDialogOpen} onOpenChange={setAddVisitorDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Yeni Ziyaretçi Ekle</DialogTitle>
                    <DialogDescription>
                        Ziyaretçi bilgilerini girin
                    </DialogDescription>
                </DialogHeader>
                <Form {...addVisitorForm}>
                  <form onSubmit={addVisitorForm.handleSubmit(handleAddVisitor)} className="space-y-6 max-h-[50vh] overflow-y-auto p-3">
                    <FormField
                      control={addVisitorForm.control}
                      name="visit_date"
                      render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Ziyaret Tarihi</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(new Date(field.value), "PPP", { locale: tr })
                                ) : (
                                    <span>Ziyaret tarihi seçin</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                  mode="single"
                                  selected={field.value ? new Date(field.value) : undefined}
                                  onSelect={(date) => {
                                    if (date) {
                                        field.onChange(format(date, 'yyyy-MM-dd'))
                                    }
                                  }}
                                    disabled={(date) =>
                                    date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                  locale={tr}
                              />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                      )}
                    />
                    <FormField
                      control={addVisitorForm.control}
                      name="group"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Grup</FormLabel>
                              <FormControl>
                                <Input 
                                  value={selectedGroupContext?.name || ''} 
                                  disabled 
                                  className="bg-gray-50"
                                />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                    />
                    <FormField
                      control={addVisitorForm.control}
                      name="meeting"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Toplantı</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                      <SelectTrigger>
                                          <SelectValue placeholder="Toplantı seçiniz" />
                                      </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                      {loadingMeetings ? (
                                        <SelectItem value="loading" disabled>
                                          Yükleniyor...
                                        </SelectItem>
                                      ) : groupMeetings.length > 0 ? (
                                        groupMeetings.map((meeting) => (
                                          <SelectItem key={meeting.id} value={meeting.id}>
                                            {new Date(meeting.date).toLocaleDateString('tr-TR')} ({meeting.start_time} - {meeting.end_time})
                                          </SelectItem>
                                        ))
                                      ) : (
                                        <SelectItem value="no-data" disabled>
                                          Toplantı bulunamadı
                                        </SelectItem>
                                      )}
                                  </SelectContent>
                              </Select>
                              <FormMessage />
                          </FormItem>
                      )}
                    />
                    <FormField
                      control={addVisitorForm.control}
                      name="full_name"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Ad Soyad</FormLabel>
                              <FormControl>
                                <Input placeholder="Ad Soyad" {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                    />  
                    <FormField
                      control={addVisitorForm.control}
                      name="category"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Kategori</FormLabel>
                              <FormControl>
                                <Input placeholder="Kategori" {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                    />  
                    <FormField
                      control={addVisitorForm.control}
                      name="company"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Şirket</FormLabel>
                              <FormControl>
                                <Input placeholder="Şirket" {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                    />  
                    <FormField
                      control={addVisitorForm.control}
                      name="phone"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Telefon</FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="Telefon" {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                    />  
                    <FormField
                      control={addVisitorForm.control}
                      name="email"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>E-Posta</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="E-Posta" {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                    />  
                    <FormField
                      control={addVisitorForm.control}
                      name="invited_by"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Davet Eden</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                      <SelectTrigger>
                                          <SelectValue placeholder="Davet Eden seçiniz" />
                                      </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                      {selectedGroupContext?.users?.length > 0 ? (
                                        selectedGroupContext.users.map((user) => (
                                          <SelectItem key={user.id} value={user.id}>
                                            {user.first_name} {user.last_name}
                                          </SelectItem>
                                        ))
                                      ) : (
                                        <SelectItem value="no-data" disabled>
                                          Kullanıcı bulunamadı
                                        </SelectItem>
                                      )}
                                  </SelectContent>
                              </Select>
                              <FormMessage />
                          </FormItem>
                      )}
                    />
                    <FormField
                      control={addVisitorForm.control}
                      name="status"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Davet Durumu</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                      <SelectTrigger>
                                          <SelectValue placeholder="Gün seçiniz" />
                                      </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                      {['Olumlu', 'Olumsuz', 'Kararsız'].map((status) => (
                                          <SelectItem key={status} value={status}>
                                              {status}
                                          </SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                              <FormMessage />
                          </FormItem>
                      )}
                    />
                    <FormField
                      control={addVisitorForm.control}
                      name="note"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Not</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Not" {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button 
                        //onClick={handleSaveEdit} 
                        disabled={isLoading}
                      >
                        {isLoading ? "Kaydediliyor..." : "Kaydet"}
                      </Button>
                     </DialogFooter>
                  </form>
                </Form>
            </DialogContent>
        </Dialog>
        <Dialog open={updateVisitorDialogOpen} onOpenChange={setUpdateVisitorDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ziyaretçi Bilgilerini Düzenle</DialogTitle>
                    <DialogDescription>
                        Ziyaretçi bilgilerini girin
                    </DialogDescription>
                </DialogHeader>
                <Form {...updateVisitorForm}>
                  <form onSubmit={updateVisitorForm.handleSubmit(handleUpdateVisitor)} className="space-y-6 max-h-[50vh] overflow-y-auto p-3">
                    <FormField
                      control={updateVisitorForm.control}
                      name="visit_date"
                      render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Ziyaret Tarihi</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(new Date(field.value), "PPP", { locale: tr })
                                ) : (
                                    <span>Ziyaret tarihi seçin</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                  mode="single"
                                  selected={field.value ? new Date(field.value) : undefined}
                                  onSelect={(date) => {
                                    if (date) {
                                        field.onChange(format(date, 'yyyy-MM-dd'))
                                    }
                                  }}
                                    disabled={(date) =>
                                    date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                  locale={tr}
                              />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                      )}
                    />
                    <FormField
                      control={updateVisitorForm.control}
                      name="group"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Grup</FormLabel>
                              <FormControl>
                                <Input 
                                  value={selectedVisitor?.group || ''} 
                                  disabled 
                                  className="bg-gray-50"
                                />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                    />
                    <FormField
                      control={updateVisitorForm.control}
                      name="meeting"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Toplantı</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                      <SelectTrigger>
                                          <SelectValue placeholder="Toplantı seçiniz" />
                                      </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                      {loadingMeetings ? (
                                        <SelectItem value="loading" disabled>
                                          Yükleniyor...
                                        </SelectItem>
                                      ) : groupMeetings.length > 0 ? (
                                        groupMeetings.map((meeting) => (
                                          <SelectItem key={meeting.id} value={meeting.id}>
                                            {new Date(meeting.date).toLocaleDateString('tr-TR')} ({meeting.start_time} - {meeting.end_time})
                                          </SelectItem>
                                        ))
                                      ) : (
                                        <SelectItem value="no-data" disabled>
                                          Toplantı bulunamadı
                                        </SelectItem>
                                      )}
                                  </SelectContent>
                              </Select>
                              <FormMessage />
                          </FormItem>
                      )}
                    />
                    <FormField
                      control={updateVisitorForm.control}
                      name="full_name"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Ad Soyad</FormLabel>
                              <FormControl>
                                <Input placeholder="Ad Soyad" {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                    />  
                    <FormField
                      control={updateVisitorForm.control}
                      name="category"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Kategori</FormLabel>
                              <FormControl>
                                <Input placeholder="Kategori" {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                    />  
                    <FormField
                      control={updateVisitorForm.control}
                      name="company"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Şirket</FormLabel>
                              <FormControl>
                                <Input placeholder="Şirket" {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                    />  
                    <FormField
                      control={updateVisitorForm.control}
                      name="phone"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Telefon</FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="Telefon" {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                    />  
                    <FormField
                      control={updateVisitorForm.control}
                      name="email"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>E-Posta</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="E-Posta" {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                    />  
                    <FormField
                      control={updateVisitorForm.control}
                      name="invited_by"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Davet Eden</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                      <SelectTrigger>
                                          <SelectValue placeholder="Davet Eden seçiniz" />
                                      </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                      {selectedGroupContext?.users?.length > 0 ? (
                                        selectedGroupContext.users.map((user) => (
                                          <SelectItem key={user.id} value={user.id}>
                                            {user.first_name} {user.last_name}
                                          </SelectItem>
                                        ))
                                      ) : (
                                        <SelectItem value="no-data" disabled>
                                          Kullanıcı bulunamadı
                                        </SelectItem>
                                      )}
                                  </SelectContent>
                              </Select>
                              <FormMessage />
                          </FormItem>
                      )}
                    />
                    <FormField
                      control={updateVisitorForm.control}
                      name="status"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Davet Durumu</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                      <SelectTrigger>
                                          <SelectValue placeholder="Gün seçiniz" />
                                      </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                      {['Olumlu', 'Olumsuz', 'Kararsız'].map((status) => (
                                          <SelectItem key={status} value={status}>
                                              {status}
                                          </SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                              <FormMessage />
                          </FormItem>
                      )}
                    />
                    <FormField
                      control={updateVisitorForm.control}
                      name="note"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Not</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Not" {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button 
                        //onClick={handleSaveEdit} 
                        disabled={isLoading}
                      >
                        {isLoading ? "Kaydediliyor..." : "Kaydet"}
                      </Button>
                     </DialogFooter>
                  </form>
                </Form>
            </DialogContent>
        </Dialog>
        <Dialog open={addNoteDialogOpen} onOpenChange={setAddNoteDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Not Ekle</DialogTitle>
                  <DialogDescription>
                      Notunuzu girin.
                  </DialogDescription>
              </DialogHeader>
              <Form {...addNoteForm}>
                <form onSubmit={addNoteForm.handleSubmit(handleAddNote)} className="space-y-6">
                  <FormField
                    control={addNoteForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Not</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Notunuzu girin"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                      <Button 
                        //onClick={handleSaveEdit} 
                        disabled={isLoading}
                      >
                        {isLoading ? "Kaydediliyor..." : "Kaydet"}
                      </Button>
                  </DialogFooter>
                </form>
              </Form>
          </DialogContent>
        </Dialog>
        <AlertDialog open={deleteVisitorDialogOpen} onOpenChange={setDeleteVisitorDialogOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Ziyaretçiyi silmek istediğinize emin misiniz?</AlertDialogTitle>
                  <AlertDialogDescription>
                      Bu işlem geri alınamaz.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteVisitor()}>Onayla</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog> 
    </>
  )
}

export default GroupDetail