const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3501;
const cors = require("cors");
const supabase = require('../supabase.js');
const { error } = require("console");


app.use(express.json());

app.use(express.static('public'));

app.post('/newpatient', async(req, res) => {
  const {name , date_of_service} = req.body 

  if(!name || !date_of_service) {
    return res.status(400).json({error: 'Name and Date of Service are required.'})
  }

  try {
    const {data , error} = await supabase
    .from('patients')
    .insert([{name , date_of_service}])

  if (error){
    throw error
  }

  res.status(201).json({message: 'patient added Succsesfuly ', data});

}catch (error){
res.status(500).json({error: error.message});
}
})


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.get("/excel.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "excel.html"));
});

app.listen(PORT, () => console.log(`Server runing on port ${PORT}`));



module.exports = app;
