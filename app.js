const express = require('express');
const { connectToDb,getDb } = require('./db');
const { ObjectId } = require('mongodb');
const morgan = require('morgan');

// init and middleware
const app = express();
app.use(morgan('dev'));
app.use(express.json());    

// connect to db
let db;
connectToDb((err)=>{
 if(!err){
    app.listen(5000,()=>{
        console.log('-Listening to port 5000...')
    })
    db = getDb();
 }else{
    console.log('I am not connecting!')
 }
})

// routes
app.get('/books',( req,res )=>{
    let books =[]
    // pagination
    const page = req.query.p || 0;
    const pagesNo = 2;

    db.collection('books')
    .find()
    .sort({ author:1})
    .skip(page * 2)
    .limit(pagesNo)
    .forEach((book)=>{
      books.push(book)
    })
    .then(()=>{
       res.status(200).json(books);
    })
    .catch(()=>{
        res.status(500).json({ err:'Could not fetch !'});
    })
})
app.get('/books/:id',( req,res)=>{
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .findOne({_id: new ObjectId(req.params.id)})
        .then((doc)=>{
          res.status(200).json(doc)
        })
        .catch((err)=>{
          res.status(500).json({err:"Could not get doc!"})
        })
    }else{
        res.status(501).json({err:"Invalid id!"})
    }
})

app.post('/books',( req,res )=>{
    const book = req.body;

       db.collection('books')
       .insertOne(book)
       .then((result)=>{
         res.status(201).json(result);
       })
       .catch((err)=>{
        res.status(500).json({err:"Could not create a new doc!"})
       })
})

app.delete('/books/:id',( req,res )=>{
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then((result)=>{
          res.status(200).json(result)
        })
        .catch((err)=>{
          res.status(500).json({err:"Could not delete doc!"})
        })
    }else{
        res.status(501).json({err:"Invalid id!"})
    }
})

app.patch('/books/:id',( req,res )=>{
    const update = req.body;
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .updateOne({_id: new ObjectId(req.params.id)}, {$set:update})
        .then((result)=>{
          res.status(200).json(result)
        })
        .catch((err)=>{
          res.status(500).json({err:"Could not update doc!"})
        })
    }else{
        res.status(501).json({err:"Invalid id!"})
    }
})

