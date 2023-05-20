const models = require('../models');
           
const { Op } = require('sequelize');

var express=require('express');
var app=express();
app.use(express.json());

module.exports = {
   createFeedback :function (req, res)  {
      // Validate request
     var user_id = req.userId;
      var message = req.body.message;
      var annonceId = req.body.annonceId;
    

      if (message == null ) {
        res.status(400).send({
          message: "Message can not be empty!"
      
        });
        return;
        
    } else if (annonceId == null ) {
      res.status(400).send({
        message: "Annonce can not be empty!"
    
      });
      return;
    }
 else {  
// Create a feedbacks
const feedbacks = {
    message: message,
    userId: user_id,
    annonceId: annonceId,

    
};

// Save feedbacks in the database
models.Feedbacks.create(feedbacks)
.then(data => {
res.send(data);
})
.catch(err => {
res.status(500).send({
message:
err.message || "Some error occurred while creating the feedbacks."
});
});
}
      
     

    },


// reserverFeedback  :function (req, res)  {
//   var user_id = req.userId;
//   var message = req.body.message;
//   var annonce_id = req.params.annonceId;
//   console.log('annonceId', annonceId)

//   if (message == null || userId == null || annonceId == null) {
//       res.status(400).send({
//           data: null,
//           error: "fields can not be empty!"
      
//       });
//       return;
      
//   }
//   else {  
//       models.Annonces.findOne({
//           where: { id: annonceId },
        
//             attributes: {
//           exclude: ['CategoryId' ]
//       } }).then(annonce => {
          
//           if (annonce != null) { 
             

//               models.Feedbacks.create({
//                   message: message,
//                   userId: user_id,
//                   annonceId: annonce.id,
//                   status: "En attente",
  
//               })
//               .then(data => {
//                   res.status(200).send(
//                       {
//                           data: "feedback effectué avec succès!",
//                           error: null
//                       }
//                   );
//               })
//               .catch(err => {
//                   res.status(500).send({
//                       data: null,
//                       error: err.message || "Some error occurred while creating the feedback."
//                   });
//               });
//           }
//       })
   
//   }

// },
    findAll :function(req, res) {

      const { page, size } = req.query;
      const getPagination = (page, size) => {
        const limit = size ? +size : 3;
        const offset = page ? page * limit : 0;
      
        return { limit, offset };
      };
      
      const getPagingData = (data, page, limit) => {
        const { count: totalItems, rows: feedbacks } = data;
        const currentPage = page ? +page : 0;
        const totalPages = Math.ceil(totalItems / limit);
      
        return { totalItems, feedbacks, totalPages, currentPage };
      };

      const { limit, offset } = getPagination(page, size);


  
      var message = req.body.message;
      var condition = message ? { name: { [Op.like]: `%${message}%` } } : null;

      var email = req.body.email;
      var condition = email ? { name: { [Op.like]: `%${email}%` } } : null;

      var password = req.body.password;
      var condition = password ? { name: { [Op.like]: `%${password}%` } } : null;

     
      
      models.Feedbacks.findAndCountAll({ where: condition ,limit , offset,   
        include: [{ 
        model: models.User, 
        attributes : ['name']
       
      },
      { 
        model: models.Annonces, 
        attributes : ['name']
       
      }]})
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
    updateFeedback :   function(req, res) {
      var feedback_id = req.params.feedback_id ;
      console.log('feedbackId ', feedback_id )
      var message  = req.body.message;
      var email = req.body.email;
      var password = req.body.password;
     

      if (message == null||email == null||password == null ) {
        res.status(400).send({
          message: "Content can not be empty!"  
        });
        return;
      }
       models.Feedbacks.findOne({
        where: { id: feedback_id },
        
      }
      ).then( async feedbackFound => {
        if (!feedbackFound) {
          return res.status(404).json({

            error: 'feedback not found',
            data:null
          }); 

        }  else {

              const feedbackUpdated = await feedbackFound.update({
                message: (message ? message : feedbackFound.message),
                email: (email ? email : feedbackFound.email),
                password: (password ? password : feedbackFound.password),
                
                


                updatedAt: new Date()
              })
              if(feedbackUpdated) {
                return res.status(200).json({
                  error: null,
                  data: feedbackUpdated
                })
              } else {  
                return res.status(500).json({
                  error: "Erreur lors de la mise à jour de l'utilisateur",
                  data:null
                })}
             
              }})},


 deleteFeedback : function(req, res) {
                var feedback_id = req.params.feedback_id;
                models.Feedbacks.findOne({
                  where: { id: feedback_id }
                }).then( async feedbackFound => {
                  if (!feedbackFound) {
                    return res.status(404).json({
              
                      error: 'feedback not found',
                      data:null
                    }); 
              
                  } else {
              
                    const feedbackDeleted = await feedbackFound.destroy({
                      where: { id: feedback_id }
                    })
                    if(feedbackDeleted) {
                      return res.status(200).json({
                        error: null,
                        data: "feedback supprimé avec succès"
                      })
                    } else {  
                      return res.status(500).json({
                        error: "Erreur lors de la suppression de l'feedback",
                        data:null
                      })
                    }
                  
                  }
                }
                    );
              
              },
      
          

              getFeedbackById : function(req, res) {
                var feedback_id = req.body.feedbackId;
                models.Feedback.findOne({
                  where: { id:  feedback_id },
                  // include: [{ 
                  //   model: models.Categories, 
                  
                  // }]
              //     ,  attributes: {
              //     exclude: ['CategoryId' ]
              //  } 
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
                        eroor: `Cannot find annonce with id=${feedback_id}.`,
                        data:null
                      }); 
                    }
                  })
                  .catch(err => {
                    res.status(500).send({
                      message:
                        err.message || "Some error occurred while retrieving feedback"
                    });
                  });
              },
              // acceptFeedback : function(req, res) {
              //   var feedback_id = req.params.feedback_id;
              //   models.Feedback.findOne({
              //     where: { id: feedback_id },
                
                
              //   }).then( async feedbackFound => {
              //     if (!feedbackFound) {
              //       return res.status(404).json({
        
              //         error: 'feedback not found',
              //         data:null
              //       }); 
        
              //     } else {
        
              //       const feedbackUpdated= await feedbackUpdated.update({
              //         status: "Accepté" ,
              //           updatedAt: new Date()
              //       }) ; 
              //       if(feedbackUpdated) {
              //         var currentYear = new Date().getFullYear();
        
              //           console.log('feedbackUpdated', feedbackUpdated.userId)
              //           models.User.findOne({
              //               where: { id: feedbackUpdated.userId },
        
              //           }).then(user => { 
              //               models.Annonces.findOne({ 
              //                   where: { id: feedbackUpdated.annonceId },
              //                   attributes: ['name']
              //               }).then(annonce => {  
              //                 var mainOptions = {
              //                   from: 'hajerrrboulabiar@gmail.com',
              //                   to:user.email,
              //                   subject: 'Acceptation feedback',
                               
              //                   text : `Bonjour ${user.name}, \n` + 
              //                   "Votre feedback pour "+ annonce.name   +" a été acceptée \n" +
                             
                
              //                   `A bientôt, \n` +
              //                   `L’équipe Real State 216. \n` +
              //                   `© ${currentYear} tous droits réservés`
              //               };
                
              //               // send mail with defined transport object
              //               transporter.sendMail(mainOptions, function (err, info) {
              //                   if (err) {
              //                       console.log(err);
              //                       return res.status(500).json({
              //                           'error': err,
              //                           'data': null
              //                       })
              //                   } else {
              //                       console.log('Message sent: ' + info.response);
              //                       return res.status(200).json({
              //                           'error': null,
              //                           'data': "Un lien pour réinitialiser mot de passe est envoyé à votre boite email"
              //                       })
              //                   }
              //               })
              //                   })
              //               }) 
              //              // send mail to user   
                 
                     
              //         return res.status(200).json({ 
        
              //                 data: "feedback accepté avec succès",
              //                 error: null
                              
              //               })  
                      
                    
              //       } else {  
              //         return res.status(500).json({
              //           error: "Erreur lors de la suppression de la feedback",
              //           data:null
              //         })
              //       }
                  
              //     }
              //   }
              //       );
              // }
        
        
}
