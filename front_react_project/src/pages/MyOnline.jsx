import React,{useEffect, useState} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import "../App.css";
import "./progress.css";
import { MdLastPage } from "react-icons/md";
import { MdFirstPage } from "react-icons/md";
import axios from "axios";
axios.defaults.withCredentials = true;


const MyOnline = () => {
    console.log("react MyOnline step1........");

    const {UserID} = useParams();
    const navigate = useNavigate();

    const [myclasslist, setMyclassLists] = useState([]);
    const [wish, setWish] = useState([]);
    const [community, setCommunity] = useState([]);
    const [payment, setPayment] = useState([]);

    useEffect(() => {
        const fetchDate = async(UserID) => {
            try{
                console.log("UserID : ", UserID);
                const res = await axios.post("/api/myclass", {UserID});
                console.log("react MyOnline step2........", res.data)
                console.log("code : ", res.data.code);

                if(res.data.code == 200){
                    setMyclassLists(res.data.myclasslist);
                    setWish(res.data.wish);
                    setCommunity(res.data.community);
                    setPayment(res.data.payment);
                }
            }catch(err){
                console.log(err);
            }
        };
        fetchDate(UserID);
    }, [UserID]);

    return (
        <div>
            <div className='myonlinelist'>
                {myclasslist.map((list) => (

                <>
                <h1>내가 수강중인 강의</h1>
                <div className='myonlinecourse' key={list.UserID}>
                <div >
                    <div style={{marginTop : '40px'}}>
                        <h1 style={{ display: 'inline',  marginLeft: '30px' }}>{list.title}</h1>
                    </div>
                    
                    
                    
                        <div style = {{float:'right', marginTop : '28px', marginLeft: '680px'}}>
                            <input className='css-box-radius' type='button'  value='이어보기'></input>
                        </div>
                    </div>
                    <div>
                        <div style = {{ marginTop:'120px', marginLeft:'-500px'}}>
                            <progress id="progress" style={{width : '350px'}}  value={`${list.AttendanceRate}`} min = "0" max="100"></progress>
                        </div>
                            
                    </div>
                    
                </div>
                
                <div className='myclasspaging'>
                    <p>
                        <div>
                        <MdFirstPage size='40'/>
                        <span style={{marginLeft: '8px'}}></span>
                        <span style={{fontSize: '30px'}}>1</span>
                        <span style={{marginRight: '8px'}}></span>
                        <MdLastPage size='40'/>
                        </div>
                    </p>
                </div>
                </>
                ))}
            </div>
            
            <br/>
            <br/>

            <div className='locate'>
                
                <div className='myclasswishlist'>
                <h1>찜목록</h1>
                {wish.map((list) => (

                
                    <div className='myclasswish'>
                        <p>
                            <div style = {{float:'right'}}><input className='css-box-radius' type='button' value='수강하기'></input></div>
                                <h3>{list.title}</h3>
                            <hr/>
                            <p style={{wordSpacing:'2em'}}>레슨15  {list.level}</p>
                        </p>
                        
                    </div>
                    ))}
                    <br/>
                    <br/>
                </div>


                <div className='mypaymentlist'>
                    
                <h2 >결제내역</h2>
                {payment.length > 0 ? (
                    payment.map((list) => (
                        <div className='myPayment'>
                            <p>
                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                    <h1>{list.title} </h1> <h2>외 3개</h2>
                                    <hr/>
                                    <h1 style = {{float:'right', marginTop:'45px'}}>총 {list.amount}원</h1>         
                                </div>
                            </p>
                        </div>
                        )) 
                        ): (
                            <div className='myPayment'>
                                <p style={{textAlign:"center"}}>결제 내역이 없습니다.</p>
                            </div>
                        )}
                    <br/>
                    <br/>
                </div>
            </div>
        </div>
    )
}

export default MyOnline
