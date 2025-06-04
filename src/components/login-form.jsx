import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ className, ...props }) {

  const handleInputChange = (e) => {

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center gap-1.5">
                <h1 className="text-2xl font-bold">Hoşgeldiniz</h1>
                <p className="text-balance text-muted-foreground">
                  BNI CRM hesabınıza giriş yapın
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
                  value=""
                  onChange={handleInputChange}
                  // disabled={isLoading}
                  // autoComplete="email"
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
                  value=""
                  onChange={handleInputChange}
                  //disabled={isLoading}
                  // autoComplete="current-password"
                  autoComplete="off"
                />
              </div>
              <Button 
              type="submit" 
              className="w-full" 
              //disabled={isLoading}
              >
                {/*{isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}*/}
                Giriş Yap
              </Button>
              {/* <div className="text-center text-sm">
                Bir hesabınız yok mu?{" "}
                <Link to="/register" className="underline underline-offset-4">
                  Kayıt Ol
                </Link>
              </div> */}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
