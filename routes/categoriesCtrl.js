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
createCategorie :function (req, res)  {
  // Validate request

  var name = req.body.name;
  
  if (name == null) {
    res.status(400).send({
      message: "Content can not be empty!"
  
    });
    return;
    
  }

  // Create a Tutorial
  const categories = {
    name: name,
    
  };

  // Save Tutorial in the database
  models.Categories.create(categories)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });

},
findAll :function(req, res) {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
  
  models.Categories.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
},
updateCategorie:   function(req, res) {
  var categorie_id = req.params.categorie_id;
  console.log('categorie', categorie_id)
  var name = req.body.name;
 

  if (name == null) {
    res.status(400).send({
      message: "Content can not be empty!"  
    });
    return;
  }
   models.Categories.findOne({
    where: { id: categorie_id }
  }).then( async categorieFound => {
    if (!categorieFound) {
      return res.status(404).json({

        error: 'Categorie not found',
        data:null
      }); 

    } else {

      const categorieUpdated = await categorieFound.update({
        name: (name ? name : categorieFound.name),
       
        updatedAt: new Date()
      })
      if(categorieUpdated) {
        return res.status(200).json({
          error: null,
          data: categorieUpdated
        })
      } else {  
        return res.status(500).json({
          error: "Erreur lors de la mise à jour de l'categorie",
          data:null
        })
      }
    
    }
  }
      );



 
},
deleteCategorie : function(req, res) {
  var categorie_id = req.params.categorie_id;
  models.Categories.findOne({
    where: { id: categorie_id }
  }).then( async categorieFound => {
    if (!categorieFound) {
      return res.status(404).json({

        error: 'categorie not found',
        data:null
      }); 

    } else {

      const categorieDeleted = await categorieFound.destroy({
        where: { id: categorie_id }
      })
      if(categorieDeleted) {
        return res.status(200).json({
          error: null,
          data: "categorie supprimé avec succès"
        })
      } else {  
        return res.status(500).json({
          error: "Erreur lors de la suppression de l'categorie",
          data:null
        })
      }
    
    }
  }
      );

}
}