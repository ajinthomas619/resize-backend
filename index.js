const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const path = require('path')
app.use(express.static(path.join(__dirname, 'client/dist')));

  const allowedOrigins = ['resize-frontend.vercel.app'];
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }

  }))
  // app.use(
  //   cors({
  //     origin: "https://resize-frontend.vercel.app/"

  //   })
  // );
  app.use(express.json())
  mongoose.connect("mongodb+srv://ajinthomas619:Motog31@cluster0.u9qv5iq.mongodb.net/apidemo", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log("Connected to MongoDB Atlas");
  }).catch((error) => {
    console.error("Error connecting to MongoDB Atlas: ", error);
  });
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'Mongodb connect error'))
  db.once('open', () => {
    console.log('Connected to mongodb')
  })

  const entrySchema = new mongoose.Schema({

    data: String
  })
  const Entry = mongoose.model('Entry', entrySchema)

  let countAdd = 0
  let countUpdate = 0


  app.post('/add', async (req, res) => {

    countAdd++
    const data = req.body.data

    try {
  
      const entry = new Entry({ data })
      await entry.save()
    }
    catch (err) {
      res.status(500).send(err)
    }
  })

  app.put('/update', async (req, res) => {

    countUpdate++
    const { id } = req.body
    const data = req.body.formData.data;
  
    const objectId = new mongoose.Types.ObjectId(id);

    try {
    
      const updatedata = await Entry.findByIdAndUpdate(id, { data: data })
 

      res.send('Data Updated Successfully')
    }
    catch (error) {
      res.status(500).send(error)
    }
  })
  app.get('/count', (req, res) => {

    res.json({ add: countAdd, update: countUpdate })
  })

  app.get('/data', async (req, res) => {

    const entries = await Entry.find({})

    res.json(entries)
  })
  app.delete('/delete', async (req, res) => {
   
    try {

      const entries = await Entry.deleteOne(req.body);
      console.log("delete data", entries)
      if (entries.deletedCount > 0) {
        res.status(200).json({ message: 'Entry deleted successfully' });
      } else {
        res.status(404).json({ message: 'Entry not found or already deleted' });
      }

    } catch (error) {
      console.error('Error deleting entry:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  })

  const PORT = 8080
  app.listen(PORT, () => console.log(`server is running on port ${PORT}`))
