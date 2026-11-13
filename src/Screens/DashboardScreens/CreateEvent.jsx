import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import AddEventGeneralInfo from "../../modules/Events/AddEventGeneralInfo"
import AddEventTicketInfo from "../../modules/Events/AddEventTicketInfo"
import ReviewEventInfo from "../../modules/Events/ReviewEventInfo"
import {ToastContainer, toast} from "react-toastify"
import { InfoTab } from "../../modules/Events/InfoTab"
import StepsComponent from "../../components/StepsComponent"
import { IoChevronBack } from "react-icons/io5"


export default function CreateEvent(){
    let navigate = useNavigate()
    let [searchParams] = useSearchParams()
    let currentTab = searchParams.get("current_tab")
    let type = searchParams.get("type")
    let eventName = searchParams.get("event")
    let eventId = searchParams.get("ev_id")
    let organiserId = searchParams.get("organiser_id")

    let steps = type == "free" 
    ? 
    ["Event Details", "Partners", "Review"]
    :
    type == "paid" 
    ?
    ["Event Details", "Partners", "Tickets & Pricing", "Review"]
    :
    []

    function moveToNextTab(event_id, event_name, organiser_id, next_tab){
        navigate(`/dashboard/event/create?current_tab=${next_tab}&event=${event_name}&ev_id=${event_id}&organiser_id=${organiser_id}`)
    }
     
    console.log("current tab", currentTab)
    return(
        <div>
            <div>
                {/* <div className="flex justify-between md:w-[50%] m-auto ">
                    <InfoTab info={"General Info"} currentTab={currentTab || "general"} />
                    <InfoTab info={"Ticket Info"} currentTab={currentTab} />
                </div> */}
                <div className="text-primary-dark flex items-center gap-2">
                    <div onClick={()=> navigate(-1)}>
                        <IoChevronBack />
                    </div>
                    <p>
                        Create Event
                    </p>
                </div>
                <div className="bg-white md:w-[90%] p-4 m-auto my-4 rounded-[20px]">
                    <StepsComponent
                        steps={steps}
                        currentStep={currentTab || "Event Details"}
                    />
                </div>
                <div className="md:w-[90%] p-6 m-auto bg-white rounded-[20px]">
                    {
                        !currentTab
                        &&
                        <AddEventGeneralInfo 
                            moveToNext={moveToNextTab} 
                            ticketed={type == "free" ? false : type == "paid" ? true : undefined} 
                            nextTab={"Partners"}
                        /> 
                    }
                    { 
                        currentTab == "Tickets & Pricing"
                        &&
                        <AddEventTicketInfo 
                            eventId={eventId} 
                            eventName={eventName} 
                            organiserId={organiserId} 
                        />
                    }
                    {
                        currentTab == "Review"
                        &&
                        <ReviewEventInfo />
                    }
                </div>
            </div>
        </div>
    )
}