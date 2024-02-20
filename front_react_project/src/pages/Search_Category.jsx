import React, {useState, useEffect} from 'react';
import "../components/Dropdown.css";
import { useNavigate, useLocation } from 'react-router-dom'
import axios from "axios";

const Search_Category = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const level = queryParams.get('level') == null ? '난이도' : queryParams.get('level');
  const [searchLevel, setSearchLevel] = useState("");

  useEffect(() => {
    const fetchDate = async () => {
      
        const res = await axios.post("/api/search", {level})
        if(level !== 'null'){
          setSearchLevel(level);
        }
      
    };
    fetchDate();
  }, [level]);


    // DropdownMenu 컴포넌트의 로직
  return (
    // 드롭다운 메뉴의 JSX
    
    <div className='menu'>
            <li onClick={() => navigate(`/search?CategoryName=카테고리&level=${level}`)}>선택안함</li>
            <li onClick={() => navigate(`/search?CategoryName=java&level=${level}`)}>java</li>
            <li onClick={() => navigate(`/search?CategoryName=C&level=${level}`)}>C</li>
            <li onClick={() => navigate(`/search?CategoryName=C++&level=${level}`)}>C++</li>
            <li onClick={() => navigate(`/search?CategoryName=인공지능&level=${level}`)}>인공지능</li>
            <li onClick={() => navigate(`/search?CategoryName=파이썬&level=${level}`)}>파이썬</li>
    </div>
        
  )
}

export default Search_Category; // 반드시 기본 내보내기로 설정
