const express = require('express')
const fs = require('fs')
const path = require('path')
const userPath = path.join(__dirname, '..', 'data', 'user.json')
const productPath = path.join(__dirname, '..', 'data', 'product.json')
const router = express()

router.get('/', (req, res) => {
    res.render('Registration')
})

router.get('/login', (req, res) => {
    res.render('Login')
})

router.post('/', (req, res) => {
    let regBody = req.body
    console.log(regBody)
    fs.readFile(userPath, (err, data) => {
        if (!err) {
            let newReg = JSON.parse(data)
            regBody.id = newReg.length
            newReg.push(regBody)

            fs.writeFile(userPath, JSON.stringify(newReg), (err) => {
                if (err) throw "There is an error"
                res.redirect('/login')
            })
        }

    })
})
router.post('/login', (req, res) => {
    let logBody = req.body

    fs.readFile(userPath, (err, data) => {
        if (!err) {
            let newLog = JSON.parse(data)

            for (let i = 0; i < newLog.length; i++) {
                if (logBody.email == newLog[i].email && logBody.password == newLog[i].password && newLog[i].role == 'Admin') {
                    res.redirect('/admin-dashboard')
                } else if (logBody.email == newLog[i].email && logBody.password == newLog[i].password && newLog[i].role == 'Buyer') {
                    res.redirect('/buyer-dashboard')
                } else { }
            }
        }
    })
})
router.get('/admin-dashboard', (req, res) => {
    res.render('admin/admin-dashboard')
})
router.get('/buyer-dashboard', (req, res) => {
    fs.readFile(productPath,(err,data)=>{
        if(!err){
            let buydata = JSON.parse(data)
            res.render('buyer/buyer-dashboard',{buywork:buydata})
        }
    })
   
})
router.get('/add-product', (req, res) => {
    res.render('admin/add_product')
})
router.get('/productPage', (req, res) => {
    fs.readFile(productPath,(err,data)=>{
        if(!err){
            let fileData = JSON.parse(data)
            res.render('admin/product',{eachProduct:fileData})
        }
    })
})
//add product part
router.post('/add-product', (req, res) => {
    let prodBody = req.body
    console.log(prodBody)
    fs.readFile(productPath,(err, datas) => {
        if (!err) {
            let newprodData = JSON.parse(datas)
            
            prodBody.id = newprodData.length
            newprodData.push(prodBody)

            fs.writeFile(productPath, JSON.stringify(newprodData), (err) => {
                if (err) throw "There is an error"
                res.redirect('/productPage')
            })
        }

    })
})

//delete part
router.post('/buyer-delete',(req,res)=>{
    const id = req.body.userID
    console.log(id)
    fs.readFile(productPath,(err,datas)=>{
        if(!err){
            let newDelete = JSON.parse(datas)
            const oriDelete = newDelete.filter((value)=>{
              return value.id != id
            })
            console.log(oriDelete)
            fs.writeFile(productPath,JSON.stringify(oriDelete),(err)=>{
                if(err) throw "error 404"
            })
            res.redirect('/productPage')
        }
    })
})

//update part
router.get('/update-product/:id', (req, res)=>{
    let id= req.params.id;
    fs.readFile(productPath, (err, data)=>{
     let filedata = JSON.parse(data);
      let newData = filedata.filter((value)=>{
        return value.id == id
      });
     res.render('admin/update', {products:newData})
    })
})

// the updated form place
router.post('/updated', (req, res)=>{
let updatedData =req.body
fs.readFile(productPath, (err, data)=>{
let fildata = JSON.parse(data)
let newData =[]
for(let i =0; i < fildata.length; i++){
if(fildata[i].id == updatedData.id){
 newData[i] = updatedData
}else{
 newData[i] = fildata[i];
}

}
fs.writeFile(productPath, JSON.stringify(newData), (err)=>{
 if(err) throw err
})
res.redirect('/admin-dashboard')
});
})


// the buyer view more section
router.get('/single-details/:id',(req,res)=>{
   let id = req.params.id
   console.log(id)
   fs.readFile(productPath,(err,data)=>{
    let newFile = JSON.parse(data)
    const filtData = newFile.filter((value)=>{
        return value.id == id
    })
    res.render('buyer/product-buy',{detail:filtData})
   })
})

module.exports = router