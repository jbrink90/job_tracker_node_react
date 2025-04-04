import React, {useEffect, useState} from "react";
import "./index.css";
import CloseIcon from '@mui/icons-material/Close';
import { Job } from "@mytypes/Job";

interface EditSlideoutProps {
    cssClass?: string
    toggleSlideout: () => void
    job: Job
    masterJobList: Job[];
    setMasterJobList: React.Dispatch<React.SetStateAction<Job[]>>;
}

const EditSlideout: React.FC<EditSlideoutProps> = ({cssClass, toggleSlideout, job, masterJobList, setMasterJobList}) => {

    const [jobValues, setJobValues] = useState(job);

    useEffect(() => {
        setJobValues(job);
    }, [job])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setJobValues((prevJob) => ({
            ...prevJob,
            [name]: value
        }));
    }

    const saveApplication = () => {
        setMasterJobList(masterJobList.map((item) =>
            item.id === jobValues.id ? jobValues : item
        ));
        toggleSlideout();
    }

    return (<>
        <aside className={cssClass}>
            <div className="editSlideout_navRow">
                <CloseIcon fontSize="large" onClick={()=>{toggleSlideout()}}/>
            </div>
            <div className="editSlideout_content">
                <header className="editSlideout_header">Edit Application</header>
                
                <label>Company</label>
                <input type="text" name="company" value={jobValues.company} onChange={handleInputChange}/>

                <label>Position</label>
                <input type="text" name="job_title" value={jobValues.job_title} onChange={handleInputChange}/>

                <label>Description</label>
                <textarea rows={10} name="description" value={jobValues.description} onChange={handleInputChange}></textarea>

                <label>Location</label>
                <input type="text" name="location" value={jobValues.location} onChange={handleInputChange}/>

                <label>Status</label>
                <input type="text" name="status" value={jobValues.status} onChange={handleInputChange}/>

                <label>Date Applied</label>
                <input type="text" name="applied" value={jobValues.applied?.toString()} onChange={handleInputChange}/>

                <label>Last Update</label>
                <span className="editSlideout_span">{jobValues ? jobValues.last_updated?.toString() : '04/02/2024 12:07 AM'}</span>
                <button style={{marginTop:'15px', height:'40px'}} onMouseUp={saveApplication}>Save Application</button>
            </div>
        </aside>
    </>)
}

export default EditSlideout