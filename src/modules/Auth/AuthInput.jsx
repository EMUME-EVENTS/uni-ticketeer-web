import { useState } from "react";
import { LuEyeClosed } from "react-icons/lu";


export function AuthInput({label, type, inputtype, required, placeholder, name, value, options, onChange}){

    let [passType, setPassType] = useState('password')

    function togglePass(){
        setPassType(passType === 'password' ? 'text' : 'password')
    }

    return(
        <div className="w-full">
            <div className="font-bold text-primary-dark">{label}</div>
            {
                type == "select"
                ?
                <div className="p-2 my-2 border-2 rounded-full">
                    <select required={required} placeholder={placeholder} name={name} value={value} onChange={onChange} className="outline-none text-primary-dark bg-inherit w-full">
                        {options?.map((option, i)=>(<option key={i} value={option.value}>{option.label}</option>))}
                    </select>
                </div>
                :
                <div className="flex items-center p-2 my-2 border-2 rounded-full">
                    <input type={type === "password" ? passType : inputtype} required={required} placeholder={placeholder} name={name} value={value} onChange={onChange} className="outline-none text-primary-dark bg-inherit w-full"/>
                    {type === "password" && <LuEyeClosed onClick={togglePass} />}
                </div>
            }
        </div>
    )
}