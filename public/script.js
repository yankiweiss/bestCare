document.addEventListener('DOMContentLoaded', async function(){
  try{
    const response = await fetch('https://best-care.vercel.app/users');
    const users = await response.json();
  
    if(!response.ok){
      throw new Error(users.error || 'Failed to fetch users');
      
    }

    const table = document.getElementById('userTable');
    const tableBody = document.getElementById("userTableBody");

    const tableHeader = document.createElement('thead');
    tableHeader.innerHTML =`
    <tr>
    <th scope="col">ID:</th>
        <th scope="col">Name:</th>
        <th scope="col">Date Of Service:</th>
    </tr>`;

    tableBody.appendChild(tableHeader);

    tableBody.innerHTML = '';

    const occuranceMap = new Map();

    users.forEach(user => {
      const key = `${user.name}-${user.date_of_service}`;
      occuranceMap.set(key, (occuranceMap.get(key) || 0) + 1);
      
    });

    const sortedUsers = users.sort((a, b) => {
      const aKey = `${a.name}-${a.date_of_service}`;
      const bKey = `${b.name}-${b.date_of_service}`;
      return (occuranceMap.get(bKey) - occuranceMap.get(aKey))
    })

    sortedUsers.forEach(user => {
      const key = `${user.name}-${user.date_of_service}`;
      const isDuplicate = occuranceMap.get(key) > 1;

      const row = document.createElement('tr');
      if(isDuplicate){
        row.classList.add('text-danger');
      }

      row.innerHTML =`
      <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.date_of_service}</td>
      `;
      tableBody.appendChild(row)
    });


  }catch(error) {
    console.error('Error fetching users', error);

    const tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = '<tr><td colspan="3">Failed to load users.</td></tr>';
  }
})