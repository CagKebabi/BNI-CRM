import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Separator } from "../components/ui/separator"
import { Users, UserPlus, Globe, Map, UsersRound, Home as HomeIcon } from "lucide-react"
import { useUser } from "../contexts/UserContext"

function Home() {
  const { isSuperUser } = useUser();

  const navigationCards = [
    {
      title: "Kullanıcı Listesi",
      description: "Tüm kullanıcıları görüntüleyin ve yönetin",
      icon: <Users className="h-8 w-8 text-green-500" />,
      path: "/user-list",
      color: "bg-green-200",
      showOnlyForSuperUser: true,
    },
    {
      title: "Ülkeler",
      description: "Ülke listesini görüntüleyin ve yönetin",
      icon: <Globe className="h-8 w-8 text-purple-500" />,
      path: "/country-list",
      color: "bg-purple-200",
      showOnlyForSuperUser: true,
    },
    {
      title: "Bölgeler",
      description: "Bölge listesini görüntüleyin ve yönetin",
      icon: <Map className="h-8 w-8 text-amber-500" />,
      path: "/region-list",
      color: "bg-amber-200",
      showOnlyForSuperUser: true,
    },
    {
      title: "Gruplar",
      description: "Grup listesini görüntüleyin ve yönetin",
      icon: <UsersRound className="h-8 w-8 text-rose-500" />,
      path: "/group-list",
      color: "bg-rose-200 "
    }
  ]

  const filteredNavigationCards = navigationCards.filter(card => card.showOnlyForSuperUser ? isSuperUser : true);

  return (
    <div className="container ">
      <div className="p-6 rounded-lg border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4">Hoş Geldiniz</h2>
        <p className="text-muted-foreground">BNI hesabınıza hoş geldiniz. Aşağıdaki kartları kullanarak sisteme hızlı erişim sağlayabilirsiniz.</p>
      </div>
      
      <Separator className="my-6" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNavigationCards.map((card, index) => (
          <Link to={card.path} key={index} className="no-underline text-foreground">
            <Card className={`h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 `}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">{card.title}</CardTitle>
                  <div className={`p-2 rounded-xl ${card.color}`}>
                    {card.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{card.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Görüntüle</Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home