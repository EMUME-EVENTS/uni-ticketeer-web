import NairaSymbol from "./NairaSymbol";

export default function NewOverviewCard({
    title, 
    icon,
    amount,
    active, 
    isCurrencyCard, 
    description, 
    metricDescription,
    setActive
}){
    return(
        <div className={`relative ${active === title && "bg-gradient-to-tl from-primary-dark to-purple-400"} p-4 rounded-2xl bg-[#EEEEEE]`}>
            <div className="absolute top-2 right-2">
                {icon}
            </div>
            <p className={`${active === title && "text-primary-light"} text-primary-dark capitalize md:text-[16px] font-medium`}>{title}</p>
            <p className={`${active === title && "text-primary-light"} text-primary-dark text-[24px] md:text-[40px] font-medium`}>
               {isCurrencyCard && <NairaSymbol />} {amount} {description && <span className="text-[16px]">{description}</span>}
            </p>
            {
                metricDescription &&
                <p className="text-[12px]">
                   {metricDescription}
                </p>
            }
        </div>
    )
}