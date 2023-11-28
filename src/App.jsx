import { useSelector } from "react-redux"
import { Navigate, Outlet, Routes, Route, useLocation } from "react-router-dom"

//COMPONENTS
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Account from "./pages/Account"
import ForgotPassword from "./pages/ForgotPassword"


const Layout = ()=>{
  const {user} = useSelector((state)=>state.user)

  const location = useLocation()
  return user?.token ? <Outlet/> 
  : <Navigate to="/auth/account" state={{from: location}} replace/>
}
function App() {
  const theme = useSelector((state) => state.theme)

  return (
    <main data-theme={theme} className="w-full min-h-screen bg-bgColor">
      <Routes>
        <Route element={<Layout/>}>
            <Route path="/" element={<Home/>}/>
            <Route path="/profile/:id?" element={<Profile/>}/>
        </Route>

        <Route path="/auth/account" element={<Account/>}/>
        <Route path="/auth/forgot-password" element={<ForgotPassword/>}/>
      </Routes>
    </main>
  )
}

export default App
