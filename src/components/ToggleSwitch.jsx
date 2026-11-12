import { useState } from 'react';

export default function ToggleSwitch({ 
  label = "Enable feature", 
  initialState = false, 
  onChange 
}) {
  const [enabled, setEnabled] = useState(initialState);

  const handleToggle = () => {
    const newState = !enabled;
    setEnabled(newState);
    if (onChange) onChange(newState);
  };

  return (
    <label className="inline-flex items-center justify-between gap-4 cursor-pointer select-none">
      {/* Label text */}
      {label && (
        <span className="text-sm font-medium text-primary-dark dark:text-gray-300">
          {label}
        </span>
      )}
      
      {/* Hidden checkbox container */}
      <div className="relative">
        <input 
          type="checkbox" 
          checked={enabled}
          onChange={handleToggle}
          className="sr-only peer" 
        />
        
        {/* Track / Background */}
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:primary-dark dark:peer-focus:primary-dark rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-dark"></div>
      </div>
    </label>
  );
}
