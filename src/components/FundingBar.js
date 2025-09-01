import React from 'react';

const FundingBar = () => {
  return (
    <div className="fixed bottom-4 right-4 flex items-center bg-white rounded-lg shadow-lg border px-3 py-2 space-x-3 z-50">
      <img 
        src="/UKRI-Logo_Horiz-RGB.png" 
        alt="UKRI" 
        className="h-6"
      />
      <img 
        src="/eu_co_funded_en.jpg" 
        alt="EU Co-funded" 
        className="h-6"
      />
    </div>
  );
};

export default FundingBar;
