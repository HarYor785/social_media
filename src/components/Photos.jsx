import React from 'react'


const Photos = ({photos}) => {

  return (
    <div className='w-full mt-6 flex flex-col gap-8 md:h-[600px] h-fit'>
        <div className='w-full bg-secondary flex flex-col 
            gap-5 p-4 rounded-lg'>
                <div className='w-full flex flex-wrap gap-0'>
                  {photos?.map((item, index) => {
                if (typeof item === 'string') {
                  // If item is a string, assume it's a URL and render it as an image
                  return (
                    <div key={index} className="w-1/3">
                      <img src={item} className="w-full h-32" alt={`Image ${index}`} />
                    </div>
                  );
                } else if (item?.profilePicUrl && item?.coverPicUrl) {
                  // If item is an object with profilePicUrl and coverPicUrl, render both images
                  return (
                    <div key={index} className="w-1/3 flex">
                      {/* Render profile pic */}
                      <img src={item?.profilePicUrl} className="w-full h-32" alt={`Profile Image ${index}`} />
              
                      {/* Render cover pic */}
                      <img src={item?.coverPicUrl} className="w-full h-32" alt={`Cover Image ${index}`} />
                    </div>
                    );
                    } else {
                      // Handle other cases as needed
                      return null;
                    }
                  })}
                </div>
            </div>
    </div>
  )
}

export default Photos