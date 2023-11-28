import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment/moment';
import {useInView} from "react-intersection-observer"
import ReactPlayer from "react-player"

//ICONS
import { CiMenuKebab } from "react-icons/ci";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { AiOutlineComment } from "react-icons/ai";
import { IoShareSocialOutline, IoBookmark } from "react-icons/io5";
import { MdOutlineEdit,MdDeleteOutline,MdCancel } from "react-icons/md";

//COMPONENTS
import CustomButton from './CustomButton';
import { noProfile } from '../assets';
import Loader from './Loader';

//UTILS
import { apiRequest, getComments } from '../utils';



const CommentForm = ({user, replyAt, id, reloadGetComments}) => {
    const [errorMsg, setErrMsg] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")

    const {
        register,
        handleSubmit,
        formState:{errors},
        reset
    } = useForm({mode: "onChange"})

    const commentPost = async (data)=>{
        setIsLoading(true)
        setMessage("")
        try {
            const newData = {
                comment: data?.comment,
                commentFrom: user?.firstName + " " + user?.lastName,
                replyAt: replyAt
            }
            const newUrl = replyAt 
                ? `/post/reply-comment/${id}`
                : `/post/comment/${id}`

            const res = await apiRequest({
                url: newUrl,
                method: "POST",
                data: newData,
                token: user?.token
            })

            if(res?.success){
                setErrMsg(false)
                await reloadGetComments()
                reset({comment: ""})
            }else{
                setErrMsg(true)
                setMessage(res?.message)
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    return <div className='flex flex-col border-t-[1px] border-ascent-3'>
        <form 
        onSubmit={handleSubmit(commentPost)}
        className='w-full flex flex-col items-center bg-secondary 
        rounded-lg gap-2 px-4 py-2 border-b border-[#66666645]'>
            {message && (
                <span 
                role='alert'
                className={`text-sm 
                ${errorMsg
                ? 'text-[#f64949fe]' 
                : 'text-[#2ba150fe]'} 
                mt-0.5`}>
                {message}
                </span>
            )}
            <div className='flex gap-2 w-full'>
                <img 
                src={user?.profilePicUrl ?? noProfile} 
                className='h-8 w-8 rounded-lg'
                alt="Avatar" />
                <input 
                name='comment'
                type="text"
                className='flex-1 bg-none outline-none border-none w-full 
                h-full text-ascent-2'
                placeholder={replyAt ? `Reply @${replyAt}`: "Write a comment"}
                {...register("comment",{
                    required: "Write something..."
                })}
                />
            </div>
            {errors?.comment 
            ? <span className='text-sm text-[#f64949fe]'>{errors?.comment?.message}</span> 
            : ""}
            {isLoading ? (<Loader/>):(
                <div className='flex justify-end items-end w-full'>
                    <CustomButton
                    type="submit"
                    label={replyAt ? "Reply" : "Comment"}
                    styles="bg-blue text-white py-1.5 px-2 rounded-lg text-sm"
                    />
                </div>
            )}
        </form>
    </div>
}

const ReplyCard = ({reply, handleLike, user, handleDeleteReply})=>{
    const [menuTab, setMenuTab] = useState(false)
    return (

        <div className='border-t-[1px] border-ascent-3 px-5'>
            {/* REPLIES */}
                <div className='mt-4 flex flex-col gap-3'>
                    <div className='flex items-center justify-between'>
                        <Link 
                        to={reply?.userId?._id === user?._id ? "/profile" : `/profile/${reply?.userId?._id}`}
                        className='flex gap-3'>
                            <img 
                            src={reply?.userId?.profilePicUrl ?? noProfile}
                            className='w-10 h-10 rounded-lg' 
                            alt="" />
                            <div className='flex flex-col gap-0.5'>
                                <span className='text-ascent-1 md:text-[14px] text-[12px]'>
                                    {reply?.userId?.firstName + " " + reply?.userId?.lastName}
                                </span>
                                <span className='text-ascent-3 text-sm'>
                                    {moment(reply?.createdAt).fromNow()}
                                </span>
                            </div>
                        </Link>

                        {/* POST ACTION BUTTONS */}
                        {reply?.userId?._id === user?._id &&  (
                            <button className='relative text-ascent-1 text-lg'>
                                <CiMenuKebab onClick={()=>setMenuTab(!menuTab)}/>
                                { menuTab && (
                                <div className='absolute w-[100px] h-fit py-2 gap-2 px-4 bg-primary 
                                right-0 flex items-start flex-col shadow-lg rounded-lg'>
                                    <button 
                                    onClick={()=>handleDeleteReply(reply?._id)}
                                    className='text-base text-ascent-3 hover:text-ascent-1 
                                    transition-all duration-300 ease-in-out flex gap-1
                                    items-center'
                                    >
                                        <MdDeleteOutline size={16}/> Delete
                                    </button>
                                </div>
                                )}
                            </button>
                        )}
                        
                    </div>
                    <div className='flex flex-col items-start gap-3'>
                        <p className='text-ascent-2 text-sm'>
                            {reply?.comment}
                        </p>
                        <div className='flex gap-3'>
                            <button 
                            onClick={handleLike}
                            className='flex items-center gap-2 text-ascent-1'
                            >
                                {reply?.likes?.includes(user?._id) 
                                    ? <BiSolidLike className='text-1xl text-blue'/>
                                    :<BiLike className='text-1xl'/>
                                }
                                <span className='text-sm'>
                                    {reply?.likes?.length} Likes
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
        </div>
    )
}


const PostCard = ({post,key, postLike, deletePosts, hidePost, savePost}) => {
    const {user} = useSelector((state)=>state.user)
    const [showAll, setShowAll] = useState(0)
    const [menuTab, setMenuTab] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [commentTab, setCommentTab] = useState()
    const [comment, setComment] = useState([])
    const [showReplies, setShowReplies] = useState()
    const [replyComment, setReplyComment] = useState()
    const [showComment, setShowComment] = useState(0)
    const [ref, inView] = useInView()
    const [isPlaying, setIsPlaying] = useState(false)

    const handlePlay = () => {
        if (inView) {
          setIsPlaying(true);
        }
      };
    
      const handlePause = () => {
        if (!inView) {
          setIsPlaying(false);
        }
      };
    
      useEffect(() => {
        handlePlay();
        handlePause();
      }, [inView]);
    
      // This useEffect handles the case where you've scrolled past the element
      useEffect(() => {
        if (!inView) {
          setIsPlaying(false);
        }
      }, [inView]);

    const getPostsComment = async (id)=>{
        const result = await getComments(user?.token, id)
        setComment(result?.data)
        setIsLoading(false)
    }

    const handleLikePost = async (url, postId)=>{
        await postLike(url)
        await getPostsComment(postId)
    }

    const handleDeletePost = async (postId)=>{
        await deletePosts(postId)
        await getPostsComment(postId)
        setMenuTab(0)
    }

    const handleDeleteComment = async (id, postId)=>{
        const res = await apiRequest({
            url: `/post/delete-comment/${id}`,
            method: "DELETE",
            token: user?.token
        })

        if(res?.success){
            await getPostsComment(postId)
            window.alert(res?.message)
        }else{
            window.alert(res?.message)
        }
    }

    const handleDeleteReply = async (url, postId)=>{
        const res = await apiRequest({
            url: url,
            method: "DELETE",
            token: user?.token
        })

        if(res?.success){
            window.alert(res?.message)
            await getPostsComment(postId)
        }else{
            window.alert(res?.message)
        }
    }

    const handleSavePost = async (id)=>{
        setMenuTab(0)
        await savePost(id)
    }

  return (
    <div className='w-full mt-6 flex flex-col gap-8'>

       
            <div 
            key={key}
            className='w-full bg-secondary flex flex-col gap-3 p-4 rounded-lg'>
                <div className='flex items-center justify-between'>
                    <Link 
                    to={`/profile/${post?.userId?._id}`}
                    className='flex gap-3'>
                        {/* USER IMG */}
                        <img 
                        src={`${post?.userId?.profilePicUrl 
                        ?? noProfile}`}
                        className='w-12 h-12 rounded-lg' 
                        alt="" />
                        {/* USER NAME AND POST DATE */}
                        <div className='flex flex-col gap-0.5'>
                            <span className='text-ascent-1 text-base'>
                                {post?.userId?.firstName + " " + post?.userId?.lastName}
                            </span>
                            <span className='text-ascent-3 text-sm'>
                                {moment(post?.createdAt).fromNow()}
                            </span>
                        </div>
                    </Link>
                    {/* POST ACTION BUTTONS */}
                    <button className='relative text-ascent-1 text-lg'>
                        <CiMenuKebab onClick={()=>setMenuTab(
                            menuTab === post?._id ? 0 : post?._id
                        )}/>
                        {menuTab === post?._id && (
                        <div className='absolute w-[150px] h-fit py-2 gap-2 px-4 bg-primary 
                        right-0 flex items-start flex-col shadow-lg rounded-lg'>
                            <button 
                            onClick={()=>{handleSavePost(post?._id)}}
                            className='text-base text-ascent-3 hover:text-ascent-1 
                            transition-all duration-300 ease-in-out flex gap-1
                            items-center'
                            >
                                <IoBookmark size={20}/> Save Post
                            </button>
                            <button 
                            onClick={()=>{
                                hidePost(post?._id)
                                setMenuTab(0)
                            }}
                            className='text-base text-ascent-3 hover:text-ascent-1 
                            transition-all duration-300 ease-in-out flex gap-1
                            items-center'
                            >
                                <MdCancel size={20}/> Hide Post
                            </button>
                            {post?.userId?._id === user?._id && (<>
                                <button 
                                onClick={()=>setMenuTab(0)}
                                className='text-base text-ascent-3 hover:text-ascent-1 
                                transition-all duration-300 ease-in-out flex gap-1
                                items-center'
                                >
                                    <MdOutlineEdit size={20}/> Edit Post
                                </button>
                                <button 
                                onClick={()=>{
                                    handleDeletePost(post?._id)
                                    setMenuTab(0)
                                }}
                                className='text-base text-ascent-3 hover:text-ascent-1 
                                transition-all duration-300 ease-in-out flex gap-1
                                items-center'
                                >
                                    <MdDeleteOutline size={20}/> Delete Post
                                </button>
                                </>
                            )}
                        </div>
                        )}
                    </button>
                </div>
                {/* POST DESCRIPTION */}
                <div className='flex flex-col w-full gap-3' onClick={()=>setMenuTab(0)}>
                    <p className='text-ascent-2 text-base'>
                        { showAll === post?._id 
                        ? post.description
                        : post?.description?.slice(0, 300)
                        }
                        {
                            post?.description?.length > 301 && (
                                showAll === post?._id ?(
                                    <span className='text-blue ml-2 font-medium cursor-pointer'
                                    onClick={() => setShowAll(0)}
                                    >
                                        Show Less
                                    </span> 
                                    ) : ( 
                                    <span className='text-blue ml-2 font-medium cursor-pointer'
                                    onClick={() => setShowAll(post?._id)}
                                    >
                                        Show More
                                    </span>
                                    )
                            )
                        }
                    </p>

                    {/* POST IMAGE  && VIDEO PLAYER */}
                    {post?.file && post?.file?.includes("video") ? (
                        <div ref={ref} className='w-full'>
                            <ReactPlayer
                            url={post?.file}
                            height="auto"
                            width="100%"
                            controls
                            playing={isPlaying}
                            onContextMenu={(e) => e.preventDefault()}
                            />
                            </div>
                        ) : post?.file && (
                            <img 
                            src={post?.file}
                            className='w-full h-[400px] rounded-lg'
                            alt="" 
                            />
                    )}
                    
                </div>
                {/* LIKES, COMMENT SHARE */}
                <div className='flex flex-col gap-3 border-t-[1px] border-ascent-3'>
                    <div className='flex items-center justify-between mt-2'>
                        <button 
                        className='flex items-center gap-2 text-ascent-1'
                        onClick={()=>handleLikePost(`/post/like/${post?._id}`, post?._id)}
                        >
                            {post?.likes?.includes(user?._id) 
                                ? <BiSolidLike className='text-2xl text-blue'/>
                                :<BiLike className='text-2xl'/>
                            }
                            <span className='text-base'>
                                {post?.likes?.length + " Likes"}
                            </span>
                        </button>
                        <div className='flex items-center gap-3'>
                            <button 
                            onClick={()=>{
                                setShowComment(showComment === post?._id ? 0 : post?._id)
                                getPostsComment(post?._id)
                            }}
                            className='flex items-center gap-2 text-ascent-1'
                            >
                                <AiOutlineComment className='text-2xl'/>
                                <span className='text-base'>
                                    {post?.comment?.length + " Comment"}
                                </span>
                            </button>
                            <button 
                            className='flex items-center gap-2 text-ascent-1'
                            >
                                <IoShareSocialOutline className='text-2xl'/>
                                <span className='text-base'>
                                    Share
                                </span>
                            </button>
                        </div>
                    </div>
                    
                    {/* COMMENTS FORM*/}
                    {showComment === post?._id  && (
                        <div className='flex flex-col gap-2'>
                            <CommentForm
                            user={user}
                            reloadGetComments={()=>getPostsComment(post?._id)}
                            id={post?._id}
                            />
                            {
                                isLoading ? (
                                    <Loader/>
                                ) : (comment?.length > 0 ? (

                                    comment?.map((comment, i) => (
                                        <div 
                                        key={i}
                                        className='px-3 border-b py-1 border-[#66666645]'>
                                            <div className='mt-4 flex flex-col gap-3'>
                                                <div className='flex items-center justify-between'>
                                                    {/* USER IMG & NAME */}
                                                    <Link 
                                                    to={comment?.userId?._id === user?._id ? "/profile" : `/profile/${comment?.userId?._id}`}
                                                    className='flex gap-3'>
                                                        <img 
                                                        src={comment?.userId?.profilePicUrl}
                                                        className='w-12 h-12 rounded-lg' 
                                                        alt="" />
                                                        <div className='flex flex-col gap-0.5'>
                                                            <span className='text-ascent-1 text-base'>
                                                                {comment?.userId?.firstName + " " + comment?.userId?.lastName}
                                                            </span>
                                                            <span className='text-ascent-3 text-sm'>
                                                                {moment(comment?.createdAt).fromNow()}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                    {/* POST ACTION BUTTONS */}
                                                    {comment?.userId?._id === user?._id && (
                                                        <button className='relative text-ascent-1 text-lg'>
                                                            <CiMenuKebab onClick={()=>{setCommentTab(
                                                                commentTab === comment?._id ? 0 : comment?._id)}}/>
                                                            {commentTab === comment?._id && (
                                                            <div className='absolute w-[100px] h-fit py-2 gap-2 px-4 bg-primary 
                                                            right-0 flex items-start flex-col shadow-lg rounded-lg'>
                                                                <button 
                                                                onClick={()=>handleDeleteComment(comment?._id, post?._id)}
                                                                className='text-base text-ascent-3 hover:text-ascent-1 
                                                                transition-all duration-300 ease-in-out flex gap-1
                                                                items-center'
                                                                >
                                                                    <MdDeleteOutline size={16}/> Delete
                                                                </button>
                                                            </div>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>

                                                {/* USER COMMENT */}
                                                <div className='flex flex-col items-start gap-3'>
                                                    <p className='text-ascent-2 text-sm px-4'>
                                                        {comment?.comment}
                                                    </p>
                                                    <div className='flex gap-3'>
                                                        <button 
                                                        onClick={()=>handleLikePost(`/post/like-comment/${comment?._id}`, post?._id)}
                                                        className='flex items-center gap-2 text-ascent-1'
                                                        >
                                                            {comment?.likes?.includes(user?._id) 
                                                                ? <BiSolidLike className='text-1xl text-blue'/>
                                                                :<BiLike className='text-1xl'/>
                                                            }
                                                            <span className='text-base'>
                                                                {comment?.likes?.length} Likes
                                                            </span>
                                                        </button>
                                                        <button 
                                                        onClick={()=>{
                                                            setReplyComment(replyComment === comment?._id 
                                                                ? 0 : comment?._id);
                                                        }}
                                                        className='flex items-center gap-2 text-ascent-1'
                                                        >
                                                            <AiOutlineComment className='text-1xl'/>
                                                            <span className='text-base'>
                                                                Reply
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>


                                            {/* REPLY FORM */}
                                            {replyComment === comment?._id && (
                                                <div className='px-1 mt-2'>
                                                    <CommentForm
                                                    user={user}
                                                    reloadGetComments={()=>getPostsComment(post?._id)}
                                                    id={comment?._id}
                                                    replyAt={comment?.from}
                                                    />
                                                    
                                                    {comment?.replies?.length > 0 &&(
                                                        <>
                                                            <div className='p-0.5'>
                                                            <span
                                                                onClick={()=>{
                                                                    setShowReplies(showReplies === comment?._id 
                                                                        ? 0 : comment?._id)
                                                                }}
                                                                className='text-sm text-blue cursor-pointer'
                                                                >
                                                                    Show replies
                                                                </span>
                                                            </div>
                                                                {showReplies === comment?._id && (
                                                                    comment?.replies?.map((reply)=>(
                                                                        <ReplyCard
                                                                        user={user}
                                                                        reply={reply}
                                                                        handleDeleteReply={(replyId)=>handleDeleteReply(`/post/delete-reply/${comment?._id}/${replyId}`, post?._id)}
                                                                        handleLike={()=>handleLikePost(
                                                                            `/post/like-comment/${comment?._id}/${reply?._id}`, post?._id)
                                                                        }
                                                                        />
                                                                    ))
                                                                )}
                                                            
                                                    
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
            
                                ) : (
                                    <div>
                                    <span className='text-ascent-2 text-base'>
                                        No Comments, Be the first to comment.
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        
    </div>
  )
}

export default PostCard