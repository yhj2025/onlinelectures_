import React from "react";

const Question = () => {
    return (
        <div>
            <div className='css-question'>
            <h1>질문/답변</h1>
                <form>
                    <input type="text" id="question" name="question" placeholder="제목을 입력해주세요."></input>
                </form>   
                <br/>
                <br/>
                <textarea type="textarea" id="content" name="content" placeholder="내용을 입력해주세요."></textarea>
                <br/>
                <br/>
                <button className='button'>게시하기</button>
            </div>
        </div>
    )
}

export default Question