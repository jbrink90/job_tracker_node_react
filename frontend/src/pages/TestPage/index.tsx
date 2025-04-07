import { Job } from "@mytypes/Job";

function TestPage() { 
    const testRow: Job = {
        "id": 1,
        "company": "Test",
        "job_title": "Underwater Basketweaver",
        "description": "Develop and maintain baskets.",
        "location": "Chicago, CA",
        "status": "Applied",
        "applied": "2025-03-01",
        "last_updated": "2025-03-10"
      };

    const addJobToSQL = async () => {
        try {
            const response = await fetch('/api/createjob', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(testRow)
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

    return (
        <>
        <button onClick={addJobToSQL}>Add Job to SQL</button>
        </>
    );
}
export default TestPage;