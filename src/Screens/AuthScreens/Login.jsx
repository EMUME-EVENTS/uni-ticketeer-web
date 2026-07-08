import { useState } from "react";
import { IoEye } from "react-icons/io5";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import CustomLoader from "../../components/CustomLoader";
import { AuthInput } from "../../modules/Auth/AuthInput.jsx";

export default function Login(){
    const {login, loginLoading, status} = useLogin()

    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')

    async function submitLogin(e){
        e.preventDefault()
        login({email: email, password: password})
    }

    return(   
        <div className="w-full h-full bg-white md:px-6 content-start md:content-center rounded-t-xl md:rounded-tr-none">
            <div className="h-auto p-5 my-10 rounded-2xl">
                <h1 className="text-[30px] md:text-[40px] lg:text-[60px] text-center leading-[100%] text-primary-dark my-4">Welcome Back</h1>
                <hr></hr>
                <p className="py-3 text-center text-[#CCCCCC] ">Enter your details to sign in</p>
                {status.error && <div className="text-red-500 text-sm text-center font-medium">{status.message}</div>}
                <form className="" onSubmit={submitLogin}>
                    <AuthInput 
                        //label={"Email*"}
                        inputtype={"email"}
                        placeholder={"Email"}
                        required={true}
                        value={email}
                        onChange={(e)=>{
                            setEmail(e.target.value)
                        }}
                    />
                    <AuthInput 
                        //label={"Password*"}
                        type={"password"}
                        inputtype={"password"}
                        required={true}
                        value={password}
                        placeholder={"*******"}
                        onChange={(e)=>{
                            setPassword(e.target.value)
                        }}
                    />
                    <div className="text-right p-2 text-primary-dark">
                        <Link to={"/auth/forgot-password"}>
                            Forgot password?
                        </Link>
                    </div>
                    <button 
                        disabled={loginLoading} 
                        className={`w-full p-2 ${loginLoading ? "bg-[#EEE] text-[#555]" : "bg-primary-dark text-primary-orange"} rounded-2xl border-xl`}
                    >
                        {
                            loginLoading
                            ?
                            <CustomLoader size={20} />
                            :
                            "Login"
                        }
                    </button>
                    <div className="pt-2 text-primary-dark">
                        Don't have an account? <Link className="cursor-pointer hover:underline" to={"/getstarted"}>Sign Up</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}