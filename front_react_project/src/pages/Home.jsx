// import React, { useState, useEffect, useContext } from 'react'
// import ".././InputWithButton.css";
// import { IoHeart } from "react-icons/io5";
// import axios from "axios";
// import { useNavigate } from 'react-router-dom';

// axios.defaults.withCredentials = true;

// const Home = () => {
//     console.log("react home step1....")
//     const [lists, setLists] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const res = await axios.get("/api");
//                 console.log("react home step2......", res.data);

//                 console.log("code : ",res.data.code);
//                 if (res.data.code === 200) {
//                     setLists(res.data.popularLectures);
//                     console.log(res.data);
//                 }
//             } catch (err) {
//                 console.log(err);
//             }
//         };
//         fetchData();
//     }, []);


//     const navigate = useNavigate();
//     const handleCourses = () => {
   
//         console.log("react 강의 상세페이지로 이동중.....");
//         navigate(`/courses/${LectureID}`);
        
//     }



//     return (
//         <div className="home">

//             <div className="promotionBanner">
//                 <a href="#none" className="bannerLink">	
//                     <img src="https://cdn.inflearn.com/public/main_sliders/b911362e-dcc1-43f4-97c0-affe71440c09/event-2024newyear-521.png" alt="배너 내용을 적어주세요." />
//                 </a>
//                 <a href="#none" class="btnClose"><img src="http://sdsupport.cafe24.com/img/guide/tip/btn_close.png" alt="배너 닫기" /></a>
//             </div>

//             <div className="card-container">
//                 {lists.map((list) => (
//                     <div className="card"  key={list.LectureID}>
//                         <img className="card-image" src={`${list.LecturesImageUrl}`} alt="" />
//                         <div className="card-content">
//                             <h2 className="card-title">{list.title}</h2>
//                             <hr style={{backgroundColor:'lightgrey'}}/>
//                             <p style={{wordSpacing: '1em'}}>레슨15 {list.level}</p>
//                             <IoHeart size="30" color='lightgrey'/>
//                             <button style = {{float:'right'}} className='button' onClick={handleCourses}>수강하기</button>
//                         </div>
//                     </div>
//                     ))}
//             </div>
//         </div>
//     )
// }

// export default Home
