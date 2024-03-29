const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const AllRoutes = require('./route/page')
const app = express()
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine','ejs')
app.use(AllRoutes)
app.use(express.static(path.join(__dirname,'public')))
app.listen(3000)