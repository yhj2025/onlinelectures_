import "./style.scss"
import {
  createBrowserRouter,
  RouterProvider,
  // Route,
  Outlet,
} from 'react-router-dom';

import Register from "./pages/Register"
import Login from "./pages/Login"
import Write from "./pages/Write"
import Home from "./pages/Home"
import Single from "./pages/Single"
import Search from "./pages/Search"
import Courses from "./pages/Courses"
import OnlineStudy from "./pages/OnlineStudy"
import Profile from "./pages/Profile"
import MyOnline from "./pages/MyOnline"
import Cart from "./pages/Cart"
import Payment from "./pages/Payment"
import Myclasslist from "./pages/Myclasslist"
import MainHome from "./pages/MainHome"
import BoardDetail from "./pages/BoardDetail"
import LectureTOCBoardList from "./pages/LectureTOCBoardList"
import BoardList from "./pages/BoardList"
import MyInfo from "./pages/MyInfo"
import ChangePW from "./pages/ChangePW"
import MyPayment from "./pages/MyPayment"
import MyWishlist from "./pages/MyWishlist"
import Question from "./pages/Question"
import Look from "./pages/Look"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Video from "./components/VideoPlayer";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/Video",
        element: <Video />
      },
      {
        path: "/post/:id",
        element: <Single />
      },
      {
        path: "/write",
        element: <Write />
      },
      {
        path: "/search",
        element:<Search />
      },
      {
        path: "/courses/:LectureID",
        element: <Courses />
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/myonline/:UserID",
        element: <MyOnline/>
      },
      {
        path: "/cart",
        element: <Cart />
      },
      {
        path: "/payment",
        element: <Payment />
      },
      {
        path: "/myclasslist/:UserID",
        element: <Myclasslist/>
      },
      {
        path: "/mainhome",
        element: <MainHome/>
      },
      {
        path: "/BoardDetail",
        element: <BoardDetail/>
      },
      {
        path: "/LectureTOCBoardList",
        element: <LectureTOCBoardList/>
      },
      {
        path: "/OnlineStudy/:LectureID",
        element: <OnlineStudy/>
      },
      {
        path: "/MyInfo/:UserID",
        element: <MyInfo/>
      },
      {
        path: "/ChangePW/:UserID",
        element: <ChangePW/>
      },
      {
        path: "/MyPayment/:UserID",
        element: <MyPayment/>
      },
      {
        path: "/MyWishlist/:UserID",
        element: <MyWishlist/>
      },
      {
        path: "/Question",
        element: <Question/>
      },
      {
        path: "/BoardList",
        element: <BoardList/>
      },
      {
        path: "/Look",
        element: <Look/>
      },
    ]
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/onlinestudy",
    element: <OnlineStudy />
  },

]);

function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
