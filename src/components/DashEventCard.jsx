import { IoCalendar,IoLocationOutline, IoTimerOutline } from "react-icons/io5";
import Event1 from '../images/Event-1.jpg'
import { Link } from "react-router-dom";
import dayjs from "dayjs"
import { formatTime } from "../global/helpers"

export default function DashEventCard({link, event}){
    return(
        <div className="group md:w-[23%] bg-white rounded-xl border-2 border-white relative">
            <img src={event.banner_image_url} className="w-full h-full rounded-xl" alt="" />
            <div className="hidden text-primary-dark group-hover:block w-full bg-white rounded-xl px-2 absolute bottom-0">
                <h3 className="text-primary-dark font-bold">{event.title}</h3>
                <p className="text-[10px] font-bold">{event.additional_information}</p>
                <div>
                    <div className="flex justify-between my-2">
                        <div className="flex items-center">
                            <div className="border-[1px] border-primary-dark p-[4px] rounded-md">
                                <IoCalendar className="text-primary-dark cursor-pointer" />
                            </div>
                            <p className="ml-2 text-[12px] font-bold">{dayjs(event.start_date).format("DD MMM")}</p> 
                        </div>
                        <div className="flex items-center">
                            <div className="border-[1px] border-primary-dark p-[4px] rounded-md">
                                <IoTimerOutline className="text-primary-dark cursor-pointer" />
                            </div>
                            <p className="ml-2 text-[12px] font-bold">{formatTime(event?.start_time)}</p>
                        </div>
                    </div>
                    <div className="flex items-center my-2">
                        <div className="border-[1px] border-primary-dark p-[4px] rounded-md">
                            <IoLocationOutline className="text-primary-dark cursor-pointer" />
                        </div>
                        <p className="ml-2 text-[12px] font-bold">{event.venue}</p>
                    </div>
                </div>
                <Link to={link}><div className="bg-primary-orange text-center rounded-full my-2 font-medium  cursor-pointer hover:underline">View Event Details</div></Link>
            </div>
        </div>
    )
}