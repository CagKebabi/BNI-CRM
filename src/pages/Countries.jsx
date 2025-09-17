import { useEffect, useState } from 'react';
import { countriesService } from '../services/countries.service';
import { MoreHorizontal, Edit, Trash2, Loader2 } from 'lucide-react';
import * as z from 'zod'
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Plus } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
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

const Countries = () => {
    const [countries, setCountries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentCountry, setCurrentCountry] = useState(null);
    const [editCountryName, setEditCountryName] = useState('');
    const [addCountryDialogOpen, setAddCountryDialogOpen] = useState(false);
    const [deleteCountryDialogOpen, setDeleteCountryDialogOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);
    
    // Form doğrulama şeması
    const formSchema = z.object({
        name: z.string().min(2, {
        message: "Ülke adı en az 2 karakter olmalıdır.",
        }),
    });
    
    // Add Region Form tanımlaması
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    }); 
    
    const handleUpdateCountry = (country) => {
        console.log('Edit country with ID:', country.id);
        setCurrentCountry(country);
        setEditCountryName(country.name);
        setEditDialogOpen(true);
    };
    
    const handleSaveEdit = async () => {
        setIsLoading(true);
        try {
            if (!currentCountry || !editCountryName.trim()) return;
            
            await countriesService.updateCountry(currentCountry.id, { name: editCountryName });
            toast.success('Ülke başarıyla güncellendi');
            setIsLoading(false);
            setEditDialogOpen(false);
            fetchCountries(); // Refresh the list
        } catch (error) {
            console.error('Error updating country:', error);
            toast.error('Ülke güncelleme hatası');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCountryClick = (country) => {
        setSelectedCountry(country);
        setDeleteCountryDialogOpen(true);
    };
    
    const handleDeleteCountry = async() => {
        console.log('Delete country with ID:', selectedCountry.id);
        // Implement delete functionality here
        try {
            await countriesService.deleteCountry(selectedCountry.id);
            fetchCountries();
            toast.success('Ülke başarıyla silindi');
        } catch (error) {
            console.error('Error deleting country:', error);
            toast.error('Ülke silme hatası');
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

    const handleAddCountry = async () => {
        setIsLoading(true);
        try {
            if (!form.getValues().name.trim()) return;
            
            await countriesService.createCountry({ name: form.getValues().name });
            toast.success('Ülke başarıyla eklendi');
            setIsLoading(false);
            setAddCountryDialogOpen(false);
            fetchCountries(); // Refresh the list
        } catch (error) {
            console.error('Error adding country:', error);
            toast.error('Ülke ekleme hatası');
        } finally {
            setIsLoading(false);
            form.reset();
        }
    };
    
    useEffect(() => {
        fetchCountries();
    }, []);
    


    return (
        <>
            <div className="max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold mb-6">Ülkeler</h1>
                    <Button variant="default" size="icon" onClick={() => setAddCountryDialogOpen(true)}>
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ): (
                    <div>
                        {countries && countries.length > 0 ? (
                            <ul className="space-y-2">
                                {countries.map((country) => (
                                    <li key={country.id} className="p-3 border rounded hover:bg-gray-50 flex justify-between items-center">
                                        <span>{country.name}</span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleUpdateCountry(country)} className="cursor-pointer">
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    <span>Düzenle</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDeleteCountryClick(country)} variant="destructive" className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    <span>Sil</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Herhangi bir ülke bulunamadı.</p>
                        )}
                    </div>
                )}
            </div>
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Ülke Düzenle</DialogTitle>
                        <DialogDescription>
                            Ülke adını düzenleyip kaydet butonuna tıklayın.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Ülke Adı
                            </Label>
                            <Input
                                id="name"
                                value={editCountryName}
                                onChange={(e) => setEditCountryName(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                            İptal
                        </Button>
                        <Button 
                        onClick={handleSaveEdit} 
                        disabled={isLoading}
                        >
                            {isLoading ? "Kaydediliyor..." : "Kaydet"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={addCountryDialogOpen} onOpenChange={setAddCountryDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Ülke Ekle</DialogTitle>
                        <DialogDescription>
                            Ülke adını düzenleyip kaydet butonuna tıklayın.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleAddCountry)} className="space-y-8">
                            <div className="grid gap-4 py-4">
                                <div className="flex justify-between">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Ülke Adı
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Ülke adını giriniz"/>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
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
            <AlertDialog open={deleteCountryDialogOpen} onOpenChange={setDeleteCountryDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ülkeyi silmek istediğinize emin misiniz?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteCountry()}>Onayla</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>  
        </>
    )
}

export default Countries