const models = require('../models');
           
const { Op } = require('sequelize');

const mysql=require('mysql');
const cors = require('cors');
var bodyParser = require('body-parser');
var express=require('express');
const { default: async } = require('async');
var app=express();
app.use(express.json());

module.exports = {

    findAll :function(req, res) {
      const { page, size } = req.query;

      const getPagination = (page, size) => {
        const limit = size ? +size : 3;
        const offset = page ? page * limit : 0;
      
        return { limit, offset };
      };

      const getPagingData = (data, page, limit) => {
        const { count: totalItems, rows: users } = data;
        const currentPage = page ? +page : 0;
        const totalPages = Math.ceil(totalItems / limit);
      
        return { totalItems, users, totalPages, currentPage };
      };

      const { limit, offset } = getPagination(page, size);

      var condition = {role : 'USER'};
      var userName = req.body.userName;
      var condition = userName ? { name: { [Op.like]: `%${userName}%` } } : null;

      var email = req.body.email;
      var condition = email ? { name: { [Op.like]: `%${email}%` } } : null;

      var password = req.body.password;
      var condition = password ? { name: { [Op.like]: `%${password}%` } } : null;

      var name = req.body.name;
      var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

      var tel = req.body.tel;
      var condition = tel ? { name: { [Op.like]: `%${tel}%` } } : null;

      var ville = req.body.ville;
      var condition = ville ? { name: { [Op.like]: `%${ville}%` } } : null;

      var region = req.body.region;
      var condition = region ? { name: { [Op.like]: `%${region}%` } } : null;
      
      models.User.findAndCountAll({ where: {role:'USER'},
          attributes: {
        exclude: ['password' , 'token' , 'expiresToken']
    } , limit, offset })
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
    updateUser :   function(req, res) {
      var user_id = req.params.user_id;
      console.log('userId', user_id)
      var userName  = req.body.userName;
      var email = req.body.email;
      var password = req.body.password;
      var name = req.body.name;
      var tel = req.body.tel;
      var ville = req.body.ville;
      var region = req.body.region;

      if (userName == null||email == null||password == null ||name == null||tel == null||ville == null||region == null) {
        res.status(400).send({
          message: "Content can not be empty!"  
        });
        return;
      }
       models.User.findOne({
        where: { id: user_id },
        
      }
      ).then( async userFound => {
        if (!userFound) {
          return res.status(404).json({

            error: 'user not found',
            data:null
          }); 

        }  else {

              const userUpdated = await userFound.update({
                userName: (userName ? userName : userFound.userName),
                email: (email ? email : userFound.email),
                password: (password ? password : userFound.password),
                name: (name ? name : userFound.name),
                tel: (tel ? tel : userFound.tel),
                ville: (ville ? ville : userFound.ville),
                region: (region ? region : userFound.region),



                updatedAt: new Date()
              })
              if(userUpdated) {
                return res.status(200).json({
                  error: null,
                  data: userUpdated
                })
              } else {  
                return res.status(500).json({
                  error: "Erreur lors de la mise à jour de l'utilisateur",
                  data:null
                })}
             
              }})},


 deleteUser : function(req, res) {
                var user_id = req.params.user_id;
                models.User.findOne({
                  where: { id: user_id }
                }).then( async userFound => {
                  if (!userFound) {
                    return res.status(404).json({
              
                      error: 'utilisateur not found',
                      data:null
                    }); 
              
                  } else {
              
                    const userDeleted = await userFound.destroy({
                      where: { id: user_id }
                    })
                    if(userDeleted) {
                      return res.status(200).json({
                        error: null,
                        data: "utilisateur supprimé avec succès"
                      })
                    } else {  
                      return res.status(500).json({
                        error: "Erreur lors de la suppression de l'utilisateur",
                        data:null
                      })
                    }
                  
                  }
                }
                    );
              
              },
      
          

              getUserById : function(req, res) {
                var user_id = req.body.userId;
                models.User.findOne({
                  where: { id:  user_id },
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
                        eroor: `Cannot find annonce with id=${user_id}.`,
                        data:null
                      }); 
                    }
                  })
                  .catch(err => {
                    res.status(500).send({
                      message:
                        err.message || "Some error occurred while retrieving annonce"
                    });
                  });
              }
  
          
            
            
     
  

}