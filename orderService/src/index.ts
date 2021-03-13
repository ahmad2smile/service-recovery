import express from "express";

const app = express();



app.use('/', (req, res)=>{
    res.json({ hello: "world"});
});


app.listen(5000)