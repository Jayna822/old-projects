const express = require('express');
const checkMillionDollarIdea = require('./checkMillionDollarIdea');
const apiRouter = express.Router();
const minionsRouter = express.Router({mergeParams:true});
const ideasRouter = express.Router({mergeParams:true});
const meetingsRouter = express.Router({mergeParams:true});
const workRouter = express.Router({mergeParams:true});

// import stuff from db.js
const { getAllFromDatabase, getFromDatabaseById, addToDatabase, updateInstanceInDatabase, deleteFromDatabasebyId, deleteAllFromDatabase } = require('./db');

apiRouter.use((req, res, next) => {
    const splitURL = req.path.split('/');
    if (splitURL.includes('work')) {
        req.modelName = 'work';
    } else {
        req.modelName = splitURL[1];
    }
    next();
});

// apiRouter.param('id', (req, res, next, id) => {
//     debugger;
//     if (!Number(id)) {
//         return res.status(400).send('Invalid id');
//     }
//     const model = getFromDatabaseById(req.modelName, idToFind);
//     if (model !== -1) {
//         req.model = model;
//         req.model.id = idToFind;
//         next();
//     } else {
//         res.status(404).send('Model id not found.');
//     }
// });

const handleGetRequest = (req, res, next) => {
    debugger;
    if (req.params.id) {
        if (isNaN(Number(req.params.id))) {
            return res.status(404).send();
        }
        const model = getFromDatabaseById(req.modelName, req.params.id);
        if (model) {
            res.send(model);
        } else {
            res.status(404).send('Model id not found.');
        }
    } else {
        res.send(getAllFromDatabase(req.modelName));
    }
};

const handlePostRequest = (req, res, next) => {
    const newModel = addToDatabase(req.modelName, req.body);
    if (newModel) {
        res.status(201).send(newModel);
    } else {
        res.status(400).send();
    }
};

const handlePutRequest = (req, res, next) => {
    if (req.params.id && isNaN(Number(req.params.id))) {
        return res.status(404).send();
    }
    const updatedModel = updateInstanceInDatabase(req.modelName, req.body);
    if (updatedModel) {
        res.send(updatedModel);
    } else {
        res.status(404).send('Invalid inputs.');
    }
};

const handleDeleteRequest = (req, res, next) => {
    let success;
    if (req.params.id) {
        if (isNaN(Number(req.params.id))) {
            return res.status(404).send();
        } else {
            success = deleteFromDatabasebyId(req.modelName, req.params.id);
        }
    } else {
        success = deleteAllFromDatabase(req.modelName);
    }
    if (success) {
        res.status(204).send();
    } else {
        res.status(404).send();
    }
};

minionsRouter.get('/', handleGetRequest);
minionsRouter.post('/', handlePostRequest);
minionsRouter.get('/:id', handleGetRequest);
minionsRouter.put('/:id', handlePutRequest);
minionsRouter.delete('/:id', handleDeleteRequest);

ideasRouter.get('/', handleGetRequest);
ideasRouter.post('/', checkMillionDollarIdea, handlePostRequest);
ideasRouter.get('/:id', handleGetRequest);
ideasRouter.put('/:id', checkMillionDollarIdea, handlePutRequest);
ideasRouter.delete('/:id', handleDeleteRequest);

meetingsRouter.get('/', handleGetRequest);
meetingsRouter.post('/', handlePostRequest);
meetingsRouter.delete('/', handleDeleteRequest);

workRouter.get('/', handleGetRequest);
workRouter.post('/', handlePostRequest);
// workRouter.put('/:id', handlePutRequest);
workRouter.delete('/:id', handleDeleteRequest);

apiRouter.use('/minions', minionsRouter);
apiRouter.use('/ideas', ideasRouter);
apiRouter.use('/meetings', meetingsRouter);
minionsRouter.use('/:id/work', workRouter);

module.exports = apiRouter;
