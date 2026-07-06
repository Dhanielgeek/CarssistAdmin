import {createBrowserRouter} from "react-router-dom"
import Login from "../Auth/Login"
import Adminlayout from "../Layouts/adminlayout"
import Overview from "../Admin/overview"
import PerformanceReport from "../Admin/overview/performancereport"
import UserReports from "../Admin/overview/userreports"
import FinancialReports from "../Admin/overview/financialreports"
import CustomerSatisfaction from "../Admin/overview/customersatisfaction"
import MainUsers from "../Admin/users"
import RidersPage from "../Admin/users/riderspage"
import Chauffersriders from "../Admin/users/chauffersriders"
import Motorist from "../Admin/users/motorist"
import Track from "../Admin/track"


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
            }, 
            {
                path: 'users/carsist-riders',
                element: 
                    <RidersPage
                    />
                
            }, 
            {
                path: "users/chauffers-riders",
                element: <Chauffersriders/>
            }, 
            {
                path: "users/motorists",
                element: <Motorist/>
            }, 
            {
                path: "track",
                element:<Track/>
            }
        ]
    }
])

export default routes