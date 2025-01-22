document.addEventListener('DOMContentLoaded', async function () {
  try {
    const response = await fetch('https://best-care.vercel.app/users'); // Replace with your backend URL
    const users = await response.json();

    if (!response.ok) {
      throw new Error(users.error || 'Failed to fetch users');
    }

    // Get the table and add headers if not already present
    const table = document.getElementById('userTable');
    const tableBody = document.getElementById('userTableBody');

    // Add headers to the table
    const tableHeader = document.createElement('thead');
    tableHeader.innerHTML = `
      <tr>
        <th scope="col">ID</th>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
       
      </tr>
    `;
    table.appendChild(tableHeader);

    // Clear the table body
    tableBody.innerHTML = '';

    // Populate the table with user data
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
       
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    const tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = '<tr><td colspan="4">Failed to load users.</td></tr>';
  }
});
