import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";


const Register = () => {
    const [ inputs, setInputs] = useState({
        Usernickname: "",
        UserID: "",
        UserEmail: "",
        Password: "",
        UserCellphone: "",
    });
    const [err, setError] = useState(null);
    const [isCheck, setIsCheck] = useState(false);
    const [checkMessage, setCheckMessage] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs((prev) => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleCheck = async (e) => {

        console.log("아이디 중복체크");
        const userIdToCheck = e.target.value;
        
        // 서버에 중복 체크 요청
        try {

            console.log(inputs);
            const response = await axios.post("/api/checkuserid",  inputs );
            const isDuplicate = response.data.isDuplicate;

            // 중복이 아닌 경우
            // setInputs((prev) => ({ ...prev, [e.target.name]: userIdToCheck }));
            // 여기에서 서버 응답을 확인하여 사용자에게 중복 여부를 알려줄 수 있음
            console.log(response.data); // 이 부분은 서버 응답을 어떻게 처리할지에 따라 달라집니다.
            if (!isDuplicate) {
                setCheckMessage("사용가능한 아이디입니다.");
            } else {
                setCheckMessage("이미 사용중인 아이디입니다.");
            }

            setIsCheck(isDuplicate);

        } catch (error) {
            // 중복인 경우 또는 다른 문제가 발생한 경우
            console.error(error);
            // 여기에서 사용자에게 에러 메시지를 표시할 수 있음
        }    
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await axios.post("/api/register", inputs);
            console.log("회원가입 완료", inputs);
            navigate("/login");
        }catch (err){
            setError(err.response.data);
        }
    };

    function CheckID(){
        setIsCheck(!isCheck);
        setCheckMessage(""); // 버튼을 누를 때마다 체크 메시지 초기화
    }

    const handleBoth = (e) => {
        handleChange(e);
        handleCheck(e);
    };

//////비밀번호 체크
    function CheckPassword(){
        // const isDuplicate = response.data.isDuplicate;

        // if (!isDuplicate) {
        //     setCheckMessage("사용가능한 아이디입니다.");

        // } else {
        //     setCheckMessage("이미 사용중인 아이디입니다.");
        // }
    }







    return (
        <div className='auth'>
            <h1>회원가입</h1>
            <div>
                <input required type="text" id='Usernickname' name='Usernickname' placeholder='닉네임' onChange={handleChange} />
                <input required type="text" id='UserID' name='UserID' placeholder='ID' onChange={handleBoth} />
                
                <button onClick={handleCheck}>중복체크</button>
                <span>{checkMessage && <span onClick={CheckID}>{checkMessage}</span>}</span>

           
                <input required type="password" id='Password' name='Password' placeholder='password' onChange={handleChange} />
                <input required type="password" id='checkPassword' name='checkPassword' placeholder='password확인' onChange={handleChange} />
                <input required type="email" id='UserEmail' name='UserEmail' placeholder='이메일' onChange={handleChange} />
                <input required type="text" id='UserCellphone' name='UserCellphone' placeholder='전화번호' onChange={handleChange} />
                <button onClick={handleSubmit}>회원가입</button>
                
                <span>이미 회원이신가요? <Link to="/login">로그인</Link></span>      
            </div>
        </div>
    )
}

export default Register
