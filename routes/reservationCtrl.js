const models = require('../models');
           
const { Op, where } = require('sequelize');
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hajerrrboulabiar@gmail.com',
    pass: 'yxzbrmgasbgscvkm'
  }
});
module.exports = {
    reserverAnnonce  :function (req, res)  {
        var user_id = req.userId;
        var startDate = req.body.startDate;
        var endDate = req.body.endDate;
        var annonceId = req.params.annonceId;

        if (startDate == null || endDate == null || annonceId == null) {
            res.status(400).send({
                data: null,
                error: "fields can not be empty!"
            
            });
            return;
            
        }
        else {
          
          models.Reservation.findAll({
            where: {
                annonceId:annonceId,
                status:'Accepté'
            }
          }).then(reservations => {
            let available = true ;
     
            let startDateAnnonce = new Date(startDate).getTime();
            let endDateAnnonce = new Date(endDate).getTime();
            reservations.every(element => {
              let startDateElement = new Date(element.startDate).getTime();
              let endDateElement = new Date(element.endDate).getTime();
           
            if(
                (startDateAnnonce >= startDateElement && startDateAnnonce <= endDateElement) ||
                (endDateAnnonce >= startDateElement && endDateAnnonce <= endDateElement) ||
                (startDateAnnonce <= startDateElement && endDateAnnonce >= endDateElement)
            ){
              console.log("enter intersection " )
                available = false;
               return false;
            }

            });

            console.log("available " , available)

            if(available==false){
              res.status(400).send({
                  data: null,
                  error: "Annonce non disponible pour ces dates!"
              
              });
              return;
          } else {
            models.Annonces.findOne({
              where: { id: annonceId },
            
                attributes: {
              exclude: ['CategoryId' ]
          } }).then(annonce => {
              
              if (annonce != null) { 
                  var start = new Date(startDate);
                  var end = new Date(endDate);
                  var diffTime = end.getTime() - start.getTime();
                  var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  console.log('diffDays', diffDays)
                  console.log('prix', annonce.prix)

                  models.Reservation.create({
                      startDate: startDate,
                      endDate: endDate,
                      userId: user_id,
                      annonceId: annonce.id,
                      status: "En attente",
                      total: annonce.prix * diffDays
      
                  })
                  .then(data => {
                      res.status(200).send(
                          {
                              data: "reservation effectué avec succès!",
                              error: null
                          }
                      );
                  })
                  .catch(err => {
                      res.status(500).send({
                          data: null,
                          error: err.message || "Some error occurred while creating the reservation."
                      });
                  });
              }
          })
          }

          }) 
 
          
        }
          

    },
    getAllReservations: function(req,res) {
        const { page, size } = req.query;
        const getPagination = (page, size) => {
            const limit = size ? +size : 3;
            const offset = page ? page * limit : 0;
          
            return { limit, offset };
          };

          const getPagingData = (data, page, limit) => {
            const { count: totalItems, rows: reservations } = data;
            const currentPage = page ? +page : 0;
            const totalPages = Math.ceil(totalItems / limit);
          
            return { totalItems, reservations, totalPages, currentPage };
          };

          const { limit, offset } = getPagination(page, size);


          models.Reservation.findAndCountAll({  
            where: { },
             limit, offset,
            include: [{ 
              model: models.User,
            attributes: ['name']
            
            },{ 
             
                model: models.Annonces,
            
                attributes: ['name']
              }
        ]
        })
            .then(data => {
              const response = getPagingData(data, page, limit);

              res.send(response);
            })
            .catch(err => {
              res.status(500).send({
                message:
                  err.message || "Some error occurred while retrieving tutorials."
              });
            });
    },
    deleteReservation : function(req, res) {
        var reservation_id = req.params.reservation_id;
        models.Reservation.findOne({
          where: { id: reservation_id },
        
        
        }).then( async reservationFound => {
          if (!reservationFound) {
            return res.status(404).json({

              error: 'Reservation not found',
              data:null
            }); 

          } else {

            const reservationDeleted = await reservationFound.destroy({
              where: { id: reservation_id }
            })
            if(reservationDeleted) {
              return res.status(200).json({
                error: null,
                data: "reservation supprimé avec succès"
              })
            } else {  
              return res.status(500).json({
                error: "Erreur lors de la suppression de la reservation",
                data:null
              })
            }
          
          }
        }
            );

      },

      acceptReservation : function(req, res) {
        var reservation_id = req.params.reservation_id;
        models.Reservation.findOne({
          where: { id: reservation_id },
        
        
        }).then( async reservationFound => {
          if (!reservationFound) {
            return res.status(404).json({

              error: 'Reservation not found',
              data:null
            }); 

          } else {

            const reservationUpdated= await reservationFound.update({
              status: "Accepté" ,
                updatedAt: new Date()
            }) ; 
            if(reservationUpdated) {
              var currentYear = new Date().getFullYear();

                console.log('reservationUpdated', reservationUpdated.userId)
                models.User.findOne({
                    where: { id: reservationUpdated.userId },

                }).then(user => { 
                    models.Annonces.findOne({ 
                        where: { id: reservationUpdated.annonceId },
                        attributes: ['name']
                    }).then(annonce => {  
                      var mainOptions = {
                        from: 'hajerrrboulabiar@gmail.com',
                        to:user.email,
                        subject: 'Acceptation reservation',
                       
                        text : `Bonjour ${user.name}, \n` + 
                        "Votre reservation pour "+ annonce.name   +" a été acceptée \n" +
                     
        
                        `A bientôt, \n` +
                        `L’équipe Real State 216. \n` +
                        `© ${currentYear} tous droits réservés`
                    };
        
                    // send mail with defined transport object
                    transporter.sendMail(mainOptions, function (err, info) {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({
                                'error': err,
                                'data': null
                            })
                        } else {
                            console.log('Message sent: ' + info.response);
                            return res.status(200).json({
                                'error': null,
                                'data': "Un lien pour réinitialiser mot de passe est envoyé à votre boite email"
                            })
                        }
                    })
                        })
                    }) 
                   // send mail to user   
         
             
              return res.status(200).json({ 

                      data: "reservation accepté avec succès",
                      error: null
                      
                    })  
              
            
            } else {  
              return res.status(500).json({
                error: "Erreur lors de la suppression de la reservation",
                data:null
              })
            }
          
          }
        }
            );
      },
      getReservationById : function(req, res) {
        var reservation_id = req.body.reservationId;
        models.Reservation.findOne({
          where: { id: reservation_id },
         })
          .then(data => { 
             if(data)
             {
              res.status(200).send(
                {data:  data,
                  error: null
                  }      
              );
             } else {   
                    
              res.status(404).send({  
                eroor: `Cannot find reservation with id=${reservation_id}.`,
                data:null
              }); 
            }
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving reservation"
            });
          });
      }


}