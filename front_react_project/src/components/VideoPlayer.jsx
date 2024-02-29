import React, { useState, useEffect, useRef, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import "../App.css";
import { FaRegCirclePlay } from "react-icons/fa6";
import { FaRegCirclePause } from "react-icons/fa6";
import { TbRewindBackward10 } from "react-icons/tb";
import { TbRewindForward10 } from "react-icons/tb";
import { AuthContext } from '../context/authContext'
import "../pages/progress.css";

const VideoPlayer = ({LectureID, src}) => {
    // const { LectureID } = useParams();

    // console.log(LectureID, src)

    const [view, setView] = useState(false); 
    const videoRef = useRef(null);
    const[currentTime, setCurrentTime] = useState(0);
    const [ duration, setDuration] = useState(0);
    const {currentUser} = useContext(AuthContext);

    // useEffect(()=> {
    //     setCurrentTime(0);
    //     const video = videoRef.current;       //video url
    //     if(!video) return;
    //     let playIntervalId;
    //     console.log("react Video step1....", video);
    
    //     const timeUpdateHandler = () => {
    //     setCurrentTime(video.currentTime);
    //     };
    
    //     const loadedMetadataHandler = () => {
    //     setDuration(video.duration);
    //     };
        
    //     const fetchDate = async (LectureID) => {
    //         try{
    //             console.log("LectureID:", LectureID);
    //             const res2 = await axios.post("/api/lectureshow", {"LectureID":LectureID});
    //             console.log("react video OnlineStudy step2.....", res2.data);
    //             //////////////////////////
    //             const currentTime = videoRef.current.currentTime;
    //             console.log("react Video step2....", currentTime);

    //             console.log(`Sending progress to server: ${currentTime}`);
    //             console.log("LectureID:", LectureID);
    //             const res = await axios.post("/api/lectureshowSet", {
    //                 "LectureID" : LectureID,
    //                 "UserID" : currentUser[0].UserID,
    //                 "AttendanceRate" : currentTime
    //             })

    //             console.log("code : ", res.data.code);
    //             if(res.data.code === 200) {
    //                 console.log(res.data.message);
    //                 setLecturesMaterial(res.data.LecturesMaterial);
    //                 console.log("react OnlineStudy detail : ", setLecturesMaterial)
    //             }
    //         }catch(err){
    //             console.log(err);
    //         }
    //     };

    //     const handleVideoEnd = () => {
    //         setCurrentTime(video.duration);
      
    //         alert(`영상 끝! - ${video.duration}`);
      
    //         clearInterval(playIntervalId);
    //         video.removeEventListener('timeupdate', timeUpdateHandler);
      
    //         fetchDate(LectureID);
    //       };
        
    //       const handlePlayButtonClick = () => {
    //         console.log("플레이버튼 클릭");
    //         playIntervalId = setInterval(() => {
    //             fetchDate(LectureID);
    //         }, 20000);
    //         video.addEventListener('timeupdate', timeUpdateHandler);
    //         video.addEventListener('ended', handleVideoEnd);
    //       };
    //       video.addEventListener('play', handlePlayButtonClick);
    //       video.addEventListener('loadedmetadata', loadedMetadataHandler);
          
    //       return () => {
    //         clearInterval(playIntervalId);
    //         video.removeEventListener('timeupdate', timeUpdateHandler);
    //         video.removeEventListener('ended', handleVideoEnd);
    //         video.removeEventListener('play', handlePlayButtonClick);
    //         video.removeEventListener('loadedmetadata', loadedMetadataHandler);
    //       };

    // }, [LectureID]);




    useEffect(()=> {
        setCurrentTime(0);
        const video = videoRef.current;
        let playIntervalId;
    
        const timeUpdateHandler = () => {
            setCurrentTime(video.currentTime);
        };
    
        const loadedMetadataHandler = () => {
            setDuration(video.duration);
        };
        
        const LectureshowData = async () => {
            const currentTime = videoRef.current.currentTime;
            console.log("LectureID:", LectureID);
            console.log("UserID :" , currentUser.UserID)
            const res = await axios.post("/api/lectureshowSet", {
                "UserID" : currentUser.UserID,
                "LectureID" : LectureID,
                "AttendanceRate" : currentTime
            })
            console.log("code : ", res.data);
            if (res.data.success) {
                console.log(res.data.message);
              } else {
                alert(res.data.message);
              }
        }

        const handleVideoEnd = () => {
            setCurrentTime(video.duration);
      
            alert(`영상 끝! - ${video.duration}`);
      
            clearInterval(playIntervalId);
            video.removeEventListener('timeupdate', timeUpdateHandler);
      
            LectureshowData();
          };
        
          const handleVideoPause = () => {
            setTimeout(() => {
                clearInterval(playIntervalId);
                console.log("타이머가 멈춥니다.");
            }, 5000);
          };

          const handlePlayButtonClick = () => {
            playIntervalId = setInterval(() => {
              LectureshowData();
              console.log("timer 5s")
            }, 5000);
            video.addEventListener('timeupdate', timeUpdateHandler);
            video.addEventListener('ended', handleVideoEnd);
            video.addEventListener('pause', handleVideoPause);
          };
          
          
            video.addEventListener('play', handlePlayButtonClick);
            video.addEventListener('loadedmetadata', loadedMetadataHandler);
          

          return () => {
            clearInterval(playIntervalId);
            
                video.removeEventListener('timeupdate', timeUpdateHandler);
                video.removeEventListener('ended', handleVideoEnd);
                video.removeEventListener('play', handlePlayButtonClick);
                video.removeEventListener('loadedmetadata', loadedMetadataHandler);
                video.removeEventListener('pause', handleVideoPause);
          };

    }, [LectureID]);

    /////비디오 재생 컨트롤 
    const playVideo = () => {
        const video = videoRef.current;
        video.play();

        // if (video && typeof video.play === 'function') {
        //     video.play();
        //     const currentTime = videoRef.current.currentTime;
        //     console.log("react Video step2....", currentTime);

        //     // playIntervalId = setInterval(() => {
        //     //     fetchDate(LectureID);
        //     // }, 20000);
        // }
        console.log("재생버튼 눌림");
    }
    const pauseVideo = () => {
        const video = videoRef.current;
        video.pause();

        // if (video && typeof video.pause === 'function') {
        //     video.pause();
        // }
        console.log("정지버튼 눌림");
    }
    const fastForward = () => {
        videoRef.current.currentTime += 10;
        console.log("10초 앞으로 버튼 눌림");
    }
    const rewind = () => {
        videoRef.current.currentTime -= 10;
        console.log("10초 뒤로 버튼 눌림");
    }
    const restartVideo = () => {
        videoRef.current.currentTime = 0;
        setCurrentTime(0);
    }

    


    return (
        <>
        
        <div >
            
            <video width="1000" height="600" ref={videoRef} controls>
            <source src={src} type="video/mp4" />
        </video>
                <br/>
                <br/>
                <div className='locate' style={{marginLeft : '300px', marginRight : '300px'}}>
                    <div onClick={() => rewind()}><TbRewindBackward10 size="30"/></div>
                    <div className='video' onClick={() => {setView(!view)}}>{view ? <div onClick={pauseVideo}><FaRegCirclePause size="30"/></div> : <div onClick={playVideo}><FaRegCirclePlay size="30" /> </div>}</div>
                    <div onClick={() => fastForward()}><TbRewindForward10 size="30" /></div>

                </div>
                <br/>
                <br/>
                <div style = {{float:'center'}}>
                    <progress id="progress" value={Number((currentTime / duration * 100).toFixed(0))} min = "0" max="100"></progress>
                    <span>{currentTime.toFixed(1)}</span>
                </div>
        </div>
        </>
    )
}

export default VideoPlayer
