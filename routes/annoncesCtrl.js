
        
            const models = require('../models');
           
            const { Op } = require('sequelize');
 
            module.exports = {
           

            createAnnonce :function (req, res)  {
              // Validate request
              var image = req.file;
              var name = req.body.name;
              var nb_chambre = req.body.nb_chambre;
              var categorieId = req.body.categorieId;
              var ville = req.body.ville;
              var region = req.body.region;
              var prix = req.body.prix;
              var desc = req.body.desc;
              if (name == null||nb_chambre == null||categorieId == null ||ville == null||region == null||prix == null||desc == null) {
                res.status(400).send({
                  message: "Content can not be empty!"
              
                });
                return;
                
              }
              models.Categories.findOne({
                where: {
                    id: categorieId ,
                  
                }
            }).then((categorie) => {
                if (categorie == null) {
                    res.status(400).send({

                        error: "categorie not found",
                        data:null
                    })
                } else {  
 // Create a annonces
 const annonces = {
  name: name,
  nb_chambre: nb_chambre,
  categorieId: categorieId,
  ville: ville,
  region:region,
  prix: prix,
  desc: desc,
  image: image.path
};

// Save Annonce in the database
models.Annonces.create(annonces)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the annonces."
    });
  });
                }
              })
             

            },
            
            findAll :function(req, res) {
           
           
              const { page, size } = req.query;
             
              var search = req.body.search;
              const getPagination = (page, size) => {
                const limit = size ? +size : 3;
                const offset = page ? page * limit : 0;
              
                return { limit, offset };
              };

              const getPagingData = (data, page, limit) => {
                const { count: totalItems, rows: annonces } = data;
                const currentPage = page ? +page : 0;
                const totalPages = Math.ceil(totalItems / limit);
              
                return { totalItems, annonces, totalPages, currentPage };
              };

              const { limit, offset } = getPagination(page, size);

           
            if(search.region != "" && search.categorieId == null)
            {
              models.Annonces.findAndCountAll({  
                where: { region: {[Op.like]:'%'+search.region+'%' }},
                 limit, offset,
                include: [{ 
                  model: models.Categories, 
                
                }]
                ,  attributes: {
                exclude: ['CategoryId' ]
            } })
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
            }

            if(search.region == "" && search.categorieId != null)
            {
              models.Annonces.findAndCountAll({  
                where: { categorieId: {[Op.eq]:search.categorieId }},   limit, offset,
                include: [{ 
                  model: models.Categories, 
                
                }]
                ,  attributes: {
                exclude: ['CategoryId' ]
            } })
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
            }

            if(search.region != "" && search.categorieId != null)
            {
              models.Annonces.findAndCountAll({  
                where: { 
                  region: {[Op.like]:'%'+search.region+'%' },
                  categorieId: {[Op.eq]:search.categorieId }},   limit, offset,
                include: [{ 
                  model: models.Categories, 
                
                }]
                ,  attributes: {
                exclude: ['CategoryId' ]
            } })
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
            }

            if(search.region == "" && search.categorieId == null)
            {
              models.Annonces.findAndCountAll({  
                limit, offset,
                include: [{ 
                  model: models.Categories, 
                
                }]
                ,  attributes: {
                exclude: ['CategoryId' ]
            } })
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
            }
           
            },
            updateAnnonce :   function(req, res) {
              var annonce_id = req.params.annonce_id;
              var name = req.body.name;
              var nb_chambre = req.body.nb_chambre;
              var categorieId = req.body.categorieId;
              var ville = req.body.ville;
              var region = req.body.region;
              var prix = req.body.prix;
              var desc = req.body.desc;

              if (name == null||nb_chambre == null||categorieId == null ||ville == null||region == null||prix == null||desc == null) {
                res.status(400).send({
                  message: "Content can not be empty!"  
                });
                return;
              }
               models.Annonces.findOne({
                where: { id: annonce_id },
                attributes: {
                  exclude: ['CategoryId' ]
              }
              }).then( async annonceFound => {
                if (!annonceFound) {
                  return res.status(404).json({
  
                    error: 'Annonce not found',
                    data:null
                  }); 
  
                } else {
                  models.Categories.findOne({
                    where: {
                        id: categorieId ,
                      
                    }
                }).then( async (categorie) => {
                    if (categorie == null) {
                        res.status(400).send({
                            
                            error: "categorie not found",
                            data:null
                        })
                    } else {
                      const annonceUpdated = await annonceFound.update({
                        name: (name ? name : annonceFound.name),
                        nb_chambre: (nb_chambre ? nb_chambre : annonceFound.nb_chambre),
                        categorieId: (categorieId ? categorieId : annonceFound.categorieId),
                        ville: (ville ? ville : annonceFound.ville),
                        region: (region ? region : annonceFound.region), 
                        prix:   (prix ? prix : annonceFound.prix),
                        desc: (desc ? desc : annonceFound.desc),
                        updatedAt: new Date()
                      })
                      if(annonceUpdated) {
                        return res.status(200).json({
                          error: null,
                          data: annonceUpdated
                        })
                      } else {  
                        return res.status(500).json({
                          error: "Erreur lors de la mise à jour de l'annonce",
                          data:null
                        })
                      }
                    }
                  })
                 
                
                }
              }
                  );

            

             
            },
            deleteAnnonce : function(req, res) {
              var annonce_id = req.params.annonce_id;
              models.Annonces.findOne({
                where: { id: annonce_id },
                attributes: {
                  exclude: ['CategoryId' ]
              }
              }).then( async annonceFound => {
                if (!annonceFound) {
                  return res.status(404).json({
  
                    error: 'Annonce not found',
                    data:null
                  }); 
  
                } else {
  
                  const annonceDeleted = await annonceFound.destroy({
                    where: { id: annonce_id }
                  })
                  if(annonceDeleted) {
                    return res.status(200).json({
                      error: null,
                      data: "annonce supprimé avec succès"
                    })
                  } else {  
                    return res.status(500).json({
                      error: "Erreur lors de la suppression de l'annonce",
                      data:null
                    })
                  }
                
                }
              }
                  );

            },
            getAnnonceById : function(req, res) {
              var annonce_id = req.body.annonceId;
              models.Annonces.findOne({
                where: { id: annonce_id },
                include: [{ 
                  model: models.Categories, 
                
                }]
                ,  attributes: {
                exclude: ['CategoryId' ]
            } })
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
                      eroor: `Cannot find annonce with id=${annonce_id}.`,
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