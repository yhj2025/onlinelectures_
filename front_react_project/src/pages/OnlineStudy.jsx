import React, { useState, useEffect, useRef, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import "../App.css";
import  VideoPlayer  from '../components/VideoPlayer';

const OnlineStudy = () => {
    const navigate = useNavigate();
    const { LectureID } = useParams();
    const [LecturesMaterial, setLecturesMaterial] = useState([]);
    

    useEffect(()=> {
        
        const fetchDate = async (LectureID) => {
            try{
                console.log("LectureID:", LectureID);
                const res = await axios.post("/api/lectureshow", {"LectureID":LectureID});
                console.log("react OnlineStudy step2.....", res.data);

                console.log("code : ", res.data.code);
                if(res.data.code === 200) {
                    setLecturesMaterial(res.data.LecturesMaterial);
                    console.log("react OnlineStudy detail : ", setLecturesMaterial)
                    console.log(res.data);
                }
            }catch(err){
                console.log(err);
            }
        };
        fetchDate(LectureID);
    }, [LectureID]);



    const handleTOCBoradlist = () => {
        console.log("react 관련목차 게시판으로 이동중.......");
        navigate("/LectureTOCBoardList");
    }

    const handleBoardDetail = () => {
        console.log("react 관련목차 상세게시글로 이동중....")
        navigate("/BoardDetail");
    }

    const handleQuestion = () => {
        console.log("react 질문화면으로 이동중....");
        navigate("/question");
    }


    return (
        <div>
            {LecturesMaterial.map((list) => (

            
            <div className='onelist'>
                <p>

                <input id="check-btn" type="checkbox" />
                <label for="check-btn"></label>
                <ul class="menubars">
                    
                    <li>메뉴</li>
                    <li>메뉴</li>
                    <li>메뉴</li>
                    <li>메뉴</li>
                    
                </ul>

                <div><h1>{list.title}</h1></div>
                </p>
                
                <hr/>
                <br/>
                <br/>
                
                <VideoPlayer  width="1000" height="600" src={`${list.MaterialURL}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen LectureID={LectureID}/>
                <br/>
                <br/>
                
                <br/>
                <p>
                    <hr/>
                    <h2>관련질문</h2>
                    <div className='css-opacity'>
                    <div style = {{float:'right', padding:'20px'}}><input className='css-box-radius-auto' type='button' value='자세히보기' onClick={handleBoardDetail}></input></div>

                        <p>파이썬으로 무엇을 할 수 있나요?</p>
                    </div>
                    
                    <hr/>
                    <br/>
                    <div style = {{float:'right'}}><input className='css-box-radius-auto' type='button' value='다른 질문 더 보기' onClick={handleTOCBoradlist}></input></div>
                    <div style = {{float:'right'}}><input className='css-box-radius-auto' type='button' value='질문하기' onClick={handleQuestion}></input></div>

                </p>
                <br/>
                <br/>
                <br/>
            </div>
            ))}
        </div>
    )
}

export default OnlineStudy
