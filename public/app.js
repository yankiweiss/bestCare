document.getElementById('uploadExcelFile').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('file', document.getElementById('excelFile').files[0]);


    try {
       const response = await fetch('https://best-care.vercel.app/upload', {
        method: 'POST',
        body: formData
       }) 

      
      

       if (response.ok){
        alert('File was uploaded succsefuly');
       }else {
        alert('File Uplaod Failed')
       }
    } catch (error) {
        alert('Error uploading file')
        console.log(error)
    }
})