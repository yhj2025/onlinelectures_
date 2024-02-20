import React, {useEffect, useState, useContext} from 'react'
import "../App.css";
import { useParams,useNavigate } from 'react-router-dom';
import axios from "axios";
import { AuthContext } from '../context/authContext'
import jsCookie from "js-cookie";
axios.defaults.withCredentials = true;



const Courses = () => {
    console.log("react Courses step1......");
    
    const { LectureID } = useParams();
    console.log("LectureID:", LectureID);
    const navigate = useNavigate();
    const handleOnlineStudy= (LectureID) => {
        console.log("react 강의 화면 페이지로 이동중.....");
        navigate(`/onlinestudy/${LectureID}`);
        }

    const [detaillists, setDetailLists] = useState([]);
    const [instructorlsits, setInstructorLists] = useState([]);
    const [curriculumlists, setCurriculumLists] = useState([]);

    const imp = 'imp00433236';
    const apiKey = "8847720430436826"
    const pg = "html5_inicis";
    const {currentUser} = useContext(AuthContext);






const LectureEnrollHandler = async () => {
    if (!currentUser) {
      alert("로그인 후 이용해 주세요.");
      return;
    } else {
      try {
        const token = jsCookie.get("jwtkey");
        // 서버로 결제 요청 데이터 만들기
        const paymentData = {
          pg: pg, // PG사
          pay_method: "card", // 결제수단
          merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
          amount: detaillists[0].amount, // 결제금액
          name: detaillists[0].title, // 주문명
          buyer_name: currentUser.Usernickname, // 구매자 이름
          buyer_email: currentUser.UserEmail, // 구매자 이메일
        };
        console.log("paymentData", paymentData);

        // IMP SDK 초기화
        const { IMP } = window;
        console.log("IMP : " ,IMP);
        console.log("imp : " ,imp);
        console.log("apiKey : " ,apiKey);
        IMP.init("imp00433236");
        // 결제 요청
        IMP.request_pay(paymentData, async (response) => {
          const { success, error_msg } = response;
          if (success) {
            try {
                const enrollmentResponse = await axios.post(`/api/selectEnrollment`,{"UserID" : currentUser.UserID}) 
                console.log(enrollmentResponse.data)
              if (enrollmentResponse.data.code === 200) {
                // 서버로 수강 등록 요청
                const res = await axios.post(
                  `/api/myenrollment`,
                  { LectureID: LectureID },
                  {
                    withCredentials: true,
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                
              } else {
                // 결제 검증 실패
                alert("결제 검증에 실패했습니다.");
                return;
              }
            } catch (error) {
              console.error("API 호출 중 오류:", error);
              alert("결제 요청 중 오류가 발생했습니다.");
              return;
            }
          } else {
            alert(`결제 실패: ${error_msg}`);
            return;
          }
        });
      } catch (error) {
        console.error("API 호출 중 오류:", error);
        alert("결제 요청 중 오류가 발생했습니다.");
        return;
      }
    }
  };    

    useEffect(()=> {
        const fetchDate = async (LectureID) => {
            try{
                console.log("LectureID:", LectureID);
                const res = await axios.post("/api/detaillecture", {LectureID});
                console.log("react Courses step2.....", res.data);

                console.log("code : ", res.data.code);
                if(res.data.code === 200) {
                    setDetailLists(res.data.detail);
                    console.log("react Courses detail : ", setDetailLists)
                    setInstructorLists(res.data.Instructor);
                    setCurriculumLists(res.data.curriculum);
                    console.log(res.data);
                }
            }catch(err){
                console.log(err);
            }
        };
        fetchDate(LectureID);
    }, [LectureID]);


    return (
        <div>
       <div>
        {detaillists.map((list) => (
            <div className = 'onelist' key={list.LectureID}>
                
            <p>
            <div style = {{float:'right'}} onClick={() => handleOnlineStudy(list.LectureID)}>
                <input className='css-box-radius' type='button' value='수강하기'></input></div>
                
                

                <h1>{list.title}</h1>
                <hr/>
                <br/>
                <div>
                    <div className='category'>
                        <p>레슨 수</p>
                        <p>15</p>
                    </div>
                    <div className='line'></div>

                    <div className='category' >
                        <p>난이도 </p>
                        <p>{list.level}</p>
                    </div>
                    <div className='line'> </div>

                    <div className='category'>
                        <p>카테고리 </p>
                        <p>{list.CategoryName}</p>
                    </div>
                </div> 
               
            </p>
            </div>
            ))}  
            
            <div className='locate'>
            {/* 강의 소개 */}
            <div className='minilist' style={{display:'flex', alignItems:'center'}} >
                {detaillists.map((list) => (
                    <div key={list.LectureID}>
                
                <p>
                    <h2>강의 소개</h2>
                    <div>
                        {list.Description}
                    </div>
                    <br/>
                    <br/>
                    <iframe width="450" height="315" src={`${list.PreviewUrl}`} allowfullscreen title="Video" allow="accelerometer; autoplay; encrypted-media; gyroscope"></iframe>
                </p>
                </div>
                ))}
            </div>

            {/* 강사소개 */}
            <div className='minilist'>
                <div>
                    <h2>강사소개</h2>
                    {instructorlsits.map((list) => (

                    
                    <div className='instructor-info'>
                        <div className="box" >
                            <img class="profile" src={`${list.instructorImgUrl}`} alt='강사 이미지를 넣어주세요'/>
                        </div>
                        <p style={{margin: '0 30px', width: '240px'}}> 
                            이름 : {list.InstructorName} <br/>
                            이메일 : {list.Email}  <br/>
                            경력 : {list.Qualifications}
                        </p>
                    </div>
                    ))}

                </div>
            </div>
            </div>


            {/* 커리큘럼 */}
            <p style={{display: 'flex', flexDirection: 'row'}}>
                    <h1>커리큘럼</h1>      
                    <h3>총 레슨 15개 영상 35분</h3>
            </p>    
            {curriculumlists.map((list) => (

            <div key={list.ParentTOCID}>
                
                <div>
                    
                        {list.ParentTOCID === null ? (
                            <div className='curriculum'>
                                <p style={{ margin: '0 10px', alignSelf: 'center'}}>{list.title}</p>
                            </div>
                        ) :(
                            <div className='curriculum-toc'>
                                <p >
                                    {list.title}
                                    <div style={{ float: 'right' }}>{list.VideoLength}</div>
                                </p>
                            </div>
                            )
                        }
                </div>
            </div>
        ))}
        </div>
    </div>
    )  
}

export default Courses
