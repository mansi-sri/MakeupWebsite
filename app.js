const express= require("express");
const path=require("path");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const { log } = require("console");

const app= express();
const port=8000;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/contactsMakeup', {
    useNewUrlParser: true,
    useUnifiedTopology:true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

//Mongoose
const ContactSchema = new mongoose.Schema({
    name: String,
    phone:String,
    email:String,
    address:String,
    desc:String
  });

const Contact = mongoose.model('Contact', ContactSchema);

//EXPRESS SPECIFIC STUFF
app.use('/static', express.static("static"))   //for serving static files
app.use(express.urlencoded({ extended: true }));
//app.use(bodyParser.urlencoded({extended: true}));

//PUG SPECIFIC STUFF
app.set('view engine', 'pug')  //for setting the template engine is pug
app.set('views', path.join(__dirname,'views'))//for setting the views directory

//ENDPOINTS
app.get('/',(req,res)=>{
    const params={}
    res.status(200).render('home.pug',params);
})
 app.get('/contact/list',async(req,res)=>{
    const contacts=await Contact.find()
    console.log(contacts)
    res.status(200).render('list.pug',{contacts});
})

app.get('/contact', (req, res) => {
    const params = {};
    res.status(200).render('contact.pug', params);
});

app.post('/contact',(req,res)=>{
    var myData= new Contact(req.body)
    myData.save().then(()=>{
        res.send("Hi Submitted")
      console.log(myData)
    }).catch(()=>{
        res.status(400).send("oops not saved")
    })
    
})

//START THE SERVER
app.listen(port,()=>{
    console.log(`The application is running at port ${port}`)
    })