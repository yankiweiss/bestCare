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
app.use(bodyParser.json());


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },

  filename : (req, file , cb) => {
    cb(null, file.originalname)
  }
});

const upload = multer({storage: storage})

app.post('/upload', upload.single('csvFile'), (req, res) =>{
  if(!req.file){
    return res.status(400).send('No file uploaded')
  }

  const filePath = path.join(__dirname, 'uploads', req.file.filename );
  const jsonData = []

  fs.createReadStream(filePath)
  pipeline(csv())
  .on('data', (row) => {
    jsonData.push(row)
  })
  .on('end', ()=> {
    saveToDatabase(jsonData)
    .then(() =>{
      res.status(200).send('File uploaded and data saved to database.');
    })
    .catch((err) => {
      res.status(500).send('Error saving to database.');
  });
  })
})

async function saveToDatabase(data) {
  console.log('Data to save:', data);

  const records = data.map((row)=> ({
    name: row.name,
    date_of_service: row.date_of_service
  }))

  try {
    const { error } = await supabase
    .from('patients')
    .insert(records)

    if(error){
      throw error
    }

    console.log('Data saved to databse')
  } catch (error) {
    console.error('Error saving in database', error)
    throw error
  }
}
   

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
