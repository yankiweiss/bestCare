const express = require("express");
const fs = require('fs');
const multer = require('multer');
const csv = require('csv-parser');
const xlsx = require('xlsx')
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3501;
const cors = require("cors");
const supabase = require('../supabase.js');
const { error } = require("console");
const { enableCompileCache } = require("module");
const bodyParser = require('body-parser');


app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.post('./upload', async (req, res) =>{
  const data = req.body;

  if(!data || data.length === 0){
    return res.status(400).send('No Data Received!')
  }

  try {
    const insertPromises = data.map(async (row) =>{
      const {Name, DateOfService, Paid, BillingInsurance} = row;

      if(Name && DateOfService && Paid && BillingInsurance){
        const {error } = await supabase
        .from('patients')
        .insert([{
           name: Name,
           date_of_service: dateOfService,
           paid: Paid,
           billing_insurance: BillingInsurance
        }])

        if(error){
          console.error("Error inserting in Database")
        }


      }else {
        console.warn('Row Skipped sue to missing feilds', row)
      }
    })

await Promise.all(insertPromises)

res.send('File processed and data saved to the database.');
} catch (error) {
  console.error('Error processing data:', error);
  res.status(500).send('Error processing data.');
}
});


app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')){
      res.set('Content-Type', 'application/javascript');
    }
  }
}));

app.get('/users', async (req, res) => {
  try {
    // Fetch users from the 'users' table
    const { data, error } = await supabase
      .from('patients')
      .select('*');

    if (error) {
      throw error; // Handle any Supabase errors
    }

    // Respond with the user data
    res.status(200).json(data);
  } catch (err) {
    // Handle server errors
    res.status(500).json({ error: err.message });
  }
});


app.post('/newpatient', async(req, res) => {
  console.log(req.body)
  const {name , dateOfService} = req.body 

  if(!name || !dateOfService) {
    return res.status(400).json({error: 'Name and Date of Service are required.'})
  }

  try {
    const {data , error} = await supabase
    .from('patients')
    .insert([{ name, date_of_service: dateOfService }])

  if (error){
    throw error
  }

  res.status(201).json({message: 'patient added Succsesfuly ', data});

}catch (error){
res.status(500).json({error: error.message});
}
})



app.get("/create.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "create.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.get("/excel.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "excel.html"));
});

app.listen(PORT, () => console.log(`Server runing on port ${PORT}`));



module.exports = app;
