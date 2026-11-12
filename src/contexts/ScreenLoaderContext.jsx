import { createContext, useContext, useEffect, useState } from "react";
import CustomModal from "../components/CustomModal";
import CustomLoader from "../components/CustomLoader";

const ScreenLoaderContext = createContext({isLoading: false, loaderText: "", setIsLoading: ()=>{}, setLoaderText: ()=>{}})

export function ScreenLoaderProvider({children}){
    let [isLoading, setIsLoading] = useState(false)
    let [loaderText, setLoaderText] = useState("")
    return(
        <ScreenLoaderContext.Provider value={{isLoading, loaderText, setIsLoading, setLoaderText}}>
            {children}
            <CustomModal
                isOpen={isLoading}
                closeModal={()=>{}}
                showCloseBtn={false}
                isLoadingModal={true}
            >
                <div className="md:w-[500px] w-[100%]">
                    <CustomLoader />
                    <div className="text-center mt-4 text-sm text-primary-dark">
                        {loaderText}
                    </div>
                </div>
            </CustomModal>
        </ScreenLoaderContext.Provider>
    )
}

export function useScreenLoaderProvider(isLoading=false, loaderText=""){
    const loaderContext = useContext(ScreenLoaderContext)

    useEffect(()=>{
        loaderContext.setIsLoading(isLoading)
        loaderContext.setLoaderText(loaderText)
    }, [isLoading])
}