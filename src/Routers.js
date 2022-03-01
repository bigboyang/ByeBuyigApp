import CateList from "./pages/CateList";
import DetailPage from "./pages/DetailPage";
import Home from "./pages/Home";
import MyPage from "./pages/MyPage";
import Update from "./pages/Update";

export default [
    {
        path:'/',
        component : Home
    },
    {
        path:'/mypage',
        component:MyPage
    },
    {
        path : '/Update',
        component : Update
    },
    {
        path:'/category',
        component:CateList
    },
    {
        path:'/detail', // 쿼리 사용시에는 경로에 적을 필요없음
        component : DetailPage
    }
]