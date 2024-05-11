const Stepper = ({ currentStep }) => {
    const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];
    return (
      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${currentStep > index + 1 ? 'border-blue-500' : 'border-gray-200'}`}></div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  export default Stepper;