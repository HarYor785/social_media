import CustomButton from "./CustomButton"
import {Link} from "react-router-dom"

const FriendRequestCard = ({req, acceptRequest,deleteRequest, key})=>{
    return (

        <div 
        key={key}
        className='w-full bg-secondary px-5 py-5 rounded-lg
        flex flex-col gap-3'>
          {/* FRIENDS IMG & NAME */}
          <Link 
          to={`/profile/${req?.fromUser?._id}`}
          className='w-full flex gap-2'>
            <img src={req?.fromUser?.profilePicUrl ?? noProfile}
            className='w-12 h-12 rounded-lg'
            alt="AVATAR" />
            <span className='text-ascent-2 text-sm block'>
              <b className='mr-1'>{req?.fromUser?.firstName + " " + req?.fromUser?.lastName}</b>
                wants to add you to friends
            </span>
          </Link>
          {/* ACCEPT OR DECLINE BUTTON */}
          <div className='w-full flex gap-4 items-center justify-between'>
            <CustomButton
            onClick={()=>acceptRequest(req?._id)}
            label="Accept"
            styles="w-full bg-blue text-white font-bold py-1 rounded-lg
            border-2 border-blue"
            />
            <CustomButton
            onClick={()=>deleteRequest(req?.fromUser?._id)}
            label="Decline"
            styles="w-full bg-none text-ascent-2 border-2 border-ascent-3 
            font-bold py-1 rounded-lg"
            />
          </div>
        </div>
    )
}


export default FriendRequestCard