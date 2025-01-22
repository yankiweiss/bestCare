const express = require("express");
const multer = require('multer');
const xlsx = require('xlsx')
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3501;
const cors = require("cors");
const supabase = require('../supabase.js');
const { error } = require("console");
const { enableCompileCache } = require("module");


app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename : (req, file, cb) =>{
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({storage: storage})

app.post('/upload', upload.single('file'), async (req, res) => {
  if(!req.file){
    return res.status(400).send('No File Uplaoded')
  }

  const filePath = req.file.path;

  try{

const workbook = xlsx.readFile(filePath);
const sheet_name_list = workbook.SheetNames;
const xlData = xlsx.utils.sheet_add_json(workbook.Sheets[Sheets_name_list[0]]);

const insertPromise = xlData.map(async (row) => {
  const {name, date_of_service} = row;
  if (name && date_of_service){
    const {data, error} = await supabase
    .from('patients')
    .insert({name, date_of_service});
    if(error){
      console.error('Error inserting in Database')
    }else {
      console.log('Data inserted:', data)
    }
  }
});

await Promise.all(insertPromise);

fstat.unlikSync(filePath);
res.send('File upaloeded, stored, and data is Saved to Supabase');
}catch(error){
  console.error('Error processing file:', error);
  res.status(500).send('Error Proccesing File')
}
})


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
