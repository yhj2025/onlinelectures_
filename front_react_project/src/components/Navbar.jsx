import React, { useState, useEffect, useContext, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ".././InputWithButton.css";
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from '../context/authContext';
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import DropdownMenu from "./DropdownMenu";
import "../App.css";
import axios from "axios";

// ".././node_modules/classNames"

const Navbar = (props) => {
   const [view, setView] = useState(false); 
   const [SearchList, setSearchList] = useState([]);
   const [search, setInput] = useState('');
   
    const [err, setError] = useState(null);
    const {logout, currentUser} = useContext(AuthContext);
    const navigate = useNavigate();
    
    const handleMyclass = async () => {
        if (currentUser && currentUser.UserID) {
            console.log(`react ${currentUser.UserID} 강의실로 이동중......`);
            navigate(`/myonline/${currentUser.UserID}`);
        }
    }

    const handleChangePW = async() => {
        if (currentUser && currentUser.UserID) {
            console.log(`react ${currentUser.UserID} 강의실로 이동중......`);
            navigate(`/changepw/${currentUser.UserID}`);
        }
    }

    const handleLogout = async (e) => {
        e.preventDefault();
        try{
            await logout()
            navigate(`/mainhome`);
        }catch(err){
            setError(err.response.data);
        }
    };

    
    
        const fetchDate = async () => {
            try{
                const res = await axios.post(`/api/look`)
                setInput(search);
                if(res.data.code === 200){
                    setSearchList(res.data.SearchList);
                    console.log("search : ", res.data)
                }else{
                    setSearchList([]);
                }
            }catch(err){
                console.log(err)
            }
        };
       
        

    const handleChange = (e) => {
        setInput(e.target.value);
    };

    const click = async () => {
        await fetchDate();
        navigate(`/look?search=${search}`);
    };


    return (
        <div className="navbar">
            <div className="container">
            <div>
                <input required type='text' name='text' className='input' onChange={handleChange}/>
                <button className='button' onClick={click}>검색</button>
            </div>
                {/* <div className="logo">
                    <Link className='link' to="/search">
                        
                    </Link>
                </div> */}
                <div className="links">
                {currentUser ? (<>
                    {/* <button onClick={handleChangePW}>비밀번호 변경</button> */}
                        <ul onClick={() => {setView(!view)}}>
                            <FaUserCircle size="50" onClick={() => handleMyclass(currentUser.UserID)}/> 
                            {view ? <IoIosArrowUp /> : <IoIosArrowDown />}
                            {view && <DropdownMenu/>} 
                        </ul>
                        <p>{currentUser.UserID}님</p>
                    <Link className="link" to="/search" onClick={handleLogout}>
                        <button onClick={handleLogout}>로그아웃</button>
                    </Link>
                    </>
                    ) : ( <>
                        <Link className="link" to="/login">
                            <h6>로그인</h6>
                        </Link>
                        <Link className="link" to="/register">
                            <h6>회원가입</h6>
                        </Link>
                    </> 
                    )}   
                </div> 
            </div>
            <div className='lines'>
                <Link className='link' to="/mainhome"><h3>Summit</h3></Link>
                <Link className='link' to="/search"><h5>강의찾기</h5></Link>
                <Link className='link' to="/boardlist"><h5>게시판</h5></Link>
                <Link className='link' to="/myonline"><h5>내강의실</h5></Link>
            </div>
            </div>


       
    )
}

export default Navbar
