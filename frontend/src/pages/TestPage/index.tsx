import { Job } from "@reacttracker/shared";

function TestPage() { 
    const testRow: Job = {
        "id": 1,
        "company": "Test",
        "job_title": "Underwater Basketweaver",
        "description": "Develop and maintain baskets.",
        "location": "Chicago, CA",
        "status": "Applied",
        "applied": new Date("2025-03-01"),
        "last_updated": new Date("2025-03-10")
      };

    const addJobToSQL = async () => {
        try {
            const response = await fetch('/api/jobs', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(testRow)
            });
        
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            //const data = await response.json();
          } catch (error) {
            console.error('Error:', error);
          }
    }

    return (
        <>
        <button onClick={addJobToSQL}>Add Job to SQL</button>
        </>
    );
}
export default TestPage;