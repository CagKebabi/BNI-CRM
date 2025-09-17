import { useEffect, useState } from 'react';
import { regionsService } from '../services/regions.service';
import { countriesService } from '../services/countries.service';
import { usersService } from '../services/users.service';
import { MoreHorizontal, Edit, Trash2, MapPin, User, Earth, Loader2 } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '../components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '../components/ui/dialog';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from '../components/ui/input';
import { Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../components/ui/form";
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

const Regions = () => {
    const [regions, setRegions] = useState([]);
    const [countries, setCountries] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [addRegionDialogOpen, setAddRegionDialogOpen] = useState(false);
    const [deleteRegionDialogOpen, setDeleteRegionDialogOpen] = useState(false);
    const [updateRegionDialogOpen, setUpdateRegionDialogOpen] = useState(false);
    const [currentRegion, setCurrentRegion] = useState(null);

    const fetchRegions = async () => {
        try {
            const response = await regionsService.getRegions();
            console.log('API Response:', response);
            
            // Handle different response structures
            let regionsData = [];
            if (response && Array.isArray(response)) {
                regionsData = response;
            } else if (response && Array.isArray(response.data)) {
                regionsData = response.data;
            } else if (response && response.data) {
                // If it's a single object, wrap it in an array
                regionsData = [response.data];
            } else if (response) {
                // If it's a single object directly in response
                regionsData = [response];
            }
            
            console.log('Bölge listesi alındı:', regionsData);
            setRegions(regionsData);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching countries:', error);
            toast.error('Ülke listesi alınamadı');
            setIsLoading(false);
        }
    };

    const fetchCountries = async () => {
        try {
            const response = await countriesService.getCountries();
            console.log('API Response:', response);
            
            // Handle different response structures
            let countriesData = [];
            if (response && Array.isArray(response)) {
                countriesData = response;
            } else if (response && Array.isArray(response.data)) {
                countriesData = response.data;
            } else if (response && response.data) {
                // If it's a single object, wrap it in an array
                countriesData = [response.data];
            } else if (response) {
                // If it's a single object directly in response
                countriesData = [response];
            }
            
            console.log('Ülke listesi alındı:', countriesData);
            setCountries(countriesData);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching countries:', error);
            toast.error('Ülke listesi alınamadı');
            setIsLoading(false);
        }
    };

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
    
    useEffect(() => {
        fetchRegions();
        fetchCountries();
        fetchUsers();
    }, []);

    // Form doğrulama şeması
    const formSchema = z.object({
        name: z.string().min(2, {
        message: "Bölge adı en az 2 karakter olmalıdır.",
        }),
        country: z.string({
            required_error: "Lütfen bir ülke seçiniz",
        }).refine((value) => countries.some(country => country.id === value), {
            message: "Lütfen geçerli bir ülke seçiniz",
        }),
        exc_director: z.string({
            required_error: "Lütfen bir yetkili seçiniz",
        }).refine((value) => users.some(user => user.id === value), {
            message: "Lütfen geçerli bir yetkili seçiniz",
        }),
    });

    // Add Region Form tanımlaması
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            country: "",
            exc_director: "",
        },
    });

    const updateRegionForm = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            country: "",
            exc_director: "",
        },
    });

    // Add Region
    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            console.log('Form değerleri:', data);
            const response = await regionsService.createRegion(
                data
            );
            console.log('Bölge oluşturuldu:', response);
            fetchRegions();
            toast.success('Bölge başarıyla eklendi');
        } catch (error) {
            console.error("Bölge oluşturma hatası:", error);
            toast.error('Bölge ekleme hatası');
        } finally {
            setIsLoading(false);
            setAddRegionDialogOpen(false);
            form.reset({
                name: "",
                country: "",
                exc_director: "",
            });
        }
    };

    // Update Region
    const handleUpdateClick = (region) => {
        setCurrentRegion(region);
        // Form değerlerini güncelle
        console.log('Selected region:', region);
        
        // Form değerlerini sıfırla ve yeni değerleri ata
        updateRegionForm.reset();
        
        // Her bir form alanını ayrı ayrı güncelle
        updateRegionForm.setValue('name', region.name);
        updateRegionForm.setValue('country', region.country);
        updateRegionForm.setValue('exc_director', region.exc_director);
        
        setUpdateRegionDialogOpen(true);
    };

    const handleUpdateRegion = async (data) => {
        if (!currentRegion) return;
        
        setIsLoading(true);
        try {
            console.log('Güncellenen bölge:', data);
            
            const response = await regionsService.updateRegion(currentRegion.id, data);
            console.log('Bölge güncellendi:', response);
            fetchRegions();
            toast.success('Bölge başarıyla güncellendi');
        } catch (error) {
            console.error("Bölge güncelleme hatası:", error);
            toast.error('Bölge güncelleme hatası');
        } finally {
            setIsLoading(false);
            setUpdateRegionDialogOpen(false);
            setCurrentRegion(null);
            updateRegionForm.reset({
                name: "",
                country: "",
                exc_director: ""
            });
        }
    };

    // Delete Region Click
    const handleDeleteRegionClick = (region) => {
        setCurrentRegion(region);
        setDeleteRegionDialogOpen(true);
    };

    // Delete Region
    const handleDeleteRegion = async () => {
        setIsLoading(true);
        try {
            await regionsService.deleteRegion(currentRegion.id);
            toast.success('Bölge başarıyla silindi');
            setIsLoading(false);
            fetchRegions(); // Refresh the list
        } catch (error) {
            console.error('Error deleting region:', error);
            toast.error('Bölge silme hatası');
        } finally {
            setIsLoading(false);
            setDeleteRegionDialogOpen(false);
            setCurrentRegion(null);
        }
    };
    
    return (
        <>
            <div className="max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold mb-6">Bölgeler</h1>
                    <Button variant="default" size="icon" onClick={() => setAddRegionDialogOpen(true)}>
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ): (
                    <div>
                        {regions && regions.length > 0 ? (
                            <ul className="space-y-2">
                                {regions.map((region) => {
                                    const country = countries.find(c => c.id === region.country);
                                    const director = users.find(u => u.id === region.exc_director);
                                    
                                    return (
                                        <li key={region.id}>
                                            <Card key={region.id} className="hover:shadow-lg transition-shadow duration-200">
                                                <CardHeader className="pb-2 flex justify-between">
                                                    <div className="flex justify-between items-center">
                                                        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                                            <div className="p-2 rounded-lg bg-red-50 text-red-700">
                                                                <MapPin className="h-5 w-5" />
                                                            </div>
                                                            {region.name}
                                                        </CardTitle>
                                                    </div>
                                                    <div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <MoreHorizontal className="h-5 w-5" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => handleUpdateClick(region)} className="cursor-pointer">
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    <span>Düzenle</span>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleDeleteRegionClick(region)} variant="destructive" className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    <span>Sil</span>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <div className="p-1.5 rounded-md bg-green-50">
                                                            <Earth className="h-4 w-4 text-green-600" />
                                                        </div>
                                                        <span className="font-medium">{country ? country.name : 'Ülke belirtilmemiş'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <div className="p-1.5 rounded-md bg-blue-50">
                                                            <User className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        <span className="font-medium">{director ? `${director.first_name} ${director.last_name}` : 'Yönetici belirtilmemiş'}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p>Herhangi bir bölge bulunamadı.</p>
                        )}
                    </div>
                )}
            </div>
            <Dialog open={addRegionDialogOpen} onOpenChange={setAddRegionDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Bölge Ekle</DialogTitle>
                        <DialogDescription>
                            Bölge adını düzenleyip kaydet butonuna tıklayın.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid gap-4 py-4">
                                <div className="flex justify-between">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Bölge Adı
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Bölge adını giriniz"/>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ülke</FormLabel>
                                                <Select
                                                    disabled={isLoading}
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Ülke seçiniz" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                {countries.map((country) => (
                                                    <SelectItem key={country.id} value={country.id}>
                                                        {country.name}
                                                    </SelectItem>
                                                ))}
                                                </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <FormField
                                        control={form.control}
                                        name="exc_director"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Yönetici</FormLabel>
                                                
                                                    <Select
                                                    disabled={isLoading}
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Yönetici seçiniz" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {users.map((user) => (
                                                            <SelectItem key={user.id} value={user.id}>
                                                                {user.first_name} {user.last_name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setUpdateRegionDialogOpen(false)}>
                                    İptal
                                </Button>
                                <Button 
                                type="submit"
                                disabled={isLoading}
                                >
                                    {isLoading ? "Kaydediliyor..." : "Kaydet"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
            <Dialog open={updateRegionDialogOpen} onOpenChange={setUpdateRegionDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Bölge Düzenle</DialogTitle>
                        <DialogDescription>
                            Bölge bilgilerini düzenleyip güncelle butonuna tıklayın.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...updateRegionForm}>
                        <form onSubmit={updateRegionForm.handleSubmit(handleUpdateRegion)} className="space-y-8">
                            <div className="grid gap-4 py-4">
                                <div className="flex justify-between">
                                    <FormField
                                        control={updateRegionForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Bölge Adı
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Bölge adını giriniz"/>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <FormField
                                        control={updateRegionForm.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ülke</FormLabel>
                                                <Select
                                                    disabled={isLoading}
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Ülke seçiniz" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                {countries.map((country) => (
                                                    <SelectItem key={country.id} value={country.id}>
                                                        {country.name}
                                                    </SelectItem>
                                                ))}
                                                </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <FormField
                                        control={updateRegionForm.control}
                                        name="exc_director"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Yönetici</FormLabel>
                                                
                                                    <Select
                                                    disabled={isLoading}
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Yönetici seçiniz" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {users.map((user) => (
                                                            <SelectItem key={user.id} value={user.id}>
                                                                {user.first_name} {user.last_name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setAddRegionDialogOpen(false)}>
                                    İptal
                                </Button>
                                <Button 
                                disabled={isLoading}
                                >
                                    {isLoading ? "Kaydediliyor..." : "Kaydet"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>        
            </Dialog>
            <AlertDialog open={deleteRegionDialogOpen} onOpenChange={setDeleteRegionDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bölgeyi silmek istediğinize emin misiniz?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteRegion()}>Onayla</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>  
        </>
    )
}

export default Regions