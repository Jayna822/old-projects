const express = require('express');
const apiRouter = express.Router();
const artistRouter = express.Router();
const seriesRouter = express.Router();
const issuesRouter = express.Router({mergeParams:true});

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const validateArtist = (req, res, next) => {
    const artist = req.body.artist;
    if (!(artist.name && artist.dateOfBirth && artist.biography)) {
        return res.status(400).send();
    }
    next();
};

const validateSeries = (req, res, next) => {
    const series = req.body.series;
    if (!(series.id && series.name && series.description)) {
        return res.status(400).send();
    }
    next();
};

const validateIssue = (req, res, next) => {
    const issue = req.body.issue;
    if (!(issue.id && issue.name && issue.issue_number && issue.publication_date && issue.artist_id && issue.series_id)) {
        return res.status(400).send();
    }
    db.get(`select * from Artist where id = ${issue.artist_id}`, (err, row) => {
        if (err) {
            return res.status(400).send();
        }
    })
    db.get(`select * from Series where id = ${issue.series_id}`, (err, row) => {
        if (err) {
            return res.status(404).send();
        }
    })
    next();
}

artistRouter.param('id', (req, res, next, id) => {
    db.get(`select * from Artist where id = ${id}`, (err, row) => {
        if (err) {
            next(err);
        } else {
            if (row) {
                req.artist = row;
                next();
            } else {
                res.status(404).send();
            }
        }
    })
});

seriesRouter.param('id', (req, res, next, id) => {
    db.get(`select * from Series where id = ${id}`, (err, row) => {
        if (err) {
            next(err);
        } else {
            if (row) {
                req.series = row;
                next();
            } else {
                res.status(404).send();
            }
        }
    })
});

issuesRouter.param('id', (req, rex, next, id) => {
    db.get(`select * from Issues where id = ${id}`, (err, row) => {
        if (err) {
            next(err);
        } else {
            if (row) {
                req.issue = row;
                next();
            } else {
                res.status(404).send();
            }
        }
    })
})

artistRouter.get('/', (req, res, next) => {
    db.all(`select * from Artist where is_currently_employed = 1`, (err, rows) => {
        if (err) {
            next(err);
        } else {
            res.status(200).json({artists: rows});
        }
    })
});

artistRouter.post('/', validateArtist, (req, res, next) => {
    const newArtist = req.body.artist;
    if (!newArtist.isCurrentlyEmployed) {
        newArtist.isCurrentlyEmployed = 1;
    }
    db.run(`insert into Artist (name, date_of_birth, biography, is_currently_employed) values ($name, $date_of_birth, $biography, $is_curently_employed)`, {
        $name: newArtist.name,
        $date_of_birth: newArtist.dateOfBirth,
        $biography: newArtist.biography,
        $is_curently_employed: newArtist.isCurrentlyEmployed
    }, function(err) {
        if (err) {
            next(err);
        } else {
            db.get(`select * from Artist where id = ${this.lastID}`, (err, row) => {
                if (err) {
                    return res.status(400).send();
                } else {
                    res.status(201).json({artist: row});
                }
            })
        }
    })
});

// artistRouter.post('/', (req, res, next) => {
//     debugger;
//   const name = req.body.artist.name,
//         dateOfBirth = req.body.artist.dateOfBirth,
//         biography = req.body.artist.biography,
//         isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;
//   if (!name || !dateOfBirth || !biography) {
//     return res.sendStatus(400);
//   }
//
//   const sql = `insert into Artist (name, date_of_birth, biography, is_currently_employed) values ($name, $date_of_birth, $biography, $is_curently_employed)`;
//   const values = {
//     $name: name,
//     $date_of_birth: dateOfBirth,
//     $biography: biography,
//     $is_curently_employed: isCurrentlyEmployed
//   };
//
//   db.run(sql, values, function(error) {
//     if (error) {
//       next(error);
//     } else {
//       db.get(`SELECT * FROM Artist WHERE Artist.id = ${this.lastID}`,
//         (error, artist) => {
//           res.status(201).json({artist: artist});
//         });
//     }
//   });
// });

artistRouter.get('/:id', (req, res, next) => {
    res.status(200).json({artist: req.artist});
});

// artistRouter.put('/:id', validateArtist, (req, res, next) => {
//     debugger;
//     db.run(`update Artist set name = $name, date_of_birth = $date_of_birth, biography = $biography, is_currently_employed = $is_curently_employed where id = $artistId`, {
//         $name: req.artist.name,
//         $date_of_birth: req.artist.date_of_birth,
//         $biography: req.artist.biography,
//         $is_curently_employed: req.artist.is_currently_employed,
//         $artistId: req.params.id
//     }, function(err) {
//         if (err) {
//             next(err);
//         } else {
//             db.get(`select * from Artist where id = ${req.params.id}`, (err, row) => {
//                 if (err) {
//                     next(err);
//                 } else {
//                     res.status(200).json({artist: row});
//                 }
//             })
//         }
//     })
//});

artistRouter.put('/:artistId', (req, res, next) => {
  const name = req.body.artist.name,
        dateOfBirth = req.body.artist.dateOfBirth,
        biography = req.body.artist.biography,
        isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;
  if (!name || !dateOfBirth || !biography) {
    return res.sendStatus(400);
  }

  const sql = 'UPDATE Artist SET name = $name, date_of_birth = $dateOfBirth, ' +
      'biography = $biography, is_currently_employed = $isCurrentlyEmployed ' +
      'WHERE Artist.id = $artistId';
  const values = {
    $name: name,
    $dateOfBirth: dateOfBirth,
    $biography: biography,
    $isCurrentlyEmployed: isCurrentlyEmployed,
    $artistId: req.params.artistId
  };

  db.run(sql, values, (error) => {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Artist WHERE Artist.id = ${req.params.artistId}`,
        (error, artist) => {
          res.status(200).json({artist: artist});
        });
    }
  });
});

artistRouter.delete('/:id', (req, res, next) => {
    db.run(`update Artist set is_currently_employed = 0 where id = $id`, {$id:req.params.id}, function(err) {
        if (err) {
            next(err);
        } else {
            db.get(`select * from Artist where id = ${this.lastID}`, (err, row) => {
                if (err) {
                    next(err);
                } else {
                    res.status(200).json({artist: row});
                }
            })
        }
    })
});

seriesRouter.get('/', (req, res, next) => {
    db.all(`select * from Series`, (err, rows) => {
        res.status(200).json({series: rows});
    })
});

seriesRouter.post('/', validateSeries, (req, res, next) => {
    const newSeries = req.body.series;
    db.run(`insert into Series (name, description) values ($name, $desciption)`, {
        $name: newSeries.name,
        $desciption: newSeries.description
    }, function(err) {
        if (err) {
            return res.status(404).send();
        }
        db.get(`select * from Series where if = ${this.lastID}`, (err, row) => {
            if (err) {
                return res.status(404).send();
            } else {
                res.status(201).send(row);
            }
        })
    })
});

seriesRouter.get('/:id', (req, res, next) => {
    res.status(200).json({series: req.series});
});

seriesRouter.put('/:id', validateSeries, (req, res, next) => {
    db.run(`update Series set name = $name, description = $description where id = $id`, {
        $name: req.series.name,
        $description: req.series.description,
        $id: req.params.id
    }, function(err) {
        if (err) {
            next(err);
        } else {
            db.get(`select * from Series where id = ${req.params.id}`, (err, row) => {
                if (err) {
                    next(err);
                } else {
                    res.status(200).json({series: row});
                }
            })
        }
    })
});

seriesRouter.delete('/:id', (req, res, next) => {
    db.get(`select * from Issue where series_id = ${req.params.id}`, (err, row) => {
        if (err) {
            next(err);
        } else {
            if (row) {
                res.status(400).send();
            } else {
                db.run(`delete from Series where id = ${req.params.id}`, (err) => {
                    if (err) {
                        next(err);
                    } else {
                        res.status(204).send();
                    }
                })
            }
        }
    })
});

issuesRouter.get('/', (req, res, next) => {
    db.all(`select * from Issue where series_id = ${req.body.series.id}`, (err, rows) => {
        if (err) {
            return res.status(404).send();
        }
        res.status(200).send(rows);
    })
});

issuesRouter.post('/', validateIssue, (req, res, next) => {
    const newIssue = req.body.issue;
    db.run(`insert into Issue (name, issue_number, publication_date, artist_id, series_id) values ($name, $issue_number, $publication_date, $artist_id, $series_id)`, {
        $name: newIssue.name,
        $issue_number: newIssue.issueNumber,
        $publication_date: newIssue.publicationDate,
        $artist_id: newIssue.artistId,
        $series_id: newIssue.seriesId
    }, function(err) {
        if (err) {
            return res.status(400).send();
        }
        db.get(`select * from Issue where id = ${this.lastID}`, (err, row) => {
            if (err) {
                return res.status(400).send();
            }
            return res.status(201).send(row);
        })
    })
});

issuesRouter.put('/:id', validateIssue, (req, res, next) => {
    db.run(`update Issue set name = $name, issue_number = $issue_number, publication_date = $publication_date, artist_id = $artist_id, series_id = $series_id where id = $id`, {
        $name: req.issue.name,
        $issue_number: req.issue.issue_number,
        $publication_date: req.issue.publication_date,
        $artist_id: req.issue.$artist_id,
        $series_id: req.issue.$series_id,
        $id: req.params.id
    }, function(err) {
        if (err) {
            next(err);
        } else {
            db.get(`select * from Issue where id = ${req.params.issueId}`, (err, row) => {
                if (err) {
                    next(err);
                } else {
                    res.status(200).json({issue: row});
                }
            })
        }
    })
});

issuesRouter.delete('/:id', (req, res, next) => {
    db.run(`delete from Issue where id = ${this.params.id}`, (err) => {
        if (err) {
            next(err);
        } else {
            res.status(204).send();
        }
    })
});

apiRouter.use('/artists', artistRouter);
apiRouter.use('/series', seriesRouter);
seriesRouter.use('/issues', issuesRouter);

module.exports = apiRouter;
