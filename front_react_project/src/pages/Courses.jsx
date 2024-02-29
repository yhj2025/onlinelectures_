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



    useEffect(() => {
      const jquery = document.createElement("script");
      jquery.src = "https://code.jquery.com/jquery-1.12.4.min.js";
      const iamport = document.createElement("script");
      iamport.src = "https://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
      document.head.appendChild(jquery);
      document.head.appendChild(iamport);
  
      return () => {
        document.head.removeChild(jquery);
        document.head.removeChild(iamport);
      };
    }, []);
  


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
          LectureID : detaillists[0].LectureID,
          buyer_name: currentUser.Usernickname, // 구매자 이름
          buyer_email: currentUser.UserEmail, // 구매자 이메일
        };
        console.log("paymentData", paymentData);
        console.log(detaillists);

        // IMP SDK 초기화
        const IMP = window.IMP;
        console.log("IMP : " ,window.IMP);
        console.log("imp : " ,imp);
        console.log("apiKey : " ,apiKey);
        window.IMP.init(imp);

        try {
          const enrollmentResponse = await axios.post(`/api/selectEnrollment`,{"UserID" : currentUser.UserID, "LectureID": LectureID}) 
          console.log(enrollmentResponse.data)
          if(enrollmentResponse.data.code === 401){
            navigate(`/onlinestudy/${LectureID}`);
          }else if (enrollmentResponse.data.code === 200) {

        // 결제 요청
        IMP.request_pay(paymentData, async (response) => {
          const { success, error_msg } = response;
          if (success) {
            
            const res_payinfo = await axios.post(
              `/api/payinfo`,
              { "LectureID": detaillists[0].LectureID, "UserID" : currentUser.UserID, "Amount": detaillists[0].amount },
              {
                withCredentials: true,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            console.log(res_payinfo.data);

                // 서버로 수강 등록 요청
                const res = await axios.post(
                  `/api/enrollment`,
                  { "LectureID": LectureID, "UserID" : currentUser.UserID },
                  {
                    withCredentials: true,
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                console.log(res);

                alert("결제 완료!!");
                
               
            
          } else {
            alert(`결제 실패`);
            return;
          }
        })
      } 
      else {
        // 결제 검증 실패
        alert("결제 검증에 실패했습니다.");
        return;
      }


      } catch (error) {
        console.error("API 호출 중 오류:", error);
        alert("결제 요청 중 오류가 발생했습니다.");
        return;
      }
        ;
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
        {detaillists.map((detail) => (
            <div className = 'onelist' key={detail.LectureID}>
                
            <p>
            <div style = {{float:'right'}} onClick={() => LectureEnrollHandler(detail.LectureID)}>
                <input className='css-box-radius' type='button' value='수강하기'></input></div>
                
                

                <h1>{detail.title}</h1>
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
                        <p>{detail.level}</p>
                    </div>
                    <div className='line'> </div>

                    <div className='category'>
                        <p>카테고리 </p>
                        <p>{detail.CategoryName}</p>
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
                    {instructorlsits.map((instructor) => (

                    
                    <div className='instructor-info'>
                        <div className="box" >
                            <img class="profile" src={`${instructor.instructorImgUrl}`} alt='강사 이미지를 넣어주세요'/>
                        </div>
                        <p style={{margin: '0 30px', width: '240px'}}> 
                            이름 : {instructor.InstructorName} <br/>
                            이메일 : {instructor.Email}  <br/>
                            경력 : {instructor.Qualifications}
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
            {curriculumlists.map((curriculumlist) => (

            <div key={curriculumlist.ParentTOCID}>
                
                <div>
                    
                        {curriculumlist.ParentTOCID === null ? (
                            <div className='curriculum'>
                                <p style={{ margin: '0 10px', alignSelf: 'center'}}>{curriculumlist.title}</p>
                            </div>
                        ) :(
                            <div className='curriculum-toc'>
                                <p >
                                    {curriculumlist.title}
                                    <div style={{ float: 'right' }}>{curriculumlist.VideoLength}</div>
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
