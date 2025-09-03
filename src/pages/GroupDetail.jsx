import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { visitsService } from "../services/visits.service";
import { groupMeetingsService } from "../services/groupMeetings.service";
import { openCategoriesService } from "../services/openCategories.service";
import { presentationsService } from "../services/presentations.service";
import { groupMembersService } from "../services/groupMembers.service";
import { rolesService } from "../services/roles.service";
import { usersService } from "../services/users.service";
import { eventsService } from "../services/events.service";
import { useGroup } from "../contexts/GroupContext";
import { useUser } from "@/contexts/UserContext";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "../lib/utils";
import { format } from "date-fns";
import { Calendar } from "../components/ui/calendar";
import { se, tr } from "date-fns/locale";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import { Printer } from "lucide-react";
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
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  RefreshCw,
  Plus,
  CalendarIcon,
  Users,
  MapPin,
  Clock,
  Timer,
  Undo2,
  User,
  Check,
  X,
} from "lucide-react";

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
  attended: z.boolean().default(false),
  contacted: z.boolean().default(false),
  contacted_by: z.string().optional(),
  rating:z.coerce.number().optional(),
});

const addNoteFormSchema = z.object({
  content: z.string().min(2, {
    message: "Not en az 2 karakter olmalıdır.",
  }),
});

const addGroupMembersFormSchema = z.object({
  user_id: z.string().uuid({
    message: "Kullanıcı seçiniz.",
  }),
  role_id: z.string().uuid({
    message: "Rol seçiniz.",
  }),
});

const updateGroupMemberFormSchema = z.object({
  role_id: z.string().uuid({
    message: "Yeni rol seçiniz.",
  }),
});

const addOpenCategoriesFormSchema = z.object({
  name: z.string().min(2, {
    message: "Kategori adı en az 2 karakter olmalıdır.",
  }),
});

const addPresentationFormSchema = z.object({
  meeting: z.string().uuid({
    message: "Geçerli bir toplantı seçiniz.",
  }),
  user: z.string().uuid({
    message: "Geçerli bir kullanıcının ID'si giriniz.",
  }),
});

const addEventFormSchema = z.object({
  group: z.string().uuid({
    message: "Geçerli bir grup seçiniz.",
  }),
  title: z.string().min(2, {
    message: "Etkinlik adı en az 2 karakter olmalıdır.",
  }),
  description: z.string().min(2, {
    message: "Etkinlik açıklaması en az 2 karakter olmalıdır.",
  }),
  date: z.string(),
});

function GroupDetail() {
  const navigate = useNavigate();
  const { selectedGroupContext } = useGroup();
  const { userId } = useUser();
  const [visitors, setVisitors] = useState([]);
  const [presentations, setPresentations] = useState([]);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [filteredGroupMembers, setFilteredGroupMembers] = useState([]);
  const [memberFilter, setMemberFilter] = useState("all");
  const [memberSorting, setMemberSorting] = useState([]);
  const [memberColumnFilters, setMemberColumnFilters] = useState([]);
  const [memberGlobalFilter, setMemberGlobalFilter] = useState("");
  const [openCategories, setOpenCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [addVisitorDialogOpen, setAddVisitorDialogOpen] = useState(false);
  const [updateVisitorDialogOpen, setUpdateVisitorDialogOpen] = useState(false);
  const [deleteVisitorDialogOpen, setDeleteVisitorDialogOpen] = useState(false);
  const [addNoteDialogOpen, setAddNoteDialogOpen] = useState(false);
  const [addGroupMemberDialogOpen, setAddGroupMemberDialogOpen] = useState(false);
  const [updateGroupMemberDialogOpen, setUpdateGroupMemberDialogOpen] = useState(false);
  const [selectedGroupMember, setSelectedGroupMember] = useState(null);
  const [addPresentationDialogOpen, setAddPresentationDialogOpen] = useState(false);
  const [updatePresentationDialogOpen, setUpdatePresentationDialogOpen] = useState(false);
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const [addOpenCategoriesDialogOpen, setAddOpenCategoriesDialogOpen] = useState(false);
  const [addEventDialogOpen, setAddEventDialogOpen] = useState(false);
  const [updateEventDialogOpen, setUpdateEventDialogOpen] = useState(false);
  const [ selectedEvent, setSelectedEvent ] = useState(null);
  const [groupMeetings, setGroupMeetings] = useState([]);
  const [loadingMeetings, setLoadingMeetings] = useState(false);

  console.log("userId", userId);

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
      attended: false,
      contacted: false,
      contacted_by: "",
      rating: 0,
    },
  });

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
      attended: false,
      contacted: false,
      contacted_by: "",
      rating: 0,
    },
  });

  const addNoteForm = useForm({
    resolver: zodResolver(addNoteFormSchema),
    defaultValues: {
      content: "",
    },
  });

  const addGroupMembersForm = useForm({
    resolver: zodResolver(addGroupMembersFormSchema),
    defaultValues: {
      user_id: "",
      role_id: "",
    },
  });

  const updateGroupMemberForm = useForm({
    resolver: zodResolver(updateGroupMemberFormSchema),
    defaultValues: {
      role_id: "",
    },
  });

  const addOpenCategoriesForm = useForm({
    resolver: zodResolver(addOpenCategoriesFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const addPresentationForm = useForm({
    resolver: zodResolver(addPresentationFormSchema),
    defaultValues: {
      meeting: "",
      user: "",
    },
  });

  const updatePresentationForm = useForm({
    resolver: zodResolver(addPresentationFormSchema),
    defaultValues: {
      meeting: "",
      user: "",
    },
  });

  const addEventForm = useForm({
    resolver: zodResolver(addEventFormSchema),
    defaultValues: {
      group: selectedGroupContext?.id || "",
      title: "",
      description: "",
      date: "",
    },
  });

  const updateEventForm = useForm({
    resolver: zodResolver(addEventFormSchema),
    defaultValues: {
      group: selectedGroupContext?.id || "",
      title: "",
      description: "",
      date: "",
    },
  });

  useEffect(() => {
    // Eğer seçili grup yoksa, gruplar listesine yönlendir
    if (!selectedGroupContext) {
      navigate("/group-list");
      return;
    }

    fethVisitors();
    fetchGroupMeetings();
    fetchPresentations();
    fetchOpenCategories();
    fetchRoles();
    fetchUsers();
    fetchGroupMembers();
    fetchEvents();
  }, [selectedGroupContext, navigate]);

  const fethVisitors = async () => {
    setIsLoading(true);
    try {
      const response = await visitsService.getVisits(selectedGroupContext.id);
      console.log("Ziyaretçiler alındı:", response);
      setVisitors(response);
      setIsLoading(false);
    } catch (error) {
      console.error("Ziyaretçiler alınırken hata oluştu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGroupMeetings = async () => {
    if (!selectedGroupContext?.id) return;

    setIsLoading(true);
    try {
      const response = await groupMeetingsService.getGroupMeetings(
        selectedGroupContext.id
      );
      console.log("Grup toplantıları alındı:", response);
      setGroupMeetings(response);
    } catch (error) {
      console.error("Grup toplantıları alınırken hata oluştu:", error);
    } finally {
      setIsLoading(false);
      addVisitorForm.reset();
    }
  };

  const fetchPresentations = async () => {
    if (!selectedGroupContext?.id) return;

    setIsLoading(true);
    try {
      const response = await presentationsService.getPresentations(
        selectedGroupContext.id
      );
      console.log("Sunumlar alındı:", response);
      setPresentations(response);
    } catch (error) {
      console.error("Sunumlar alınırken hata oluştu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOpenCategories = async () => {
    if (!selectedGroupContext?.id) return;

    setIsLoading(true);
    try {
      const response = await openCategoriesService.getOpenCategories(
        selectedGroupContext.id
      );
      console.log("Açık kategoriler alındı:", response);
      setOpenCategories(response);
    } catch (error) {
      console.error("Açık kategoriler alınırken hata oluştu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await rolesService.getRoles();
      console.log("Rol listesi alındı:", response);
      setRoles(response);
      setIsLoading(false);
    } catch (error) {
      console.error("Rol listesi alınamadı:", error);
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!selectedGroupContext?.id) return;
    try {
      const response = await usersService.getUsers();
      console.log("Kullanıcı listesi alındı:", response);
      setUsers(response);
      setIsLoading(false);
    } catch (error) {
      console.error("Kullanıcı listesi alınamadı:", error);
      setIsLoading(false);
    }
  };

  const fetchGroupMembers = async () => {
    if (!selectedGroupContext?.id) return;

    setIsLoading(true);
    try {
      const response = await groupMembersService.getGroupMembers(
        selectedGroupContext.id
      );
      setGroupMembers(response.members);
      setFilteredGroupMembers(response.members);
      setMemberFilter("all");
      console.log("GRUP ÜYELERİ ALINDI:", response.members);
    } catch (error) {
      console.error("Grup üyeleri alınırken hata oluştu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvents = async () => {
    if (!selectedGroupContext?.id) return;
    try {
      const response = await eventsService.getEvents(selectedGroupContext.id);
      setEvents(response);
    }
    catch (error) {
      console.error("Etkinlikler alınırken hata oluştu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Members table konfigürasyonu
  const memberColumns = [
    {
      accessorKey: "first_name",
      header: "Üye",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center text-sm font-medium text-indigo-700">
            {row.original.first_name?.charAt(0).toUpperCase()}
            {row.original.last_name?.charAt(0).toUpperCase()}
          </div>
          <span>
            {row.original.first_name} {row.original.last_name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "E-posta",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "roles",
      header: "Roller",
      cell: ({ row }) => (
        <div>
          {row.original.roles && row.original.roles.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {row.original.roles.map((role) => (
                <span
                  key={role.id}
                  className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {role.role}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-400 text-sm">Rol atanmamış</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Kategori",
      cell: ({ row }) => (
        <div>
          {row.original.roles && row.original.roles.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {row.original.roles.map(
                (role) =>
                  role.category && (
                    <span
                      key={`${role.id}-category`}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                    >
                      {role.category}
                    </span>
                  )
              )}
            </div>
          ) : (
            <span className="text-gray-400 text-sm">-</span>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => updateGroupMemberClick(row.original)}
                variant="default"
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>Düzenle</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRemoveGroupMember(row.original.id)}
                variant="destructive"
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Gruptan Çıkar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const memberTable = useReactTable({
    data: filteredGroupMembers,
    columns: memberColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setMemberSorting,
    onColumnFiltersChange: setMemberColumnFilters,
    onGlobalFilterChange: setMemberGlobalFilter,
    state: {
      sorting: memberSorting,
      columnFilters: memberColumnFilters,
      globalFilter: memberGlobalFilter,
    },
  });

  // Client-side filtreleme fonksiyonu
  const filterGroupMembers = (filterType) => {
    setMemberFilter(filterType);

    let filtered = [];

    switch (filterType) {
      case "all":
        filtered = groupMembers;
        break;
      case "gold":
        // Gold Member rolüne sahip üyeleri filtrele
        filtered = groupMembers.filter(
          (member) =>
            member.roles &&
            member.roles.some(
              (role) =>
                role.role && role.role.toLowerCase().includes("gold member")
            )
        );
        break;
      case "leader":
        // Lider Ekip kategorisine sahip üyeleri filtrele
        filtered = groupMembers.filter(
          (member) =>
            member.roles &&
            member.roles.some(
              (role) =>
                role.category &&
                role.category.toLowerCase().includes("lider ekip")
            )
        );
        break;
      default:
        filtered = groupMembers;
    }

    setFilteredGroupMembers(filtered);
    console.log(`${filterType} üyeleri filtrelendi:`, filtered);
  };

  // Ziyaretçi İşlemleri
  const handleAddVisitor = async (data) => {
    // Grup değerini selectedGroupContext.id'den alıyoruz
    const visitData = {
      ...data,
      contacted_by: data.contacted_by === "none" ? null : data.contacted_by,
      group: selectedGroupContext?.id,
    };

    console.log("Yeni ziyaretçi:", visitData);
    try {
      setIsLoading(true);
      await visitsService.createVisit(visitData);
      fethVisitors();
      setAddVisitorDialogOpen(false); // Form başarıyla gönderildiğinde modalı kapat
      toast.success("Ziyaretçi başarıyla eklendi");
    } catch (error) {
      console.error("Ziyaretçi eklendiğinde hata oluştu:", error);
      toast.error("Ziyaretçi eklenemedi");
    } finally {
      setIsLoading(false);
      addVisitorForm.reset(); // Formu sıfırla
    }
  };

  const handleUpdateVisitor = async (data) => {
    // Grup değerini selectedGroupContext.id'den alıyoruz
    const updateData = {
      ...data,
      contacted_by: data.contacted_by === "none" ? null : data.contacted_by,
      group: selectedGroupContext?.id,
    };

    console.log("Güncellenecek ziyaretçi:", updateData);
    setIsLoading(true);
    try {
      await visitsService.updateVisit(selectedVisitor.id, updateData);
      fethVisitors();
      setUpdateVisitorDialogOpen(false); // Form başarıyla gönderildiğinde modalı kapat
      toast.success("Ziyaretçi başarıyla güncellendi");
    } catch (error) {
      console.error("Ziyaretçi güncellenirken hata oluştu:", error);
      toast.error("Ziyaretçi güncellenemedi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisitorClick = (visitor, dialogType) => {
    setSelectedVisitor(visitor);
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
        attended: visitor.attended,
        contacted: visitor.contacted,
        contacted_by: visitor.contacted_by,
        rating: visitor.rating,
      });
      setUpdateVisitorDialogOpen(true);
    } else if (dialogType === "addNote") {
      setAddNoteDialogOpen(true);
    } else if (dialogType === "delete") {
      setDeleteVisitorDialogOpen(true);
    }
    //console.log("Silinecek ziyaretçi:", visitor);
  };

  const handleAddNote = async (data) => {
    setIsLoading(true);
    const noteData = {
      ...data,
      visitor: selectedVisitor.id,
      author: userId,
    };
    console.log("Yeni not:", noteData);
    try {
      await visitsService.createVisitorNote(noteData);
      setAddNoteDialogOpen(false);
      toast.success("Not başarıyla eklendi");
      fethVisitors();
    } catch (error) {
      console.error("Not eklendiğinde hata oluştu:", error);
      toast.error("Not eklenemedi");
    } finally {
      setIsLoading(false);
      addNoteForm.reset();
    }
  };

  const handleDeleteVisitor = async () => {
    setIsLoading(true);
    try {
      await visitsService.deleteVisit(selectedVisitor.id);
      setDeleteVisitorDialogOpen(false);
      toast.success("Ziyaretçi başarıyla silindi");
      fethVisitors();
    } catch (error) {
      console.error("Ziyaretçi silindiğinde hata oluştu:", error);
      toast.error("Ziyaretçi silinemedi");
    } finally {
      setIsLoading(false);
    }
  };

  // Grup Üyeleri İşlemleri
  const handleAddGroupMember = async (data) => {
    setIsLoading(true);
    try {
      if (!data.user_id.trim() || !data.role_id.trim()) return;
      console.log(data);
      await groupMembersService.addMemberToGroup(selectedGroupContext.id, data);
      toast.success("Grup üyesi başarıyla eklendi");
      setIsLoading(false);
      fetchGroupMembers(); // Refresh the list
    } catch (error) {
      console.error("Error adding group member:", error);
      toast.error(
        "Grup üyesi ekleme hatası - Üye başka bir gruba ait olabilir"
      );
    } finally {
      setIsLoading(false);
      setAddGroupMemberDialogOpen(false);
      addGroupMembersForm.reset();
    }
  };

  const handleUpdateGroupMember = async (data) => {
    setIsLoading(true);
    console.log(data);
    const updatedData = {
      user_id: selectedGroupMember.id,
      role_id: data.role_id,
    };
    try {
      if (!updatedData.user_id.trim() || !updatedData.role_id.trim()) return;
      console.log(updatedData);
      await groupMembersService.addMemberToGroup(
        selectedGroupContext.id,
        updatedData
      );
      toast.success("Grup üyesi başarıyla güncellendi");
      setIsLoading(false);
      fetchGroupMembers(); // Refresh the list
    } catch (error) {
      console.error("Error updating group member:", error);
      toast.error("Grup üyesi güncellenemedi");
    } finally {
      setIsLoading(false);
      setUpdateGroupMemberDialogOpen(false);
      updateGroupMemberForm.reset();
    }
  };

  const updateGroupMemberClick = (user) => {
    setSelectedGroupMember(user);
    console.log(user);
    setUpdateGroupMemberDialogOpen(true);
    updateGroupMemberForm.reset({
      user_id: user.user_id,
      old_role_name: user.role_name,
      new_role_name: user.role_name,
    });
  };

  const handleDeleteGroupMemberRole = async (role_id, user_id) => {
    setIsLoading(true);
    const data = {
      user_id: user_id,
      role_id: role_id,
    };
    try {
      await groupMembersService.deleteGroupMemberRole(
        selectedGroupContext.id,
        data
      );
      toast.success("Rol başarıyla silindi");
      setIsLoading(false);
      fetchGroupMembers(); // Refresh the list
    } catch (error) {
      console.error("Error deleting group member role:", error);
      toast.error("Rol silinemedi");
    } finally {
      setIsLoading(false);
      setUpdateGroupMemberDialogOpen(false);
      updateGroupMemberForm.reset();
    }
  };

  const handleRemoveGroupMember = async (user_id) => {
    setIsLoading(true);
    try {
      const response = await usersService.updateUser(user_id, {
        group_id: null,
      });
      toast.success("Üye gruptan çıkarıldı");
      setIsLoading(false);
      fetchGroupMembers();
    } catch (error) {
      console.error("Error removing group member:", error);
      toast.error("Üye gruptan çıkarılamadı");
    } finally {
      setIsLoading(false);
    }
  };

  // Açık Kategoriler İşlemleri
  const handleAddOpenCategory = async (data) => {
    setIsLoading(true);
    try {
      const response = await openCategoriesService.createOpenCategory(
        selectedGroupContext.id,
        data
      );
      console.log("Açık kategori oluşturuldu:", response);
      setAddOpenCategoriesDialogOpen(false);
      toast.success("Açık kategori başarıyla eklendi");
      fetchOpenCategories();
      // Kategoriler güncellenecek
    } catch (error) {
      console.error("Açık kategori eklenirken hata oluştu:", error);
      toast.error("Açık kategori eklenemedi");
    } finally {
      setIsLoading(false);
      addOpenCategoriesForm.reset();
    }
  };

  const handleDeleteOpenCategory = async (categoryId) => {
    setIsLoading(true);
    try {
      await openCategoriesService.deleteOpenCategory(
        selectedGroupContext.id,
        categoryId
      );
      toast.success("Açık kategori başarıyla silindi");
      // Açık kategorileri güncellemek için sayfayı yenileyelim
      fetchOpenCategories();
    } catch (error) {
      console.error("Açık kategori silinirken hata oluştu:", error);
      toast.error("Açık kategori silinemedi");
    } finally {
      setIsLoading(false);
    }
  };

  // Sunum İşlemleri
  const handleAddPresentation = async (data) => {
    const presentationData = {
      ...data,
      group: selectedGroupContext?.id,
    };
    setIsLoading(true);
    try {
      const response = await presentationsService.createPresentation(
        presentationData
      );
      console.log("Sunum oluşturuldu:", response);
      setAddPresentationDialogOpen(false);
      toast.success("Sunum başarıyla eklendi");
      // Sunumlar güncellenecek
    } catch (error) {
      console.error("Sunum eklenirken hata oluştu:", error);
      toast.error("Sunum eklenemedi");
    } finally {
      fetchPresentations();
      setIsLoading(false);
      addPresentationForm.reset();
    }
  };

  const handleUpdatePresentation = async (data) => {
    const presentationData = {
      ...data,
      group: selectedGroupContext?.id,
    };
    setIsLoading(true);
    try {
      const response = await presentationsService.updatePresentation(
        selectedPresentation.id,
        presentationData
      );
      console.log("Sunum güncellendi:", response);
      setUpdatePresentationDialogOpen(false);
      toast.success("Sunum başarıyla güncellendi");
      // Sunumlar güncellenecek
    } catch (error) {
      console.error("Sunum güncellenirken hata oluştu:", error);
      toast.error("Sunum güncellenemedi");
    } finally {
      fetchPresentations();
      setIsLoading(false);
      updatePresentationForm.reset();
    }
  };

  const handleUpdatePresentationClick = (presentation) => {
    setSelectedPresentation(presentation);
    updatePresentationForm.reset({
      meeting: presentation.meeting,
      user: presentation.user,
    });
    setUpdatePresentationDialogOpen(true);
  };

  const handleDeletePresentation = async (presentation) => {
    setIsLoading(true);
    try {
      await presentationsService.deletePresentation(presentation.id);
      toast.success("Sunum başarıyla silindi");
      fetchPresentations();
    } catch (error) {
      console.error("Sunum silinirken hata oluştu:", error);
      toast.error("Sunum silinemedi");
    } finally {
      setIsLoading(false);
    }
  };

  // Etkinlik İşlemleri
  const handleAddEvent = async (data) => {
    const eventData = {
      ...data,
      group: selectedGroupContext?.id,
    };
    setIsLoading(true);
    console.log("eventData", eventData);
    try {
      await eventsService.createEvent(eventData);
      setAddEventDialogOpen(false);
      toast.success("Etkinlik başarıyla eklendi");
      fetchEvents();
    } catch (error) {
      console.error("Etkinlik eklenirken hata oluştu:", error);
      toast.error("Etkinlik eklenemedi");
    } finally {
      setIsLoading(false);
      addEventForm.reset();
    }
  };

  const handleUpdateEventClick = (event) => {
    setSelectedEvent(event);
    updateEventForm.reset({
      title: event.title,
      description: event.description,
      date: event.date,
      group: event.group,
    });
    setUpdateEventDialogOpen(true);
  };

  const handleUpdateEvent = async (data) => {
    const eventData = {
      ...data,
      group: selectedGroupContext?.id,
    };
    setIsLoading(true);
    try {
      const response = await eventsService.updateEvent(
        selectedEvent.id,
        eventData
      );
      console.log("Etkinlik güncellendi:", response);
      setUpdateEventDialogOpen(false);
      toast.success("Etkinlik başarıyla güncellendi");
      // Sunumlar güncellenecek
    } catch (error) {
      console.error("Etkinlik güncellenirken hata oluştu:", error);
      toast.error("Etkinlik güncellenemedi");
    } finally {
      fetchEvents();
      setIsLoading(false);
      updateEventForm.reset();
    }
  };

  const handleDeleteEvent = async (event) => {
    setIsLoading(true);
    try {
      await eventsService.deleteEvent(event.id);
      toast.success("Etkinlik başarıyla silindi");
      fetchEvents();
    } catch (error) {
      console.error("Etkinlik silinirken hata oluştu:", error);
      toast.error("Etkinlik silinemedi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-6xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div>
              <div className="flex items-center gap-2 text-lg font-semibold">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span>{selectedGroupContext?.name}</span>
                  <span className="text-sm text-gray-500">
                    {" Yönetici: " +
                      selectedGroupContext?.region_exc_director_name}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-sm text-red-700 w-fit">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">
                  {selectedGroupContext?.region_name}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/group-list")}
              className="flex items-center gap-2"
            >
              <Undo2 className="h-4 w-4" />
              Gruplara Dön
            </Button>
            <Link to="/page-print">
              <Button variant="outline" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Yazdır
              </Button>
            </Link>
            <Link to="/page-print-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Yazdır2
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex w-full flex-col gap-6">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="info">Grup Bilgileri</TabsTrigger>
              <TabsTrigger value="visitors">Ziyaretçiler</TabsTrigger>
              <TabsTrigger value="members">Üyeler</TabsTrigger>
              <TabsTrigger value="presentations">Sunumlar</TabsTrigger>
              <TabsTrigger value="openCategories">Açık Kategoriler</TabsTrigger>
              <TabsTrigger value="events">Etkinlikler</TabsTrigger>
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
                        <p className="text-sm pl-9">
                          {selectedGroupContext.meeting_day}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="p-1.5 rounded-md bg-purple-50">
                            <Clock className="h-4 w-4 text-purple-600" />
                          </div>
                          <span className="font-medium">Toplantı Saati</span>
                        </div>
                        <p className="text-sm pl-9">
                          {selectedGroupContext.start_time} -{" "}
                          {selectedGroupContext.end_time}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="p-1.5 rounded-md bg-teal-50">
                            <Timer className="h-4 w-4 text-teal-600" />
                          </div>
                          <span className="font-medium">Dönem</span>
                        </div>
                        <p className="text-sm pl-9">
                          {selectedGroupContext.term_start} -{" "}
                          {selectedGroupContext.term_end}
                        </p>
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
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <CardTitle>Ziyaretçiler</CardTitle>
                      <CardDescription>
                        Gruba gelen ziyaretçilerin listesi
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
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
                      <Button
                        variant="default"
                        size="icon"
                        onClick={() => setAddVisitorDialogOpen(true)}
                      >
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
                            <TableHead>Puan</TableHead>
                            <TableHead>Davet Eden</TableHead>
                            <TableHead>Notlar</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {visitors.map((visitor) => (
                            <TableRow key={visitor.id}>
                              <TableCell className="font-medium">
                                {visitor.full_name}
                              </TableCell>
                              <TableCell>{visitor.company}</TableCell>
                              <TableCell>{visitor.category}</TableCell>
                              <TableCell>
                                {new Date(
                                  visitor.visit_date
                                ).toLocaleDateString("tr-TR")}
                              </TableCell>
                              <TableCell>
                               <div className="flex flex-col gap-1">
                                <span
                                    className={`text-center px-2 py-1 rounded-full text-xs ${
                                      visitor.status === "Olumlu"
                                        ? "bg-green-100 text-green-800"
                                        : visitor.status === "Olumsuz"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {visitor.status}
                                  </span>
                                  <span
                                    className={`text-center px-2 py-1 rounded-full text-xs ${
                                      visitor.attended
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {visitor.attended ? "Katıldı" : "Katılmadı"}
                                  </span>
                               </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm flex flex-col gap-1">
                                  <div>{visitor.phone}</div>
                                  <div>{visitor.email}</div>
                                  <div className="flex items-center gap-1 border border-gray-200 p-1 rounded-md w-fit">
                                    <div>
                                      {visitor.contacted ? <div className="flex items-center gap-1 text-green-700"><Check className="h-3 w-3" />İletişime Geçildi</div>: <div className="flex items-center gap-1 text-red-500"><X className="h-3 w-3" />İletişime Geçilmedi</div>}
                                    </div>
                                    <div>
                                      {visitor.contacted_by_full_name && <span className="text-gray-500">{visitor.contacted_by_full_name}</span>}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                  <div className="flex items-center">
                                    {
                                      visitor.rating 
                                      ?
                                      <span>{visitor.rating}/10</span>
                                      :
                                      <span>-</span>
                                    }
                                  </div>
                              </TableCell>
                              <TableCell>
                                {visitor.invited_by_full_name}
                              </TableCell>
                              <TableCell>
                                <div className="max-w-xs">
                                  {visitor.note && (
                                    <p className="text-sm mb-1">
                                      {visitor.note}
                                    </p>
                                  )}
                                  {visitor.notes &&
                                    visitor.notes.length > 0 && (
                                      <div className="mt-1">
                                        <details>
                                          <summary className="text-xs text-blue-600 cursor-pointer">
                                            {visitor.notes.length} not
                                          </summary>
                                          <div className="mt-2 text-xs space-y-2">
                                            {visitor.notes.map((note) => (
                                              <div
                                                key={note.id}
                                                className="p-2 bg-gray-50 rounded"
                                              >
                                                <p>{note.content}</p>
                                                <p className="text-gray-500 text-xs mt-1">
                                                  {new Date(
                                                    note.created_at
                                                  ).toLocaleString("tr-TR")}
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
                                    <Button
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleVisitorClick(visitor, "update")
                                      }
                                      variant="default"
                                      className="cursor-pointer"
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      <span>Düzenle</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleVisitorClick(visitor, "addNote")
                                      }
                                      variant="default"
                                      className="cursor-pointer"
                                    >
                                      <Plus className="mr-2 h-4 w-4" />
                                      <span>Not Ekle</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleVisitorClick(visitor, "delete")
                                      }
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
              </Card>
            </TabsContent>
            <TabsContent value="members" className="mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <CardTitle>Üyeler</CardTitle>
                      <CardDescription>
                        {selectedGroupContext
                          ? `${selectedGroupContext.name} grubu üye listesi`
                          : "Grup üyeleri"}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button onClick={fetchGroupMembers} disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Yükleniyor...
                          </>
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="default"
                        size="icon"
                        onClick={() => setAddGroupMemberDialogOpen(true)}
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Input
                        placeholder="Üye ara..."
                        value={memberGlobalFilter ?? ""}
                        onChange={(event) => setMemberGlobalFilter(event.target.value)}
                        className="max-w-sm"
                      />
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="member-filter"
                          className="text-sm font-medium"
                        >
                          Filtre:
                        </Label>
                        <Select
                          onValueChange={(value) => filterGroupMembers(value)}
                          value={memberFilter}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Üye Tipi" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tüm Üyeler</SelectItem>
                            <SelectItem value="gold">Altın Üyeler</SelectItem>
                            <SelectItem value="leader">Lider Ekip</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          {memberTable.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                              {headerGroup.headers.map((header) => {
                                return (
                                  <TableHead key={header.id}>
                                    {header.isPlaceholder
                                      ? null
                                      : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext()
                                        )}
                                  </TableHead>
                                );
                              })}
                            </TableRow>
                          ))}
                        </TableHeader>
                        <TableBody>
                          {memberTable.getRowModel().rows?.length ? (
                            memberTable.getRowModel().rows.map((row) => (
                              <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                              >
                                {row.getVisibleCells().map((cell) => (
                                  <TableCell key={cell.id}>
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    )}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={memberColumns.length}
                                className="h-24 text-center"
                              >
                                Bu grupta henüz üye bulunmamaktadır.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-2 py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => memberTable.previousPage()}
                        disabled={!memberTable.getCanPreviousPage()}
                      >
                        Önceki
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => memberTable.nextPage()}
                        disabled={!memberTable.getCanNextPage()}
                      >
                        Sonraki
                      </Button>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="presentations" className="mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <CardTitle>Sunumlar</CardTitle>
                      <CardDescription>
                        {selectedGroupContext
                          ? `${selectedGroupContext.name} grubu sunum listesi`
                          : "Sunumlar"}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={fetchPresentations} disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Yükleniyor...
                          </>
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="default"
                        size="icon"
                        onClick={() => setAddPresentationDialogOpen(true)}
                      >
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
                  ) : presentations.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Üye</TableHead>
                            <TableHead>Toplantı Tarihi</TableHead>
                            <TableHead>Oluşturulma Tarihi</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {presentations.map((presentation) => (
                            <TableRow key={presentation.id}>
                              <TableCell className="font-medium">
                                {presentation.user_full_name}
                              </TableCell>
                              <TableCell>
                                {new Date(
                                  presentation.meeting_date
                                ).toLocaleDateString("tr-TR")}
                              </TableCell>
                              <TableCell>
                                {new Date(
                                  presentation.created_at
                                ).toLocaleDateString("tr-TR")}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleUpdatePresentationClick(
                                          presentation
                                        )
                                      }
                                      variant="default"
                                      className="cursor-pointer"
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      <span>Düzenle</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDeletePresentation(presentation)
                                      }
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
                      <p>Henüz sunum bulunmuyor.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="openCategories" className="mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <CardTitle>Açık Kategoriler</CardTitle>
                      <CardDescription>
                        {selectedGroupContext
                          ? `${selectedGroupContext.name} grubu açık kategoriler listesi`
                          : "Açık kategoriler"}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="icon"
                        onClick={() => setAddOpenCategoriesDialogOpen(true)}
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {openCategories && openCategories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {openCategories.map((category) => (
                        <div
                          key={category.id}
                          id={category.id}
                          className="bg-secondary border border-gray-100 rounded-lg shadow-sm p-3 hover:shadow-md transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center justify-between gap-3 w-full">
                              <div className="">{category.name}</div>
                              <Button
                                disabled={isLoading}
                                onClick={() =>
                                  handleDeleteOpenCategory(category.id)
                                }
                                variant="destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p>Bu grupta açık kategori üye bulunmamaktadır.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="events" className="mt-4">
              <Card>
              <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <CardTitle>Etkinlikler</CardTitle>
                      <CardDescription>
                        {selectedGroupContext
                          ? `${selectedGroupContext.name} grubu etkinlikler listesi`
                          : "Etkinlikler"}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="icon"
                        onClick={() => setAddEventDialogOpen(true)}
                      >
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
                  ) : events.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Etkinlik Adı</TableHead>
                            <TableHead>Tarih</TableHead>
                            <TableHead>Açıklama</TableHead>
                            <TableHead>Oluşturan</TableHead>
                            <TableHead>Oluşturulma Tarihi</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {events.map((event) => (
                            <TableRow key={event.id}>
                              <TableCell className="font-medium">
                                {event.title}
                              </TableCell>
                              <TableCell>
                                {new Date(event.date).toLocaleDateString("tr-TR", {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </TableCell>
                              <TableCell>
                                {event.description || '-'}
                              </TableCell>
                              <TableCell>
                                {event.created_by_name || 'Bilinmiyor'}
                              </TableCell>
                              <TableCell>
                                {new Date(event.created_at).toLocaleDateString("tr-TR")}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleUpdateEventClick(event)
                                      }
                                      variant="default"
                                      className="cursor-pointer"
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      <span>Düzenle</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDeleteEvent(event)
                                      }
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
                      <p>Henüz etkinlik bulunmuyor.</p>
                    </div>
                  )}
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
            <DialogDescription>Ziyaretçi bilgilerini girin</DialogDescription>
          </DialogHeader>
          <Form {...addVisitorForm}>
            <form
              onSubmit={addVisitorForm.handleSubmit(handleAddVisitor)}
              className="space-y-6 max-h-[50vh] overflow-y-auto p-3"
            >
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
                              format(new Date(field.value), "PPP", {
                                locale: tr,
                              })
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
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(format(date, "yyyy-MM-dd"));
                            }
                          }}
                          disabled={(date) => date < new Date("1900-01-01")}
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
                        value={selectedGroupContext?.name || ""}
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                              {new Date(meeting.date).toLocaleDateString(
                                "tr-TR"
                              )}{" "}
                              ({meeting.start_time} - {meeting.end_time})
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Gün seçiniz" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["Olumlu", "Olumsuz", "Kararsız", "İleri Tarih"].map((status) => (
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
              <FormField
                control={addVisitorForm.control}
                name="attended"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Katıldı</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <span className="text-xs text-gray-500">
                      HAYIR / EVET
                    </span>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addVisitorForm.control}
                name="contacted"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İletişime Geçildi</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <span className="text-xs text-gray-500">
                      HAYIR / EVET
                    </span>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addVisitorForm.control}
                name="contacted_by"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İletişime Geçen</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="İletişime Geçen seçiniz" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Seçilmedi</SelectItem>
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
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Puan</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Puan (0-10)" 
                        min="0"
                        max="10"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? "" : Number(value));
                        }}
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
      <Dialog
        open={updateVisitorDialogOpen}
        onOpenChange={setUpdateVisitorDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ziyaretçi Bilgilerini Düzenle</DialogTitle>
            <DialogDescription>Ziyaretçi bilgilerini girin</DialogDescription>
          </DialogHeader>
          <Form {...updateVisitorForm}>
            <form
              onSubmit={updateVisitorForm.handleSubmit(handleUpdateVisitor)}
              className="space-y-6 max-h-[50vh] overflow-y-auto p-3"
            >
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
                              format(new Date(field.value), "PPP", {
                                locale: tr,
                              })
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
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(format(date, "yyyy-MM-dd"));
                            }
                          }}
                          disabled={(date) => date < new Date("1900-01-01")}
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
                        value={selectedVisitor?.group_name || ""}
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                              {new Date(meeting.date).toLocaleDateString(
                                "tr-TR"
                              )}{" "}
                              ({meeting.start_time} - {meeting.end_time})
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Gün seçiniz" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["Olumlu", "Olumsuz", "Kararsız", "İleri Tarih"].map((status) => (
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
              <FormField
                control={updateVisitorForm.control}
                name="attended"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Katıldı</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <span className="text-xs text-gray-500">
                      HAYIR / EVET
                    </span>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateVisitorForm.control}
                name="contacted"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İletişime Geçildi</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <span className="text-xs text-gray-500">
                      HAYIR / EVET
                    </span>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateVisitorForm.control}
                name="contacted_by"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İletişime Geçen</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="İletişime Geçen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Seçilmedi</SelectItem>
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
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Puan</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Puan (0-10)" 
                        min="0"
                        max="10"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? "" : Number(value));
                        }}
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
      <Dialog open={addNoteDialogOpen} onOpenChange={setAddNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Not Ekle</DialogTitle>
            <DialogDescription>Notunuzu girin.</DialogDescription>
          </DialogHeader>
          <Form {...addNoteForm}>
            <form
              onSubmit={addNoteForm.handleSubmit(handleAddNote)}
              className="space-y-6"
            >
              <FormField
                control={addNoteForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Not</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Notunuzu girin" {...field} />
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
      <Dialog
        open={addGroupMemberDialogOpen}
        onOpenChange={setAddGroupMemberDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gruba Üye Ekle</DialogTitle>
            <DialogDescription>Yeni bir üye ekleyin</DialogDescription>
          </DialogHeader>
          <Form {...addGroupMembersForm}>
            <form
              onSubmit={addGroupMembersForm.handleSubmit(handleAddGroupMember)}
              className="space-y-4"
            >
              <FormField
                control={addGroupMembersForm.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kullanıcı</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Kullanıcı seçiniz" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.first_name + " " + user.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addGroupMembersForm.control}
                name="role_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Rol seçiniz" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
      <Dialog
        open={updateGroupMemberDialogOpen}
        onOpenChange={setUpdateGroupMemberDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grup Üyesi Düzenle</DialogTitle>
            <DialogDescription>
              <span className="font-bold">
                {selectedGroupMember &&
                  selectedGroupMember.first_name +
                    " " +
                    selectedGroupMember.last_name}{" "}
              </span>
              Grup üyesinin rollerini düzenleyin.
            </DialogDescription>
          </DialogHeader>
          <Form {...updateGroupMemberForm}>
            <form
              onSubmit={updateGroupMemberForm.handleSubmit(
                handleUpdateGroupMember
              )}
              className="space-y-4"
            >
              <div className="flex items-end justify-between">
                <FormField
                  control={updateGroupMemberForm.control}
                  name="role_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rol Ekle</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Rol Seçiniz" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name} - {role.category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button disabled={isLoading}>
                    {isLoading ? "Kaydediliyor..." : "Kaydet"}
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </Form>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
            {selectedGroupMember &&
              Array.isArray(selectedGroupMember.roles) &&
              selectedGroupMember.roles.map((role) => (
                <div
                  key={role.id}
                  className="rounded-md border bg-card hover:bg-accent/10 transition-colors"
                >
                  <div className="flex items-center p-3 justify-between">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-primary" />
                      <span>
                        {role.role} - {role.category}
                      </span>
                    </div>
                    <div>
                      <Button
                        disabled={isLoading}
                        onClick={() =>
                          handleDeleteGroupMemberRole(
                            role.role_id,
                            selectedGroupMember.id
                          )
                        }
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={addPresentationDialogOpen}
        onOpenChange={setAddPresentationDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Sunum Ekle</DialogTitle>
            <DialogDescription>Sunum bilgilerini girin</DialogDescription>
          </DialogHeader>
          <Form {...addPresentationForm}>
            <form
              onSubmit={addPresentationForm.handleSubmit(handleAddPresentation)}
              className="space-y-6"
            >
              <FormField
                control={addPresentationForm.control}
                name="group"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grup</FormLabel>
                    <FormControl>
                      <Input
                        value={selectedGroupContext?.name || ""}
                        disabled
                        className="bg-gray-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addPresentationForm.control}
                name="meeting"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Toplantı</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                              {new Date(meeting.date).toLocaleDateString(
                                "tr-TR"
                              )}{" "}
                              ({meeting.start_time} - {meeting.end_time})
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
                control={addPresentationForm.control}
                name="user"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kullanıcı</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Kullanıcı seçiniz" />
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
      <Dialog
        open={updatePresentationDialogOpen}
        onOpenChange={setUpdatePresentationDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sunumu Düzenle</DialogTitle>
            <DialogDescription>Sunum bilgilerini girin</DialogDescription>
          </DialogHeader>
          <Form {...updatePresentationForm}>
            <form
              onSubmit={updatePresentationForm.handleSubmit(
                handleUpdatePresentation
              )}
              className="space-y-6"
            >
              <FormField
                control={updatePresentationForm.control}
                name="group"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grup</FormLabel>
                    <FormControl>
                      <Input
                        value={selectedGroupContext?.name || ""}
                        disabled
                        className="bg-gray-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updatePresentationForm.control}
                name="meeting"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Toplantı</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                              {new Date(meeting.date).toLocaleDateString(
                                "tr-TR"
                              )}{" "}
                              ({meeting.start_time} - {meeting.end_time})
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
                control={updatePresentationForm.control}
                name="user"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kullanıcı</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Kullanıcı seçiniz" />
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
      <Dialog
        open={addOpenCategoriesDialogOpen}
        onOpenChange={setAddOpenCategoriesDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Açık Kategori Ekle</DialogTitle>
            <DialogDescription>Açık kategori adını girin.</DialogDescription>
          </DialogHeader>
          <Form {...addOpenCategoriesForm}>
            <form
              onSubmit={addOpenCategoriesForm.handleSubmit(
                handleAddOpenCategory
              )}
              className="space-y-6"
            >
              <FormField
                control={addOpenCategoriesForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Açık Kategori Adı</FormLabel>
                    <FormControl>
                      <Input placeholder="Açık kategori adı" {...field} />
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
      <Dialog open={addEventDialogOpen} onOpenChange={setAddEventDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Etkinlik Ekle</DialogTitle>
            <DialogDescription>Etkinlik bilgilerini girin</DialogDescription>
          </DialogHeader>
          <Form {...addEventForm}>
            <form onSubmit={addEventForm.handleSubmit(handleAddEvent)} className="space-y-6">
            <FormField
                control={addEventForm.control}
                name="group"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grup</FormLabel>
                    <FormControl>
                      <Input
                        value={selectedGroupContext?.name || ""}
                        disabled
                        className="bg-gray-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addEventForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etkinlik Adı</FormLabel>
                    <FormControl>
                      <Input placeholder="Etkinlik adı" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addEventForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Etkinlik Tarihi</FormLabel>
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
                              format(new Date(field.value), "PPP", {
                                locale: tr,
                              })
                            ) : (
                              <span>Etkinlik tarihi seçin</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(format(date, "yyyy-MM-dd"));
                            }
                          }}
                          disabled={(date) => date < new Date("1900-01-01")}
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
                control={addEventForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etkinlik Açıklaması</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Etkinlik açıklaması" {...field} />
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
      <Dialog
        open={updateEventDialogOpen}
        onOpenChange={setUpdateEventDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Etkinlik Düzenle</DialogTitle>
            <DialogDescription>Etkinlik bilgilerini girin</DialogDescription>
          </DialogHeader>
          <Form {...updateEventForm}>
            <form onSubmit={updateEventForm.handleSubmit(handleUpdateEvent)} className="space-y-6">
            <FormField
                control={updateEventForm.control}
                name="group"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grup</FormLabel>
                    <FormControl>
                      <Input
                        value={selectedGroupContext?.name || ""}
                        disabled
                        className="bg-gray-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateEventForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etkinlik Adı</FormLabel>
                    <FormControl>
                      <Input placeholder="Etkinlik adı" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateEventForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Etkinlik Tarihi</FormLabel>
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
                              format(new Date(field.value), "PPP", {
                                locale: tr,
                              })
                            ) : (
                              <span>Etkinlik tarihi seçin</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(format(date, "yyyy-MM-dd"));
                            }
                          }}
                          disabled={(date) => date < new Date("1900-01-01")}
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
                control={updateEventForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etkinlik Açıklaması</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Etkinlik açıklaması" {...field} />
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
      <AlertDialog
        open={deleteVisitorDialogOpen}
        onOpenChange={setDeleteVisitorDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Ziyaretçiyi silmek istediğinize emin misiniz?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteVisitor()}>
              Onayla
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default GroupDetail;
