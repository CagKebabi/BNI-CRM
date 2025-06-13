import { useEffect, useState } from 'react';
import { countriesService } from '../services/countries.service';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
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
    DialogTrigger,
    DialogClose
} from '../components/ui/dialog';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';

const Countries = () => {
    const [countries, setCountries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditFormLoading, setIsEditFormLoading] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentCountry, setCurrentCountry] = useState(null);
    const [editCountryName, setEditCountryName] = useState('');
    
    const handleEditCountry = (country) => {
        console.log('Edit country with ID:', country.id);
        setCurrentCountry(country);
        setEditCountryName(country.name);
        setEditDialogOpen(true);
    };
    
    const handleSaveEdit = async () => {
        setIsEditFormLoading(true);
        try {
            if (!currentCountry || !editCountryName.trim()) return;
            
            await countriesService.updateCountry(currentCountry.id, { name: editCountryName });
            toast.success('Ülke başarıyla güncellendi');
            setIsEditFormLoading(false);
            setEditDialogOpen(false);
            fetchCountries(); // Refresh the list
        } catch (error) {
            console.error('Error updating country:', error);
            toast.error('Ülke güncelleme hatası');
        } finally {
            setIsEditFormLoading(false);
        }
    };
    
    const handleDeleteCountry = async(countryId) => {
        console.log('Delete country with ID:', countryId);
        // Implement delete functionality here
        try {
            await countriesService.deleteCountry(countryId);
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
    
    useEffect(() => {
        fetchCountries();
    }, []);
    


    return (
        <>
            <div className="max-w-4xl p-6">
                <h1 className="text-2xl font-bold mb-6">Ülkeler</h1>
                {isLoading ? (
                    <p>Yükleniyor...</p>
                ): (
                    <div>
                        {countries && countries.length > 0 ? (
                            <ul className="space-y-2">
                                {countries.map((country) => (
                                    <li key={country.id} className="p-3 border rounded hover:bg-gray-50 flex justify-between items-center">
                                        <span>{country.name}</span>
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
                        disabled={isEditFormLoading}
                        >
                            {isEditFormLoading ? "Kaydediliyor..." : "Kaydet"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Countries