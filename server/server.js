const express = require('express');
const bodyParser = require('body-parser');

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

app.listen(3000, () => console.log('Started on port 3000'));

module.exports = { app };