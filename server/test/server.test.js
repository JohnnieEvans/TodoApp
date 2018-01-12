const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');

const todos = [
    { _id: new ObjectID(), task: 'First task' },
    { _id: new ObjectID(), task: 'Second task' }
];

beforeEach(done => {
    Todo.remove({})
        .then(() => Todo.insertMany(todos))
        .then(() => done());
});

describe('POST /todos', () => {
    it('should create new todo', done => {
        let task = 'Test todo task';

        request(app)
            .post('/api/todos')
            .send({ task })
            .expect(200)
            .expect(res => {
                expect(res.body.task).toBe(task);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({ task })
                    .then(todos => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].task).toBe(task);
                        done();
                    })
                    .catch(e => done(e));
            });
    });

    it('should not create todo with invalid body data', done => {
        request(app)
            .post('/api/todos')
            .send()
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find()
                    .then(todos => {
                        expect(todos.length).toBe(2);
                        done();
                    })
                    .catch(e => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', done => {
        request(app)
            .get('/api/todos')
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('DELETE /delete/:id', () => {
    it('should delete todo with id', done => {
        request(app)
            .delete(`/api/delete/${todos[0]._id}`)
            .expect(200)
            .expect(res => {
                expect(res.body.task).toBe(todos[0].task);
            })
            .end(done);
    });
});

describe('PATCH /patch/:id', () => {
    it('should update todo with id', done => {
        request(app)
            .patch(`/api/patch/${todos[0]._id}?completed=true&&priority=true`)
            .expect(200)
            .expect(res => {
                expect(res.body.completed).toBe(true);
            })
            .expect(res => {
                expect(res.body.priority).toBe(true);
            })
            .end(done);
    });
});