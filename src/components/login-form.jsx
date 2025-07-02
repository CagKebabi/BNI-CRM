import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "../services/auth.service";
import { toast } from "sonner";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "../contexts/UserContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";

// Form doğrulama şeması
const loginFormSchema = z.object({
    email: z.string().email({
        message: "Geçerli bir email adresi giriniz.",
    }),
    password: z.string().min(8, {
        message: "Şifre en az 8 karakter olmalıdır.",
    }),
});

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { isSuperUser, setIsSuperUser } = useUser();
  const { userId, setUserId } = useUser();

  const loginForm = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    },
    mode: "onSubmit",
  });

  const handleSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await authService.login(data.email, data.password);
      console.log("Login response:", response);

      if (response &&response.access && response.refresh) {
        localStorage.setItem('access', response.access);
        localStorage.setItem('refresh', response.refresh);
        toast.success("Başarıyla giriş yapıldı");
        setIsSuperUser(response.is_superuser);
        setUserId(response.user_id);
        navigate("/");
      } else {
        //throw new Error("Giriş yapılamadı", error);
        toast.error("Giriş yapılamadı. Lütfen bilgilerinizi kontrol ediniz.");
      }

    } catch (error) {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      console.error('Login error:', error || "Giriş yapılamadı. Lütfen bilgilerinizi kontrol ediniz.");
      toast.error("Giriş yapılamadı. Lütfen bilgilerinizi kontrol ediniz.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0">
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(handleSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col items-center text-center gap-1.5">
              <h1 className="text-2xl font-bold">Hoşgeldiniz</h1>
              <p className="text-balance text-muted-foreground">
                BNI hesabınıza giriş yapın
              </p>
            </div>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        E-Posta
                      </FormLabel>
                      <FormControl>
                        <Input type="email" {...field} placeholder="E-Posta"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Şifre
                      </FormLabel>
                      <FormControl>
                        <Input type="password" {...field} placeholder="Şifre"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
              <Button 
              //onClick={handleSaveEdit} 
              //type="submit"
              disabled={isLoading}
              >
                {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </Button>
          </form>
        </Form>
          {/* <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center gap-1.5">
                <h1 className="text-2xl font-bold">Hoşgeldiniz</h1>
                <p className="text-balance text-muted-foreground">
                  BNI hesabınıza giriş yapın
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  autoComplete="off"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Şifre</Label>
                </div>
                <Input 
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  autoComplete="off"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </Button>
            </div>
          </form> */}
        </CardContent>
      </Card>
    </div>
  );
}
