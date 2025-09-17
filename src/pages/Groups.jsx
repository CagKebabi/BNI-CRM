import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { groupsService } from '../services/groups.service';
import { regionsService } from '../services/regions.service';
import { rolesService } from '../services/roles.service';
import { groupMembersService } from '../services/groupMembers.service';
import { usersService } from '../services/users.service';
import { groupMeetingsService } from '../services/groupMeetings.service';
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../components/ui/button';
import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import { cn } from "../lib/utils";
import { 
    Users, 
    MapPin, 
    Calendar as CalendarIcon, 
    Clock, 
    CalendarDays, 
    Timer,
    User,
    Plus,
    MoreHorizontal,
    Edit,
    Trash2,
    Loader2,
    ExternalLink,
  } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '../components/ui/input';
import { useForm } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
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
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../components/ui/form";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "../components/ui/tooltip";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Calendar } from "../components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../components/ui/popover";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../components/ui/accordion"
import { useUser } from "../contexts/UserContext";
import { useGroup } from "../contexts/GroupContext";

function Groups() {
    const navigate = useNavigate();
    const { setSelectedGroupContext } = useGroup();
    const [groups, setGroups] = useState([]);
    const [regions, setRegions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [addGroupDialogOpen, setAddGroupDialogOpen] = useState(false);
    const [updateGroupDialogOpen, setUpdateGroupDialogOpen] = useState(false);
    const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
    const [rolesDialogOpen, setRolesDialogOpen] = useState(false);
    const [addRolesDialogOpen, setAddRolesDialogOpen] = useState(false);
    const [addGroupMemberDialogOpen, setAddGroupMemberDialogOpen] = useState(false);
    const [updateGroupMemberDialogOpen, setUpdateGroupMemberDialogOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedGroupMember, setSelectedGroupMember] = useState(null);
    const [editingRoleId, setEditingRoleId] = useState(null);
    const { isSuperUser, userId } = useUser();  
    
    console.log("userId", userId);

    const formSchema = z.object({
        name: z.string().min(2, {
            message: "Grup adı en az 2 karakter olmalıdır.",
        }),
        region: z.string().uuid({
            message: "Geçerli bir bölge seçiniz.",
        }),
        meeting_day: z.string().min(2, {
            message: "Toplantı günü seçiniz.",
        }),
        start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
            message: "Geçerli bir başlangıç saati giriniz (HH:MM:SS).",
        }),
        end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
            message: "Geçerli bir bitiş saati giriniz (HH:MM:SS).",
        }),
        // meeting_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        //     message: "Geçerli bir toplantı tarihi giriniz (YYYY-AA-GG).",
        // }),
        term_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
            message: "Geçerli bir dönem başlangıç tarihi giriniz (YYYY-AA-GG).",
        }),
        term_end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
            message: "Geçerli bir dönem bitiş tarihi giriniz (YYYY-AA-GG).",
        }),
    });

    const formSchema2 = z.object({
        name: z.string().min(2, {
            message: "Rol adı en az 2 karakter olmalıdır.",
        }),
        category: z.string().min(2, {
            message: "Rol kategorisi seçiniz.",
        }),
    })

    const formSchema3 = z.object({
        user_id: z.string().uuid({
            message: "Kullanıcı seçiniz.",
        }),
        role_id: z.string().uuid({
            message: "Rol seçiniz.",
        }),
    })

    const formSchema4 = z.object({
        role_id: z.string().uuid({
            message: "Yeni rol seçiniz.",
        }),
    })
    
    // Sabit rol kategorileri
    const roleCategories = [
        "Lider Ekip", 
        "Mentör Komitesi", 
        "Üyelik Komitesi", 
        "Ziyaretçi Komitesi", 
        "Diğer"
    ];
    
    // Add Group Form tanımlaması
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            region: "",
            meeting_day: "",
            start_time: "08:30:00",
            end_time: "10:30:00",
            // meeting_date: "",
            term_start: "",
            term_end: "",
        },
    }); 

    // Edit Group Form tanımlaması
    const updateGroupForm = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            region: "",
            meeting_day: "",
            start_time: "08:30:00",
            end_time: "10:30:00",
            // meeting_date: "",
            term_start: "",
            term_end: "",
        },
    }); 
    
    // Add Roles Form tanımlaması
    const addRoleForm = useForm({
        resolver: zodResolver(formSchema2),
        defaultValues: {
            name: "",
            category: "",
        },
    }); 
    
    // Edit Role Form tanımlaması
    const editRoleForm = useForm({
        resolver: zodResolver(formSchema2),
        defaultValues: {
            name: "",
            category: "",
        },
    });

    // Add Group Members Form tanımlaması
    const addGroupMembersForm = useForm({
        resolver: zodResolver(formSchema3),
        defaultValues: {
            user_id: "",
            role_id: "",
        },
    });
    
    // Update Group Members Form tanımlaması
    const updateGroupMemberForm = useForm({
        resolver: zodResolver(formSchema4),
        defaultValues: {
            role_id: "",
        },
    });
    
    useEffect(() => {
        fetchGroups();
        fetchRegions();
        fetchRoles();
        fetchUsers();
    }, []);
    
    const fetchGroups = async () => {
        try {
            const response = await groupsService.getGroups();
            console.log("Grup listesi alındı:", response);
            setGroups(response);
            setIsLoading(false);
        } catch (error) {
            console.error("Grup listesi alınamadı:", error);
            setIsLoading(false);
        }
    };

    const fetchRegions = async () => {
        try {
            const response = await regionsService.getRegions();
            console.log("Bölge listesi alındı:", response);
            setRegions(response);
            setIsLoading(false);
        } catch (error) {
            console.error("Bölge listesi alınamadı:", error);
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
    
    // Groups
    const handleUpdateClick = (group) => {
        setSelectedGroup(group);
        // Form değerlerini güncelle
        console.log('Selected group:', group);
        
        // Form değerlerini sıfırla ve yeni değerleri ata
        updateGroupForm.reset();
        
        // Her bir form alanını ayrı ayrı güncelle
        updateGroupForm.setValue('name', group.name);
        updateGroupForm.setValue('region', group.region);
        updateGroupForm.setValue('meeting_day', group.meeting_day);
        updateGroupForm.setValue('start_time', group.start_time);
        updateGroupForm.setValue('end_time', group.end_time);
        updateGroupForm.setValue('meeting_date', group.meeting_date);
        updateGroupForm.setValue('term_start', group.term_start);
        updateGroupForm.setValue('term_end', group.term_end);
        
        setUpdateGroupDialogOpen(true);
    };

    const handleDeleteGroupClick = (group) => {
        setSelectedGroup(group);
        setDeleteGroupDialogOpen(true);
    };
    
    const handleViewGroupDetail = (group) => {
        // Seçilen grup bilgisini context'e kaydet
        setSelectedGroupContext(group);
        console.log('Grup detayı görüntüleniyor:', group);
        
        // GroupDetail sayfasına yönlendir
        navigate('/group-list/group-detail');
    };
    
    const handleAddGroup = async (data) => {
        setIsLoading(true);
        try {
            if (!data.name.trim()) return;
            
            const response = await groupsService.createGroup(data);
            await groupMeetingsService.setGroupMeeting(response.id);
            toast.success('Grup başarıyla eklendi');
            setIsLoading(false);
            setAddGroupDialogOpen(false);
            fetchGroups(); // Refresh the list
        } catch (error) {
            console.error('Error adding group:', error);
            toast.error('Grup ekleme hatası');
        } finally {
            setIsLoading(false);
            form.reset();
        }
    };

    const handleUpdateGroup = async (data) => {
        setIsLoading(true);
        try {
            if (!data.name.trim()) return;
            
            await groupsService.updateGroup(selectedGroup.id, data);
            await groupMeetingsService.setGroupMeeting(selectedGroup.id);
            toast.success('Grup başarıyla güncellendi');
            setIsLoading(false);
            setUpdateGroupDialogOpen(false);
            fetchGroups(); // Refresh the list
        } catch (error) {
            console.error('Error updating group:', error);
            toast.error('Grup güncelleme hatası');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDeleteGroup = async () => {
        setIsLoading(true);
        try {
            await groupsService.deleteGroup(selectedGroup.id);
            toast.success('Grup başarıyla silindi');
            setIsLoading(false);
            fetchGroups(); // Refresh the list
        } catch (error) {
            console.error('Error deleting group:', error);
            toast.error('Grup silme hatası');
        } finally {
            setIsLoading(false);
        }
    };

    // Roles
    const handleUpdateRoleClick = (role) => {
        setSelectedRole(role);
        // Form değerlerini güncelle
        console.log('Selected role:', role);
        
        // Düzenleme modunu aç/kapa
        if (editingRoleId === role.id) {
            setEditingRoleId(null);
        } else {
            setEditingRoleId(role.id);
            // Form değerlerini sıfırla ve yeni değerleri ata
            editRoleForm.reset();
            
            // Her bir form alanını ayrı ayrı güncelle
            editRoleForm.setValue('name', role.name);
            editRoleForm.setValue('category', role.category);
        }
    };

    const handleAddRole = async (data) => {
        setIsLoading(true);
        try {
            console.log(data);
            if (!data.name.trim()) return;

            const modifiedData = {
                ...data,
                category: data.category === "Diğer" ? null : data.category,
            };
            
            await rolesService.createRole(modifiedData);
            toast.success('Rol başarıyla eklendi');
            setIsLoading(false);
            setAddRolesDialogOpen(false);
            fetchRoles(); // Refresh the list
        } catch (error) {
            console.error('Error adding role:', error);
            toast.error('Rol ekleme hatası');
        } finally {
            setIsLoading(false);
            addRoleForm.reset();
        }
    };

    const handleUpdateRole = async (data) => {
        setIsLoading(true);
        try {
            if (!data.name.trim()) return;

            const modifiedData = {
                ...data,
                category: data.category === "Diğer" ? null : data.category,
            };
            
            await rolesService.updateRole(selectedRole.id, modifiedData);
            toast.success('Rol başarıyla güncellendi');
            setIsLoading(false);
            setEditingRoleId(null); // Düzenleme modunu kapat
            fetchRoles(); // Refresh the list
        } catch (error) {
            console.error('Error updating role:', error);
            toast.error('Rol güncelleme hatası');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteRole = async (id) => {
        setIsLoading(true);
        try {
            await rolesService.deleteRole(id);
            toast.success('Rol başarıyla silindi');
            setIsLoading(false);
            fetchRoles(); // Refresh the list
        } catch (error) {
            console.error('Error deleting role:', error);
            toast.error('Rol silme hatası');
        } finally {
            setIsLoading(false);
        }
    };

    // Group Members
    const addMemberToGroupClick = (group) => {
        setSelectedGroup(group);
        console.log(group);
        setAddGroupMemberDialogOpen(true);
    };
    
    const handleAddGroupMember = async (data) => {
        setIsLoading(true);
        try {
            if (!data.user_id.trim() || !data.role_id.trim()) return;
            console.log(data);
            await groupMembersService.addMemberToGroup(selectedGroup.id, data);
            toast.success('Grup üyesi başarıyla eklendi');
            setIsLoading(false);
            fetchGroups(); // Refresh the list
        } catch (error) {
            console.error('Error adding group member:', error);
            toast.error('Grup üyesi ekleme hatası - Üye başka bir gruba ait olabilir');
        } finally {
            setIsLoading(false);
            setAddGroupMemberDialogOpen(false);
            addGroupMembersForm.reset();
        }
    };

    const updateGroupMemberClick = (group, user) => {
        setSelectedGroup(group);
        setSelectedGroupMember(user);
        console.log(group, user);
        setUpdateGroupMemberDialogOpen(true);
        updateGroupMemberForm.reset({
            user_id: user.user_id,
            old_role_name: user.role_name,
            new_role_name: user.role_name,
        });
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
            await groupMembersService.addMemberToGroup(selectedGroup.id, updatedData);
            toast.success('Grup üyesi başarıyla güncellendi');
            setIsLoading(false);
            fetchGroups(); // Refresh the list
        } catch (error) {
            console.error('Error updating group member:', error);
            toast.error('Grup üyesi güncellenemedi');
        } finally {
            setIsLoading(false);
            setUpdateGroupMemberDialogOpen(false);
            updateGroupMemberForm.reset();
        }
    };

    const handleDeleteGroupMemberRole = async (group_id, role_id, user_id) => {
        setIsLoading(true);        
        const data = {
            user_id: user_id,
            role_id: role_id,
        };
        try {
            await groupMembersService.deleteGroupMemberRole(group_id, data);
            toast.success('Rol başarıyla silindi');
            setIsLoading(false);
            fetchGroups(); // Refresh the list
        } catch (error) {
            console.error('Error deleting group member role:', error);
            toast.error('Rol silinemedi');
        } finally {
            setIsLoading(false);
            setUpdateGroupMemberDialogOpen(false);
            updateGroupMemberForm.reset();
        }
    };

    const handleRemoveGroupMember = async (user_id) => {
        setIsLoading(true);
        try {
          const response = await usersService.updateUser(user_id, { group_id: null });
          toast.success("Üye gruptan çıkarıldı");
          setIsLoading(false);
          fetchGroups();
        } catch (error) {
          console.error("Error removing group member:", error);
          toast.error("Üye gruptan çıkarılamadı");
        } finally {
          setIsLoading(false);
        }
      };

    return (
        <>
            <div className="max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold mb-6">Gruplar</h1>
                    {isSuperUser && (
                    <div className='flex items-center gap-2'>
                        <div className="flex items-center gap-2 border border-gray-200 rounded-md p-2">
                            <Button variant="default" onClick={() => setRolesDialogOpen(true)} className="bg-secondary text-primary border-2 hover:bg-primary hover:text-secondary">
                                <div className="flex items-center gap-2" >
                                    <span>Roller</span>
                                    <Users className="h-5 w-5" />
                                </div>
                            </Button>
                            <Button variant="default" onClick={() => setAddRolesDialogOpen(true)} className="bg-secondary text-primary border-2 hover:bg-primary hover:text-secondary">
                                <div className="flex items-center gap-2" >
                                <Plus className="h-5 w-5" />
                                </div>
                            </Button>
                        </div>
                        <Button variant="default" size="icon" onClick={() => setAddGroupDialogOpen(true)}>
                            <Plus className="h-5 w-5" />
                        </Button>
                    </div>
                    )}
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ): (
                    <div>
                        <ul className="space-y-2">
                        {groups && groups.length > 0 ? groups.map((group) => (
                            <li key={group.id}>
                                <Card className="hover:shadow-lg transition-shadow duration-200">
                                    <CardHeader className="pb-2 flex justify-between">
                                        <div className="flex flex-col gap-2">
                                            <CardTitle >
                                                <div className="flex items-center gap-2 text-lg font-semibold">
                                                    <div className="p-2 rounded-lg bg-blue-50">
                                                        <Users className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span>{group.name}</span>
                                                        <span className='text-sm text-gray-500'>{" Yönetici: " + group.region_exc_director_name}</span>
                                                    </div>
                                                    <Button variant="outline" size="icon" onClick={() => handleViewGroupDetail(group)}>
                                                        <ExternalLink className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                                
                                            </CardTitle>
                                            <CardDescription className="mt-0">
                                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-sm text-red-700 w-fit">
                                                    <MapPin className="h-4 w-4" />
                                                    <span className="font-medium">{group.region_name}</span>
                                                </div>
                                            </CardDescription>
                                        </div>
                                        {isSuperUser && 
                                        <div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleUpdateClick(group)} variant="default" className="cursor-pointer">
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Düzenle
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDeleteGroupClick(group)} variant="destructive" className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Sil
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        }
                                        
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            {/* Toplantı Günü ve Saati */}
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="p-1.5 rounded-md bg-green-50">
                                                        <CalendarIcon className="h-4 w-4 text-green-600" />
                                                    </div>
                                                    <span className="font-medium">Toplantı Günü</span>
                                                </div>
                                                <p className="text-sm pl-9">{group.meeting_day}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="p-1.5 rounded-md bg-purple-50">
                                                        <Clock className="h-4 w-4 text-purple-600" />
                                                    </div>
                                                    <span className="font-medium">Toplantı Saati</span>
                                                </div>
                                                <p className="text-sm pl-9">{group.start_time} - {group.end_time}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="p-1.5 rounded-md bg-teal-50">
                                                        <Timer className="h-4 w-4 text-teal-600" />
                                                    </div>
                                                    <span className="font-medium">Dönem</span>
                                                </div>
                                                <p className="text-sm pl-9">{group.term_start} - {group.term_end}</p>
                                            </div>
                                            </div>
                                            {/* Üyeler */}
                                            <Accordion type="single" collapsible>
                                                <AccordionItem value="item-1">
                                                    <AccordionTrigger className="cursor-pointer">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 rounded-md bg-indigo-50">
                                                            <User className="h-4 w-4 text-indigo-600" />
                                                        </div>
                                                        <span className="font-medium text-sm">
                                                            Grup Üyeleri ({group.users.length})
                                                        </span>
                                                    </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="pt-4 border-t border-gray-100">
                                                            {
                                                                isSuperUser || group.region_exc_director_id === userId ? 
                                                                    <div className="flex items-center justify-end gap-2  mb-4">
                                                                        <Button variant="default" onClick={() => addMemberToGroupClick(group)} className="bg-secondary text-primary border-2 hover:bg-primary hover:text-secondary">
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="flex items-center gap-1">
                                                                                    <User className="h-5 w-5" />
                                                                                    <span>Üye Ekle</span>
                                                                                </div>
                                                                                <Plus className="h-5 w-5" />
                                                                            </div>
                                                                        </Button>
                                                                    </div>
                                                                :
                                                                    ""
                                                                
                                                            }
                                                            <div>
                                                                <Table>
                                                                    <TableHeader>
                                                                        <TableRow>
                                                                            <TableHead>Üye</TableHead>
                                                                            <TableHead>E-posta</TableHead>
                                                                            <TableHead>Roller</TableHead>
                                                                            <TableHead>Kategori</TableHead>
                                                                            <TableHead>Durum</TableHead>
                                                                            <TableHead className="w-[80px]"></TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {group.users.map((user, index) => (
                                                                            <TableRow key={user.id}>
                                                                                <TableCell className="font-medium">
                                                                                    <div className="flex items-center gap-3">
                                                                                        <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center text-sm font-medium text-indigo-700">
                                                                                            {user.first_name?.charAt(0).toUpperCase()}{user.last_name?.charAt(0).toUpperCase()}
                                                                                        </div>
                                                                                        <span>{user.first_name} {user.last_name}</span>
                                                                                    </div>
                                                                                </TableCell>
                                                                                <TableCell>{user.email}</TableCell>
                                                                                <TableCell>
                                                                                    {user.roles && user.roles.length > 0 ? (
                                                                                        <div className="flex flex-wrap gap-1">
                                                                                            {user.roles.map((role) => (
                                                                                                <span key={role.id} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium">
                                                                                                    {role.role}
                                                                                                </span>
                                                                                            ))}
                                                                                        </div>
                                                                                    ) : (
                                                                                        <span className="text-gray-400 text-sm">Rol atanmamış</span>
                                                                                    )}
                                                                                </TableCell> 
                                                                                <TableCell>
                                                                                    {user.roles && user.roles.length > 0 ? (
                                                                                        <div className="flex flex-wrap gap-1">
                                                                                            {user.roles.map((role) => (
                                                                                                role.category && (
                                                                                                    <span key={`${role.id}-category`} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                                                                                        {role.category}
                                                                                                    </span>
                                                                                                )
                                                                                            ))}
                                                                                        </div>
                                                                                    ) : (
                                                                                        <span className="text-gray-400 text-sm">-</span>
                                                                                    )}
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                                                                        Aktif
                                                                                    </span>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    {
                                                                                        isSuperUser || group.region_exc_director_id === userId ? 

                                                                                        <DropdownMenu>
                                                                                            <DropdownMenuTrigger asChild>
                                                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                                                </Button>
                                                                                            </DropdownMenuTrigger>
                                                                                            <DropdownMenuContent align="end">
                                                                                                <DropdownMenuItem
                                                                                                    onClick={() => updateGroupMemberClick(group, user)}
                                                                                                    variant="default"
                                                                                                    className="cursor-pointer"
                                                                                                >
                                                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                                                    <span>Düzenle</span>
                                                                                                </DropdownMenuItem>
                                                                                                <DropdownMenuItem 
                                                                                                    onClick={() => handleRemoveGroupMember(user.id)} 
                                                                                                    variant="destructive"
                                                                                                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                                                                                >
                                                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                                                    Gruptan Çıkar
                                                                                                </DropdownMenuItem>
                                                                                            </DropdownMenuContent>
                                                                                        </DropdownMenu> 
                                                                                    : 
                                                                                    ""
                                                                                    }
                                                                                    
                                                                                </TableCell>         
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </div>
                                                            {/* <div className="grid grid-cols-1 gap-3">
                                                                {group.users.map((user, index) => (
                                                                    <div key={user.id} className="bg-secondary border border-gray-100 rounded-lg shadow-sm p-3 hover:shadow-md transition-all">
                                                                        <div className="flex justify-between items-start">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center text-sm font-medium text-indigo-700">
                                                                                    {user.first_name.charAt(0).toUpperCase() + user.last_name.charAt(0).toUpperCase()}
                                                                                </div>
                                                                                <div>
                                                                                    <h4 className="font-medium text-primary">{user.first_name} {user.last_name}</h4>
                                                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                                                </div>
                                                                            </div>
                                                                            {
                                                                                isSuperUser || group.region_exc_director_id === userId ? 
                                                                                <Button variant="ghost" className="bg-secondary text-primary border-2 hover:bg-primary hover:text-secondary" onClick={() => updateGroupMemberClick(group, user)}>
                                                                                    <div className="flex items-center"> 
                                                                                        <Edit className="h-2 w-2" />
                                                                                    </div>
                                                                                </Button>
                                                                            :
                                                                                ""
                                                                            }
                                                                        </div>
                                                                        
                                                                        {user.roles.length > 0 && (
                                                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                                                <p className="text-xs font-medium text-gray-500 mb-2">Roller</p>
                                                                                <div className="flex flex-wrap gap-2">
                                                                                    {user.roles.map((role, index) => (
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
                                                            </div> */}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                    </CardContent>
                                </Card>
                            </li>
                        )): (
                            <p className="text-center">Herhangi bir grup bulunamadı</p>
                        )}
                        </ul>
                    </div>
                )}
            </div>
            <Dialog open={addGroupDialogOpen} onOpenChange={setAddGroupDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Grup Ekle</DialogTitle>
                        <DialogDescription>
                            Grup adını ve açıklamasını girip kaydet butonuna tıklayın.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleAddGroup)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Grup Adı</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Grup adı" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="region"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bölge</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Bölge seçiniz" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {regions.map((region) => (
                                                    <SelectItem key={region.id} value={region.id}>
                                                        {region.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="meeting_day"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Toplantı Günü</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Gün seçiniz" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'].map((day) => (
                                                    <SelectItem key={day} value={day}>
                                                        {day}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="start_time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Başlangıç Saati</FormLabel>
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
                                                            {field.value || "Başlangıç saati"}
                                                            <Clock className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-4" align="start">
                                                    <div className="flex flex-col gap-2">
                                                        <Input
                                                            type="time"
                                                            step="1"
                                                            value={field.value}
                                                            onChange={(e) => field.onChange(e.target.value)}
                                                            className="w-[160px]"
                                                        />
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="end_time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bitiş Saati</FormLabel>
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
                                                            {field.value || "Bitiş saati"}
                                                            <Clock className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-4" align="start">
                                                    <div className="flex flex-col gap-2">
                                                        <Input
                                                            type="time"
                                                            step="1"
                                                            value={field.value}
                                                            onChange={(e) => field.onChange(e.target.value)}
                                                            className="w-[160px]"
                                                        />
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {/* <FormField
                                control={form.control}
                                name="meeting_date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Toplantı Tarihi</FormLabel>
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
                                                            <span>Toplantı tarihi seçin</span>
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
                            /> */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="term_start"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Dönem Başlangıç</FormLabel>
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
                                                                <span>Dönem başlangıç tarihi</span>
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
                                    control={form.control}
                                    name="term_end"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Dönem Bitiş</FormLabel>
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
                                                                <span>Dönem bitiş tarihi</span>
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
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setAddGroupDialogOpen(false)}>
                                    İptal
                                </Button>
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
            <Dialog open={updateGroupDialogOpen} onOpenChange={setUpdateGroupDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Grup Düzenle</DialogTitle>
                            <DialogDescription>
                                <span>
                                   <span className="font-bold">{selectedGroup && selectedGroup.name}</span>  grubunun bilgilerini düzenleyebilirsiniz.
                                </span>
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...updateGroupForm}>
                            <form onSubmit={updateGroupForm.handleSubmit(handleUpdateGroup)} className="space-y-4">
                                <FormField
                                    control={updateGroupForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Grup Adı</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Grup adı" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={updateGroupForm.control}
                                    name="region"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bölge</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Bölge seçiniz" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {regions.map((region) => (
                                                        <SelectItem key={region.id} value={region.id}>
                                                            {region.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={updateGroupForm.control}
                                    name="meeting_day"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Toplantı Günü</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Gün seçiniz" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'].map((day) => (
                                                        <SelectItem key={day} value={day}>
                                                            {day}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={updateGroupForm.control}
                                        name="start_time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Başlangıç Saati</FormLabel>
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
                                                                {field.value || "Başlangıç saati"}
                                                                <Clock className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-4" align="start">
                                                        <div className="flex flex-col gap-2">
                                                            <Input
                                                                type="time"
                                                                step="1"
                                                                value={field.value}
                                                                onChange={(e) => field.onChange(e.target.value)}
                                                                className="w-[160px]"
                                                            />
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={updateGroupForm.control}
                                        name="end_time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bitiş Saati</FormLabel>
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
                                                                {field.value || "Bitiş saati"}
                                                                <Clock className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-4" align="start">
                                                        <div className="flex flex-col gap-2">
                                                            <Input
                                                                type="time"
                                                                step="1"
                                                                value={field.value}
                                                                onChange={(e) => field.onChange(e.target.value)}
                                                                className="w-[160px]"
                                                            />
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {/* <FormField
                                    control={updateGroupForm.control}
                                    name="meeting_date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Toplantı Tarihi</FormLabel>
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
                                                                <span>Toplantı tarihi seçin</span>
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
                                /> */}
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={updateGroupForm.control}
                                        name="term_start"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Dönem Başlangıç</FormLabel>
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
                                                                    <span>Dönem başlangıç tarihi</span>
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
                                        control={updateGroupForm.control}
                                        name="term_end"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Dönem Bitiş</FormLabel>
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
                                                                    <span>Dönem bitiş tarihi</span>
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
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setUpdateGroupDialogOpen(false)}>
                                        İptal
                                    </Button>
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
            <Dialog open={rolesDialogOpen} onOpenChange={setRolesDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Rol Listesi</DialogTitle>
                        <DialogDescription>
                            Rol listesi kategorilere göre gruplandırılmış şekilde görüntüleniyor.
                        </DialogDescription>
                    </DialogHeader>
                    
                    {/* Group roles by category */}
                    {(() => {
                        // Group roles by category
                        const groupedRoles = roles.reduce((acc, role) => {
                            const category = role.category || "Diğer";
                            if (!acc[category]) {
                                acc[category] = [];
                            }
                            acc[category].push(role);
                            return acc;
                        }, {});
                        
                        // Sort categories
                        const sortedCategories = Object.keys(groupedRoles).sort((a, b) => {
                            if (a === "Diğer") return 1;
                            if (b === "Diğer") return -1;
                            return a.localeCompare(b);
                        });
                        
                        return (
                            <div className="space-y-6">
                                {sortedCategories.map((category) => (
                                    <Card key={category}>
                                        <CardHeader className=" pb-2">
                                            <CardTitle className="text-lg font-medium">{category}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                                                {groupedRoles[category].map((role) => (
                                                    <div key={role.id} className="rounded-md border bg-card hover:bg-accent/10 transition-colors">
                                                        <div className="flex items-center p-3 justify-between">
                                                            <div className='flex items-center'>
                                                                <User className="h-4 w-4 mr-2 text-primary" />
                                                                <span>{role.name}</span>
                                                            </div>
                                                            <div>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger>
                                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                                            <span className="sr-only">Open menu</span>
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem onClick={() => handleUpdateRoleClick(role)} variant="default" className="cursor-pointer">
                                                                            <Edit className="mr-2 h-4 w-4" />
                                                                            Düzenle
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => handleDeleteRole(role.id)} variant="destructive" className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                                            Sil
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Düzenleme formu - sadece düzenleme modunda göster */}
                                                        {editingRoleId === role.id && (
                                                            <div className="p-3 pt-0 border-t border-gray-100">
                                                                <Form {...editRoleForm}>
                                                                    <form onSubmit={editRoleForm.handleSubmit(handleUpdateRole)} className="space-y-4">
                                                                        <FormField
                                                                            control={editRoleForm.control}
                                                                            name="name"
                                                                            render={({ field }) => (
                                                                                <FormItem>
                                                                                    <FormLabel>Rol</FormLabel>
                                                                                    <FormControl>
                                                                                        <Input placeholder="Rol adı" {...field} />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                        <FormField
                                                                            control={editRoleForm.control}
                                                                            name="category"
                                                                            render={({ field }) => (
                                                                                <FormItem>
                                                                                    <FormLabel>Kategori</FormLabel>
                                                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                        <FormControl>
                                                                                            <SelectTrigger>
                                                                                                <SelectValue placeholder="Kategori seçiniz" />
                                                                                            </SelectTrigger>
                                                                                        </FormControl>
                                                                                        <SelectContent>
                                                                                            {roleCategories.map((category) => (
                                                                                                <SelectItem key={category} value={category}>
                                                                                                    {category}
                                                                                                </SelectItem>
                                                                                            ))}
                                                                                        </SelectContent>
                                                                                    </Select>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                        <div className="flex justify-end gap-2">
                                                                            <Button 
                                                                                type="button" 
                                                                                variant="outline" 
                                                                                onClick={() => setEditingRoleId(null)}
                                                                            >
                                                                                İptal
                                                                            </Button>
                                                                            <Button 
                                                                                type="submit" 
                                                                                disabled={isLoading}
                                                                            >
                                                                                {isLoading ? "Kaydediliyor..." : "Kaydet"}
                                                                            </Button>
                                                                        </div>
                                                                    </form>
                                                                </Form>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        );
                    })()} 
                    
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setRolesDialogOpen(false)}>Kapat</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={addRolesDialogOpen} onOpenChange={setAddRolesDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rol Ekle</DialogTitle>
                        <DialogDescription>
                            Yeni bir rol ekleyin
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...addRoleForm}>
                        <form onSubmit={addRoleForm.handleSubmit(handleAddRole)} className="space-y-4">
                            <FormField
                                control={addRoleForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rol</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Rol adı" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={addRoleForm.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kategori</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Kategori seçiniz" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {roleCategories.map((category) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setAddRolesDialogOpen(false)}>
                                    İptal
                                </Button>
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
            <Dialog open={addGroupMemberDialogOpen} onOpenChange={setAddGroupMemberDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Gruba Üye Ekle</DialogTitle>
                        <DialogDescription>
                            Yeni bir üye ekleyin
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...addGroupMembersForm}>
                        <form onSubmit={addGroupMembersForm.handleSubmit(handleAddGroupMember)} className="space-y-4">
                            <FormField
                                control={addGroupMembersForm.control}
                                name="user_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kullanıcı</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            <Dialog open={updateGroupMemberDialogOpen} onOpenChange={setUpdateGroupMemberDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Grup Üyesi Düzenle</DialogTitle>
                        <DialogDescription>
                            <span className="font-bold">{selectedGroupMember && selectedGroupMember.first_name + " " + selectedGroupMember.last_name} </span>Grup üyesinin rollerini düzenleyin.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...updateGroupMemberForm}>
                        <form onSubmit={updateGroupMemberForm.handleSubmit(handleUpdateGroupMember)} className="space-y-4">
                            <div className='flex items-end justify-between'>
                                <FormField
                                    control={updateGroupMemberForm.control}
                                    name="role_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Rol Ekle</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Rol Seçiniz" />
                                                </SelectTrigger>
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
                                    disabled={isLoading}
                                    >
                                        {isLoading ? "Kaydediliyor..." : "Kaydet"}
                                    </Button>
                                </DialogFooter>
                            </div>
                        </form>
                    </Form>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                        {selectedGroupMember && Array.isArray(selectedGroupMember.roles) && selectedGroupMember.roles.map((role) => (
                            <div key={role.id} className="rounded-md border bg-card hover:bg-accent/10 transition-colors">
                                <div className="flex items-center p-3 justify-between">
                                    <div className='flex items-center'>
                                        <User className="h-4 w-4 mr-2 text-primary" />
                                        <span>{role.role} - {role.category}</span> 
                                    </div>
                                    <div>
                                        <Button disabled={isLoading} onClick={() => handleDeleteGroupMemberRole(selectedGroup.id, role.role_id, selectedGroupMember.id)} variant="destructive" >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
            <AlertDialog open={deleteGroupDialogOpen} onOpenChange={setDeleteGroupDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Grubu silmek istediğinize emin misiniz?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteGroup()}>Onayla</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog> 
        </>
    )
}

export default Groups