import React, {useState, useEffect, useContext} from 'react'
import ".././InputWithButton.css";
import "../App.css";
import { IoHeart } from "react-icons/io5";
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from '../context/authContext';
axios.defaults.withCredentials = true;


const MainHome = () => {
    console.log("react MainHome step1....");
    const [push, setPush] = useState([]);
    const [myclasslists, setMyLists] = useState([]);
    const [popularlists, setPopularLists] = useState([]);  
    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDate = async () => {
            try {
                console.log("react MainHome step2  before ...." );
                const res = await axios.post("/api");
                console.log("react MainHome step2....", res.data);

                console.log("code : ", res.data.code);
                if(res.data.code === 200) {
                    setMyLists(res.data.myclass || []);
                    setPopularLists(res.data.popular || []);
                    console.log(res.data);
                }else{
                    setMyLists([])
                    setPopularLists([])
                }
            }catch(err){
                console.log(err);
            }
        };
        fetchDate();
    }, []);




    const handlePuthWishlist = (index) => {
        const newWishList = [...push];
        newWishList[index] = !newWishList[index];
        setPush(newWishList);

        await 
    }


    const handleCourses = async (LectureID) => {
        console.log("react 강의 상세페이지로 이동중.....");
        // const main = await axios.post("/api/main", {LectureID});
        // console.log("react MainHome step3 Courses main LectureID.... : ", LectureID)
        // try{

        //     //여기서 LectureID를 서버로 보냄
        //     const res = await axios.post("/api/detaillecture", { LectureID});
        //     console.log("react courses Request Body:", { LectureID });

        //     console.log("react MainHome step4 Courses LectureID.... : ", res.data);
        // }catch(err){
        //     console.error("react MainHome LectureID 서버 요청 에러: ", err);
        // }
        navigate(`/courses/${LectureID}`);
    }

    
    const handleOnlineStudy = async(LectureID) => {
        console.log("react 강의 화면페이지로 이동중.....");
        try{
            const res = await axios.post("/api/lectureshow", {LectureID});
            console.log("react MainHome step3 Onlinestudy LectureID.... : ", res.data);
        }catch(err){
            console.error("서버 요청 에러 : ",err);
        }
        navigate(`/onlinestudy/${LectureID}`);
        
    }

    

    return (
        <div className="home">
            
            {/* <div className="promotionBanner">
                <a href="#none" className="bannerLink">	
                    <img src="https://cdn.inflearn.com/public/main_sliders/b911362e-dcc1-43f4-97c0-affe71440c09/event-2024newyear-521.png" alt="배너 내용을 적어주세요." />
                </a>
                <a href="#none" class="btnClose"><img src="http://sdsupport.cafe24.com/img/guide/tip/btn_close.png" alt="배너 닫기" /></a>
            </div> */}
            <br/>
            {currentUser && (
                <>
                <p className="tag-css">현재 수강중인 강좌</p>
                <div className="card-container">
                {/* 현재수강중인 강좌 */}
                    {myclasslists.map((list) => (             
                    <div className="card" key={list.LectureID}>
                        <img className="card-image" src={`${list.LecturesImageUrl}`} alt="강의 이미지"></img>
                        <div className="card-content">
                            <h2 className="card-title">{list.title}</h2>
                            <hr style={{backgroundColor:'lightgrey'}}/>
                        <p><progress id="progress" value={`${list.AttendanceRate}`} min = "0" max="100"></progress></p>
                            <div style = {{float:'right'}} onClick={() => handleOnlineStudy(list.LectureID)}><input className='css-box-radius' type='button' value='이어보기'></input></div>
                        </div>
                    </div>
                    ))}        
                </div>
                <br/></>
            )}
            

            <p className="tag-css">인기 강좌</p>
            <div className="card-container">
                {popularlists.map((list, index) => (                
                <div className="card"  key={list.LectureID}>
                    <img className="card-image" src={`${list.LecturesImageUrl}`} alt="" />
                    <div className="card-content">
                        <h2 className="card-title">{list.title}</h2>
                        <hr style={{backgroundColor:'lightgrey'}}/>
                        <p style={{wordSpacing: '1em'}}>레슨15 {list.level}</p>
                        <div onClick={() => handlePuthWishlist(index)}>
                            {push[index] ? <IoHeart size="30" color='red'/> : <IoHeart size="30" color='lightgrey'/> }
                            <button style = {{float:'right'}} className='button' onClick={() => handleCourses(list.LectureID)}>수강하기</button>
                        </div>
                    </div>
                </div>
                ))}
                
            </div>
        </div>
    )
}

export default MainHome
