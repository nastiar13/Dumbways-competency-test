const express = require('express')
const app = express()
const path = require('path')
const session = require('express-session')
const cookieParser = require('cookie-parser') 
const flash = require('connect-flash')
const mysql = require('mysql')

let isLogin = 0
const {isDup, isMatch} = require('./utils/module.js')

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pandawa5",
    database: "db_task_collections"

})

const expressLayouts = require('express-ejs-layouts')

app.use(cookieParser('secret'))
app.use(
    session({
    cookie: {maxAge: 6000},
    secret: 'secret',
    resave: false,
    saveUninitialized: true
    })
)
app.use(flash())
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.urlencoded({extended: true}))
app.use('/public', express.static(path.join(__dirname, 'public')))



app.get('/', (req, res) => {
    db.query('select * from users_tb', (err, users) => {
        res.render('home', {
        title: "home",
        layout : 'layout/index',
        users,
        isLogin
        })
    })
    
})

app.get('/login', (req, res) => {
    
    res.render('login', {
        title : "Login",
        layout: "layout/index", 
        msg: req.flash('msg'),
        isLogin
    })
    
    
})

app.post('/login', (req, res) => {
    const {email, pass} = req.body
    db.query('select email, pass from users_tb', (err, result) => {
        const user = isMatch(result, email, pass)
        if(user) {
            db.query(`select * from users_tb where email = '${email}'`, (err, result) => {
                res.redirect(`/collection/${result[0].id}`) 
            })
            isLogin = 1
           
        }else {
            req.flash('msg', 'Email or password wrong!')
            res.redirect('/login')
        }
        

        
    })
    
})
app.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register',
        layout: "layout/index",
        msg: req.flash('reg'),
        isLogin
    })
})
app.post('/register', (req, res) => {
    const {email, pass, username} = req.body
    db.query('select email from users_tb', (err, result) => {
        if(isDup(result, email)) {
            req.flash('reg','Email has been registered!')
            res.redirect('/register')
        }else {
            db.query(`insert into users_tb(email, pass, username) values ("${email}","${pass}","${username}")`)
            res.redirect('/login')
        }
    })
})

app.get('/collection/:id', (req, res) => {
    const id = req.params.id
    db.query(`select * from collections_tb where user_id = ${id}`, (err, coll) => {
        res.render('collection', {
            title: "Collections",
            layout: 'layout/index',
            coll,
            id,
            isLogin
        })
    })
})
app.post('/add-coll/:id', (req, res) => {
    const id = req.params.id
    const collName = req.body.coll
    db.query(`insert into collections_tb (name, user_id) values ("${collName}", ${id})`, (err, result) => {
        res.redirect(`/collection/${id}`)
    })
})

app.get('/delete-coll/:id', (req, res) => {
    const id = req.params.id
    db.query(`select * from collections_tb where id = ${id}`, (err, coll) => {
        db.query(`delete from collections_tb where id = ${id}`, () => {
            res.redirect(`/collection/${coll[0].user_id}`)
        })
    })
})
app.post('/add-task/:id', (req, res) => {
    const id = req.params.id
    const taskName = req.body.task
    db.query(`insert into tasks_tb (name, collection_id) values ("${taskName}", ${id})`, (err, result) => {
        res.redirect(`/task/${id}`)
    })
})

app.get('/done/:id', (req, res) => {
    const id = req.params.id
    db.query(`select * from tasks_tb where id = ${id}`, (err, tasks) => {
      db.query(`update tasks_tb set is_done = 1 where id = ${id}`,() => {
        res.redirect(`../task/${tasks[0].collection_id}`)
        })  
    })
    

})

app.get('/task/:id',(req, res) => {
    const id = req.params.id
    db.query(`select * from collections_tb where id = ${id}`, (err, coll) => {
        db.query(`select * from tasks_tb where collection_id = ${id}`, (err, tasks) => {
            
            res.render('task', {
            title: "Task",
            layout: 'layout/index',
            isLogin,
            coll,
            tasks
            })

        })
        
    })
    
})

app.get('/logout', (req, res) => {
    isLogin = 0
    res.redirect('/')
})

app.listen(3000, () => {
    console.log('listening on http://localhost:3000')
})