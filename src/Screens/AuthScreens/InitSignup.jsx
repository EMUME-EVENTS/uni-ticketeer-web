
import { IoClose } from "react-icons/io5";
import Section from "../../components/Section";
import { Images } from "../../images";
import { FaRegUser } from "react-icons/fa";
import { useState } from "react";
import { GiCheckMark } from "react-icons/gi";
import CustomSliderContainer from "../../components/CustomSliderContainer";
import { SwiperSlide } from "swiper/react";
import { PiSuitcaseLight } from "react-icons/pi";
import { Link } from "react-router-dom";

let signupDetails = [
    {
        title: "I'm a Ticketeer",
        description: "Discover events, buy tickets instantly, and manage your entry with ease",
        role: "basic",
        icon: <FaRegUser />,
        points: [
            "Browse verified events near you", 
            "Instant tickets delivery to email & dashboard",
            "Secure QR code entry at events",
            "Save events and get reminders",
            "Easy refunds (if events allow it)"
        ]
    },
    {
        title: "I'm an Organizer",
        description: "Create events, sell tickets, track sales and manage attendees from one dashboard",
        role: "organiser",
        icon: <PiSuitcaseLight />,
        points: [
            "Create unlimited events and ticket type",
            "Real-time sales analytics and reports",
            "QR code check-in system for attendees",
            "Payout tracking and revenue management",
            "Dedicated organizer support tools"
        ]
    }
]
export default function InitSignup(){
    let [userRole, setUserRole] = useState("")
    
    return(
        <div 
            className="w-full min-h-[100vh] flex flex-col gap-10 justify-between"
            style={{
                backgroundImage: `url(${Images.signupBg})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover"
            }}
        >   
            <Section>
                <div className="flex justify-between">
                    <img src={Images.logoGray} className="w-[50px]" />
                    {/* <div className="flex justify-center text-[32px] items-center w-[32px] md:w-[68px] h-[32px] md:h-[68px] bg-white rounded-full cursor-pointer">
                        <IoClose color="black" />
                    </div> */}
                </div>
            </Section>
            <Section>
                <div>
                    <p className="text-center text-white text-[24px] md:text-[46px]">Join as a Ticketeer or an Organizer</p>
                </div>
            </Section>
            <div>
                <CustomSliderContainer
                    breakpoints={
                    {
                        321: {
                            "slidesPerView": 1.2
                        },
                        640: {
                            "slidesPerView": 2,
                        }
                    }}
                    slidesPerView={1.08}
                    spaceBetween={5}
                >
                    {
                        signupDetails.map((det, i)=>(
                            <SwiperSlide key={"swiper"+i}>
                                <SelectRoleCard
                                    details={det}
                                    currentRole={userRole}
                                    onChangeRole={(role)=>setUserRole(role)}
                                />
                            </SwiperSlide>
                        ))
                    }
                </CustomSliderContainer>
            </div>
            <Section>
                <Link to={userRole && `/auth/signup?role=${userRole}`}>
                    <div className="flex justify-end">
                        <div className={`${userRole ? "bg-white text-primary-dark": "bg-[#CCCCCC] text-[#EEEEEE]"} px-6 py-4 mb-2 rounded-full`}>
                            Continue
                        </div>
                    </div>
                </Link>
            </Section>
        </div>
    )
}

function SelectRoleCard({details, currentRole, onChangeRole}){
    let isActive = currentRole == details.role
    return(
        <div 
            className={`relative flex flex-col items-center justify-center gap-5 w-[300px] md:w-[380px] 
                h-[450px] ${isActive ? "border-2 border-primary-orange" : "border-white/50 border-t border-b"} 
                p-8 text-white transition duration-300 m-auto
                rounded-[30px] backdrop-blur-sm bg-white/10 cursor-pointer`}
            onClick={()=>{
                onChangeRole(details.role)
            }}
        >
            {
                isActive
                &&
                <div className="absolute top-5 left-5 flex justify-center items-center w-[20px] md:w-[24px] h-[20px] md:h-[24px] bg-primary-orange rounded-full">
                    <GiCheckMark className="text-primary-dark" />
                </div>
            }
            <p className="">{details.title}</p>
            <div className={`flex border border-neutral-500/20 items-center justify-center ${isActive ? "w-[80px] h-[80px] md:w-[100px] md:h-[100px]" : "w-[140px] h-[140px] md:w-[200px] md:h-[200px] text-[32px]"}  rounded-full`}>
                {details.icon}
            </div>
            {
                isActive
                &&
                <div>
                    <p className="text-center font-medium md:text-[16px] mb-4">{details.description}</p>
                    <ul>
                        {
                            details.points.map((p, i)=>(
                                <li key={"list"+i} style={{listStyle: "circle"}} className="font-light text-[14px] md:text-[16px] ">{p}</li>
                            ))
                        }   
                    </ul>
                </div>
            }
        </div>
    )
}