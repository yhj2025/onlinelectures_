import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios';
import "../App.css";
import "./progress.css";


const Myclasslist = () => {
    console.log("react Myclasslist step1.........")

    const {UserID} = useParams();
    const navigate = useNavigate();
    const [myclasslists, setMyclassLists] = useState([]);

    useEffect(() => {
        const fetchDate = async (UserID) => {
            try{
                console.log("UserID : ", UserID);
                const res = await axios.post("/api/myclasslist", {UserID});
                console.log("react Myclasslist step2.........", res.data)
                if(res.data.code === 200){
                    setMyclassLists(res.data.myclasslist);
                    console.log("react Myclasslist step3.........", setMyclassLists)
                }
            }catch(err){
                console.log(err);
            }
        };
        fetchDate(UserID);
    }, [UserID]);

    return (
        <div>
            <div>
                <h1 text="bold">내가 수강중인 강의</h1>
            </div>
            {myclasslists.map((list) => (
            <div className = 'onelist' key={list.UserID}>
                <p>
                <p style={{flexDirection:'row'}}>
                    <h2> {list.title} </h2>
                    </p>
                    <hr/>
                    <br/>
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
                        <p>{list.Categoryname}</p>                       
                    </div>
                    <div className='category'>
                        <p><br/></p>
                        <br/>
                        <progress id="progress" value={`${list.AttendanceRate}`} min = "0" max="100"></progress>
                    </div>
                    <div style = {{float:'right'}} className='category'>
                        <p><br/></p>
                        <br/>
                        <div>
                            <input className='css-box-radius' type='button' value='이어보기'></input>
                        </div>
                    </div>                    
                    </div>
                    
                <br/>
                 
                </p>
            </div>
            ))}

            </div>
           
      
    )
}


export default Myclasslist