import React, { useState, useEffect } from 'react';
import "../components/Dropdown.css";
import { useNavigate, useLocation } from 'react-router-dom'
import axios from "axios";

const Search_Level = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const CategoryName = queryParams.get('CategoryName') == null ? '카테고리' : queryParams.get('CategoryName');
  const [searchCategoryname, setSearchCategoryname] = useState("");

  // const checklevel = async(Level) => {
  //   console.log("react Search_Level 선택.......", Level)
  //   navigate(`/search/${Level}`);
  // }

  useEffect(() => {
    const fetchDate = async () => {
      
        const res = await axios.post("/api/search", CategoryName)
        setSearchCategoryname(CategoryName);
        console.log("search_level", CategoryName)
      
    }; 
    fetchDate();
  }, [CategoryName])

  // DropdownMenu 컴포넌트의 로직
  return (
    // 드롭다운 메뉴의 JSX
    
    <div className='menu'>
            <li onClick={() => navigate(`/search?CategoryName=${CategoryName}&level=난이도`)}>선택안함</li>
            <li onClick={() => navigate(`/search?CategoryName=${CategoryName}&level=입문`)}>입문</li>
            <li onClick={() => navigate(`/search?CategoryName=${CategoryName}&level=초급`)}>초급</li>
            <li onClick={() => navigate(`/search?CategoryName=${CategoryName}&level=중급이상`)}>중급이상</li>
    </div>
        
  )
}

export default Search_Level; // 반드시 기본 내보내기로 설정
