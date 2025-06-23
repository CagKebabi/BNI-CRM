import { useEffect, useState } from 'react'
import { groupsService } from '../services/groups.service';
import { regionsService } from '../services/regions.service';
import { rolesService } from '../services/roles.service';
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

function Groups() {
    const [groups, setGroups] = useState([]);
    const [regions, setRegions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [addGroupDialogOpen, setAddGroupDialogOpen] = useState(false);
    const [updateGroupDialogOpen, setUpdateGroupDialogOpen] = useState(false);
    const [rolesDialogOpen, setRolesDialogOpen] = useState(false);
    const [addRolesDialogOpen, setAddRolesDialogOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    
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
        meeting_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
            message: "Geçerli bir toplantı tarihi giriniz (YYYY-AA-GG).",
        }),
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
            message: "Rol kategorisi en az 2 karakter olmalıdır.",
        }),
    })
    
    // Add Group Form tanımlaması
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            region: "",
            meeting_day: "",
            start_time: "08:30:00",
            end_time: "10:30:00",
            meeting_date: "",
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
            meeting_date: "",
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
    
    useEffect(() => {
        fetchGroups();
        fetchRegions();
        fetchRoles();
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
    
    const handleAddGroup = async (data) => {
        setIsLoading(true);
        try {
            if (!data.name.trim()) return;
            
            await groupsService.createGroup(data);
            toast.success('Grup başarıyla eklendi');
            setIsLoading(false);
            setAddGroupDialogOpen(false);
            fetchGroups(); // Refresh the list
        } catch (error) {
            console.error('Error adding group:', error);
            toast.error('Grup ekleme hatası');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateGroup = async (data) => {
        setIsLoading(true);
        try {
            if (!data.name.trim()) return;
            
            await groupsService.updateGroup(selectedGroup.id, data);
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
    
    const handleDeleteGroup = async (id) => {
        setIsLoading(true);
        try {
            await groupsService.deleteGroup(id);
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
    const handleAddRole = async (data) => {
        setIsLoading(true);
        try {
            console.log(data);
            if (!data.name.trim()) return;
            
            await rolesService.createRole(data);
            toast.success('Rol başarıyla eklendi');
            setIsLoading(false);
            setAddRolesDialogOpen(false);
            fetchRoles(); // Refresh the list
        } catch (error) {
            console.error('Error adding role:', error);
            toast.error('Rol ekleme hatası');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold mb-6">Gruplar</h1>
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
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ): (
                    <div>
                        <ul className="space-y-2">
                        {groups.map((group) => (
                            <li key={group.id}>
                                <Card className="hover:shadow-lg transition-shadow duration-200">
                                    <CardHeader className="pb-2 flex justify-between">
                                        <div className="flex flex-col gap-2">
                                            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                                <div className="p-2 rounded-lg bg-blue-50">
                                                    <Users className="h-5 w-5 text-blue-600" />
                                                </div>
                                                {group.name}
                                            </CardTitle>
                                            <CardDescription className="mt-0">
                                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-sm text-red-700 w-fit">
                                                    <MapPin className="h-4 w-4" />
                                                    <span className="font-medium">{group.region_name}</span>
                                                </div>
                                            </CardDescription>
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
                                                    <DropdownMenuItem onClick={() => handleUpdateClick(group)} variant="default" className="cursor-pointer">
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Düzenle
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDeleteGroup(group.id)} variant="destructive" className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Sil
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
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
                                            {/* Toplantı Tarihi ve Dönem */}
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="p-1.5 rounded-md bg-orange-50">
                                                        <CalendarDays className="h-4 w-4 text-orange-600" />
                                                    </div>
                                                    <span className="font-medium">Toplantı Tarihi</span>
                                                </div>
                                                <p className="text-sm pl-9">{group.meeting_date}</p>
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
                                            <div className="pt-4 border-t border-gray-100">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="p-1.5 rounded-md bg-indigo-50">
                                                        <User className="h-4 w-4 text-indigo-600" />
                                                    </div>
                                                    <span className="font-medium text-sm">
                                                        Grup Üyeleri ({group.users.length})
                                                    </span>
                                                </div>
                                                
                                                <div className="flex flex-wrap gap-2">
                                                    {group.users.map((user, index) => (
                                                        <Tooltip key={user.id}>
                                                            <TooltipTrigger>
                                                                <div
                                                                    className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 transition-colors text-indigo-700 px-2 py-1.5 rounded-full text-xs"
                                                                >
                                                                    <div className="w-5 h-5 bg-indigo-200 rounded-full flex items-center justify-center text-xs font-medium">
                                                                        {user.first_name.charAt(0).toUpperCase() + user.last_name.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <span className="max-w-[100px] truncate font-medium">
                                                                        {user.first_name} {user.last_name}
                                                                    </span>
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p className="text-sm font-medium">{user.first_name} {user.last_name}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    ))}
                                                </div>
                                            </div>
                                    </CardContent>
                                </Card>
                            </li>
                        ))}
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
                            <FormField
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
                            />
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
                            <DialogTitle>Grup Ekle</DialogTitle>
                            <DialogDescription>
                                Grup adını ve açıklamasını girip kaydet butonuna tıklayın.
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
                                <FormField
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
                                />
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
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {groupedRoles[category].map((role) => (
                                                    <div 
                                                        key={role.id} 
                                                        className="flex items-center p-3 rounded-md border bg-card hover:bg-accent/10 transition-colors"
                                                    >
                                                        <User className="h-4 w-4 mr-2 text-primary" />
                                                        <span>{role.name}</span>
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
                        <DialogTitle>Roller</DialogTitle>
                        <DialogDescription>
                            Roller listesini görüntüleyin ve yönetin
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
                                            <Input placeholder="Grup adı" {...field} />
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
                                        <FormControl>
                                            <Input placeholder="Grup adı" {...field} />
                                        </FormControl>
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
        </>
    )
}

export default Groups