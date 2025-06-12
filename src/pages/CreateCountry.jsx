import { useState } from 'react';
import { useForm } from 'react-hook-form'
import { countriesService } from '../services/countries.service';
import { toast } from 'sonner';
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Form doğrulama şeması
const formSchema = z.object({
    name: z.string().min(2, {
        message: "Ülke adı giriniz.",
    }),
});

const CreateCountry = () => {
    const [isLoading, setIsLoading] = useState(false);

    // Form tanımlaması
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });
    
    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await countriesService.createCountry(data);
            toast.success('Ülke başarıyla eklendi!');
        } catch (error) {
            console.error('Ülke ekleme hatası:', error);
            toast.error('Ülke ekleme başarısız!');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="space-y-6">
                <div className="space-y-2">
                    <h3 className="text-lg font-medium">Yeni Ülke Oluştur</h3>
                    <p className="text-sm text-muted-foreground">
                        Sisteme yeni bir ülke ekleyin
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ülke Adı</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Ülke Adı" {...field} disabled={isLoading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Kaydediliyor..." : "Kaydet"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>  
    )
}

export default CreateCountry
