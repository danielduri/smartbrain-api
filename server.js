import express, {response} from 'express';
import bcrypt from 'bcryptjs'
import cors from 'cors'
import knex from "knex";
import handleRegister from "./controllers/register.js";
import handleSignIn from "./controllers/signIn.js";
import handleProfileGet from "./controllers/profile.js";
import {handleImage, handleAPICall} from "./controllers/image.js";

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }
});

const app = express();

app.use(express.json())
app.use(cors())

/*
app.get('/', (req, res) => {
    console.log("DEBUG ONLY");
    db.select('*').from('users').then(response => res.json(response));
})
*/

app.get('/', (req, res) => {res.send('Server is up')})
app.post('/signIn', (req, res) => {handleSignIn(req, res, db, bcrypt)})
app.post("/register", (req, res) => {handleRegister(req, res, db, bcrypt)});
app.get('/profile/:id', (req, res) => {handleProfileGet(req, res, db)} )
app.put("/image", (req, res) => {handleImage(req, res, db)} )
app.post('/imageURL', (req, res) => handleAPICall(req, res))

app.listen(process.env.PORT || 3000, () => {
    console.log(`application is running on port ${process.env.PORT}`)
})

