import { useState } from "react";
import { IoCalendarOutline, IoCartOutline, IoGridOutline, IoLogOutOutline, IoSettingsOutline, IoTicketOutline, IoWalletOutline } from "react-icons/io5";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import { useUserProvider } from "../../contexts/UserContext" ;
import { isUserOrganiser, isUserBasic } from "../../global/helpers"
import { EventProvider } from "../../contexts/EventContext";
import { ToastContainer } from "react-toastify";
import { useScreenLoaderProvider } from "../../contexts/ScreenLoaderContext";
import NetworkError from "../../components/NetworkError";

export default function DashboardLayout(){
    let { logout } = useLogin()
    let [isMenuOpen, setIsMenuOpen] = useState(false)
    let location = useLocation()
    let userProvider = useUserProvider()

    function toggleMenu(){
        setIsMenuOpen(!isMenuOpen)
    }

    useScreenLoaderProvider(userProvider?.userLoading, "Loading User detials")
    console.log("user from userprovider in dashboard layout", userProvider?.user)

    return(
            <EventProvider>
                <div className="flex z-[-10]">
                    <div className={`w-auto md:w-[18%] ${!isMenuOpen ? 'hidden' : 'block'} md:block h-[100vh] z-[20] bg-primary-dark px-6 pt-6 fixed`}>
                        <h2 className="text-white text-xl font-bold pb-4 cursor-pointer"><Link to={"/"}>Emume</Link></h2>
                        <div className="pt-8 pb-6">
                            <h4 className="text-[#CCCCCC] font-medium">Welcome,</h4>
                            <h3 className="text-white font-bold">{userProvider?.user?.firstname} {userProvider?.user?.lastname}</h3>
                        </div>
                        <hr />
                        <div className="py-4 flex flex-col justify-between">
                            {
                                isUserOrganiser(userProvider?.user)
                                &&
                                <DashNavLinkCont toggleMenu={toggleMenu} active={location.pathname === '/dashboard' ? true : false} >
                                    <IoGridOutline size={25} />
                                    <Link to={"/dashboard"} className="ml-2 cursor-pointer">
                                        Dashboard
                                    </Link>
                                </DashNavLinkCont>
                            }
                            {
                                isUserBasic(userProvider?.user)
                                &&
                                <DashNavLinkCont toggleMenu={toggleMenu} active={location.pathname === '/dashboard/events' ? true : false} >
                                    <IoCalendarOutline size={25} />
                                    <Link to={"/dashboard/events"} className="ml-2 cursor-pointer">
                                        Events
                                    </Link>
                                </DashNavLinkCont>
                            }
                            {
                                isUserBasic(userProvider?.user)
                                &&
                                <DashNavLinkCont toggleMenu={toggleMenu} active={location.pathname === '/dashboard/purchased-tickets' ? true : false}>
                                    <IoTicketOutline size={25} />
                                    <Link to={"/dashboard/purchased-tickets"} className="ml-2 cursor-pointer">
                                        Tickets
                                    </Link>
                                </DashNavLinkCont>
                            }
                            {
                                isUserOrganiser(userProvider?.user)
                                &&
                                <DashNavLinkCont toggleMenu={toggleMenu} active={location.pathname === '/dashboard/wallet' ? true : false} >
                                    <IoWalletOutline size={25} />
                                    <Link to={"/dashboard/wallet"} className="ml-2 cursor-pointer">
                                        Wallet
                                    </Link>
                                </DashNavLinkCont>
                            }
                            <DashNavLinkCont toggleMenu={toggleMenu} active={location.pathname === '/dashboard/settings' ? true : false} >
                                <IoSettingsOutline size={25} />
                                <Link to={"/dashboard/settings"} className="ml-2 cursor-pointer">
                                    Settings
                                </Link>
                            </DashNavLinkCont>

                        </div>

                        <div className="absolute bottom-[-10px]">
                            <div onClick={logout} className="text-[#CCCCCC] flex font-medium align-center absolute bottom-10">
                                <IoLogOutOutline size={25} />
                                <div className="ml-2 cursor-pointer">
                                    Logout
                                </div>
                            </div>
                        </div>
                    </div>

                    <div onClick={isMenuOpen ? toggleMenu : ()=>{}} className="w-full md:w-[82%] px-3 min-h-[100vh] bg-[#EEEEEE] ml-auto pb-16 md:mb-0">
                        {
                            userProvider?.userStatus.message.toLowerCase() == "network error"
                            ?
                            <NetworkError />
                            :
                            <Outlet context={{toggleMenu}} />
                        }
                    </div>
                    <div className="fixed w-full rounded-md bottom-0 md:hidden h-10 shadow-[0_-4px_8px_0_rgba(0,0,0,0.15)]">
                        <div className="flex text-primary-dark justify-around bg-[#EEEEEE] h-[100%]">
                            {
                                isUserBasic(userProvider?.user)
                                &&
                                <Link to={"/dashboard/purchased-tickets"} className={`flex flex-col items-center pt-2 ${location.pathname === "/dashboard/purchased-tickets" && "text-primary-orange font-medium"}`}>
                                    <IoTicketOutline />
                                    <p className="text-[11px]">My Tickets</p>
                                </Link>
                            }
                            {
                                isUserOrganiser(userProvider?.user)
                                &&
                                <Link to={"/dashboard"} className={`flex flex-col items-center pt-2 ${location.pathname === "/dashboard" && "text-primary-orange font-medium"}`}>
                                    <IoGridOutline />
                                    <p className="text-[11px]">Dashboard</p>
                                </Link>
                            }
                            <Link to={"/dashboard/events"} className="bg-primary-dark p-4 rounded-full absolute bottom-5 m-auto border-b-[5px] border-l-[5px]  border-r-[5px] shadow-[0_4px_8px_0_rgba(0,0,0,0.15)]">
                                <IoCalendarOutline className="text-primary-orange" size={25} />
                            </Link>
                            {
                                isUserBasic(userProvider?.user)
                                &&
                                <Link to={"/dashboard/cart"} className={`flex flex-col items-center pt-2 ${location.pathname === "/dashboard/cart" && "text-primary-orange font-medium"}`}>
                                    <IoCartOutline />
                                    <p className="text-[11px]">Cart</p>
                                </Link>
                            }
                            {
                                isUserOrganiser(userProvider?.user)
                                &&
                                <Link to={"/dashboard/wallet"} className={`flex flex-col items-center pt-2 ${location.pathname === "/dashboard/wallet" && "text-primary-orange font-medium"}`}>
                                    <IoWalletOutline />
                                    <p className="text-[11px]">Wallet</p>
                                </Link>
                            }
                        </div>
                        
                    </div>
                    <ToastContainer />
                </div>
            </EventProvider>
    )
}


function DashNavLinkCont({children, active, toggleMenu}){
    return(
        <div onClick={toggleMenu} className={`${active ? 'text-white' : "text-[#CCCCCC]"} hover:text-white flex font-medium align-center py-6 cursor-pointer`}>
            {children}
        </div>
    )
}