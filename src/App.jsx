import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
// import DashboardLayout from "./layout/DashboardLayout"
import Login from "./pages/Login";
import TestPage1 from "./pages/TestPage1";
import TestPage2 from "./pages/TestPage2";
import DashboardNavbar from "./layout/dashboarNavbar";
import ProtectedRoutes from "./ProtectedRoutes";
import CreateUser from "./pages/CreateUser";
import Countries from "./pages/Countries";
import CreateCountry from "./pages/CreateCountry";
import Regions from "./pages/Regions";

function App() {
  const router = createBrowserRouter([
    {
      element: <ProtectedRoutes />,
      children: [
        {
          path: "/",
          element: <DashboardNavbar />,
          children: [
            // {
            //   index: true,
            //   element: <TestPage1 />,
            // },
            {
              path: "create-user",
              element: <CreateUser />,
            },
            {
              path: "test-page-2",
              element: <TestPage2 />,
            },
            {
              path: "country-list",
              element: <Countries />,
            },
            {
              path: "create-country",
              element: <CreateCountry />,
            },
            {
              path: "region-list",
              element: <Regions />,
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
