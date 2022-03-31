import express from "express";
import mongoose from "mongoose";
import routes from './src/routes'
import { APP_PORT, CONNECTION_URL } from "./src/config";
import errorHandler from "./src/middleware/errorHandler";
const app = express()


// mongodb connection
mongoose.connect(`${CONNECTION_URL}`, 
	{
    useNewUrlParser: true,
    useUnifiedTopology: true
	}
).then(() => {
	console.log('Mongodb connected!')
}).catch(err => console.log(err));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//routes
app.use('/api', routes)

app.use(errorHandler)

app.listen(APP_PORT, ()=> {
    console.log(`App is running on ${APP_PORT}`)
})