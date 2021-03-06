const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = require('./knexfile.js');
const db = knex(knexConfig.development);
const server = express();

server.use(helmet());
server.use(express.json())

server.get('/', (req, res)=>{
    res.send("it's alive!");
})

server.get('/api/cohorts',(req,res)=>{
    db("cohorts")
      .then(cohorts=>{
        res.status(200).json(cohorts);
      })
      .catch(err=>res.status(500).json(err));
})

server.get('/api/students',(req,res)=>{
    db("students")
      .then(students=>{
        res.status(200).json({...
            students //,
            //cohort: 
        });
      })
      .catch(err=>res.status(500).json(err));
})
  
server.get('/api/cohorts/:id',(req,res)=>{
    const id = req.params.id;
    db("cohorts").where({id})
        .then(cohorts=>{
        if (cohorts && cohorts.length != 0){
            res.status(200).json(cohorts[0]);
        } else {
            res.status(404).json({
            Error: "ID not found"
            })
        }
        })
        .catch(err=>res.status(500).json(err));
})

server.get('/api/students/:id',(req,res)=>{
    const id = req.params.id;
    db("students").where({id})
        .then(students=>{
        if (students && students.length != 0){
            res.status(200).json(students[0]);
        } else {
            res.status(404).json({
            Error: "ID not found"
            })
        }
        })
        .catch(err=>res.status(500).json(err));
})

server.get('/api/cohorts/:id/students',(req,res)=>{
    const id = req.params.id;
    db("students").where({cohort_id:id})
        .then(students=>{
            if (students && students.length != 0){
                res.status(200).json(students);
            } else {
                res.status(404).json({
                Error: "ID not found"
                })
            }
        })
        .catch(err=>res.status(500).json(err));
})
  
server.post('/api/cohorts', (req, res)=>{
    const cohort = req.body;
    db.insert(cohort)
        .into('cohorts')
        .then(id=>{
        res.status(201).json(id);
        })
        .catch(err=>res.status(500).json(err));
})

server.post('/api/students', (req, res)=>{
    const student = req.body;
    db.insert(student)
        .into('students')
        .then(id=>{
        res.status(201).json(id);
        })
        .catch(err=>res.status(500).json(err));
})
  
server.delete('/api/cohorts/:id', (req, res)=>{
    const id = req.params.id;
    db("cohorts").where({id}).del()
        .then(cohorts =>{
        if (cohorts && cohorts.length != 0){
            res.status(200).json({
            Success: "ID deleted."
            });
        } else {
            res.status(404).json({
                Error: "ID not found"
            })
        }
        })
        .catch(err=>res.status(500).json(err));
})

server.delete('/api/students/:id', (req, res)=>{
    const id = req.params.id;
    db("students").where({id}).del()
        .then(students =>{
        if (students && students.length != 0){
            res.status(200).json({
            Success: "ID deleted."
            });
        } else {
            res.status(404).json({
                Error: "ID not found"
            })
        }
        })
        .catch(err=>res.status(500).json(err));
})
  
server.put('/api/cohorts/:id', (req, res)=>{
    const id = req.params.id;
    const newCohort = req.body;
    db("cohorts").update(newCohort).where({id})
    .then(cohorts =>{
        if (cohorts && cohorts.length != 0){
        res.status(200).json({
            Success: "ID updated."
        });
        } else {
        res.status(404).json({
            Error: "ID not found"
        })
        }
    })
    .catch(err=>res.status(500).json(err)); 
})

server.put('/api/students/:id', (req, res)=>{
    const id = req.params.id;
    const newCohort = req.body;
    db("students").update(newCohort).where({id})
    .then(students =>{
        if (students && students.length != 0){
        res.status(200).json({
            Success: "ID updated."
        });
        } else {
        res.status(404).json({
            Error: "ID not found"
        })
        }
    })
    .catch(err=>res.status(500).json(err)); 
})

server.listen(9000, ()=>console.log('\nAPI running on 9000\n'))