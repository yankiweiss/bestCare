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
       }else if (file.name.endsWith('.csv')){
        jsonData = await processCSVFile(file)
       }else {
        alert('Invalid file type. Please upload an Excel or CSV file.');
            return;
       }

       console.log(jsonData)

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
        const errorDetails = await response.text();
            console.error('Error:', errorDetails);
            alert(`Error uploading file: ${errorDetails}`);
       
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
            const jsonData = [];
            Papa.parse(file, {
                header: true, // Use the first row as headers
                skipEmptyLines: true,
                chunk: function (results) {
                    console.log('Processed chunk:', results.data);
                    jsonData.push(...results.data); // Append chunk data to jsonData
                },
                complete: function () {
                    console.log('All chunks processed!');
                    resolve(jsonData); // Resolve with the complete data
                },
                error: function (error) {
                    reject(error); // Reject if there's an error
                }
            });
        });
    }
});

        /*function CSVToJSON(csv) {
            const rows = csv.split('\n');
            const headers = rows[0].split(',');
        
            const json = rows.slice(1).map(row => {
                const values = row.match(/(".*?"|[^",\n]+)(?=\s*,|\s*$)/g); // Match values properly even with commas inside quotes
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header.trim()] = values[index].replace(/"/g, '').trim(); // Remove quotes and any extra spaces
                });
                return obj;
            });
        
            return json;
        }*/

            function CSVToJSON(csv){
                const rows = csv.split(/\r?\n/).filter(row => row.trim() !== '');

                const headers = rows.shift().split(',').map(header => header.trim())

                const json = [];
                let currentRow = []

                rows.forEach(row => {
                    if(row.split('"').length % 2 === 0){
                        currentRow[currentRow.length - 1] += '\n' + row;
                    }else {
                        currentRow.push(row)
                    }
                    
                });

                currentRow.forEach(row => {
                    const values = row.match(/(".*?"|[^",\n]+)(?=\s*,|\s*$)/g);
                    if(values){
                        const obj = {};
                        headers.forEach((header, index) => {
                            obj[header] = values[index] ? values[index].replace(/"/g, '').trim() : '';
                        })

                        json.push(obj)
                    }
                })

                return json;
            }
    