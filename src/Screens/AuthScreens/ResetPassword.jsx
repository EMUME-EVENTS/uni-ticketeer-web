import { useState } from "react"
import useLogin from "../../hooks/useLogin"
import { AuthInput } from "../../modules/Auth/AuthInput.jsx"
import { useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import CustomLoader from "../../components/CustomLoader"

export default function ResetPassword(){
    let { status, loginLoading, resetPassword } = useLogin()
    let [searchParams, setSearchParams] = useSearchParams()

    let userid = searchParams.get("userid")
    let token = searchParams.get("token")

    console.log("userid", userid, "token", token)

    let [password, setPassword]= useState("")
    let [confirmPass, setConfirmPass] = useState("")

    async function submitResetPassword(e){
        e.preventDefault()
        if(password !== confirmPass){
            toast.warning("Passwords don't match")
            return
        }

        await resetPassword(userid, token, {new_password: password})
    }
    return(
        <div className="h-full content-start md:content-center bg-white p-5 rounded-2xl">
            <h1 className="text-[30px] md:text-[40px] lg:text-[60px] text-center leading-[100%] text-primary-dark my-2">Password Reset</h1>
            <hr></hr>
            <p className="py-3 text-sm text-center text-[#CCCCCC] ">Enter and confirm password to reset</p>
            {status.error && <div className="text-red-500 text-md text-center font-medium">{status.message}</div>}
            <form className="" onSubmit={submitResetPassword}>
                <AuthInput 
                    //label={"Password"}
                    placeholder={"*******"}
                    required={true}
                    inputtype={"password"}
                    type={"password"}
                    value={password}
                    onChange={(e)=>{
                        setPassword(e.target.value)
                    }}
                />
                <AuthInput 
                    //label={"Confirm Password"}
                    placeholder={"*******"}
                    required={true}
                    inputtype={"password"}
                    type={"password"}
                    value={confirmPass}
                    onChange={(e)=>{
                        setConfirmPass(e.target.value)
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