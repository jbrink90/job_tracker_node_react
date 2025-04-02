import React from "react";
import "./index.css";
import CloseIcon from '@mui/icons-material/Close';
import { Job } from "../../../../shared/src/types/Job";

interface EditSlideoutProps {
    cssClass?: string
    toggleSlideout: Function
    job: Job
}

const EditSlideout: React.FC<EditSlideoutProps> = ({cssClass, toggleSlideout, job}) => {
    return (<>
        <aside className={cssClass}>
            <div className="editSlideout_navRow">
                <CloseIcon fontSize="large" onClick={()=>{toggleSlideout()}}/>
            </div>
            <div className="editSlideout_content">
                <header className="editSlideout_header">Edit Application</header>
                
                <label>Company</label>
                <input type="text" placeholder="Company" value={job.company}/>

                <label>Position</label>
                <input type="text" placeholder="Position" value={job.job_title}/>

                <label>Description</label>
                <textarea defaultValue={'whoknows'} rows={10} value={job.description}></textarea>

                <label>Location</label>
                <input type="text" placeholder="Location" value={job.location}/>

                <label>Status</label>
                <input type="text" placeholder="Status" value={job.status}/>

                <label>Date Applied</label>
                <input type="text" placeholder="Date Applied" value={job.applied?.toString()}/>

                <label>Last Update</label>
                <span className="editSlideout_span">{job ? job.last_updated?.toString() : '04/02/2024 12:07 AM'}</span>
            </div>
        </aside>
    </>)
}

export default EditSlideout