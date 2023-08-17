const express = require('express')
const bodyParser =  require('body-parser')
const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv');
const mongoose = require('mongoose')
const connectDB = require('./db/db')
const postRoutes = require('./routes/postRoutes')
const userRoutes = require('./routes/userRoutes')
const cors = require('cors')

const app = express()
dotenv.config()
connectDB()

app.use(express.json())
app.use(bodyParser.json({limit:"30mb",extended:true}))
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))
app.use(cors())


app.use('/posts',postRoutes)
app.use('/user',userRoutes)

app.get('/',(req, res) => {
    res.send('Hello to API')
})

// if(process.env.NODE_ENV === 'production'){
//     console.log(__dirname)
//     app.use(express.static(path.join(__dirname,'../frontend/build')))
//     app.get('*', (req, res) =>
//             res.sendFile(path.resolve(__dirname, '../','frontend', 'build', 'index.html'))
//   )
// } else{
//     app.get('/',(req,res) => {
//         res.send('Hllo')
//     })
    
// }


const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server is live on port ${PORT}`))

