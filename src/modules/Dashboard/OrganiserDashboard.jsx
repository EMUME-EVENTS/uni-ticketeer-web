import { Link } from "react-router-dom";
import OverviewCard from "../../components/OverviewCard";
import DashEventCard from "../../components/DashEventCard";
import { IoAdd, IoClose, IoTicketOutline } from "react-icons/io5";
import { useEffect, useState, useContext } from "react";
import useEvents from "../../hooks/useEvents";
import useTickets from "../../hooks/useTickets";
import { useNavigate } from "react-router-dom";
import { UserContext, useUserProvider } from "../../contexts/UserContext";
import { checkMissingTickets, isEventPast } from "../../global/helpers";
import CustomModal from "../../components/CustomModal";
import NewOverviewCard from "../../components/NewOverviewCard";
import { CiDollar } from "react-icons/ci";
import { RiCalendarCheckLine } from "react-icons/ri";
import { BsCalendar2Check } from "react-icons/bs";

let actionArray = [
    {
        text: "Create New Event",
        link: "/dashboard/event/create",
        bgDark: true
    },
    {
        text: "View Payout"
    },
    {
        text: "Export Report"
    },
    {
        text: "Message Attendees"
    }
]

export default function OrganiserDashboard(){
    let navigate = useNavigate()
    const {user, organiserStats } = useUserProvider()

    let [viewMore, setViewMore] = useState(false)
    
    const { events, eventsLoading, eventsStatus } = useEvents()

    let [organiserActiveEvents, setOrganiserActiveEvents] = useState([])
    let [organiserPastEvents, setOrganiserPastEvents] = useState([])
    let [organiserAllEvents, setOrganiserAllEvents] = useState([])
    let [needTicketModalOpen, setNeedTicketModalOpen] = useState(false)
    let [eventNeedingTickets, setEventNeedingTickets] = useState("")

    useEffect(()=>{
        if(events && events.length > 0){
            console.log("events from organiser dashboard", events)
            let allEvents = []
            let activeEvents = []
            let pastEvents = []
            for(let i=0; i < events.length; i++){
                if(events[i].organiser === user._id){
                    allEvents.push(events[i])
                    setOrganiserAllEvents(allEvents)
                    if(!isEventPast(events[i].start_at)){
                        activeEvents.push(events[i])
                        setOrganiserActiveEvents(activeEvents)
                    }
                    if(isEventPast(events[i].start_at)){
                        pastEvents.push(events[i])
                        setOrganiserPastEvents(pastEvents)
                    }
                }
            }
        }
    }, [events])

    async function checkEventsNeedingTickets(events){
        console.log("running function to check missing tickets")
        let result = await checkMissingTickets(events)
        console.log("result after checking missing tickets", result)
        if(result.isMissing){
            setEventNeedingTickets({name: result.event.title, banner_image_url: result.event.banner_image_url, id: result.event._id})
            setNeedTicketModalOpen(true)
        }
    }
    
    useEffect(()=>{
        console.log("active events", organiserActiveEvents)
        if(organiserActiveEvents.length > 0){
            checkEventsNeedingTickets(organiserActiveEvents)
        }
    }, [organiserActiveEvents])

    return(
        <div className="w-[100%]">
                    <h2 className="text-xl py-2 font-bold text-primary-dark">Overview</h2>
                    <div className="flex flex-col md:grid grid-cols-2 gap-5 bg-white p-4 rounded-[20px]">
                        <NewOverviewCard 
                            title={"Total Revenue"} 
                            isCurrencyCard
                            amount={organiserStats?.allTimeSales.toLocaleString() || 0} 
                            description={"all time"}
                            icon={<CiDollar size={35} className="text-primary-dark" />}
                        />          
                        <NewOverviewCard 
                            title={"Tickets sold"} 
                            amount={organiserStats?.ongoingTicketSales || 0} 
                            description={"upcoming"}
                            icon={<IoTicketOutline size={30} className="text-primary-dark" />}
                        />
                        <NewOverviewCard 
                            title={"Upcoming Events"} 
                            amount={organiserActiveEvents.length || 0} 
                            description={"active"}
                            icon={<BsCalendar2Check size={30} className="text-primary-dark" />}
                        />
                        <NewOverviewCard 
                            title={"all time events"} 
                            amount={organiserStats?.allTimeEvents || 0}
                        />
                        {viewMore && <OverviewCard title={"all time ticket sales"} amount={organiserStats?.allTimeTicketSales || 0} />}
                        {viewMore && <OverviewCard title={"all time sales"} isCurrencyCard={true} amount={organiserStats?.allTimeSales.toLocaleString() || 0} />}          
                    </div>
                    {/* <div className="bg-white my-4 p-4 rounded-[20px]">
                        <div className="flex gap-3 overflow-x-scroll rounded-[20px]">
                        {
                            actionArray.map((action)=>(
                                <div className={` ${action.bgDark ? "text-primary-orange bg-primary-dark" : "text-primary-dark"} whitespace-nowrap border-[1px] border-primary-dark px-4 py-2 rounded-full text-center`}>
                                    {action.text}
                                </div>
                            ))
                        }
                        </div>
                    </div> */}
                    {/* <div className="flex justify-end text-primary-dark font-medium pt-4 underline text-right">
                        <div 
                            onClick={()=>{
                                setViewMore((prev)=>(!prev))
                            }}
                            className="cursor-pointer"
                        >
                            {
                                viewMore
                                ?
                                "View Less"
                                :
                                "View More"
                            }
                        </div>
                    </div> */}
                    <div>
                        <div className="flex justify-between items-center pt-12 pb-8">
                            <h2 className="text-xl font-bold text-primary-dark">Your Events</h2>
                            <Link to={"/dashboard/event/create"}>
                                <div className="flex text-primary-dark items-center bg-primary-orange p-2 mr-8 rounded-full font-medium"> 
                                    New Event 
                                    <IoAdd size={20} className=" cursor-pointer"/>
                                </div>
                            </Link>
                        </div>
                        {
                            eventsLoading
                            ?
                            <div className="pt-8 h-[200px] text-center text-primary-dark font-medium"> Loading Events .... </div>
                            :
                            eventsStatus?.error
                            ?
                            <div className="pt-8 h-[200px] text-center text-red-500 font-medium"> {eventsStatus.message} </div>
                            :
                            <div>
                                {
                                    organiserActiveEvents.length == 0
                                    ?
                                    <div className="p-4 text-center text-primary-dark">
                                        You have no active events
                                    </div>
                                    :
                                    <div className="flex justify-even gap-2 mb-4 flex-wrap">
                                        {
                                            organiserActiveEvents?.map((event, i)=>(<DashEventCard key={"event"+i} event={event} link={`/dashboard/event/details/${event._id}`}  />))
                                        }
                                    </div>
                                }
                                {
                                    organiserPastEvents.length > 0
                                    &&
                                    <>
                                        <div className="text-primary-dark font-medium text-xl py-4">
                                            Past Events
                                        </div>
                                        <div className="flex justify-even gap-2 flex-wrap">
                                            {
                                                organiserPastEvents?.map((event, i)=>(<DashEventCard key={"event"+i} event={event} link={`/dashboard/event/details/${event._id}`}    />))
                                            }
                                        </div>
                                    </>
                                }
                            </div>
                        }
                    </div>
                    <CustomModal 
                        isOpen={needTicketModalOpen} 
                        closeModal={()=> {}}
                    >
                        <div>
                            <p className="text-center text-primary-dark font-medium">
                                An event with the name <span className="font-bold text-primary-orange">{eventNeedingTickets.name}</span> was found to be ticketed but no tickets were found.
                            </p>
                            <div className="w-[60%] h-[50vh] m-auto mt-4 mb-4">
                                <img 
                                    className="w-[100%] h-[100%] rounded-[20px] shadow-2xl"
                                    src={eventNeedingTickets.banner_image_url}
                                />
                            </div>
                            <p className="text-center text-primary-dark font-medium">
                                The event cannot be published until you either create a ticket or set the event to a free event
                            </p>

                            <div className="flex justify-between p-4">
                                <div 
                                    onClick={()=> navigate(`/dashboard/event/edit/${eventNeedingTickets.id}`)} 
                                    className="bg-primary-dark text-primary-orange font-medium cursor-pointer p-2 border-[1px] border-primary-dark rounded-full"
                                >
                                    Edit Event
                                </div>
                                <div 
                                    onClick={()=>navigate(`/dashboard/event/create?current_tab=ticket&event=${eventNeedingTickets.name}&ev_id=${eventNeedingTickets.id}&organiser_id=${user?._id}`)} 
                                    className="bg-primary-dark text-primary-orange font-medium cursor-pointer p-2 border-[1px] border-primary-dark rounded-full"
                                >
                                    Add Tickets
                                </div>
                            </div>
                        </div>
                    </CustomModal>
                </div>
    )
}