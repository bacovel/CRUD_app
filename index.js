const express = require('express');
const bodyParser = require('body-parser');
const ejsMate = require("ejs-mate");
const methodOverride = require('method-override')
require('dotenv').config();

//app
const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs'); // so you can render('index')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.set("views", __dirname + "/views");
app.use(express.static("public"));
app.use(methodOverride('_method'))


//MONGOOSE - DATABASE
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(MONGO_URL)
  .then(() => console.log('Connected!'));

const itemSchema = new Schema({
    nume: String,
    prenume: String,
    age: Number
});

const Item = mongoose.model("Item", itemSchema);

const getFriend = async (req, res) => {
    const friendFounded = await Item.findById(req.params.id);
    res.render("pages/friend.ejs",{title:"Edit Friend", friendFounded});
}

app.get('/', async (req, res) => {
    const items = await Item.find({});
    res.render("pages/index",{title:"Friends Management Software", itemsList: items});
});

app.post('/index', async (req, res) => {
    const item = new Item({...req.body});
    await item.save();
    res.redirect("/")
});

app.delete('/index/:id', async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.redirect("/");
})

app.put('/index/:id', async (req, res) => {
    await Item.findByIdAndUpdate(req.params.id, req.body)
    res.redirect("/");
});

app.get('/friend/:id', getFriend);





app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}...`);
});

