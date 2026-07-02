import {createBrowserRouter} from "react-router-dom"
import Login from "../Auth/Login"
import Adminlayout from "../Layouts/adminlayout"
import Overview from "../Admin/overview"
import PerformanceReport from "../Admin/overview/performancereport"
import UserReports from "../Admin/overview/userreports"
import FinancialReports from "../Admin/overview/financialreports"
import CustomerSatisfaction from "../Admin/overview/customersatisfaction"
import MainUsers from "../Admin/users"

const routes = createBrowserRouter([
    {
        path : "",
        element: <Login/>
    },
    {
        path: "admin",
        element: <Adminlayout/>,
        children: [
            {
                path: "overview",
                element: <Overview/>
            }, 
            {
                path: "performance-reports",
                element: <PerformanceReport/>
            },
            {
                path: "user-reports",
                element: <UserReports/>
            }, 
            {
                path: "financial-reports",
                element: <FinancialReports/>
            },
            {
                path: "customer-satisfaction",
                element: <CustomerSatisfaction/>
            }, 
            {
                path: "users",
                element: <MainUsers/>
            }
        ]
    }
])

export default routes