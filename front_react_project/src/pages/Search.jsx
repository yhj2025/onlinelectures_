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



const Search = () => {
    console.log("react Search step1......");

    const [category, setCategory] = useState(false);
    const [Level, setLevel] = useState(false);
    const [LectureList, setLectureList] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    console.log(location);
    const level = queryParams.get('level');
    const [searchLevel, setSearchLevel] = useState("");
    const CategoryName = queryParams.get('CategoryName');
    console.log(level, CategoryName);
    const [searchCategoryname, setSearchCategoryname] = useState("");


    useEffect(() => {
        const fetchDate = async () => {
            try{
                const res = await axios.post("/api/search", {
                  level : level,
                  CategoryName : CategoryName
                });
                console.log("react Search step2......", res.data);
                setSearchLevel(level);
                console.log("react searchLevel ...... : ", level);
                setSearchCategoryname(CategoryName);
                console.log("react searchCategoryname ...... : ", CategoryName);

                console.log("code : ", res.data.code);
                if(res.data.code === 200){
                    setLectureList(res.data.LectureList);
                    console.log("react Search step3......", res.data);
                }else{
                    setLectureList([]);
                }
            }catch(err){
                console.log(err);
            }
        };
        fetchDate();
    }, [level, CategoryName]);


  
    return (
      <div>
        <div className="home">
          <div className='search-menu'>
            <h1>강의 찾기</h1>
            <div>
              <h3>{CategoryName ? CategoryName : '카테고리'}</h3>
              <ul onClick={() => { setCategory(!category) }}>
                {category ? <IoIosArrowUp className='search-icon' /> : <IoIosArrowDown className='search-icon' />}
                {category && <Search_Category />}
              </ul>
            </div>
            <div>
              <h3>{level ? level : '난이도'}</h3>
              <ul onClick={() => { setLevel(!Level) }}>
                {Level ? <IoIosArrowUp    className='search-icon' /> : <IoIosArrowDown className='search-icon' />}
                {Level && <Search_Level />}
              </ul>
            </div>
          </div>
  


<div class="card-container">
  {LectureList.map((list) => (
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
  {LectureList.length === 0 ? (<p>일치하는 강의가 존재하지 않습니다.</p>) : 
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

export default Search
