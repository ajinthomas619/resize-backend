const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const path =  require('path')
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('*', (req, res) => {
 res.sendFile(path.join(__dirname+'./../client/index.html'));
});
const allowCrossDomain = (req, res, next) => {
  res.header(`Access-Control-Allow-Origin`,`https://resize-frontend.vercel.app/`);    
  res.header("Access-Control-Allow-Credentials", "true");
  // res.header("Access-Control-Expose-Headers", "true");
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,OPTIONS,POST,DELETE`);
  res.header("Access-Control-Allow-Headers", "Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
};

app.use(allowCrossDomain);
app.use(
  cors({
    origin: "https://resize-frontend.vercel.app/"
   
  })
);
app.use(express.json())
mongoose.connect("mongodb+srv://ajinthomas619:Motog31@cluster0.u9qv5iq.mongodb.net/apidemo",{
useNewUrlParser: true,
useUnifiedTopology:true
}).then(() => {
  console.log("Connected to MongoDB Atlas");
}).catch((error) => {
  console.error("Error connecting to MongoDB Atlas: ", error);
});
const db = mongoose.connection
db.on('error',console.error.bind(console,'Mongodb connect error'))
db.once('open',() => {
    console.log('Connected to mongodb')
})
console.log("111111111")
const entrySchema = new mongoose.Schema({
    
    data:String
})
const Entry =mongoose.model('Entry',entrySchema)
console.log("222222222")
let countAdd = 0
let countUpdate = 0
console.log("33333333")

app.post('/add' , async(req,res)=>{
    console.log("44444444")
    countAdd++
    const data = req.body.data

    try{
        console.log("try mannnn")
        const entry = new Entry({data})
        await entry.save()
    }
    catch(err){
        res.status(500).send(err)
    }
})

app.put('/update',async (req,res)=> {
    console.log("entered updating data")
  countUpdate++
  const {id}  =req.body
const data = req.body.formData.data;
  console.log("idfgdfddd",req.body.formData.data)
  console.log("iddd",id)
  const objectId = new mongoose.Types.ObjectId(id);

  try{
    console.log("entered to update process")
    console.log("whatttt",{ _id: id, $set: data });
    console.log("dataa",data)
  const updatedata  = await Entry.findByIdAndUpdate(id,{ data: data  })
  console.log("updated data",updatedata) 

  res.send('Data Updated Successfully')
  }
  catch(error){
    res.status(500).send(error)
  }
})
  app.get('/count',(req,res)=>{
    console.log("countadd:",countAdd,"countupdate",countUpdate)
    res.json({add:countAdd, update:countUpdate})
  })

  app.get('/data',async (req,res)=>{
   
    const entries=await Entry.find({})
    
    res.json(entries)
  })
  app.delete('/delete',async(req,res)=>{
    console.log("delete entry")
    try{
        console.log("delete try entry")
    const entries = await Entry.deleteOne(req.body);
    console.log("delete data",entries)
    if (entries.deletedCount > 0) {
      res.status(200).json({ message: 'Entry deleted successfully' });
    } else {
      res.status(404).json({ message: 'Entry not found or already deleted' });
    }

  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }  })
  
const PORT = 8080
app.listen(PORT,()=>console.log(`server is running on port ${PORT}`))
