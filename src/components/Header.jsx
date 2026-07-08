import { useState } from "react"
import { GiHamburgerMenu } from "react-icons/gi"
import { IoSearch } from "react-icons/io5"
import { Link } from "react-router-dom"

export default function Header(){
    let [navOpen, setNavOpen] = useState(false)

    function toggleNav(){
        setNavOpen(!navOpen)
    }

    function closeNav(){
        setNavOpen(false)
    }

    return(
        <div className={`${navOpen ? "fixed bg-black/50 w-full px-4 py-8 lg:relative left-0 top-0 lg:w-auto h-[100dvh] lg:h-auto z-10" : ""}`}>
            <div className={`relative bg-white m-auto p-4 rounded-lg`}>
                <header className={`flex flex-col lg:flex-row justify-between gap-5 w-full items-center`}>
                    <div className="w-full lg:w-[54px] flex flex-row justify-between text-lg cursor-pointer"> 
                        <Link to={"/"}>
                            <img src="new-logo.png" alt="emume-logo" className="w-[33px] lg:w-[150px] p-[0px] m-[0px]"/>
                        </Link>

                        <div className="flex items-center gap-4 lg:hidden">
                            <div>
                                <IoSearch className="text-primary-dark" size={25} />
                            </div>
                            <div onClick={toggleNav}>
                                <GiHamburgerMenu className="text-primary-dark" size={25} />
                            </div>
                        </div>
                    </div>
                    <nav className={`${navOpen ? "flex" : "hidden lg:flex"} flex-col w-full lg:flex-row lg:items-center justify-between`}>
                        <ul className="flex flex-col lg:flex-row justify-between lg:items-center">
                            <NavItems name={"Events"} url={"/events"} toggleNav={closeNav} className=" cursor-pointer"/>
                            <NavItems name={"How it works"} url={"/how-it-works"} toggleNav={closeNav} className=" cursor-pointer"/>
                            <NavItems name={"Organizers"} url={"/"} toggleNav={closeNav} className=" cursor-pointer" />
                            <NavItems name={"About"} url={"/about"} toggleNav={closeNav} className=" cursor-pointer"/>
                        </ul>
                        <div className="w-full md:w-auto flex flex-col md:flex-row md:justify-end items-center gap-2 md:gap-5">
                            <div className="w-full text-center bg-primary-orange md:bg-transparent md:w-auto uppercase text-primary-dark px-4 py-2 rounded-full">
                                <Link to={"/auth/login"}>
                                    Log In
                                </Link>
                            </div>
                            <div className="w-full text-center md:w-auto bg-primary-dark uppercase text-primary-orange px-4 py-2 rounded-full">
                                <Link to={'/getstarted'}>
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </nav>
                </header>
            </div>

        </div>
    )
}

function NavItems({name, url, toggleNav}){
    return(
        <li className="md:w-auto md:text-[16px] uppercase md:border-0 md:last:mr-10 mx-4 py-4 text-primary-dark hover:text-primary-orange cursor-pointer">
            <Link onClick={toggleNav} to={url}>{name}</Link>
        </li>
    )
}