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

       console.log(`Total records processed: ${jsonData.length}`);

       // Split data into chunks and upload
       const CHUNK_SIZE = 500; // Number of rows per chunk
       for (let i = 0; i < jsonData.length; i += CHUNK_SIZE) {
           const chunk = jsonData.slice(i, i + CHUNK_SIZE); // Create chunks of data
           console.log(`Uploading chunk ${Math.floor(i / CHUNK_SIZE) + 1}...`);

           const response = await fetch('https://best-care.vercel.app/upload', {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json',
               },
               body: JSON.stringify(chunk),
           });

           if (!response.ok) {
               throw new Error(`Error uploading chunk ${Math.floor(i / CHUNK_SIZE) + 1}`);
           }

           console.log(`Chunk ${Math.floor(i / CHUNK_SIZE) + 1} uploaded successfully.`);
       }

       alert('File uploaded and processed successfully!');
   } catch (error) {
       alert('Error processing or uploading file.');
       console.error(error);
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
    