import { useParams } from "react-router-dom";


const HomePage = () => {
    const { userID } = useParams();
    return (<div>Hello Trang profile của user, {userID} </div>)
}

export default HomePage;