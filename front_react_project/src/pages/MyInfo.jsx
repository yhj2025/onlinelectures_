import React from 'react';
import "../App.css";




const MyInfo = () => {
    return (
        <div>
            <div className='myinfo-background'>
            <h1>내 정보 수정</h1>
            <div>
            <form>
                <p>닉네임
                <input type="text" id="nickname" name="nickname" placeholder='닉네임' />
                </p>
                <p>이메일
                <input type="text" id="email" name='email' placeholder='이메일' />
                </p>
                <p>전화번호
                <input type="number" id="cellphone" name='cellphone' placeholder='전화번호' />
                </p>
                <button>수정</button>
            </form>
            </div>  
            
            </div>
        </div>
    )
}

export default MyInfo