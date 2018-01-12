const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongoose').Types.ObjectId;

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE');
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
    let query = undefined;
    if(req.query.show) {
        switch(req.query.show) {
            case 'all':
                break;
            case 'priority':
                query = { priority: true }
                break;
            case 'notCompleted':
                query = { completed: false }
                break;
            case 'completed':
                query = { completed: true }
                break;
            default:
                break;
        }
    }

    Todo.find(query)
        .sort({ priority: -1 })
        .sort({ completed: 1 })
        .then(
            todos => res.send({ todos }),
            e => res.status(400).send(e)
        );
});

// DELETE TODO with id in DB
app.delete('/api/delete/:id', (req, res) => {
    let id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).send();
    }  

    Todo.findByIdAndRemove(id)
        .then(todo => {
            if (!todo) {
                return res.status(404).send();
            }
            res.send(todo);
        })
        .catch(e => res.status(400).send());
})

// PATCH TODO with id in DB
app.patch('/api/patch/:id', (req, res) => {
    let id = req.params.id;
    let completed = req.query.completed || undefined;
    let priority = req.query.priority || undefined;

    Todo.findByIdAndUpdate(id, {$set: { completed, priority }}, {new: true})
        .then(todo => {
            if (!todo) {
                return res.status(404).send();
            }
            res.send(todo);
        })
        .catch(e => res.status(400).send());
});

app.listen(3001, () => console.log('Started on port 3001'));

module.exports = { app };
