import express from "express"
import ConnectDb from "./src/config/Db.js"
 import { route as userRoutes } from "./src/routes/UserRoute.js"; 
const app = express()
app.use(express.json());
app.use("/api", userRoutes)

ConnectDb()

app.listen(4000, () => console.log("running on port 4000"))