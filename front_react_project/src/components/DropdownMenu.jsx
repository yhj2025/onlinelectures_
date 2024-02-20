import React, {useContext} from 'react';
import "./Dropdown.css";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const DropdownMenu = () => {
  console.log("react DropdownMenu step1........");
  const navigate = useNavigate();
  const {currentUser} = useContext(AuthContext);
  console.log(currentUser.UserID);


  const handleNavigate = async (path) => {
   
    navigate(path);
    // navigate(`/mywishlist/${currentUser.UserID}`);
    
  };




  // DropdownMenu 컴포넌트의 로직
  return (
    // 드롭다운 메뉴의 JSX
    
    <div className='menu'>
            <li onClick={() => handleNavigate(`/Myclasslist/${currentUser.UserID}`)}>내 강의실</li>
            <li onClick={() => handleNavigate(`/myinfo/${currentUser.UserID}`)}>내 정보수정</li>
            <li onClick={() => handleNavigate(`/ChangePW/${currentUser.UserID}`)}>비밀번호 변경</li>
            <li onClick={() => handleNavigate(`/mywishlist/${currentUser.UserID}`)}>찜목록</li>
            <li onClick={() => handleNavigate(`/mypayment/${currentUser.UserID}`)}>결제내역</li>
    </div>
        
  )
}

export default DropdownMenu; // 반드시 기본 내보내기로 설정

















// import useDetectClose from "./useDetectClose";

// const DropdownMenu = () => {
//     const[myPageIsOpen, myPageRef, myPageHandler] = useDetectClose(false);

//     return (<DropdownContainer>
//         <DropdaownButton
//         onClick={myPageHandler}
//         ref = {myPageRef}>
//             카테고리
//         </DropdaownButton>
//         <Menu
//         isDropped = {myPageIsOpen}>
//             <Ul>
//                 <Li>
//                     <LinkWrapper href="#1-1">
//                         메뉴 1
//                     </LinkWrapper>
//                 </Li>
//                 <Li>
//                     <LinkWrapper href="#1-2">
//                         메뉴 2
//                     </LinkWrapper>
//                 </Li>
//                 <Li>
//                     <LinkWrapper href="#1-3">
//                         메뉴 3
//                     </LinkWrapper>
//                 </Li>
//             </Ul>
//         </Menu>

//     </DropdownContainer>
//     )

// }