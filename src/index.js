import express from "express"
import IndexRoute from "./router/index.route.js"
const app = express();

app.use(express.json());

app.use(IndexRoute)

app.listen(3000, ()=> {
    console.log("Hola server :) ");
})