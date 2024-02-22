import React, { useEffect, useState } from 'react';
import "../App.css";
import axios from "axios";
import { useParams } from 'react-router-dom';
axios.defaults.withCredentials = true;

const ChangePW = () => {

    const [userInput, setUserInput] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [checkMessage, setCheckMessage] = useState("");
    const [checkpasswordMessage, setCheckPasswordMessage] = useState("");

    const {UserID} = useParams();
    const [isCheck, setIsCheck] = useState(false);


    function CheckPassword(){
        setIsCheck(!isCheck);
        setCheckMessage(""); // 버튼을 누를 때마다 체크 메시지 초기화
    }
    
    const handleChange = async (e) => {
        e.preventDefault();
        console.log("비밀번호 확인");
        setUserInput(userInput)

        try{
           
            console.log(userInput);
            const res = await axios.post("/api/checkuserpassword", {"Password" :userInput, UserID});   // { password: userPasswordCheck }
            console.log("react changePW step2.......", res.data)
            console.log("react changePW step3.......", userInput)
            const isSamePassword = res.data.isSamePassword;
            
            // console.log("비밀번호 확인 : ", Password);
            console.log(res.data);
            if(isSamePassword){
                setCheckMessage(`사용자 ${UserID}님 비밀번호 입니다.`);
            }else{
                setCheckMessage("비밀번호를 다시 확인해주세요.");
            }
            setIsCheck(isSamePassword);
        }catch(error){
            console.error(error);
        }
    }


    const CheckChange = async () => {
        console.log("새비밀번호 확인");
        setNewPassword(newPassword);
        setConfirmPassword(confirmPassword);
        console.log("새비밀번호  : ", newPassword);
        console.log("새비밀번호 확인 : ", confirmPassword);
        if(newPassword === confirmPassword){
            setCheckPasswordMessage("비밀번호가 같습니다.")
            const res = await axios.post("/api/changepassword", newPassword);
        }else{
            setCheckPasswordMessage("비밀번호가 틀립니다.");
        }
    }


    const inputChange = (e) => {
        setUserInput(e.target.value);
    };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    }


    const SummitChangePW = () => {
        const fetchDate = async() => {
            try{
                // if()
                console.log("UserID : ", UserID);
                const res = await axios.post("/api/changepassword", {UserID});
                // console.log("react changePW step2.......", res.data)
            }catch(err){
                console.log(err);
            }
        };
        fetchDate();
    };

    return (
        <div>   
            <div className='myinfo-background'>
                <h1>비밀번호 변경</h1>   

                <div>
                    <form>
                        <input required type="password" id="password" name="password" placeholder='기존password' onChange={inputChange}/>
                        <button onClick={handleChange}>확인</button>
                        <span>{checkMessage && <span onClick={CheckPassword}>{checkMessage}</span>}</span>
                        <input required type="text" id="newPassword" name='newPassword' placeholder='새password' onChange={handleNewPasswordChange}/>
                        <input required type="password" id="confirmPassword" name='confirmPassword' placeholder='password확인' onChange={handleConfirmPasswordChange}/>
                        <span>{checkpasswordMessage && <span onChange={CheckChange}>{checkpasswordMessage}</span>}</span>
                        <button onclick={SummitChangePW}>비밀번호 변경</button>
                    </form>
                </div>
            
            </div>
        </div>
    );
};

export default ChangePW;