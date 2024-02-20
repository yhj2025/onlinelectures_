import React, {useState, useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext'

const Login = () => {
    console.log("react login step1....")

    const [inputs, setInputs] = useState({
        UserID:"",
        Password: "",
    });
    const [err, setError] = useState(null);

    const navigate = useNavigate();

    const {login} = useContext(AuthContext);

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await login(inputs)
            console.log("react login step2....", inputs)
            navigate(`/mainhome`);
        }catch(err){
            setError(err.response.data);
        }
    };

    return (
        <div className='auth'>
            <h1>Login</h1>
            <span>아직 회원이 아니신가요? <Link to="/register">회원가입</Link></span>
            <br/>
            <br/>
            <div>
                <input required type="text" id="UserID" name="UserID" placeholder='UserID' onChange={handleChange} />
                <input required type="Password" id="Password" name='Password' placeholder='Password' onChange={handleChange} />
                <button onClick={handleSubmit}>Login</button>
            </div>
        </div>
    )
}

export default Login
