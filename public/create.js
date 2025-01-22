document.getElementById('userForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the form from refreshing the page
  
    const name = document.getElementById('name').value;
    const email = document.getElementById('dateOfService').value;
  
    try {
      const response = await fetch('https://best-care.vercel.app/newpatient', { // Replace with your backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, date_of_service}), // Send name and email as JSON
      });
  
      const data = await response.json();
  
      if (response.ok) {
        document.getElementById('responseMessage').innerText = `Success: ${data.message}`;
      } else {
        document.getElementById('responseMessage').innerText = `Error: ${data.error}`;
      }
    } catch (error) {
      console.log(error)
      document.getElementById('responseMessage').innerText = `Error: ${error.message}`;
    }
  });
  