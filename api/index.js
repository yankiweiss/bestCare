const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3501;
const cors = require("cors");
const supabase = require('../supabase.js');
const { error } = require("console");
const { enableCompileCache } = require("module");


app.use(express.json());

app.use(express.static('public'));

app.post('/newpatient', async(req, res) => {
  const {name , email} = req.body 

  if(!name || !email) {
    return res.status(400).json({error: 'Name and Email are required.'})
  }

  try {
    const {data , error} = await supabase
    .from('patients')
    .insert([{name , email}])

  if (error){
    throw error
  }

  res.status(201).json({message: 'patient added Succsesfuly ', data});

}catch (error){
res.status(500).json({error: error.message});
}
})



app.get("/create", (req, res) => {
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
