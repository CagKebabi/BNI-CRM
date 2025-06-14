import { useEffect, useState } from 'react';
import { regionsService } from '../services/regions.service';
import { countriesService } from '../services/countries.service';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
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
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../components/ui/form";

const Regions = () => {
    const [regions, setRegions] = useState([]);
    const [countries, setCountries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditFormLoading, setIsEditFormLoading] = useState(false);
    const [addRegionDialogOpen, setAddRegionDialogOpen] = useState(false);
    const [currentRegion, setCurrentRegion] = useState(null);
    const [editCountryName, setEditCountryName] = useState('');  
    
    // const handleEditCountry = (country) => {
    //     console.log('Edit country with ID:', country.id);
    //     setCurrentCountry(country);
    //     setEditCountryName(country.name);
    //     setEditDialogOpen(true);
    // };
    
    // const handleSaveEdit = async () => {
    //     setIsEditFormLoading(true);
    //     try {
    //         if (!currentCountry || !editCountryName.trim()) return;
            
    //         await countriesService.updateCountry(currentCountry.id, { name: editCountryName });
    //         toast.success('Ülke başarıyla güncellendi');
    //         setIsEditFormLoading(false);
    //         setEditDialogOpen(false);
    //         fetchCountries(); // Refresh the list
    //     } catch (error) {
    //         console.error('Error updating country:', error);
    //         toast.error('Ülke güncelleme hatası');
    //     } finally {
    //         setIsEditFormLoading(false);
    //     }
    // };
    
    // const handleDeleteCountry = async(countryId) => {
    //     console.log('Delete country with ID:', countryId);
    //     // Implement delete functionality here
    //     try {
    //         await countriesService.deleteCountry(countryId);
    //         fetchCountries();
    //         toast.success('Ülke başarıyla silindi');
    //     } catch (error) {
    //         console.error('Error deleting country:', error);
    //         toast.error('Ülke silme hatası');
    //     }
    // };

    const fetchRegions = async () => {
        try {
            const response = await regionsService.getRegions();
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
            
            console.log('Processed countries data:', countriesData);
            setRegions(countriesData);
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
            
            console.log('Processed countries data:', countriesData);
            setCountries(countriesData);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching countries:', error);
            toast.error('Ülke listesi alınamadı');
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchRegions();
        fetchCountries();
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
        })
    });

    // Add Region Form tanımlaması
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            country: "",
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
            form.reset();
        }
    };
    
    return (
        <>
            <div className="max-w-4xl p-6">
                <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold mb-6">Bölgeler</h1>
                <Button variant="default" size="icon" onClick={() => setAddRegionDialogOpen(true)}>
                    <Plus className="h-5 w-5" />
                </Button>
                </div>
                {isLoading ? (
                    <p>Yükleniyor...</p>
                ): (
                    <div>
                        {regions && regions.length > 0 ? (
                            <ul className="space-y-2">
                                {regions.map((region) => (
                                    <li key={region.id} className="p-3 border rounded hover:bg-gray-50 flex justify-between items-center">
                                        <span>{region.name}</span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEditCountry(country)} className="cursor-pointer">
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    <span>Düzenle</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDeleteCountry(country.id)} variant="destructive" className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    <span>Sil</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </li>
                                ))}
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
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setAddRegionDialogOpen(false)}>
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

export default Regions