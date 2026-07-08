import { useState } from "react"
import useLogin from "../../hooks/useLogin"
import {AuthInput} from "../../modules/Auth/AuthInput.jsx"
import CustomLoader from "../../components/CustomLoader"

export default function ForgotPassword(){
    let {status, loginLoading, getResetPasswordLink } = useLogin()
    let [email, setEmail] = useState("")

    async function submitResetPassword(e){
        e.preventDefault()
        await getResetPasswordLink(email)
    }
    
    
    return(
        <div className="h-full content-start md:content-center bg-white p-5 rounded-2xl">
            <h1 className="text-[30px] lg:text-[60px] text-center leading-[100%] text-primary-dark my-2">Password Reset</h1>
            <hr></hr>
            <p className="py-3 text-sm text-center text-[#CCCCCC] ">A link to reset your password would be sent to your mail</p>
            {status.error && <div className="text-red-500 text-md text-center font-medium">{status.message}</div>}
            <form className="" onSubmit={submitResetPassword}>
                <AuthInput 
                    //label={"Enter Email"}
                    placeholder={"Email"}
                    required={true}
                    inputtype={"email"}
                    value={email}
                    onChange={(e)=>{
                        setEmail(e.target.value)
                    }}
                />
                <button 
                    disabled={loginLoading} 
                    className={`w-full mt-4 p-2 ${loginLoading ? "bg-[#EEE] text-[#555]" : "bg-primary-dark text-primary-orange"} rounded-2xl border-xl`}
                >
                    {
                        loginLoading
                        ?
                        <CustomLoader size={20} />
                        :
                        "Get Link"
                    }
                </button>
            </form>
        </div>
    )
}