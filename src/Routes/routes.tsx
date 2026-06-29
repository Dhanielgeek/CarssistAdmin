import {createBrowserRouter} from "react-router-dom"
import Login from "../Auth/Login"
import Adminlayout from "../Layouts/adminlayout"
import Overview from "../Admin/overview"


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
            }
        ]
    }
])

export default routes