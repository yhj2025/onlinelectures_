import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'


const MyPayment = () => {

    const {UserID} = useParams();
    const [payment, setPayment] = useState([]);
    
    useEffect(() => {
        const fetchDate = async(UserID) => {
            try{
                console.log("UserID : ", UserID);
                const res = await axios.post("/api/payment", {UserID});
                console.log(res.data);
                if(res.data.code === 200){
                    setPayment(res.data.payment)
                }
            }catch(err) {
                console.log(err);
            }
        }
        fetchDate(UserID);
    }, [UserID]);

    return (
        <div>
            <div className='mypayment'>
                <p>주문번호 주문날짜 주문상태 결제한강의 금액</p>
            </div>
            {payment.map((list) => (
            
            <div style={{margin:'50px'}}>
                <span style={{fontSize: '24px',marginRight: '80px'}}>{list.PaymentID}</span>
                <span style={{fontSize: '24px',marginRight: '80px'}}>{list.PaymentDate}</span>
                <span style={{fontSize: '24px',marginRight: '80px'}}>{list.pay_state}</span>
                <span style={{fontSize: '24px',marginRight: '80px'}}>{list.title}</span>
                <span style={{fontSize: '24px',marginRight: '80px'}}>{list.Amount}</span>
                <hr style={{backgroundColor:'lightgrey'}}/>
            </div>
            ))}
        </div>
    )
}

export default MyPayment