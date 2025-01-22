document.addEventListener('DOMContentLoaded', async function () {
    try {
      const response = await fetch('https://best-care.vercel.app/users'); // Replace with your backend URL
      const users = await response.json();
  
      if (!response.ok) {
        throw new Error(users.error || 'Failed to fetch users');
      }
  
      // Clear the table body
      const tableBody = document.getElementById('userTableBody');
      tableBody.innerHTML = '';
  
      // Populate the table with user data
      users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${new Date(user.created_at).toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      const tableBody = document.getElementById('userTableBody');
      tableBody.innerHTML = '<tr><td colspan="4">Failed to load users.</td></tr>';
    }
  });
  