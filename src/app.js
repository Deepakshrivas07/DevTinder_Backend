const express = require("express");
const { connectDB } = require("./config/database");
// this cookie-parser helps to parse the cookie so that we can read the cookie else it shows undefined
const cookieParser = require("cookie-parser");
//cors is a middleware used to connect the frontend and backend as they are in different domain
const cors = require('cors')
const app = express();
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
//directly using app.use(function) means it will be applied to all the routes and if we want to apply it to specific route then we can use it like this app.get("/profile",userAuth,async (req,res)=>{...}) so here userAuth middleware will be applied to only /profile route.
app.use(express.json());//this is a inbuild middleware to convert the json formate to js obj.using this for req.body as node.js dont understands json formate so it will return undefine and to prevent from this we are using this middleware.
app.use(cookieParser()); 

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request');
const userRouter = require("./routes/user");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);


//we are listening to the server after connecting to the database (best practice)...
connectDB()
  .then(() => {
    console.log("Database connection establishted");
    app.listen(3000, () => {
      console.log("started server: 3000");
    });
  })
  .catch((err) => {
    console.error("Error occured");
  });
