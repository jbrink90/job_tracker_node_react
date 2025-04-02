import EditSlideout from "../../components/EditSlideout";
import { ReactTable } from "../../components";
import "./index.css";
import mock_response from "../../__mocks__/all_response.json";
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import RefreshIcon from '@mui/icons-material/Refresh';

const SlideoutPage = () => {

    const toggleSlideout = () => {
        const slideout: HTMLElement = document.getElementsByTagName("aside")[0];
        if (slideout.classList.contains("slide-in-right")) {
            slideout.classList.remove("slide-in-right");
            slideout.classList.add("slide-out-right");
        }
        else if (slideout.classList.contains("slide-out-right")) {
            slideout.classList.remove("slide-out-right");
            slideout.classList.add("slide-in-right");
        }
    }

    return (
    <>
        <div className="slideOutPage_leftPane">
            <header style={{textAlign: 'left', marginBottom: '0px', fontSize:'xxx-large'}}>Current Applications</header>
            <div className="slideoutPage_buttonsContainer">
                <div className="slideoutPage_buttonsInner">
                <button><DownloadIcon fontSize="large"/></button>
                <button><UploadIcon fontSize="large"/></button>
                <button><RefreshIcon fontSize="large"/></button>
                </div>
            </div>
            <ReactTable jobs={mock_response} toggleSlideoutFunction={toggleSlideout} />
        </div>
        <EditSlideout job={mock_response[0]} toggleSlideout={toggleSlideout} cssClass={"editSlideout_container slide-in-right"} />
    </>
    )
}
export default SlideoutPage