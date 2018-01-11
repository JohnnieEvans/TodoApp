const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongoose').Types.ObjectId;

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// POST new TODO to DB
app.post('/api/todos', (req, res) => {
    let todo = new Todo({
        task: req.body.task,
    });

    todo.save()
        .then(
            doc => res.send(doc), 
            e => res.status(400).send(e)
        );
});

// GET all TODOs in DB
app.get('/api/todos', (req, res) => {
    Todo.find()
        .then(
            todos => res.send({ todos }),
            e => res.status(400).send(e)
        );
});

// GET TODO with id in BD
app.get('/api/todos/:id', (req, res) => {
    let id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).send();
    }   

    Todo.findById(id)
        .then(
            todo => {
                if (todo) {
                   return res.send({ todo });
                }
                res.status(404).send();
            }
        )
        .catch(e => res.status(400).send(e));
});

app.listen(3001, () => console.log('Started on port 3001'));

module.exports = { app };
