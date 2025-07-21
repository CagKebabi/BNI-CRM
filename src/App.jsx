import { createBrowserRouter, createHashRouter, RouterProvider, Navigate } from "react-router-dom"
// import DashboardLayout from "./layout/DashboardLayout"
import Login from "./pages/Login";
import DashboardNavbar from "./layout/dashboarNavbar";
import ProtectedRoutes from "./ProtectedRoutes";
import CreateUser from "./pages/CreateUser";
import Countries from "./pages/Countries";
import Regions from "./pages/Regions";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import Users from "./pages/Users";
import Home from "./pages/Home";
import PagePrint from "./pages/PagePrint";
import { UserProvider } from "./contexts/UserContext";
import { GroupProvider } from "./contexts/GroupContext";

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
              children: [
                {
                  index: true,
                  element: <Groups />,
                },
                {
                  path: "group-detail",
                  element: <GroupDetail />,
                }
              ],
            },
            {
              path: "user-list",
              element: <Users />,
            },
            {
              path: "page-print",
              element: <PagePrint />,
            }
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

  return (
    <UserProvider>
      <GroupProvider>
        <RouterProvider router={router} />
      </GroupProvider>
    </UserProvider>
  )
  // (
  //   // <>
  //   // <RouterProvider router={router} />
  //   //   {/* <DashboardNavbar />
  //   //   <div>TEST</div> */}
  //   // </>
  // )
}

export default App
