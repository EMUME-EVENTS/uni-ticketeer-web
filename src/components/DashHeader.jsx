import { IoCartOutline, IoMenu, IoNotificationsOutline, IoPersonOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useUserProvider } from "../contexts/UserContext";
import useCart from "../hooks/useCart";
import { useCartProvider } from "../contexts/CartContext";
import { isUserBasic } from "../global/helpers";
import { useState } from "react";
import { Images } from "../images";

export default function DashHeader({title, dashnavtoggle}){
    let navigate = useNavigate()
    let userProvider = useUserProvider()
    let cartProvider = useCartProvider()

    let [stickHeader, setStickHeader] = useState(false)

    window.addEventListener("scroll", ()=>{
        if(window.scrollY > 100){
            setStickHeader(true)
        }else{
            setStickHeader(false)
        }
    })

    return(
        <div className={`bg-white md:bg-transparent rounded-lg flex justify-between items-center p-2 m-auto my-2 w-full ${stickHeader && "sticky top-2 z-50 md:relative shadow-[0_4px_8px_0_rgba(0,0,0,0.15)]"}`}>
            <Link to={"/"}>
                <img src={Images.newLogo} alt="emume-logo" className="md:hidden w-[33px] lg:w-[150px] p-[0px] m-[0px]"/>
            </Link>
            <div className="flex items-center w-[auto] justify-around">
                {
                    isUserBasic(userProvider?.user)
                    &&
                    <div onClick={()=> navigate("/dashboard/cart")} className="relative mx-2 p-2">
                        {
                            cartProvider?.cart?.length > 0
                            &&
                            <div className="absolute bottom-[20px] left-[20px] w-[20px] h-[20px] flex justify-center items-center bg-red-500 rounded-full text-[10px] text-white text-center">
                                {cartProvider?.cart?.length}
                            </div>
                        }
                        <IoCartOutline className="cursor-pointer text-primary-dark" size={25} />
                    </div>
                }
                <div className="mx-2 p-2">
                    <IoNotificationsOutline className=" cursor-pointer text-primary-dark" size={25} />
                </div>
                
                <div className="w-[40px] h-[40px] bg-[#CCC] border-[1px] justify-center items-center hidden md:flex rounded-full">
                    <IoPersonOutline size={25} />
                </div>
                <div onClick={dashnavtoggle} className="w-[40px] h-[40px] md:hidden flex items-center p-2">
                    <IoMenu className=" cursor-pointer text-primary-dark" size={25} />
                </div>
            </div>
        </div>
    )
}