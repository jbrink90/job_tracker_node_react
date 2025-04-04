import { useState } from 'react';
import EditSlideout from "../../components/EditSlideout";
import { ReactTable } from "../../components";
import "./index.css";
import {mockApiResponseAll} from "@mocks/mockApiResponseAll";
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Job } from "@mytypes/Job";

const SlideoutPage = () => {

    const [masterJobList, setMasterJobList] = useState<Job[]>(mockApiResponseAll);
    const [selectedJobIndex, setSelectedJobIndex] = useState<number | null>(0);
    
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
        else {
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
            <ReactTable 
                jobs={masterJobList} 
                toggleSlideoutFunction={toggleSlideout} 
                setSelectedJobIndex={setSelectedJobIndex}
            />
        </div>
        <EditSlideout 
            job={masterJobList[selectedJobIndex ?? 0]} 
            toggleSlideout={toggleSlideout} 
            cssClass={"editSlideout_container"}
            masterJobList={masterJobList}
            setMasterJobList={setMasterJobList}
        />
    </>
    )
}
export default SlideoutPage