import { JobTable } from "../../components/JobTable";

function Table() { 
    const someJobApplications = [
        {
            "id": 1,
            "company": "NewName",
            "job_title": "Modified Job Title",
            "description": "Job Description changed",
            "location": "New Delhi, India",
            "status": "Applied",
            "applied": "2025-08-01",
            "last_updated": "2025-09-10"
        },
        {
            "id": 10,
            "company": "TechWorld",
            "job_title": "Software Engineer",
            "description": "Write and maintain software applications.",
            "location": "Chicago, IL",
            "status": "Interview Scheduled",
            "applied": "2025-02-18",
            "last_updated": "2025-03-02"
        },
        {
            "id": 12,
            "company": "TechPro",
            "job_title": "Data Engineer",
            "description": "Design and maintain data pipelines.",
            "location": "Austin, TX",
            "status": "Rejected",
            "applied": "2025-01-23T05:00:00.000Z",
            "last_updated": "2025-02-10"
        },
        {
            "id": 14,
            "company": "InnovationHub",
            "job_title": "Business Analyst",
            "description": "Analyze and interpret business data.",
            "location": "San Diego, CA",
            "status": "Interview Scheduled",
            "applied": "2025-02-10",
            "last_updated": "2025-03-03"
        },
        {
            "id": 18,
            "company": "MarketPro",
            "job_title": "Marketing Specialist",
            "description": "Develop marketing strategies for product promotion.",
            "location": "New York, NY",
            "status": "Interview Scheduled",
            "applied": "2025-02-22",
            "last_updated": "2025-03-01"
        },
        {
            "id": 20,
            "company": "CodeLabs",
            "job_title": "Software Engineer",
            "description": "Develop and maintain software solutions.sadfas",
            "location": "Austin, TX",
            "status": "Rejected",
            "applied": "2025-01-10",
            "last_updated": "2025-01-25"
        },
        {
            "id": 21,
            "company": "AlphaTech",
            "job_title": "QA Engineer",
            "description": "Test and ensure the quality of software products. sdfasdf",
            "location": "Chicago, IL",
            "status": "Applied",
            "applied": "2025-02-25",
            "last_updated": "2025-03-02"
        },
        {
            "id": 22,
            "company": "InnovatorsHub",
            "job_title": "Front-end Developer",
            "description": "Create responsive and interactive user interfaces.adfs",
            "location": "San Francisco, CA",
            "status": "Interview Scheduled",
            "applied": "2025-02-15",
            "last_updated": "2025-03-01"
        },
        {
            "id": 23,
            "company": "StartTech",
            "job_title": "Product Manager",
            "description": "Manage the development and launch of new products.",
            "location": "Seattle, WA",
            "status": "Offer Received",
            "applied": "2025-02-28",
            "last_updated": "2025-03-10"
        },
        {
            "id": 24,
            "company": "BizTech",
            "job_title": "Operations Manager",
            "description": "Oversee the day-to-day operations of the business.",
            "location": "Boston, MA",
            "status": "Rejected",
            "applied": "2025-01-30",
            "last_updated": "2025-02-12"
        },
        {
            "id": 25,
            "company": "CloudLabs",
            "job_title": "Cloud Architect",
            "description": "Design and implement cloud infrastructure.",
            "location": "Portland, OR",
            "status": "Applied",
            "applied": "2025-02-22",
            "last_updated": "2025-03-05"
        },
        {
            "id": 42,
            "company": "Test",
            "job_title": "Software Engineer",
            "description": "Develop and maintain web applications.",
            "location": "San Francisco, CA",
            "status": "Applied",
            "applied": "2025-03-01",
            "last_updated": "2025-03-10"
        },
        {
            "id": 43,
            "company": "Wahat",
            "job_title": "Software Engineer",
            "description": "Develop and maintain web applications.",
            "location": "San Francisco, CA",
            "status": "Applied",
            "applied": "2025-03-01",
            "last_updated": "2025-03-10"
        }
    ];
    return (
        <JobTable data={someJobApplications} theme="dark"/>
    );
}
export default Table;