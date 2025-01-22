document.getElementById('uploadForm').addEventListener('submit', async (e) =>{
    e.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if(!file){
        alert('Pleaes selcet a File');
        return
    }

    const formData = new FormData();
    formData.append('file', file)

    let jsonData;

    try {
       if(file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        jsonData = await processExcelFile(file)
       }else if (file.name.endsWith('csv')){
        jsonData = await processCSVFile(file)
       }else {
        alert('Invalid file type. Please upload an Excel or CSV file.');
            return;
       }

       const response = await fetch('https://best-care.vercel.app/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
       });

       if (response.ok){
        alert('File uploaded and processed successfully!');
       }else {
        alert('Error uploading file.');
       }
    } catch (error) {
        alert('Error proccesing file.');
        console.error(error)
    }

    async function processExcelFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const data = event.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];  // Get the first sheet
                const sheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(sheet);
                resolve(json);
            };
            reader.onerror = function(error) {
                reject(error);
            };
            reader.readAsBinaryString(file);
        });
    }

        async function processCSVFile(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const data = event.target.result;
                    const json = CSVToJSON(data);
                    resolve(json);
                };
                reader.onerror = function(error) {
                    reject(error);
                };
                reader.readAsText(file);
            });
        }

        function CSVToJSON(csv) {
            const rows = csv.split('\n');
            const headers = rows[0].split(',');
        
            const json = rows.slice(1).map(row => {
                const values = row.split(',');
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header.trim()] = values[index].trim();
                });
                return obj;
            });
        
            return json;
        }
    })
    
