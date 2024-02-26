
const { genSaltSync } = require("bcrypt");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
const bcrypt =require("bcryptjs") ;
const jwt = require("jsonwebtoken");
const cookieparser = require('cookie-parser');
const mysql = require('mysql');
const connection = require('./database.js');

app.use(cookieparser());
app.use(express.static("public"));

const corsOptions = {
    origin: 'http://localhost:3000', // 클라이언트의 주소로 변경
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());  //json으로 값 보내기

// const connection = mysql.createConnection({
//     host : 'localhost',
//     user : 'root', 
//     password : '0000',
//     database : 'my_project',
//     port : 3306
// });



//로그인 전 메인페이지
// connection.connect();
// app.get('/api', (req, res) => {
 
//     console.log("node home step1.......");
//     connection.query(`SELECT LectureID, InstructorID, title, LecturesImageUrl, level, 강의금액, RANK() OVER (ORDER BY 갯수 DESC) AS 등수, 갯수  
//     FROM ( SELECT Lectures.LectureID, Lectures.InstructorID, Lectures.title, Lectures.LecturesImageUrl, Lectures.level
//                                 , Payments.Amount AS 강의금액, COUNT(*) AS 갯수
//                   FROM Lectures JOIN Payments 
//                     ON Payments.LectureID = Lectures.LectureID
//                   GROUP BY Lectures.LectureID, Lectures.title, Payments.Amount
//                 ) AS RankedData
//     ORDER BY 등수
//     LIMIT 6`, (err, row) => {
//         if(err){
//             console.error(err);
//             return res.status(500).send('서버 오류');
//         }
//         if(row.length === 0) {
//             return res.status(404).send('데이터 없음');
//         }
//         var popularLectures = row.map(row => ({
//             LectureID : row.LectureID,
//             InstructorID :row.InstructorID,
// 			title : row.title,
//             LecturesImageUrl : row.LecturesImageUrl,
// 			level : row.level,
// 			"강의 금액" : row['강의금액']
//         }));
//         console.log("node home step2 ......", popularLectures)
//         res.json({

//             code : 200,
//             message : "success",
//             popularLectures : popularLectures});
//     });
    
// });


//로그인
app.post("/api/login", (req, res) => {
    console.log("node login step1.......");
    const UserID = req.body.UserID;
    const Password = req.body.Password;
    connection.query(`SELECT UserID, Password, Usernickname, UserEmail
                        FROM Users
                        WHERE UserID = ? `
                        , [UserID], (err, row) => {
        if(err){
            console.error(err);
            return res.status(500).send('서버 오류');
        }
        if(row.length > 0){
            const isPasswordCorrect = bcrypt.compareSync(
                req.body.Password,
                row[0].Password
            );
            if(isPasswordCorrect) {
                console.log("node login step2 correct.......");
                const { Password, ...user } = row[0];
                const token = jwt.sign({ id: row[0].UserID }, "jwtkey");
                        res
                        .cookie("access_token", token, {
                            httpOnly: true,
                        })
                        .status(200)
                        .json({
                            code : 200,
                            message : '로그인 성공',
                            userInfo : user
                           });
            }else{
                return res.json({
                    code : 402,
                    message : '비밀번호가 다릅니다.'});
            }
        }else {
            return res.json({
                code : 401,
                message : '해당하는 아이디 또는 비밀번호가 존재하지 않습니다.'});
        }
    });
});

app.post("/api/logout", (req, res) => {
    console.log("node logout step1.......");

    res.clearCookie("access_token",{
        sameSite:"none",
        secure:true
      }).status(200).json("User has been logged out.")
 
});

//회원가입 아이디 중복체크
app.post("/api/checkuserid", (req, res) =>{

    const UserID = req.body.UserID;
    console.log("아이디 중복체크 노드 ", UserID);
    if(!UserID){
        return res.status(400).json({
            code : 400,
            message : '유효하지 않은 요청입니다.'
        });
    }
    connection.query(`SELECT userid
    FROM Users
    WHERE userid = ?`, [UserID], (err, row) => {
        if(err){
            console.error(err);
            return res.status(500).send('서버오류');
        }
        console.log("유저아이디: ", row.length);
        if(row.length > 0){
            
            return res.json({
                code : 401,
                message : '이미 사용중인 아이디 입니다.',
                isDuplicate : 1
            });
        }else {
            return res.json({
                code : 200,
                message : '사용가능한 아이디입니다.',
                isDuplicate : 0
            });
        }
    })
});


//회원가입 정보 저장
app.post("/api/register", (req, res) => {
    const UserID = req.body.UserID;
    const Usernickname = req.body.Usernickname;
    const UserEmail = req.body.UserEmail;
    const UserCellphone = req.body.UserCellphone;
    const salt = genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.Password, salt);
    const UserType = "user";

    connection.query(`INSERT INTO Users(UserID, Usernickname, UserEmail, UserCellphone, Password, UserType) 
    VALUES (?, ?, ?, ?, ?, ?)`, [UserID, Usernickname, UserEmail, UserCellphone, hash, UserType], (err, result) => {
            if(err){
                console.error(err);
                return res.status(500).send('서버오류');
            }
            if(result.affectedRows > 0){
                return res.json({
                    code : 200,
                    message : '회원가입이 완료되었습니다.',
                    userinfo : {UserID : UserID,
                                Usernickname :  Usernickname, 
                                UserEmail : UserEmail, 
                                UserCellphone : UserCellphone, 
                                UserType : UserType}
                });
            }else{
                return res.json({
                    code : 400,
                    message : '잘못된 요청입니다.'
                })
            }
    })
});






app.post("/api", (req, res) => {
    const token = req.cookies.access_token;
    console.log(token);
    // if (token == undefined) return res.status(401).json("Not authenticated!");
    if (!token) {
        // 로그인하지 않은 경우, popular 정보만 응답
        connection.query(`SELECT LectureID, CategoryID, InstructorID, title, LecturesImageUrl, level, 강의금액, 
        RANK() OVER (ORDER BY 갯수 DESC) AS 등수, 갯수  
FROM (
SELECT Lectures.LectureID, LectureCategory.CategoryID, Lectures.InstructorID, Lectures.title, Lectures.LecturesImageUrl, Lectures.level
, Payments.Amount AS 강의금액, COUNT(*) AS 갯수
FROM Lectures JOIN Payments 
ON Payments.LectureID = Lectures.LectureID
Join LectureCategory
ON Lectures.LectureID = LectureCategory.LectureID
GROUP BY Lectures.LectureID, LectureCategory.CategoryID, Lectures.title, Payments.Amount
) AS RankedData
ORDER BY 등수
LIMIT 6;`, (err, result2) => {
            if (err) {
                console.error(err);
                return res.status(500).send('서버오류');
            }
            var popular = result2.map(result2 => ({
                LectureID: result2.LectureID,
                CategoryID : result2.CategoryID,
                InstructorID : result2.InstructorID,
                title: result2.title,
                LecturesImageUrl: result2.LecturesImageUrl,
                level: result2.level,
                "강의 금액": result2['강의금액']
            }));
            console.log("node mainhome step2 ......", popular);

            res.json({
                code: 200,
                message: "success",
                popular: popular
            });
        });
    } else { jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");  // user 정보가 꼭 필요할때는 에러를 리턴한다. 
        console.log("userInfo : ", userInfo);
        
        const UserID = userInfo.id;

        connection.query(`SELECT Enrollments.LectureID, Enrollments.AttendanceRate,
        Lectures.title, Lectures.level, Lectures.LecturesImageUrl
    FROM Enrollments JOIN Lectures 
    ON Enrollments.LectureID = Lectures.LectureID
    WHERE Enrollments.UserID = ? `, [UserID], (err, result1) => {
        if(err){
            console.error(err);
            return res.status(500).send('서버오류');
        }
        var myclass = result1.map(result1 => ({
            LectureID : result1.LectureID,
            AttendanceRate : result1.AttendanceRate,
            title : result1.title,
            level : result1.level,
            LecturesImageUrl : result1.LecturesImageUrl
        }));
        console.log("node mainhome step2 ......", myclass)
        connection.query(`SELECT LectureID, CategoryID, InstructorID, title, LecturesImageUrl, level, 강의금액, 
        RANK() OVER (ORDER BY 갯수 DESC) AS 등수, 갯수  
FROM (
SELECT Lectures.LectureID, LectureCategory.CategoryID, Lectures.InstructorID, Lectures.title, Lectures.LecturesImageUrl, Lectures.level
, Payments.Amount AS 강의금액, COUNT(*) AS 갯수
FROM Lectures JOIN Payments 
ON Payments.LectureID = Lectures.LectureID
Join LectureCategory
ON Lectures.LectureID = LectureCategory.LectureID
GROUP BY Lectures.LectureID, LectureCategory.CategoryID, Lectures.title, Payments.Amount
) AS RankedData
ORDER BY 등수
LIMIT 6;`, (err, result2) => {
            if(err){
                console.error(err);
                return res.status(500).send('서버오류');
            }
            var popular = result2.map(result2 => ({
                LectureID : result2.LectureID,
                CategoryID : result2.CategoryID,
                InstructorID : result2.InstructorID,
                title : result2.title,
                LecturesImageUrl : result2.LecturesImageUrl,
                level : result2.level,
                "강의 금액" : result2['강의금액']
            }));
            console.log("node mainhome step2 ......", popular)
            if(myclass.length === 0 && popular.length === 0){
                res.json({
                    code : 401,
                    message : "찾을 수 없는 정보입니다."
                });
            }else{
                res.json({
                    code : 200,
                    message : "success",
                    myclass : myclass,
                    popular : popular
                });
            }
        }
        );
    });
    });
    }
});


app.post("/api/put/wishlist", (req, res) => {
    const UserID = req.body.UserID;
    const LectureID = req.body.LectureID;
    const CategoryID = req.body.CategoryID;
    const title = req.body.title;

    connection.query(`INSERT INTO Wishlist(UserID, LectureID, CategoryID, title) VALUES (?, ?, ?, ?);`,
    [UserID, LectureID, CategoryID, title], (err, result) =>{
        if(err){
            console.error(err);
            return res.status(500).send('서버 오류');
        }
        if(result.affectedRows > 0){
            res.json({
                code : 200,
                message : "success",
                result : {
                    "유저 아이디" : UserID,
                    "강의 아이디" : LectureID,
                    "카테고리 아이디" : CategoryID,
                    "강의 제목" : title
                }
            });
            console.log(UserID, LectureID, CategoryID, title);
        }else {
            res.json({
                code : 400,
                message : "찾을 수 없습니다."
            });
        }
    });
});


app.post("/api/search", (req, res) => {
    console.log("node search step1 ......")
    const level = req.body.level;
    const CategoryName = req.body.CategoryName;
    const select_sql = `SELECT Lectures.title, Lectures.LecturesImageUrl, Lectures.InstructorID, Lectures.level, Payments.LectureID
    , Payments.Amount as 강의금액, COUNT(Payments.LectureID) AS countamount
FROM Payments
JOIN Lectures ON Payments.LectureID = Lectures.LectureID
JOIN LectureCategory ON Lectures.LectureID = LectureCategory.LectureID
JOIN Category ON LectureCategory.CategoryID = Category.CategoryID`;
    let where_sql = ` `;
    // let params = level, CategoryName;
    console.log("node search step2 ......", CategoryName , level);
    let params = [];
    if (level !== '난이도' && CategoryName !== '카테고리') {
        where_sql = ` WHERE Lectures.level = ? AND Category.CategoryName = ?`;
        params = [level, CategoryName];
      }else if(level !== '난이도' && CategoryName === '카테고리'){
        where_sql = ` WHERE Lectures.level = ? `;
        params = [level];
      }else if(CategoryName !== '카테고리' && level === '난이도'){
        where_sql = ` WHERE Category.CategoryName = ? `;
        params = [CategoryName];
      }else{
        where_sql = ` `;
      }
      const groupby_sql = ` GROUP BY Lectures.level, Payments.LectureID, Payments.Amount
      ORDER BY countamount DESC, Payments.LectureID
      LIMIT 6`;
    const search_sql = select_sql + where_sql + groupby_sql;
    console.log(search_sql);
    connection.query(search_sql, params, (err, result) => {
    if(err){
        console.error(err);
        return res.status(500).send('서버 오류');
    }
    var LectureList = result.map(result => ({
        title : result.title,
        level : result.level,
        LecturesImageUrl: result.LecturesImageUrl,
        LectureID : result.LectureID,
        InstructorID : result.InstructorID,
        amount : result.amount
    }));
    if(result.length > 0){
        res.json({
            code : 200,
            message : 'success',
            LectureList : LectureList
        });
    }else{
        res.json({
            code : 400,
            message : '찾을 수 없습니다.'
        });
    }
});
});


//강의검색
app.post("/api/look", (req, res) => {
    const search = req.body.search;
    console.log("node look step1.......", search);
    connection.query(`SELECT Lectures.title, Lectures.LecturesImageUrl, Lectures.InstructorID, Lectures.level, Payments.LectureID
    , Payments.Amount as 강의금액, COUNT(Payments.LectureID) AS 결제횟수
FROM Payments
JOIN Lectures ON Payments.LectureID = Lectures.LectureID
JOIN LectureCategory ON Lectures.LectureID = LectureCategory.LectureID
JOIN Category ON LectureCategory.CategoryID = Category.CategoryID
WHERE Lectures.title like concat ('%', ?, '%') OR Lectures.level like concat ('%', ?, '%') OR Category.CategoryName like concat ('%', ?, '%')
GROUP BY Lectures.level, Payments.LectureID, Payments.Amount
ORDER BY 결제횟수 DESC, Payments.LectureID;`, [search, search, search], (err, result) => {
    if(err){
        console.error(err);
        return res.status(500).send('서버 오류');
    }
    console.log("node look step2.......", search);
    var SearchList = result.map(result => ({
        title : result.title,
        level : result.level,
        LectureID : result.LectureID,
        amount : result.강의금액,
        LecturesImageUrl: result.LecturesImageUrl,
        InstructorID : result.InstructorID
    }));
    console.log("node look step3.......", search);
    if(result.length > 0){
        res.json({
            code : 200,
            message : 'success',
            SearchList : SearchList
        });
    }else{
        res.json({
            code : 400,
            message : '찾을 수 없습니다.'
        });
    }
});
});

//강의 상세 페이지
app.post("/api/detaillecture", (req, res) => {
    const LectureID = req.body.LectureID;

    console.log("node detaillecture step1......", LectureID);
    const query = `SELECT Lectures.LectureID, Lectures.InstructorID,  Lectures.level, Lectures.title, Category.CategoryName 
    , Lectures.Description, Lectures.PreviewUrl, Payments.amount
FROM LectureCategory JOIN Category 
ON LectureCategory.CategoryID = Category.CategoryID
JOIN Lectures
ON LectureCategory.LectureID = Lectures.LectureID
JOIN Payments
ON Lectures.LectureID = Payments.LectureID
WHERE LectureCategory.LectureID = ?
LIMIT 1;`
    connection.query(query, [LectureID], (err, result) => {
    if(err){
        console.error(err);
        return res.status(500).send('서버오류');
    }
     // 결과가 없는 경우 처리
     if (result.length === 0) {
        return res.status(404).json({
            code: 404,
            message: "해당 강의를 찾을 수 없습니다."
        });
    }
    var detail = result.map(result => ({
        LectureID : result.LectureID,
        InstructorID : result.InstructorID,
        level : result.level,
		title : result.title,
	    CategoryName : result.CategoryName,
		Description : result.Description,
		PreviewUrl : result.PreviewUrl,
        amount : result.amount
    }));

    console.log("node detaillecture step2 detail......", detail);
    // 강사 소개 /////////////////////////////////////////////
    const InstructorID = detail[0].InstructorID;
    console.log("node detaillecture step3 InstructorID......", InstructorID);
    console.log("node Request Body1:", { LectureID, InstructorID });

    connection.query(`SELECT Instructor.InstructorName, Instructor.instructorImgUrl, Instructor.Email, Instructor.Qualifications
    FROM Instructor JOIN Lectures 
    ON Instructor.InstructorID = Lectures.InstructorID
    WHERE Instructor.InstructorID = ?`, [InstructorID], (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).send('서버오류');
        }
        var Instructor = result.map(result =>({
            InstructorName : result.InstructorName,
            instructorImgUrl :result.instructorImgUrl,
			Email : result.Email,
		    Qualifications : result.Qualifications
        }));
        console.log("node detaillecture step4 instructor......", Instructor);
        console.log("node Request Body1:", { LectureID, InstructorID });

        //커리큘럼////////////////////////////////////
        connection.query(`SELECT LectureTOC.title, LectureTOC.ParentTOCID, LectureTOC.VideoLength
        FROM LectureTOC Join Lectures
        ON LectureTOC.LectureID = Lectures.LectureID
        WHERE LectureTOC.LectureID = ?`, [LectureID], (err, result) => {
            if(err){
                console.error(err);
                return res.status(500).send('서버 오류');
            }
            var curriculum = result.map(result => ({
                title : result.title,
                ParentTOCID :result.ParentTOCID,
				VideoLength : result.VideoLength
            }));  
            if(detail.length === 0 || Instructor.length === 0 || curriculum.length === 0){
                res.json({
                    code : 401,
		            message : "찾을 수 없는 정보 입니다."
                })
            }else {
                console.log("node detaillecture step6......", detail, Instructor, curriculum);
                res.json({
                    code : 200,
	                message : "success",
		            detail : detail,
		            Instructor : Instructor,
		            curriculum : curriculum
                });    
            }
        });
    });
});
});

app.post("/api/selectEnrollment", (req, res) => {
    const UserID = req.body.UserID;
    connection.query(`select pay_state, LectureId
    from Payments
    where UserID = ?;`, [UserID], (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).send('서버오류');
        }
        var selectEnrollment = result.map(result =>({
            LectureId : result.LectureId,
            pay_state :result.pay_state
        }));
        if(selectEnrollment.length > 0){
            res.json({
                code : 200,
                message : 'success',
                selectEnrollment : selectEnrollment
            });
        }else{
            res.json({
                code : 400,
                message : '찾을 수 없습니다.',
                selectEnrollment : selectEnrollment

            });
        }
    })
})

//수강하기 insert
app.post("/api/enrollment", (req, res) => {
    const UserID = req.body.UserID;
    const LectureID = req.body.LectureID;
    const EnrollmentDate = req.body.EnrollmentDate;
    const AttendanceRate = req.body.AttendanceRate;
    const paymentstate = req.body.paymentstate;
    connection.query(`INSERT INTO Enrollments(UserID, LectureID, EnrollmentDate, AttendanceRate, paymentstate) VALUES (?, ?, ?, ?, ?);`,
    [UserID, LectureID, EnrollmentDate, AttendanceRate, paymentstate], (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).send('서버오류');
        }
        if(result.affectedRows > 0){
            res.json({
                code : 200,
                message : '수강 정보가 저장되었습니다.',
                enrollment : {"유저 아이디" : UserID,
                            "강의 아이디" : LectureID,
                            "수강 날짜" : EnrollmentDate,
                            "출석률" : AttendanceRate,
                            "결제 상태" : paymentstate}
            });
        }else{
            res.json({
                code : 401,
                message : '잘못된 요청입니다.'
            });
        }
    });
});


///결제하기///////////////////////////////////////////////////////////////////////////
app.post("/api/paying", (req, res) => {
    const LectureID = req.body.LectureID;
    connection.query(`SELECT Lectures.title, Payments.Amount
    FROM Lectures JOIN Payments
    ON Lectures.LectureID = Payments.LectureID
    WHERE Lectures.LectureID = ?`, [LectureID], (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).send('서버오류');
        }
        var payments = result.map(result => ({
            "강의 제목" : result.title,
            "강의 금액" : result.Amount
        }));
        console.log(payments);
        if(payments.length > 0){
            res.json({
                code : 200,
		        message : "success",
		        payments : payments
            });
        }else {
            res.json({
                code : 401,
		        message : "잘못된 요청입니다"
            })
        }
    });
});


//결제 정보 저장
app.post("/api/payinfo", (req, res) => {
    const UserID = req.body.UserID;
    const Amount = req.body.Amount;
    const PaymentDate = req.body.PaymentDate;
    const pay_state = req.body.pay_state;
    const LectureID = req.body.LectureID;
    connection.query(`INSERT INTO Payments(UserID, Amount, PaymentDate, pay_state, LectureID) 
    VALUES (?, ?, ?, ?, ?)`,[UserID, Amount, PaymentDate, pay_state, LectureID], (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).send('서버오류');
        }
        if(result.affectedRows > 0){
            res.json({
                code : 200,
                message : '결제 정보가 저장되었습니다.',
                payments : {"유저 아이디" : UserID,
                            "금액" : Amount,
                            "결제 날짜" : PaymentDate,
                            "결제 상태" : pay_state,
                            "강의 아이디" : LectureID}
            });
        }else{
            res.json({
                code : 401,
                message : '잘못된 요청입니다.'
            });
        }
    });
});


app.post("/api/lectureshow", (req, res) => {
    const LectureID = req.body.LectureID;
    connection.query(`SELECT LecturesMaterial.MaterialURL, LecturesMaterial.Description
    ,Lectures.title as '강의제목', LectureTOC.LectureID, LectureTOC.TocID, LectureTOC.title, LectureTOC.ParentTOCID
FROM LecturesMaterial JOIN LectureTOC
ON LecturesMaterial.TOCID = LectureTOC.TOCID
JOIN Lectures ON Lectures.LectureID = LectureTOC.LectureID
WHERE LectureTOC.LectureID = ? LIMIT 1`, [LectureID], (err, result) => {
    if(err){
        console.error(err);
        return res.status(500).send('서버오류');
    }
    var LecturesMaterial = result.map(result => ({
        LectureID : result.LectureID,
		MaterialURL : result.MaterialURL,
		Description : result.Description,
        title : result.강의제목
    }));
    var LectureTOC = result.map(result => ({
        "강의 ID" : result.LectureID,  
		"목차 아이디" : result.TocID,
		"소제목" : result.title,
	    "부모 목차 아이디" : result.ParentTOCID
    }));
    if(result.length > 0){
        res.json({
            code : 200,
            message : "success",
            LecturesMaterial : LecturesMaterial,
            LectureTOC : LectureTOC
        })
    }else {
        res.json({
            code : 401,
            message : "찾을 수 없는 정보입니다."
        });
    }
});
});


app.post("/api/lectureshowSet", (req, res) => {
    UserID = req.body.UserID;
    LectureID = req.body.LectureID;
    AttendanceRate = req.body.AttendanceRate;
    console.log("node lectureshowSet step1......", UserID, LectureID, AttendanceRate)
    const sql = `select * from Enrollments where UserID = ? and LectureID= ?`;
    const values = [UserID, LectureID];
    connection.query(sql, values,(err, result) => {
        if(err){
            console.error(err);
            return res.status(500).send('서버오류');
        }
        if(result.length === 0){
            const sql = `insert into enrollments(UserID, LectureID, AttendanceRate, EnrollmentDate ) value (?, ?, ?, NOW())`;
            const values = [UserID, LectureID, AttendanceRate];
            connection.query(sql, values,(err, insertResult) => {
                if(err){
                    console.error(err);
                    return res.status(500).send('서버오류');
                }
                if(insertResult.length === 0){
                    res.json({
                        success: false,
                        message : 'false'
                    });
                }else{
                    res.json({
                        success : true,
                        message : '성공'
                    });
                }
            });
        }else{
            const sql = `Update enrollments set AttendanceRate = ? where UserID = ? and LectureID = ?`;
            const values = [AttendanceRate, UserID, LectureID];
            connection.query(sql, values, (err, updateresult) => {
                if(err){
                    console.error(err);
                    return res.status(500).send('서버오류');
                }
                if(updateresult.length === 0){
                    res.json({
                        success:false,
                        message: '업데이트 실패'
                    });
                }else{
                    res.json({
                        success : true,
                        message : '업데이트 성공'
                    })
                }
            });
        }
    })


})


app.post("/api/lecturetoc_community_detail", (req, res) => {
    const Community = req.body.no;
    connection.query(`SELECT Community.Title, Community.CommunityDate, Community.Content
    ,Users.Usernickname, Reply.UserID, Reply.ReplyDate, Reply.Content
FROM Community JOIN Users
ON Community.UserID = Users.UserID
JOIN Reply
ON Community.no = Reply.comm_no
WHERE Community.no = ?
ORDER BY Community.CommunityDate ASC`, [Community], (err, result) => {
    if(err){
        console.error(err);
        return res.status(500).send('서버 오류');
    }
    var question = result.map(result => ({
        "커뮤니티 제목" : result.Title, 
		"게시 날짜" : result.CommunityDate,
		"내용" : result.Content
    }));
    var reply = result.map(result=> ({
        "유저 아이디" : result.UserID,
		"답변 날짜" : result.ReplyDate,
		"내용" : result.Content
    }));
    if(result.length > 0){
        res.json({
            code : 200,
            message : "success",
            question : question,
            reply : reply
        });
    }else{
        res.json({
            code : 401,
            message : "게시글을 찾을 수 없습니다."
        });
    }
});
});


app.post("/api/lecturetoc_communitylist", (req, res) => {
    const TOCID = req.body.TOCID;
    connection.query(`SELECT Community.Title, Community.CommunityDate, Community.Content
    ,Users.Usernickname, Community.TOCID
FROM Community JOIN Users
ON Community.UserID = Users.UserID
WHERE Community.TOCID= ?
ORDER BY Community.CommunityDate ASC;`, [TOCID], (err, result) => {
    if(err){
        console.error(err);
        return res.status(500).send('서버 오류');
    }
    var lecturetoc_communitylist = result.map(result => ({
        "커뮤니티 제목" : result.Title, 
		"게시 날짜" : result.CommunityDate,
		"내용" : result.Content,
        "유저 닉네임" : result.Usernickname,
        "목차 아이디" : result.TOCID
    }));
    if(result.length > 0){
        res.json({
            code : 200,
            message : "success",
            lecturetoc_communitylist : lecturetoc_communitylist
        });
    }else{
        res.json({
            code : 401,
            message : "게시글을 찾을 수 없습니다."
        });
    }
});
});


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
app.post("/api/question_insert", (req, res) => {
    const Title = req.body.title;
    const CommunityDate = req.body.CommunityDate;
    const Content = req.body.Content;
    const UserID = req.body.UserID;
    connection.query(`INSERT INTO community(Title, CommunityDate, Content, UserID) VALUES(?, ?, ?, ?);`,[Title, CommunityDate, Content, UserID], (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).send('서버오류');
        }
        if(result.affectedRows > 0){
            res.json({
                code : 200,
                message : '게시글이 등록되었습니다.',
                payments : {
                            "제목" : Title,
                            "게시 날짜" : CommunityDate,
                            "내용" : Content,
                            "유저 아이디" : UserID}
            });
        }else{
            res.json({
                code : 401,
                message : '잘못된 요청입니다.'
            });
        }
    });
});



app.post("/api/communitylist", (req, res) => {
    connection.query(`SELECT community.Title, community.CommunityDate, community.Content
    , Users.Usernickname
FROM community JOIN Users
ON community.UserID = Users.UserID
ORDER BY community.CommunityDate ASC;`, (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).send('서버오류');
        }
        var list = result.map(result => ({
            "커뮤니티 제목" : result.Title, 
			"게시 날짜" : result.CommunityDate,
			"내용" : result.Content,
			"유저 닉네임" : result.Usernickname
        }))
        if(result.length > 0){
            res.json({
                code : 200,
                message : 'success',
                list : list
            });
        }else{
            res.json({
                code : 401,
                message : '게시글 찾을 수 없습니다.'
            });
        }
    });
});


app.post("/api/myclass", (req, res) => {
    const UserID = req.body.UserID;
    console.log("node myclass step1......", UserID);
    connection.query(`SELECT Enrollments.AttendanceRate, Lectures.title
    FROM Enrollments JOIN Lectures 
    ON Enrollments.LectureID = Lectures.LectureID
    WHERE Enrollments.UserID = ? ;`, [UserID], (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).send("서버 오류");
        }
        if (result.length === 0) {
            return res.status(404).json({
                code: 404,
                message: "해당 회원정보를 찾을 수 없습니다."
            });
        }
        var myclasslist = result.map(result => ({
            AttendanceRate : result.AttendanceRate,
			title : result.title
        }));
        console.log(myclasslist);
        connection.query(`SELECT Lectures.title, Lectures.level
        FROM Lectures JOIN Wishlist 
        ON Lectures.LectureID = Wishlist.LectureID
        WHERE Wishlist.UserID = ?;`, [UserID], (err, result) => {
            if(err){
                console.error(err);
                return res.status(500).send('서버오류');
            }
            var wish = result.map(result => ({
                title : result.title,
				level : result.level
            }));
            console.log(wish);
            connection.query(`SELECT title, Content, CommunityDate
            FROM Community
            WHERE UserID = ?
            ORDER BY CommunityDate DESC;` ,[UserID], (err, result) => {
                if(err){
                    console.error(err);
                    return res.status(500).send('서버오류');
                }
                var community = result.map(result => ({
                    title : result.title,
					Content : result.Content,
					CommunityDate : result.CommunityDate
                }));
                console.log(community);
                connection.query(`SELECT Payments.amount, Lectures.title 
                FROM Payments JOIN Lectures
                ON Payments.LectureID = Lectures.LectureID
                WHERE Payments.UserID = ?
                ORDER BY PaymentDate DESC;`, [UserID], (err, result) => {
                    if(err){
                        console.error(err);
                        return res.status(500).send('서버오류');
                    }
                    var payment = result.map(result => ({
                        title : result.title,
                        amount : result.amount
                    }));
                    console.log(payment);
                    
                    console.log(myclasslist, wish, community, payment);
                    res.json({
                        code : 200,
                        message : 'success',
                        myclasslist : myclasslist,
                        wish : wish,
                        community : community,
                        payment : payment
                    });
                })
            });
        });
    });
});


//내가 수강중인 강좌 list
app.post("/api/myclasslist", (req, res) => {
    const UserID  = req.body.UserID;
    connection.query(`SELECT Lectures.title, Lectures.level, Category.Categoryname, 
    Enrollments.AttendanceRate
FROM LectureCategory JOIN Category 
ON LectureCategory.CategoryID = Category.CategoryID
JOIN Lectures
ON LectureCategory.LectureID = Lectures.LectureID
LEFT JOIN Enrollments 
ON Lectures.LectureID = Enrollments.LectureID
WHERE Enrollments.UserID = ?;`, [UserID], (err, result) => {
    if(err){
        console.error(err);
        return res.status(500).send('서버오류');
    }
    var myclasslist = result.map(result => ({
        title: result.title,
		level : result.level,
		Categoryname : result.Categoryname,
		AttendanceRate : result.AttendanceRate
    }));
    if(result.length > 0){
        res.json({
            code : 200,
            message : 'success', 
            myclasslist : myclasslist
        });
    }else{
        res.json({
            code : 401,
            message : '찾을 수 없는 정보입니다.'
        });
    }
});
});



app.post("/api/changemyinfo", (req, res) => {
    const UserID = req.body.UserID;
    const Usernickname = req.body.Usernickname;
    const UserEmail = req.body.UserEmail;
    const UserCellPhone = req.body.UserCellPhone;
    connection.query(`UPDATE Users 
    SET Usernickname = ?, UserEmail = ?, UserCellPhone = ?
    WHERE UserID = ?;`, [Usernickname, UserEmail, UserCellPhone, UserID], (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).send('서버오류');
        }
        if(result.affectedRows > 0){
            res.json({
                code : 200,
                message : '변경되었습니다.',
                Usernickname, UserEmail, UserCellPhone
            })
        }else{
            res.json({
                code : 401,
                message : '잘못된 요청입니다.'
            });
        }
    });
});



app.post("/api/checkuserpassword", (req, res) => {
    const Password = req.body.Password;
    const UserID = req.body.UserID;
    console.log("node checkuserpassword step1.......", Password)
    console.log(UserID)
    connection.query(`SELECT Password
    FROM Users
    WHERE UserID= ?;`, [UserID], (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).send('서버오류');
        }

        console.log("node checkuserpassword step2......", result[0])
        if(result.length > 0 && bcrypt.compareSync(Password, result[0].Password)){
            return res.json({
                code : 200,
                message : `사용자 ${UserID}님 비밀번호 입니다.`,
                user : result,
                isSamePassword : 1});
        }else if(result.length < 0 && bcrypt.compareSync(undefined, undefined)){
            return res.json({
                code : 401,
                message : '찾는 비밀번호가 없습니다.',
                isSamePassword :0 });
        }else{
            return res.json({
                code : 401,
                message : '찾는 비밀번호가 없습니다.',
                isSamePassword :0 });
        }
        

    })
})



app.post("/api/changepassword", (req, res) => {
    const salt = genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.newPassword, salt);
    const UserID = req.body.UserID;
    console.log("암호화 비밀키 : ", hash);
    console.log(UserID);
    connection.query(`UPDATE Users
    SET Password = ?
    WHERE UserID = ?;`, [hash, UserID], (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).send('서버오류');
        }
        if(result.affectedRows > 0){
            return res.json({
                code : 200,
                message : `변경되었습니다.`});
        }else {
            return res.json({
                code : 401,
                message : '비밀번호가 잘못되었습니다.'});
        }
    })
})


app.post("/api/wishlist", (req, res) => {
    const UserID = req.body.UserID;
    connection.query(`SELECT Lectures.LectureID, Lectures.title, Lectures.level, Category.Categoryname
    FROM LectureCategory JOIN Category 
    ON LectureCategory.CategoryID = Category.CategoryID
    JOIN Lectures
    ON LectureCategory.LectureID = Lectures.LectureID
    LEFT JOIN Wishlist 
    ON Lectures.LectureID = Wishlist.LectureID
    WHERE Wishlist.UserID = ?;`, [UserID], (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).send('서버오류');
        }
        var wishlist = result.map(result => ({
            LectureID : result.LectureID,
            title : result.title,
			level : result.level,
			Categoryname : result.Categoryname
        }));
        if(result.length > 0){
            res.json({
                code : 200,
                message : "success",
                wishlist : wishlist
            });
        }else{
            res.json({
                code : 401,
                message : "찾을 수 없는 정보입니다."
            });
        }
    });
});


app.post("/api/payment", (req, res) => {
    const UserID = req.body.UserID;
    connection.query(`SELECT Payments.PaymentID, Payments.PaymentDate, Payments.pay_state, 
    Lectures.title, Payments.Amount
FROM Payments JOIN Lectures
ON Lectures.LectureID = Payments.LectureID
WHERE Payments.UserID = ?;`, [UserID], (err, result) => {
    if(err){
        console.error(err);
        return res.status(500).send('서버오류');
    }
    var payment = result.map(result => ({
        PaymentID : result.PaymentID,
		PaymentDate : result.PaymentDate,
		pay_state : result.pay_state,
		title : result.title,
		Amount : result.Amount
    }));
    if(result.length > 0){
        res.json({
            code : 200,
            message : 'success',
            payment : payment
        });
    }else{
        res.json({
            code : 401,
            message : "찾을 수 없는 정보입니다."
        });
    }
});
});


app.listen(port, () => {
    console.log(`onlinelectures is running on port ${port}`);
});