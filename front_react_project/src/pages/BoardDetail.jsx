import React from 'react'
import "../App.css";

const BoardDetail = () => {
    return (
        <div>
            <div className='onelist'>
                <h1>관련목차 질문 게시판</h1>
                <h2>파이썬으로 무엇을 할 수 있나요?</h2>
                <p>작성자 날짜 </p>
                <hr/>
                <p>내용~~~</p>
                <hr/>
                <h3>답변하기 </h3>
                <textarea id='content' name='reply' rows={5} cols={143}>

                </textarea>
                <div style = {{float:'right'}}><input className='css-box-radius' type='button' value='등록'></input></div>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <h1>답변</h1>

                <p>작성자 날짜 </p>
                <p style={{backgroundColor: 'lightgrey'}}>입문자를 위해 준비한
[게임 프로그래밍, 알고리즘 · 자료구조] 강의입니다.
어디부터 시작할지 막막한 게임 프로그래밍 입문자를 위한 All-In-One 커리큘럼입니다. C++, 자료구조/알고리즘, STL, 게임 수학, Windows API, 게임 서버 입문으로 이어지는 알찬 커리큘럼으로 게임 프로그래밍 기초를 폭넓게 공부합니다.</p>
                <div style = {{float:'right'}}><input className='css-box-radius-auto' type='button' value='다른 질문 더 보기'></input></div>
                <br/>
                <br/>

            </div>
        </div>
    )
}

export default BoardDetail