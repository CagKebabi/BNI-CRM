import React, { useState, useEffect } from 'react';
import * as z from "zod";
import { Button } from '@/components/ui/button';
import { Plus, Loader2, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {usersService} from '../services/users.service';
import { groupsService } from '../services/groups.service';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from 'sonner';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
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
} from '../components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Form doğrulama şeması
const formSchema = z.object({
    email: z.string().email({
        message: "Geçerli bir email adresi giriniz.",
    }),
    password: z.string().min(8, {
        message: "Şifre en az 8 karakter olmalıdır.",
    }),
    password2: z.string().min(8, {
        message: "Şifre tekrarı en az 8 karakter olmalıdır.",
    }),
    first_name: z.string().min(2, {
        message: "Ad en az 2 karakter olmalıdır.",
    }),
    last_name: z.string().min(2, {
        message: "Soyad en az 2 karakter olmalıdır.",
    }),
    gsm: z.string().min(10, {
        message: "GSM en az 10 karakter olmalıdır.",
    }),
    group_id: z.string(),
});

const Users = () => {
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");

    // Form tanımlaması
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
        email: "",
        password: "",
        password2: "",
        first_name: "",
        last_name: "",
        gsm: "",
        group_id: "", //isteğe bağlı
        },
    });

    const fetchUsers = async () => {
        try {
            const response = await usersService.getUsers();
            console.log('API Response:', response);
            
            // Handle different response structures
            let usersData = [];
            if (response && Array.isArray(response)) {
                usersData = response;
            } else if (response && Array.isArray(response.data)) {
                usersData = response.data;
            } else if (response && response.data) {
                // If it's a single object, wrap it in an array
                usersData = [response.data];
            } else if (response) {
                // If it's a single object directly in response
                usersData = [response];
            }
            
            console.log('Kullanıcı listesi alındı:', usersData);
            setUsers(usersData);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching countries:', error);
            toast.error('Kullanıcı listesi alınamadı');
            setIsLoading(false);
        }
    };

    const fetchGroups = async () => {
        try {
            const response = await groupsService.getGroups();
            console.log('API Response:', response);
            
            // Handle different response structures
            let groupsData = [];
            if (response && Array.isArray(response)) {
                groupsData = response;
            } else if (response && Array.isArray(response.data)) {
                groupsData = response.data;
            } else if (response && response.data) {
                // If it's a single object, wrap it in an array
                groupsData = [response.data];
            } else if (response) {
                // If it's a single object directly in response
                groupsData = [response];
            }
            
            console.log('Grup listesi alındı:', groupsData);
            setGroups(groupsData);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching countries:', error);
            toast.error('Grup listesi alınamadı');
            setIsLoading(false);
        }
    };
    
    useEffect( () => {
        fetchUsers();
        fetchGroups();
    }, []);

    // Dialog açıldığında/kapandığında form değerlerini sıfırla
    useEffect(() => {
        if (!addUserDialogOpen) {
            form.reset({
                email: "",
                password: "",
                password2: "",
                first_name: "",
                last_name: "",
                gsm: "",
                group_id: "",
            });
        }
    }, [addUserDialogOpen]);

    const columns = [
        {
            accessorKey: "first_name",
            header: "Ad",
            cell: ({ row }) => (
                <div>{row.original.first_name || "Belirtilmemiş"}</div>
            ),
        },
        {
            accessorKey: "last_name",
            header: "Soyad",
            cell: ({ row }) => (
                <div>{row.original.last_name || "Belirtilmemiş"}</div>
            ),
        },
        {
            accessorKey: "email",
            header: "E-posta",
            cell: ({ row }) => <div>{row.getValue("email")}</div>,
        },
        {
            accessorKey: "gsm",
            header: "Telefon",
            cell: ({ row }) => (
                <div>{row.original.gsm || "Belirtilmemiş"}</div>
            ),
        },
        {
            accessorKey: "is_active",
            header: "Durum",
            cell: ({ row }) => (
                <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block 
                    ${row.original.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {row.original.is_active ? "Aktif" : "Pasif"}
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
                                onClick={() => handleUpdateClick(row.original)}
                                className="cursor-pointer"
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Düzenle</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteUser(row.original.id)} variant="destructive" className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Sil</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
    });

    // Form gönderme işlemi
    const handleAddUser = async (data) => {
        setIsLoading(true);
        try {
            console.log('Form değerleri:', data);
            const response = await usersService.createUser(
                data
            );
            console.log('Kullanıcı oluşturuldu:', response);
            fetchUsers();
            toast.success('Kullanıcı başarıyla eklendi');
        } catch (error) {
            console.error("Kullanıcı oluşturma hatası:", error);
            toast.error('Kullanıcı ekleme hatası');
        } finally {
            setIsLoading(false);
            setAddUserDialogOpen(false);
            form.reset({
                email: "",
                password: "",
                password2: "",
                first_name: "",
                last_name: "",
                gsm: "",
                group_id: "",
            });
        }
    }

    const handleUpdateClick = (user) => {
        console.log('Güncellenecek kullanıcı:', user);
        // TODO: Güncelleme modalını aç
    };

    const handleDeleteUser = async (userId) => {
        setIsLoading(true);
        console.log('Silenecek kullanıcı ID:', userId);
        
        try {
            await usersService.deleteUser(userId);
            toast.success('Kullanıcı başarıyla silindi');
            fetchUsers(); // Listeyi yenile
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Kullanıcı silinirken bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <div className="max-w-4xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold mb-6">Kullanıcılar</h1>
                    <Button variant="default" size="icon" onClick={() => setAddUserDialogOpen(true)}>
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>  
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Input
                                placeholder="Kullanıcı ara..."
                                value={globalFilter ?? ""}
                                onChange={(event) => setGlobalFilter(event.target.value)}
                                className="max-w-sm"
                            />
                        </div>
                        
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    {table.getHeaderGroups().map((headerGroup) => (
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
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
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
                                                colSpan={columns.length}
                                                className="h-24 text-center"
                                            >
                                                Kullanıcı bulunamadı.
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
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Önceki
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Sonraki
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Kullanıcı Ekle</DialogTitle>
                        <DialogDescription>
                            Kullanıcı adını düzenleyip kaydet butonuna tıklayın.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleAddUser)} className="space-y-6" autoComplete="off">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="email" 
                                                placeholder="email@example.com" 
                                                autoComplete="off" 
                                                autoSave="off"
                                                {...field} 
                                                disabled={isLoading} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="first_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ad</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ad" {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="last_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Soyad</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Soyad" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gsm"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>GSM</FormLabel>
                                        <FormControl>
                                            <Input placeholder="GSM" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Şifre</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="password" 
                                                placeholder="Şifre" 
                                                autoComplete="new-password" 
                                                autoSave="off"
                                                {...field} 
                                                disabled={isLoading} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Şifre Tekrar</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="password" 
                                                placeholder="Şifre Tekrar" 
                                                autoComplete="new-password" 
                                                autoSave="off"
                                                {...field} 
                                                disabled={isLoading} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="group_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Grup</FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Grup seçiniz" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {groups.map((group) => (
                                                    <SelectItem key={group.id} value={group.id}>
                                                        {group.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                    
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Kaydediliyor..." : "Kaydet"}
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Users;