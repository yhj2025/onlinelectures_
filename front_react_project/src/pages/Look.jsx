import React, {useState, useEffect} from 'react'
import ".././InputWithButton.css";
import { IoHeart } from "react-icons/io5";
import { MdLastPage } from "react-icons/md";
import { MdFirstPage } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import Search_Category from './Search_Category';
import Search_Level from './Search_Level';
import axios from "axios";
import { useLocation } from 'react-router-dom'



const Look = () => {
    console.log("react Look step1......");
    const [input, setInput] = useState("")
    const [SearchList, setSearchList] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    console.log(location)
    const search = queryParams.get('search');


    useEffect(() => {
      const fetchDate = async () => {
        try{
            const res = await axios.post("/api/look", {"search" : search})
            console.log("검색할 강의는 : ", search);
            setInput(search);
            if(res.data.code === 200){
                setSearchList(res.data.SearchList);
                console.log("search look : ", res.data)
            }else{
                setSearchList([]);
            }
        }catch(err){
            console.log(err)
        }
    };
    fetchDate();
    },[search])


  
    return (
      <div>
        <div className="home">
          


          <div class="card-container">
            {SearchList.map((list) => (
              <div class="card" key={list.LectureID}>
                  <img class="card-image" src={`${list.LecturesImageUrl}`} alt="" />
                  <div class="card-content">
                      <h2 class="card-title">{list.title}</h2>
                      <hr style={{backgroundColor:'lightgrey'}}/>
                      <p style={{wordSpacing: '1em'}}>레슨15 {list.level}</p>
                      <IoHeart size="30" color='lightgrey'/>
                      <button style = {{float:'right'}} className='button'>수강하기</button>
                  </div>
                
              </div>
              ))}
            {SearchList.length === 0 ? (<p>일치하는 강의가 존재하지 않습니다.</p>) : 
              null}
          </div>
          <div className='pagenation'>
            <MdFirstPage size='40'/>
              <span style={{marginLeft: '10px'}}></span>
              <span style={{fontSize: '30px', marginLeft: '10px'}}>1</span>
              <span style={{fontSize: '30px', marginLeft: '15px'}}>2</span>
              <span style={{fontSize: '30px', marginLeft: '15px'}}>3</span>
              <span style={{fontSize: '30px', marginLeft: '15px'}}>4</span>
              <span style={{fontSize: '30px', marginLeft: '15px', marginRight: '10px'}}>5</span>
              <span style={{marginRight: '10px'}}></span>
            <MdLastPage size='40'/>  
          </div>
        </div>
  
      </div>
)
}

export default Look
