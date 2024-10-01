const express = require('express');
const { MongoClient } = require('mongodb');
const { inserting, finding } = require('./demo');
const session = require('express-session');
const { render } = require('ejs');

const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
var cartItems=[];
const app = express();
app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cartItems: [],
    total: 0
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.listen(3000, () => {
    console.log('local host on port 3000');
});

app.get('/', (req, res) => {
    res.render('login');
});

app.post('/', async (req, res) => {
    try {
        var email = req.body.login_email;
        var passwo = req.body.login_pass;
        var data = {
            "email": email
        };
        const uri = "mongodb+srv://handicrafts:test123@cluster0.uohcfax.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        const client = new MongoClient(uri);
        await client.connect();
        const person = await finding(client, data, 'user');
        await client.close();
        console.log(data, person);
        if (person == null) {
            res.render('signup');
        }
        if (person[0].pass == passwo) {
            req.session.person = person[0];
        } else {
            res.render('signup');
            return;
        }
        res.render('home1', { person: req.session.person,cartItems: cartItems });
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send("An error occurred");
    }
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', async (req, res) => {
    try {
        var name = req.body.su_name;
        var phone = req.body.su_phone;
        var email = req.body.su_email;
        var pass = req.body.su_pass;
        var person = {
            name, phone, email, pass
        }
        const uri = "mongodb+srv://handicrafts:test123@cluster0.uohcfax.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        const client = new MongoClient(uri);
        await client.connect();
        await inserting(client, person, 'user');
        req.session.person = person;
        req.session.cartItems = req.session.cartItems || [];
        req.session.total = req.session.total || 0;
        await client.close();
        res.render('home1', { person: req.session.person,cartItems: cartItems });

    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send("An error occurred");
    }
});

app.post('/sell', async (req, res) => {
    try {
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var itemName = req.body.itemName;
        var itemPrice = req.body.itemPrice;
        var itemType = req.body.itemType;
        var itemImg = req.body.itemImg;
        var rating = req.body.rating;
        var desc = req.body.desc;
        var data = {
            firstName, lastName, itemName, itemPrice, itemType, itemImg, rating, desc
        }
        const uri = "mongodb+srv://handicrafts:test123@cluster0.uohcfax.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        const client = new MongoClient(uri);
        await client.connect();
        await inserting(client, data, 'itemsdata');
        await client.close();
        res.redirect('/sell');
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send("An error occurred");
    }
});

app.get('/shop', async (req, res) => {
    try {
        const person = req.session.person;
        req.session.cartItems = req.session.cartItems || [];
        req.session.total = req.session.total || 0;
        const uri = "mongodb+srv://handicrafts:test123@cluster0.uohcfax.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        const client = new MongoClient(uri);
        await client.connect();
        const data = {};
        const items = await finding(client, data, 'itemsdata');
        await client.close();
        console.log(items);
        let array1 = [];
        items.forEach(a => {
            array1.push(a.itemType);
        })
        let array2 = [];

        let set = new Set(array2);
        array1.forEach(item => {
            set.add(item);
        });

        array2 = Array.from(set);
        res.render('shop', { items: items, array2: array2, person: person, cartItems: cartItems});
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send("An error occurred");
    }
});
app.post('/shop', (req, res) => {
    const item=req.body.productItem;
    cartItems+=[item];
    console.log(cartItems);
    
});
app.get('/home', (req, res) => {
    const person = req.session.person;
    req.session.cartItems = req.session.cartItems || [];
    req.session.total = req.session.total || 0;
    res.render('home1', { person: person, cartItems: cartItems });
});

app.get('/contact-us', (req, res) => {
    const person = req.session.person;
    req.session.cartItems = req.session.cartItems || [];
    req.session.total = req.session.total || 0;
    res.render('contact-us', { person: person, cartItems: cartItems });
});

app.post('/contact-us', async (req, res) => {
    try {
        var name = req.body.name;
        var email = req.body.email;
        var message = req.body.message;
        var data = {
            "name": name,
            "email": email,
            "message": message
        }
        const uri = "mongodb+srv://handicrafts:test123@cluster0.uohcfax.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        const client = new MongoClient(uri);
        await client.connect();
        await inserting(client, data, 'contact');
        await client.close();
        res.redirect('/contact-us');

    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send("An error occurred");
    }
});

app.get('/sell', (req, res) => {
    const person = req.session.person;
    req.session.cartItems = req.session.cartItems || [];
    req.session.total = req.session.total || 0;
    res.render('sell', { person: person, cartItems: cartItems });
});

app.get('/cart', (req, res) => {
    
    const person = req.session.person;
    res.render('cart', { person: person, cartItems: cartItems });
});
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'iit2023006@iiita.ac.in',
      pass: '' 
    }
  });
  

app.post('/cart', (req, res) => {
    const { email, name } = req.body;
    const mailOptions = {
        from: 'iit2023006@iiita.ac.in',
        to:email,
        subject:['CraftWonders- ',name],
        text:cartItems
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        console.log(error);
        res.status(500).send('Failed to send email');
        } else {
        console.log('Email sent: ' + info.response);
        res.send('Email sent successfully');
        }
    });
});
  
  

app.get('/blog', (req, res) => {
    
    const person = req.session.person;
    
    res.render('blog', { person: person, cartItems: cartItems });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.use((req, res) => {
    const person = req.session.person;
    
    res.render('404', { person: person });
});
