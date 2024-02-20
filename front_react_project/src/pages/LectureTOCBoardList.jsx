import React from "react";
import "../App.css";

const BoardList = () => {
    return (
        <div>
            <div className="onelist">
                <h1>파이썬이란...</h1>
                {/* 관련목차질문 */}
                <h3>전체보기</h3>
                <hr/>
                <p>제목   날짜</p>
                <hr/>
                <p>내용</p>
                <p>...</p>
                <p>...</p>
                <br/>
                <hr/>
                <p>제목   날짜</p>
                <hr/>
                <p>내용</p>
                <p>...</p>
                <p>...</p>
                <br/>
                <hr/>
                <p>제목   날짜</p>
                <hr/>
                <p>내용</p>
                <p>...</p>
                <p>...</p>
                <br/>
                <hr/>
            </div>
        </div>
    )
}


export default BoardList