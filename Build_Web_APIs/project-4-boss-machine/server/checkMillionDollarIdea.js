const checkMillionDollarIdea = (req, res, next) => {
    if (!(req.body.numWeeks) || !(req.body.weeklyRevenue)) {
        res.status(400).send();
    }
    const product = Number(req.body.numWeeks) * Number(req.body.weeklyRevenue);
    if (product && product >= 1000000) {
        next();
    } else {
        res.status(400).send();
    }
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
