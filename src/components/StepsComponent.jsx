export default function SignupStep({ steps, currentStep }) {
  return (
    <div>
      {/* mobile description */}
      <div className="text-center md:hidden text-[16px]">
        {currentStep}
      </div>
      {/* mobile steps */}
      <div className="flex gap-1 justify-center items-center py-2 md:hidden">
        {
          steps.map((step, i)=>{
            const isActive = i <= steps.indexOf(currentStep);
            const isCurrent = step == currentStep;
            const isLast = i === steps.length - 1;

            return(
              <div className={`flex-1 h-[4px] ${isActive ? "bg-primary-dark" : "bg-[#CCC]"}`} />
            )
          })
        }
      </div>
      {/* desktop description */}
      <div className="hidden md:flex justify-between">
        {
          steps.map((step)=>(
            <p className="text-[20px] font-light text-primary-dark">{step}</p>
          ))
        }
      </div>
      {/* desktop steps */}
      <div className="hidden md:flex items-center w-full p-2">
        {steps.map((step, i) => {
          const isActive = i <= steps.indexOf(currentStep);
          const isCurrent = step == currentStep;
          const isLast = i === steps.length - 1;

          return (
            <div key={step} className={`flex items-center ${isLast ? "w-auto" : "flex-1"}`}>
              {/* Circle */}
              <div
                className={`
                  shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                  text-sm font-semibold transition-all duration-300
                  ${isActive
                    ? "bg-primary-dark text-white"
                    : "border border-primary-dark text-orange-500 bg-transparent"
                  }
                `}
              >
                {
                  isActive && !isCurrent
                  &&
                  <span>&#10003;</span>
                }
                {
                  isCurrent
                  &&
                  <span>...</span>
                }
              </div>

              {/* Connector */}
              {!isLast && (
                <div className={`flex-1 h-[2px] ${isActive && !isCurrent ? "bg-primary-dark" : "bg-[#CCC]"} mx-1`}/>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}