document.addEventListener('DOMContentLoaded', async function() {
  try {
    const response = await fetch('https://best-care.vercel.app/users');
    const users = await response.json();

    if (!response.ok) {
      throw new Error(users.error || 'Failed to fetch users');
    }

    const table = document.getElementById('userTable');
    const tableBody = document.getElementById("userTableBody");

    // Add Bootstrap classes for styling
    table.classList.add('table', 'table-striped', 'table-bordered', 'table-hover', 'table-sm');

    const tableHeader = document.createElement('thead');
    tableHeader.innerHTML = `
      <tr>
        <th scope="col">ID:</th>
        <th scope="col">Name:</th>
        <th scope="col">Date Of Service:</th>
        <th scope="col">Paid:</th>
      </tr>`;
    table.appendChild(tableHeader);

    tableBody.innerHTML = ''; // Clear existing table body

    const occuranceMap = new Map();

    // Group users by name and date_of_service
    users.forEach(user => {
      const key = `${user.name}-${user.date_of_service}`;
      occuranceMap.set(key, (occuranceMap.get(key) || 0) + 1);
    });

    // Create a list of users sorted by the key
    const groupedUsers = [];
    occuranceMap.forEach((count, key) => {
      const [name, date_of_service] = key.split('-');
      const group = users.filter(user => `${user.name}-${user.date_of_service}` === key);
      groupedUsers.push({ group, count });
    });

    // Now display users, grouped by name and date_of_service
    groupedUsers.forEach(groupData => {
      const { group, count } = groupData;

      group.forEach(user => {
        const row = document.createElement('tr');

        const idCell = document.createElement('td');
        const nameCell = document.createElement('td');
        const dateCell = document.createElement('td');
        const paidCell = document.createElement('td');

        // Add values to the td elements
        idCell.innerHTML = user.id;
        nameCell.innerHTML = user.name;
        dateCell.innerHTML = user.date_of_service;
        paidCell.innerHTML = user.paid;

        // If there are duplicates, apply the text-danger class
        if (count > 1) {
          idCell.classList.add('text-danger');
          nameCell.classList.add('text-danger');
          dateCell.classList.add('text-danger');
          paidCell.classList.add('text-danger');
        }

        // Append td elements to the row
        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(dateCell);
        row.appendChild(paidCell);

        // Append the row to the table body
        tableBody.appendChild(row);
      });
    });

  } catch (error) {
    console.error('Error fetching users', error);

    const tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = '<tr><td colspan="3">Failed to load users.</td></tr>';
  }
});
