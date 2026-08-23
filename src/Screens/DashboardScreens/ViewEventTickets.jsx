import { IoCalendar, IoLocationOutline, IoTimerOutline } from 'react-icons/io5'
import { useParams } from "react-router"
import dayjs from "dayjs"
import Event1 from '../../images/Event-1.jpg'
import { useEffect, useState, useContext } from 'react'
import useTickets from "../../hooks/useTickets"
import useEvents from "../../hooks/useEvents"
import { formatTime, formatDay, isEventPast, isUserOrganiser } from "../../global/helpers"
import { UserContext, useUserProvider } from "../../contexts/UserContext"
import { toast } from 'react-toastify'
import { useScreenLoaderProvider } from '../../contexts/ScreenLoaderContext'
import useCart from '../../hooks/useCart'
import { useCartProvider } from '../../contexts/CartContext'
import CustomLoader from '../../components/CustomLoader'
import Line from '../../components/Line'

export default function ViewEventTickets(){
    let { id } = useParams()
    let userProvider = useUserProvider()
    let cartProvider = useCartProvider()
    let { tickets, addTicketToCart, ticketsLoading, ticketStatus } = useTickets(id)
    let { events, eventsLoading, eventsStatus } = useEvents()

    let [ticketsToBuy, setTicketsToBuy] = useState([])
    let [singleEvent, setSingleEvent] = useState(null)

    let [addToCartLoading, setAddToCartLoading] = useState(false)

    function setTicketQuantity(i, newQuantity){
        console.log("ticket index to set", i, "ticket quantity", newQuantity)
        ticketsToBuy[i].quantity = newQuantity
        setTicketsToBuy([...ticketsToBuy])
    }

    async function addToCart(){
        if(!ticketsToBuy.find((ticket)=> ticket.quantity > 0)){
            toast.warn("No Ticket(s) selected", {position: 'top-center'})
            return
        }
        setAddToCartLoading(true)
        for(let i=0; i < ticketsToBuy.length; i++){
            console.log("item being added to cart", ticketsToBuy[i])
            if(ticketsToBuy[i].quantity > 0){
                let result = await addTicketToCart(ticketsToBuy[i].ticket_info._id, {quantity: ticketsToBuy[i].quantity})
                if(!result.success){
                    setAddToCartLoading(false)
                    return
                }else{
                    ticketsToBuy[i].quantity = 0
                    setTicketsToBuy([...ticketsToBuy])
                }
            }
        }
        await cartProvider.getCart()
        toast.success("Ticket(s) added to cart", {position: 'top-center'})
        setAddToCartLoading(false)
    }

    
    useEffect(()=>{
        let _ticketsToBuy = tickets?.map((ticket)=> (
            {
                ticket_info: ticket, 
                user_info: {
                    user_id: userProvider?.user?._id,
                    user_name: userProvider?.user?.username,
                    user_email: userProvider?.user?.email
                },
                quantity: 0
            }
        ))
        console.log("tickets to buy", _ticketsToBuy)
        setSingleEvent(events?.find((event)=>event._id == id))
        setTicketsToBuy(_ticketsToBuy)
    },[events, tickets, userProvider?.user])

    useScreenLoaderProvider(addToCartLoading, "adding Tickets to cart")

    return(
        <div className='md:w-[80%] md:m-auto'>
            <div className="text-primary-dark w-full md:justify-between md:flex gap-4">
                <div className='md:w-[40%] h-[45vh] m-auto border-4 border-primary-dark rounded-lg'>
                    <img src={singleEvent?.banner_image_url} alt='event banner' className='w-[100%] h-[100%] rounded-md' />
                </div>
                <div className='md:w-[50%] m-auto my-2 py-2 text-primary-dark'>
                    <h3 className='text-center text-lg font-medium'>{singleEvent?.title}</h3>
                    <div className='md:flex justify-between my-2 py-2'>
                        <div>
                            <div className='flex items-center my-4'>
                                <div className="border-[1px] border-primary-dark p-[4px] rounded-md">
                                    <IoTimerOutline className="text-primary-dark" />
                                </div>
                                <p className="ml-2 text-[12px] font-bold">{singleEvent && formatTime(singleEvent?.start_time)}</p>
                            </div>
                            <div className='flex items-center my-4'>
                                <div className="border-[1px] border-primary-dark p-[4px] rounded-md">
                                    <IoCalendar className="text-primary-dark" />
                                </div>
                                <p className="ml-2 text-[12px] font-bold">{formatDay(singleEvent && formatDay(singleEvent?.start_date))}</p> 
                            </div>
                            <div className='flex items-center my-4'>
                            <div className="border-[1px] border-primary-dark p-[4px] rounded-md">
                                <IoLocationOutline className="text-primary-dark" />
                            </div>
                            <p className="ml-2 text-[12px] font-bold">{singleEvent?.venue}</p>
                            </div>
                        </div>
                        <div>
                            <p className='my-4'><b>Organisers:</b> {singleEvent?.organiser_name} </p>
                            <p className='my-4'><b>Contacts:</b> </p>
                        </div>
                    </div>
                </div>
            </div>
            <Line />
            {
                singleEvent?.additional_information
                &&
                <div className='text-center text-primary-dark my-4'>
                    <p className='font-bold'>About</p>
                    <p className='font-medium'>
                       {singleEvent?.additional_information}
                    </p>
                    <Line />
                </div>
            }
            {
                isUserOrganiser(userProvider?.user)
                ?
                <div className='text-center text-primary-dark p-4'> 
                    Organiser Accounts cannot purchase Tickets 
                </div>
                :
                isEventPast(singleEvent?.start_at)
                ?
                <div className='text-center flex justify-center items-center text-primary-dark p-4 h-[20vh]'> 
                    This Event has ended and you can no longer purchase tickets 
                </div>
                :
                ticketsLoading
                ?
                <div className='text-center p-4 text'>
                    <CustomLoader />
                </div>
                :
                ticketStatus.status === 404
                ?
                <div className='text-center'> No ticket(s) found for this event </div>
                :
                <div className='my-4 text-primary-dark'>
                    <h3 className='font-medium text-primary-dark text-center'>Choose Ticket</h3>
                    <div className='border-2 border-primary-dark rounded-md p-4 my-4'>
                        <div className='flex justify-between'>
                            <p className='w-[30%] font-bold'>Categories</p>
                            <p className='w-[30%] font-bold'>Price</p>
                            <p className='font-bold'>Quantity</p>
                        </div>
                        {
                            ticketsToBuy?.map((ticket, i)=><TicketDetailsTab key={i} index={i} category={ticket.ticket_info?.ticket_type} price={ticket?.ticket_info?.ticket_price} quantity={ticket.quantity} setQuantity={setTicketQuantity} />)
                        }
                    </div>
                    <div 
                        className='bg-primary-dark w-[50%] md:w-[20%] p-2 text-primary-orange text-center rounded-full m-auto cursor-pointer'
                        onClick={addToCart}
                    >
                        Add to cart
                    </div>
                </div>
            }

            <div className='text-primary-dark'>
                <h3 className='text-2xl font-bold'>More Events Like This</h3>
                <div>
                    
                </div>
            </div>
        </div>
    )
}

function TicketDetailsTab({category, quantityLeft, index, price, quantity = 0, setQuantity}){

    function decreaseTicketQuantity(){
        if(quantity > 0){
            console.log("ticket index", index, "ticket quantity", quantity)
            let newquantity = quantity - 1
            setQuantity(index, newquantity)
        }
    }

    function increaseTicketQuantity(){
        let newquantity = quantity + 1
        console.log("ticket index", index, "ticket quantity", newquantity)
        setQuantity(index, newquantity)
    }

    return(
        <div className='flex items-center justify-between my-2'>
            <div className='w-[30%]'>
                <p>{category}</p>
                {
                    quantityLeft
                    &&
                    <p className='text-[11px]'>{`(${quantityLeft} tickets remaining)`}</p>
                }
            </div>
            <p className='w-[30%]'>{price}</p>
            <div className='flex justify-between'>
                <div onClick={decreaseTicketQuantity} className='flex justify-center items-center cursor-pointer rounded-md text-primary-dark border-[1px] border-primary-dark w-[20px] h-[20px] bg-primary-orange'>-</div>
                <input value={quantity} disabled className='w-[20px] h-[20px] mx-2' />
                <div onClick={increaseTicketQuantity} className='flex justify-center items-center cursor-pointer rounded-md text-primary-dark border-[1px] border-primary-dark w-[20px] h-[20px] bg-primary-orange'>+</div>
            </div>
        </div>
    )
}