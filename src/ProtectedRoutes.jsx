import { Outlet, Navigate} from "react-router-dom"

export default function ProtectedRoutes() {
    const user = localStorage.getItem('user');

    if (!user) {
        return <Navigate to="/login" />
    }

    return <Outlet />
}