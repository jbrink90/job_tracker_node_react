import { NavBar } from "../../components";
import "./index.css";

const LoginPage = () => {
  return  (<>
  <div className="reactTrackerPage_main">
    <div className="reactTrackerPage_leftPane">
      <NavBar isUserLoggedIn={false} />

      <div className="reactTrackerPage_buttonsContainer">
        <div className="reactTrackerPage_buttonsInner">
          <header className="reactTrackerPage_header">Login</header>
        </div>
        <div className="reactTrackerPage_buttonsInner">
        </div>
      </div>
      <div className="reactTrackerPage_tableContainer">

      </div>
    </div>
  </div>
</>)
};
export default LoginPage;
