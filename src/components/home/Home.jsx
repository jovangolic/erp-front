import { useLocation } from "react-router-dom";
import MainHeader from "../layout/MainHeader";
import { useAuth } from "../auth/AuthProvider";
import MainHeader from "../layout/MainHeader";


const Home = () => {
    const location = useLocation();
    const { user: currentUser } = useAuth(); // Uzmi korisnika iz AuthProvider-a
    const message = location.state?.message;

    return (
        <div>
            {message && <div className="alert alert-info">{message}</div>}
            <h1>Welcome to the Home Page</h1>
            <section>
                {message && <p className="text-warning px-5">{message}</p>}
                {currentUser && (
                    <h6 className="text-success text-center">
                        You are logged in as {currentUser.sub} {/* Assuming `sub` is the user identifier */}
                    </h6>
                )}
                <MainHeader />
            </section>
        </div>
    );
};

export default Home;