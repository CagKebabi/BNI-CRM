import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
// import DashboardLayout from "./layout/DashboardLayout"
import Login from "./pages/Login";
import DashboardNavbar from "./layout/dashboarNavbar";
import ProtectedRoutes from "./ProtectedRoutes";
import CreateUser from "./pages/CreateUser";
import Countries from "./pages/Countries";
import Regions from "./pages/Regions";
import Groups from "./pages/Groups";
import Users from "./pages/Users";
import Home from "./pages/Home";

function App() {
  const router = createBrowserRouter([
    {
      element: <ProtectedRoutes />,
      children: [
        {
          path: "/",
          element: <DashboardNavbar />,
          children: [
            {
              index: true,
              element: <Home />,
            },
            {
              path: "create-user",
              element: <CreateUser />,
            },
            {
              path: "country-list",
              element: <Countries />,
            },
            {
              path: "region-list",
              element: <Regions />,
            },
            {
              path: "group-list",
              element: <Groups />,
            },
            {
              path: "user-list",
              element: <Users />,
            },
          ],
        }
      ],
      
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "*",
      element: <Navigate to="/login" replace />,
    }
  ]);

  return <RouterProvider router={router} />
  // (
  //   // <>
  //   // <RouterProvider router={router} />
  //   //   {/* <DashboardNavbar />
  //   //   <div>TEST</div> */}
  //   // </>
  // )
}

export default App
