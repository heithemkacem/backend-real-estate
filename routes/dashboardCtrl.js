const models = require('../models');
const { Op } = require('sequelize');
const moment= require('moment');
const asyncLib = require('async');

module.exports = {
    getNumberOfUsersByFilter: function (req, res) {
            var filter = req.params.filter;
            if (filter == 'today') {
                models.User.findAll({
                    attributes: ['id'],
                    where: {
                        createdAt: {
                            [Op.gte]: moment().startOf('day').toDate(),
                            [Op.lte]: moment().endOf('day').toDate()
                        }
                    }
                })
                    .then(feedbacks => {
                        res.status(200).json(feedbacks.length);
                    })
                    .catch(error => res.status(400).json({ error }));
            } else if (filter == 'month') {
                models.User.findAll({
                    attributes: ['id'],
                    where: {
                        createdAt: {
                            [Op.gte]: moment().startOf('month').toDate(),   
                            [Op.lte]: moment().endOf('month').toDate() 

                        }            

                    }
                })
                    .then(feedbacks => {
                        res.status(200).json(feedbacks.length);
                    })
                    .catch(error => res.status(400).json({ error }));
            }
             else {
                models.User.findAll({
                    attributes: ['id'],
                    where: {
                        createdAt: {
                            [Op.gte]: moment().startOf('year').toDate(),
                            [Op.lte]: moment().endOf('year').toDate()


                        }            

                    }
                })
                    .then(feedbacks => {
                        res.status(200).json(feedbacks.length);
                    })
                    .catch(error => res.status(400).json({ error }));
             }
        
        
        
        
        
        
             
    },
    getNumberOfAnnoncesByFilter: function (req, res) {
        var filter = req.params.filter;
        if (filter == 'today') {
            models.Annonces.findAll({
                attributes: ['id'],
                where: {
                    createdAt: {
                        [Op.gte]: moment().startOf('day').toDate(),
                        [Op.lte]: moment().endOf('day').toDate()
                    }
                }
            })
                .then(feedbacks => {
                    res.status(200).json(feedbacks.length);
                })
                .catch(error => res.status(400).json({ error }));
        } else if (filter == 'month') {
            models.Annonces.findAll({
                attributes: ['id'],
                where: {
                    createdAt: {
                        [Op.gte]: moment().startOf('month').toDate(),   
                        [Op.lte]: moment().endOf('month').toDate() 

                    }            

                }
            })
                .then(feedbacks => {
                    res.status(200).json(feedbacks.length);
                })
                .catch(error => res.status(400).json({ error }));
        }
         else {
            models.Annonces.findAll({
                attributes: ['id'],
                where: {
                    createdAt: {
                        [Op.gte]: moment().startOf('year').toDate(),
                        [Op.lte]: moment().endOf('year').toDate()


                    }            

                }
            })
                .then(feedbacks => {
                    res.status(200).json(feedbacks.length);
                })
                .catch(error => res.status(400).json({ error }));
         }
    
    
    
    
    
    
         
},
    getNumberReservationsByFilter: function (req, res) {
    var filter = req.params.filter;
    if (filter == 'today') {
        models.Reservation.findAll({
            attributes: ['id'],
            where: {
                createdAt: {
                    [Op.gte]: moment().startOf('day').toDate(),
                    [Op.lte]: moment().endOf('day').toDate()
                }
            }
        })
            .then(reservations => {
                res.status(200).json(reservations.length);
            })
            .catch(error => res.status(400).json({ error }));
    } else if (filter == 'month') {
        models.Reservation.findAll({
            attributes: ['id'],
            where: {
                createdAt: {
                    [Op.gte]: moment().startOf('month').toDate(),   
                    [Op.lte]: moment().endOf('month').toDate() 

                }            

            }
        })
            .then(reservations => {
                res.status(200).json(reservations.length);
            })
            .catch(error => res.status(400).json({ error }));
    }
     else {
        models.Reservation.findAll({
            attributes: ['id'],
            where: {
                createdAt: {
                    [Op.gte]: moment().startOf('year').toDate(),
                    [Op.lte]: moment().endOf('year').toDate()


                }            

            }
        })
            .then(reservations => {
                res.status(200).json(reservations.length);
            })
            .catch(error => res.status(400).json({ error }));
     }






     
},
getNumberOfFeedbacksByFilter: function (req, res) {
        var filter = req.params.filter;
        if (filter == 'today') {
            models.Feedbacks.findAll({
                attributes: ['id'],
                where: {
                    createdAt: {
                        [Op.gte]: moment().startOf('day').toDate(),
                        [Op.lte]: moment().endOf('day').toDate()
                    }
                }
            })
                .then(feedbacks => {
                    res.status(200).json(feedbacks.length);
                })
                .catch(error => res.status(400).json({ error }));
        } else if (filter == 'month') {
            models.Feedbacks.findAll({
                attributes: ['id'],
                where: {
                    createdAt: {
                        [Op.gte]: moment().startOf('month').toDate(),   
                        [Op.lte]: moment().endOf('month').toDate() 
    
                    }            
    
                }
            })
                .then(feedbacks => {
                    res.status(200).json(feedbacks.length);
                })
                .catch(error => res.status(400).json({ error }));
        }
         else {
            models.Feedbacks.findAll({
                attributes: ['id'],
                where: {
                    createdAt: {
                        [Op.gte]: moment().startOf('year').toDate(),
                        [Op.lte]: moment().endOf('year').toDate()
    
    
                    }            
    
                }
            })
                .then(feedbacks => {
                    res.status(200).json(feedbacks.length);
                })
                .catch(error => res.status(400).json({ error }));
         }
    
    
    
    
    
    
         
    },

    prepareDataForBarChart: function (req, res) {
        let labels = [];
        let numbers = [];
        let values = [];
        asyncLib.waterfall([
            function (done) {
                models.Categories.findAll({
                    attributes: ['id','name'],
                  
                }).then(function(categories) {
                    done(null, categories);
            }) 
            } , function (categories, done) { 
                let ids = [];
                categories.forEach(element => {
                    ids.push(element.id)
                    labels.push(element.name)
                 
                       
                });
                done(null, ids);
               
            } ,  function (ids, done) {
                let countAnnonceList = [];
                ids.forEach( (element,i) => {
                    console.log('i ' , i)
                    countAnnonceList=[]
                    models.Annonces.count({
                        where: {    
                            categorieId : element 
                        }
                    }).then(function (countAnnonces) {
                                             console.log("length   " , ids.length)

                        countAnnonceList.push(countAnnonces)
                        console.log("count  " , countAnnonceList)
                    
                        if(i == ids.length -1){
                            console.log("numbers 2 " , countAnnonceList)

                            res.status(200).json({
                                "labels": labels,
                                "values": countAnnonceList
                            });
                        }

                     
                    })
                })
           
             

            
            }   
        ])

       
    },
}
