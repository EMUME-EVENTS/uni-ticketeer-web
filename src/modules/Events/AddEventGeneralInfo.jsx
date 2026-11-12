import { useContext, useEffect, useState } from "react"

import { TbMicrophone2 } from "react-icons/tb";
import { MdOutlineFastfood, MdTheaterComedy } from "react-icons/md";
import { BiParty } from "react-icons/bi";
import { MdPalette } from "react-icons/md";
import { RiBriefcase4Line } from "react-icons/ri";
import { IoFitnessOutline } from "react-icons/io5";
import { PiHandsPrayingFill } from "react-icons/pi";
import { GiSewingNeedle } from "react-icons/gi";
import { MdLaptop } from "react-icons/md";
import { AiOutlinePicture } from "react-icons/ai";
import TicketInput from "../../components/TicketInput";
import useImage from "../../hooks/useImage";
import states from "../../global/states";
import { useNavigate } from "react-router-dom";
import { useUserProvider } from "../../contexts/UserContext";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useEventProvider } from "../../contexts/EventContext";
import CustomModal from "../../components/CustomModal";
import CustomLoader from "../../components/CustomLoader";
import ToggleSwitch from "../../components/ToggleSwitch";



export default function AddEventGeneralInfo({moveToTickets, event, ticketed}){
    let navigate = useNavigate()
    let userProvider = useUserProvider()
    let nextDay = dayjs().add(1, "day").format("YYYY-MM-DD")
    let today = dayjs()
    const {isImageLoading, imageStatus, uploadImage} = useImage()
    let { createEvent, editEvent, eventsLoading, eventsStatus } = useEventProvider()
    let [isTicketed, setIsTicketed] = useState(ticketed || false)
    let [bannerImg, setBannerImg] = useState({blob: "", isUploaded: false})
    let [statesArr, setStatesArr] = useState([])
    let [citiesArr, setCitiesArr] = useState([])
    let [state, setState] = useState("")
    let [city, setCity] = useState("")
    let [isLocationPrivate, setIsLocationPrivate] = useState(false)
    let [isEventOnline, setIsEventOnline] = useState(false)
    let [landmark, setLandmark] = useState("")
    let [onlineLink, setOnlineLink] = useState("")
    let [createEventFormData, setCreateEventFormData] = useState(
        {
            title: "",
            venue: "",
            organiser: userProvider?.user?._id,
            organiser_name: userProvider?.user?.username,
            start_date: "",
            end_date: undefined,
            start_time: "",
            end_time: undefined,
            category: [],
            banner_image_url: "",
            additional_information: undefined
        }
    )

    let [showAddMoreTicketOption, setShowAddMoreTicketOption] = useState(false)

    function handleCreateEventChange(e){
        //console.log(e)
        if(e.target.name === "category"){
            if(e.target.checked){
                setCreateEventFormData({
                    ...createEventFormData,
                    category: [...createEventFormData.category, e.target.value]
                })
            }else{
                setCreateEventFormData({
                    ...createEventFormData,
                    category: createEventFormData.category.filter((category)=>{return category !== e.target.value })
                })
            }
        }else{
            setCreateEventFormData(
            {
                ...createEventFormData,
                [e.target.name]: e.target.value
            })
        }

        console.log(createEventFormData)
    }

    async function handleSubmitEvent(e){
        e.preventDefault();
        console.log("location", userProvider?.user)
        if(createEventFormData.banner_image_url === ""){
            toast.error("Select and Upload image")
            return
        }
        let eventData = {
            ...createEventFormData, 
            is_ticketed: isTicketed,
            status: 'draft',
            location: {
                country: userProvider?.user?.location?.country,
                state,
                city,
                isPrivate: isLocationPrivate,
                onlineLink: isEventOnline ? 
                landmark: landmark || undefined
            }
        }
        console.log("submitting:", eventData)
        let result
        if(!event){
            result = await createEvent(eventData)
            if(!result.success) return;
            toast.success("Event Created Successfully", {position: 'top-center'})
            if(eventData.is_ticketed){
                moveToTickets(result.eventId, eventData.title, eventData.organiser)
            }else{
                navigate("/dashboard")
            }
        }else{
            result = await editEvent(event._id, eventData)
            if(!result.success) return;
            toast.success("Event Edited Successfully")
            if(eventData.is_ticketed){
                setShowAddMoreTicketOption(true)
            }else{
                setTimeout(()=>{
                    navigate("/dashboard")
                }, 1000)
            }
        }
    }

    async function handleUploadImage(){
        if(bannerImg.blob){
            let imageUrl = await uploadImage(bannerImg.blob)
            console.log("image url:", imageUrl)
            handleCreateEventChange({
                target: {
                    name: "banner_image_url",
                    value: imageUrl
                }
            })
            setBannerImg({...bannerImg, isUploaded: true})
        }
    }

    useEffect(()=>{
        for(let i=0; i < states.length; i++){
            setStatesArr((prev)=>[...prev, states[i].name])
        }
    }, [])

    useEffect(()=>{
        if(event){
            setCreateEventFormData({
                title: event.title,
                venue: event.venue,
                organiser: event.organiser,
                organiser_name: event.organiser_name,
                start_date: event.start_date.split("T")[0],
                end_date: event.end_date || undefined,
                start_time: event.start_time,
                end_time: event.end_time || undefined,
                category: event.category,
                banner_image_url: event.banner_image_url,
                additional_information: event.additional_information || undefined
            })
            setIsTicketed(event.is_ticketed)
            setState(event.location.state)
            setCity(event.location.city)
        }
    }, [event])

    useEffect(()=>{
        if(state !== ""){
            let st = states.find((singleState)=>singleState.name === state)
            setCitiesArr(st.lgas)
        }
    },[state])

    useEffect(()=>{
        if(userProvider?.user?._id == undefined){
            navigate("/dashboard")
        }
    })

    return(
        <form onSubmit={handleSubmitEvent} >
                    <p className="text-primary-dark text-[18px] md:text-[24px]">Event Details</p>
                    <div>
                        <Title title={"Event name *"} />
                        <TicketInput 
                            tagType={"input"} 
                            required
                            value={createEventFormData.title} 
                            name={"title"} 
                            onChange={handleCreateEventChange} 
                            placeholder={"Event name"} 
                        />
                    </div>
                    <div>
                        <Title title={"Upload Image"} />
                        <div className="w-full m-auto border border-primary-dark/50 flex flex-col justify-center items-center p-6 rounded-lg">
                            {
                                bannerImg.blob !== ""
                                ?
                                <label htmlFor="event_banner">
                                    <img src={URL.createObjectURL(bannerImg.blob)} alt="banner" className="w-[70%] m-auto" />
                                </label>
                                :
                                <label htmlFor="event_banner" className="cursor-pointer flex flex-col items-center w-full">
                                    {
                                        createEventFormData.banner_image_url
                                        ?
                                        <img src={createEventFormData.banner_image_url} alt="banner" className="w-[70%] m-auto" />
                                        :
                                        <AiOutlinePicture size={60} fontWeight={2} color="#3F1860" />
                                    }
                                    <p className="text-[18px] text-center text-primary-dark">Upload cover</p>
                                </label>
                            }
                            <input 
                                type="file" 
                                id="event_banner" 
                                accept="image/*" 
                                hidden={true}
                                onInput={(e)=>{
                                    setBannerImg({
                                        blob: e.target.files[0] || bannerImg.blob,
                                        isUploaded: false
                                    }); 
                                    console.log(URL.createObjectURL(e.target.files[0]), e.target.files[0])
                                }} />
                            {
                                bannerImg.blob
                                && 
                                <div onClick={isImageLoading ? undefined : handleUploadImage} className="py-[3px] text-primary-dark cursor-pointer px-4 border border-primary-dark rounded-sm my-2 w-auto">
                                    { 
                                        imageStatus.error
                                        ?
                                        <span>{imageStatus.message}.. Try again</span>
                                        :
                                        isImageLoading
                                        ?
                                        <span>uploading image ...</span>
                                        :
                                        bannerImg.isUploaded
                                        ?
                                        <span className="text-green-500">Image has been uploaded</span>
                                        :
                                        <span>Upload Image</span> 
                                    }
                                </div>
                            }
                        </div>
                    </div>
                    <div>
                        <Title title="Description" />
                        <TicketInput 
                            tagType={"textarea"} 
                            value={createEventFormData.additional_information} 
                            placeholder={"Write details about the event"}
                            name={"additional_information"} 
                            onChange={handleCreateEventChange} 
                        />
                    </div>
                    <div>
                        <Title title={"Categories *"} />
                        <div className="flex gap-3 flex-wrap">
                            <CategoryTab value={createEventFormData.category} category={"Music"} onChange={handleCreateEventChange} >
                                <TbMicrophone2 size={25} />
                            </CategoryTab>

                            <CategoryTab value={createEventFormData.category} category={"Food and Drink"} onChange={handleCreateEventChange}>
                                <MdOutlineFastfood size={25} />
                            </CategoryTab>

                            <CategoryTab value={createEventFormData.category} category={"Party and Nightlife"} onChange={handleCreateEventChange} >
                                <BiParty size={25} />
                            </CategoryTab>

                            <CategoryTab value={createEventFormData.category} category={"Art and Culture"} onChange={handleCreateEventChange} >
                                <MdPalette size={25} />
                            </CategoryTab>

                            <CategoryTab value={createEventFormData.category} category={"Career and Business"} onChange={handleCreateEventChange} >
                                <RiBriefcase4Line size={25} />
                            </CategoryTab>

                            <CategoryTab value={createEventFormData.category} category={"Fitness and Wellness"} onChange={handleCreateEventChange} >
                                <IoFitnessOutline size={25} />
                            </CategoryTab>

                            <CategoryTab value={createEventFormData.category} category={"Spirituality and Religion"} onChange={handleCreateEventChange} >
                                <PiHandsPrayingFill size={25} />
                            </CategoryTab>

                            <CategoryTab value={createEventFormData.category} category={"Fashion Design"} onChange={handleCreateEventChange} >
                                <GiSewingNeedle size={25} />
                            </CategoryTab>

                            <CategoryTab value={createEventFormData.category} category={"Classes"} onChange={handleCreateEventChange} >
                                <MdLaptop size={25} />
                            </CategoryTab>

                            <CategoryTab value={createEventFormData.category} category={"Comedy"} onChange={handleCreateEventChange}>
                                <MdTheaterComedy size={25} />
                            </CategoryTab>
                        </div>
                    </div>
                    
                    <div>
                        <Title title="Location" />
                        <div className="md:flex gap-3 w-full">
                            <TicketInput
                                tagType={"select"}
                                required
                                label={"state"}
                                placeholder={"Select State"}
                                value={state}
                                options={statesArr}
                                onChange={(e)=>{setState(e.target.value)}}
                            />
                            <TicketInput
                                tagType={"select"}
                                required
                                label={"city"}
                                placeholder={"Select City"}
                                value={city}
                                options={citiesArr && citiesArr}
                                onChange={(e)=>{setCity(e.target.value)}}
                            />
                        </div>
                        <TicketInput
                            tagType={"input"}
                            required
                            placeholder={"Full address"}
                            label={"Venue"}
                            value={createEventFormData.venue}
                            name={"venue"}
                            onChange={handleCreateEventChange}
                        />
                        <div className="flex justify-end">
                            <ToggleSwitch 
                                label="Private Location"
                            />
                        </div>
                        <div className="flex justify-between items-center pt-2 text-primary-dark">
                            <ToggleSwitch 
                                initialState={isEventOnline} onChange={(val)=>{
                                    console.log("link switch toggled", val)
                                    setIsEventOnline(val)
                                }} 
                                label="Online Event?" 
                            />
                        </div>
                        {
                            isEventOnline
                            &&
                            <TicketInput 
                                tagType="input"
                                value={onlineLink}
                                onChange={(e)=>{
                                    console.log("online link", e.target.value)
                                    setOnlineLink(e.target.value)
                                }}
                                placeholder={"Enter event link"}
                            />
                        }
                        <div className="md:w-[50%] m-auto">
                            <TicketInput 
                                tagType={"input"} 
                                value={landmark}
                                onChange={(e)=>{setLandmark(e.target.value)}}
                                placeholder={"Popular landmark near event address"} 
                                label={"Landmark (optional)"} 
                            />
                        </div>
                    </div>
                    <div>
                        <Title title={"Date and Time"} />
                        <div className="md:flex gap-3">
                            <TicketInput 
                                tagType={"input"}
                                required 
                                type={"date"} 
                                min={event ? today : nextDay}
                                label={"start date"}
                                name={"start_date"}
                                value={createEventFormData.start_date.split("T")[0]}
                                onChange={handleCreateEventChange}
                            />
                            <TicketInput 
                                tagType={"input"}
                                type={"date"}
                                label={"end date"}
                                name={"end_date"}
                                value={createEventFormData.end_date}
                                onChange={handleCreateEventChange}
                            />
                        </div>
                        <div className="md:flex gap-3">
                            <TicketInput
                                tagType={"input"}
                                required
                                type={"time"}
                                label={"start time"}
                                name={"start_time"}
                                value={createEventFormData.start_time}
                                onChange={handleCreateEventChange}
                            />
                            <TicketInput
                                tagType={"input"}
                                type={"time"}
                                label={"stop time"}
                                name={"end_time"}
                                value={createEventFormData.end_time}
                                onChange={handleCreateEventChange}
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-center">
                        <button 
                            className={`p-2 m-4 text-center ${eventsLoading ? "bg-grey-700" : "bg-primary-dark"} text-primary-orange rounded-md`}
                            disabled={eventsLoading}
                        >
                            {
                                eventsLoading
                                ?
                                <CustomLoader size={20} />
                                :
                                event
                                ?
                                "Submit"
                                :
                                "Continue"
                            }
                        </button>
                    </div>
                     <CustomModal
                        isOpen={showAddMoreTicketOption}
                        showCloseBtn={false}
                    >
                        <div className="pt-4 pb-4">
                            <p className="text-center text-[20px]">
                                Would you like to add more tickets to this event?
                            </p>
                            <div className="flex justify-center gap-4 pt-8">
                                <div 
                                    className="w-[100px] cursor-pointer text-center bg-primary-dark text-primary-orange pt-2 pb-2 pr-6 pl-6 rounded-full"
                                    onClick={()=> navigate("/dashboard")}
                                >
                                    No
                                </div>
                                <div 
                                    className="w-[100px] cursor-pointer text-center bg-primary-dark text-primary-orange pt-2 pb-2 pr-6 pl-6 rounded-full"
                                    onClick={()=>{
                                        moveToTickets(event._id, event.title, event.organiser)
                                    }}
                                >
                                    Yes
                                </div>
                            </div>
                        </div>
                    </CustomModal>
                </form>
    )
}

function CategoryTab({value, category, children, onChange}){
    let [isChecked, setIsChecked] = useState(false)

    useEffect(()=>{
        if(value?.includes(category)){
            setIsChecked(true)
        }
    }, [value])

    return(
        <div className="w-[72px]">
            <label htmlFor={category} >
                <div className={`flex items-center justify-center ${isChecked && "bg-gray-500"} border-[2px] border-primary-dark rounded-md p-2 h-[70px] text-primary-dark`}>
                    {children}
                </div>
                <p className="text-center text-[10px] font-medium text-primary-dark">{category}</p>
            </label>
            <input type="checkbox" checked={isChecked} onChange={(e)=>{setIsChecked(!isChecked); onChange(e)}} name="category" value={category} id={category} hidden />
        </div>
    )
}

function Title({title}){
    return(
        <h3 className="text-primary-dark my-4 font-medium text-[16px] md:text-[20px]">{title}</h3>
    )
}

// function TicketedTab({priceType, isTicketed, setIsTicketed}){
//     let [selected, setSelected] = useState("")

//     function toggleIsTicketed(){
//         setIsTicketed(priceType === "free" ? false : true)
//     }

//     useEffect(()=>{
//         setSelected(isTicketed ? "paid" : "free")
//     }, [isTicketed])

//     return (
//         <div onClick={toggleIsTicketed} className={`w-full text-center cursor-pointer ${priceType === selected ? "bg-primary-dark" : "bg-[#F7F7F7]"} text-primary-orange`}> 
//             {priceType}
//         </div> 
//     )
// }