import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../App.css";
import axios from "axios";


const MyWishlist = () => {

    const {UserID} = useParams();
    const [wish, setWish] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
    const fetchDate = async(UserID) => {
        try{
        console.log("UserID : ", UserID);
        const res = await axios.post("/api/wishlist", {UserID});
        console.log("react DropdownMenu step2........", res.data);
        if(res.data.code === 200){
            setWish(res.data.wishlist);
        }
        }catch(err){
        console.log(err);
        }
    };
    fetchDate(UserID);
    }, [UserID]);

    const handlestudy = async(LectureID) => {
        navigate(`/courses/${LectureID}`)
    }


    return (
        <div>
          
            <div>
                <h1 text="bold">찜목록</h1>
            </div>
            {wish.map((list) => (

            
            <div className = 'onelist'>
                <p>
                <p style={{flexDirection:'row'}}>
                    <h2>{list.title} </h2>
                    </p>
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
                    </div>
                    <div style = {{float:'right'}} className='category'>
                        <p><br/></p>
                        <br/>
                        <div>
                            <input className='css-box-radius' type='button' onClick={() => handlestudy(list.LectureID)} value='수강하기'></input>
                        </div>
                    </div>                    
                    </div>
                    
                <br/>
                 
                </p>
                <br/>
            </div>
           ))}
            
        </div>
      
    )
}


export default MyWishlist