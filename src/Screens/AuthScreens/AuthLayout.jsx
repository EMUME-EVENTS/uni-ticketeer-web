import {useEffect} from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import useLogin from "../../hooks/useLogin"
import { ToastContainer } from "react-toastify"
import { Images } from "../../images"


export default function AuthLayout(){
    const location = useLocation()
    const navigate = useNavigate()
    const {isLoggedIn} = useLogin()

    console.log(location.pathname)

    useEffect(()=>{
        if(isLoggedIn){
            navigate("/dashboard")
        }
    })

    return(
        <>
            <div className="relative md:flex h-[100vh] overflow-hidden" style={{backgroundImage: `url(${Images.signupSideImg})`, backgroundSize: "contain"}}>
                <div className="w-[25%] hidden md:flex flex-col justify-center items-center h-[100vh] bg-transparent fixed">
                    <div className="text-white text-xl absolute top-10 left-10 font-bold cursor-pointer"><Link to={"/"}><img src={Images.logoGray} className="w-[50px]" /></Link></div>
                    <h1 className="text-4xl text-white font-bold">Emume</h1>
                    <p className="text-primary-orange text-xl">{location.pathname === "/auth/login" ? "Login" : location.pathname === "/auth/signup" ? "Sign up" : ""}</p>
                </div>
                <div className="absolute rounded-t-xl md:rounded-tr-none w-full md:relative bottom-0 md:w-[40%] h-[80vh] md:min-h-[100vh] ml-auto bg-[#EEE] items-center justify-center overflow-scroll">
                    <Outlet />
                </div>
                <ToastContainer />
            </div>
        </>
    )
}