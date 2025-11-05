import { useParams } from "react-router-dom";


const HomePage = () => {
    const { userID } = useParams();
    return (<div>Hello Homepage, {userID} </div>)
}

export default HomePage;