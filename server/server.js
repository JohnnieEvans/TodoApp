const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongoose').Types.ObjectId;

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');

const app = express();

app.use(bodyParser.json());

// POST new TODO to DB
app.post('/todos', (req, res) => {
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
app.get('/todos', (req, res) => {
    Todo.find()
        .then(
            todos => res.send({ todos }),
            e => res.status(400).send(e)
        );
});

// GET TODO with id in BD
app.get('/todos/:id', (req, res) => {
    let id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).send();
    }   

    Todo.findById(id)
        .then(
            todo => {
                if (todo) {
                   return res.send(todo);
                }
                res.status(404).send();
            },
            e => res.status(400).send(e)
        );
});

app.listen(3000, () => console.log('Started on port 3000'));

module.exports = { app };
