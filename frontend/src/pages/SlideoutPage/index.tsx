import { useEffect, useState } from 'react';
import EditSlideout from "../../components/EditSlideout";
import { ReactTable } from "../../components";
import "./index.css";
//import {mockApiResponseAll} from "@mocks/mockApiResponseAll";
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import { Job } from "@mytypes/Job";

const SlideoutPage = () => {
    const [masterJobList, setMasterJobList] = useState<Job[]>([]);
    const [selectedJobIndex, setSelectedJobIndex] = useState<number>(0);
    const [currentEditingJob, setCurrentEditingJob] = useState<Job>(masterJobList[selectedJobIndex ?? 0])

    const getAllJobs = async () => {
        try {
            console.log("API");
            const response = await fetch('/api/all', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              },
            });
        
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const data = await response.json();
            console.log('Success:', data);
            setMasterJobList(data);
            
          } catch (error) {
            console.error('Error:', error);
          }
    }

    const deleteJob = async (indexNumber: number) => {
        console.log(`trying to delete ${JSON.stringify(masterJobList[indexNumber])}`) 
        try {
            console.log("API");
            const response = await fetch('/api/deletejob', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(masterJobList[indexNumber])
            });
        
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const data = await response.json();
            console.log('Success:', data);
            
          } catch (error) {
            console.error('Error:', error);
          }
    }

    useEffect(() => {
        setCurrentEditingJob(masterJobList[selectedJobIndex]);
    }, [selectedJobIndex, masterJobList])

    const slideIn = () => {
        const slideout: HTMLElement = document.getElementsByTagName("aside")[0];
        slideout.classList.remove("slide-out-right");
        slideout.classList.add("slide-in-right");
    }
    const slideOut = () => {
        const slideout: HTMLElement = document.getElementsByTagName("aside")[0];
        slideout.classList.remove("slide-in-right");
        slideout.classList.add("slide-out-right");
    }

    return (
    <>
        <div className="slideOutPage_leftPane">
            <header style={{textAlign: 'left', marginBottom: '0px', fontSize:'xxx-large'}}>Current Applications</header>
            <div className="slideoutPage_buttonsContainer">
                <div className="slideoutPage_buttonsInner">
                <button><DownloadIcon fontSize="large"/></button>
                <button><UploadIcon fontSize="large"/></button>
                <button><RefreshIcon onClick={getAllJobs} fontSize="large"/></button>
                <button><AddIcon fontSize="large"/></button>
                </div>
            </div>
            <ReactTable 
                jobs={masterJobList} 
                slideIn={slideIn} 
                setSelectedJobIndex={setSelectedJobIndex}
                deleteJob={deleteJob}
            />
        </div>
        <EditSlideout 
            job={currentEditingJob}
            masterJobList={masterJobList}
            setMasterJobList={setMasterJobList}
            slideOut={slideOut}
            addingNewJob={true}
        />

    </>
    )
}
export default SlideoutPage