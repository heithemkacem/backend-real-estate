const models = require('../models');
const asyncLib = require('async');
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils.js');
const { Op } = require('sequelize');
const crypto = require('crypto');
const nodemailer = require("nodemailer");


const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hajerrrboulabiar@gmail.com',
      pass: 'yxzbrmgasbgscvkm'
    }
  });


module.exports = {
    
    // register 
    register: function (req, res) {
        var userName = req.body.userName;
        var email= req.body.email;
        var password= req.body.password;
        var name= req.body.name;
        var tel= req.body.tel;
        var adresse = req.body.adresse;
        var ville= req.body.ville;
        var region= req.body.region;

        if (userName == null || email == null || password == null || name == null ) {
 
             return res.status(400).json({
                 'error': "Veuillez renseigner des champs du formulaire"
             });
            }
 
            

         if (userName.length < 2) {
            return res.status(400).json({
                'error': "Le nom d'utilisateur doit contenir au moins 2 caractères",
                'data': null
            });
        }

        if (name.length < 2 ) {
            return res.status(400).json({
                'error': "Le nom doit contenir au moins 2 caractères",
                'data': null
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                'error': "Le mot de passe doit contenir au moins 6 caractères",
                'data': null
            });
        }

        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({
                'error': "Vous n'avez pas saisie une adresse email valide",
                'data': null
            })
        }

  
        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    attributes: ['email', 'userName'],
                    where: {
                        [Op.or]: [{
                            email: email
                        },
                        {
                            userName: userName
                        }
                        ]
                    }
                })
                    .then(function (userFound) {

                        if (userFound) {

                            return res.status(400).json({
                                'error': "Utilisateur existe deja",
                                'data': null
                            })

                        } else {

                            done(null, userFound);
                        }
                    })
                    .catch(function (err) {

                        console.log('userCtl: inscription: search user', err)

                        return res.status(500).json({
                            'error': err,
                            'data': null
                        })
                    });
            },
            function (userFound, done) {
                bcrypt.hash(password, 5, function (err, bcryptedPassword) {
                    models.User.create({
                        userName: userName,
                        email: email,
                        password: bcryptedPassword,
                        name: name,
                        adresse: adresse,
                        tel: tel,
                        ville: ville,
                        region: region,
                        role: "USER",
                       
                        createdAt: new Date(),
                        updatedAt: new Date()
                    })
                        .then(function (newUser) {
                            return res.status(200).json({
                                'error': null,
                                'data': newUser
                            })
                        });
                });
            }
        ])

       
    },
    // login 
    login: function (req, res) {
        var email = req.body.email;
        var password = req.body.password;

        if (email == null || password == null) {
            return res.status(400).json({
                'error': 'Veuillez renseigner des champs du formulaire'
            });
        }

        models.User.findOne({
            where: {
                [Op.or]: [{
                    email: email
                },
                {
                    userName: email
                }
                ]
            }
        }).then(function (userFound) {

                if(userFound)
                {
                        bcrypt.compare(password, userFound.password, function (errBycrypt, resBycrypt) { 
                                if(resBycrypt)
                                {
                                    return res.status(200).json({
                                        'error': null,
                                        'token': jwtUtils.generateTokenForUser(userFound),
                                        'role': userFound.role
                                    })
                                } else {
                                    return res.status(400).json({
                                        'error': "Mot de passe n'est pas valide"
                                    })
                                }
                        }) 

                } else {
                    return res.status(400).json({
                        'error': "L'email ou le mot de passe est invalide"
                    })
                }
        }) 
        .catch(function (err) {

            console.log('authCtl: login: search user', err)
            return res.status(500).json({
                'error': err
            });
        });

    },


    // forget password bloc
    forgotPassword :function (req, res)  {
        var email = req.body.email;
        var token = crypto.randomBytes(12).toString('hex');
        var expires = new Date().getTime() + ( 30 * 60 * 1000); // 30 minutes from now

        if(email == null || email == "" || email == undefined) {
            return res.status(400).json({
                'error': "Veuillez renseigner votre email"
            });
        }

        asyncLib.waterfall([
            function (done) {      
                models.User.findOne({
                    where: {
                        email: email
                    }
                })
                    .then(function (userFound) {
                        if (userFound) {
                            done(null, userFound);
                        } else {
                            return res.status(400).json({
                                'error': "Aucun utilisateur avec cet email n'existe"
                            })
                        }
                        
                    });
            } , function( userFound,done)
            {

                if(userFound)
                {
                    userFound.update({
                        token: token,
                        expiresToken: expires,
                        updatedAt: new Date()
                    })
                    .then(function (userUpdated) {
                        if(userUpdated)
                        {
                           done(null, userUpdated);
                        } else {
                            return res.status(500).json({
                                'error': err,
                                'data': null
                            })
                        }
                    })
                    .catch(function (err) {
                        return res.status(500).json({
                            'error': err,
                            'data': null
                        })
                    });
                }
            } , function(userUpdated, done)
            {
                    if(userUpdated)
                    {
                        var currentYear = new Date().getFullYear();
                        const resetLink = `http://localhost:4200/reset-new-password/${userUpdated.token}`;

                        var mainOptions = {
                            from: 'hajerrrboulabiar@gmail.com',
                            to: userUpdated.email,
                            subject: 'Demande de réinitialisation du mot de passe',
                           
                            text : `Bonjour ${userUpdated.name}, \n` + 
                            `Vous avez demandé une réinitialisation du mot de passe \n` +
                            `Lien : ${resetLink} \n` +

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
                    }
            }
        ])
    },

    verifResetPasswordToken :function (req, res)  {
        var token = req.body.token;

        if(token == null || token == "" || token == undefined) {
            return res.status(400).json({
                error: "Impossible de trouver le jeton de réinitialisation du mot de passe",
                data: null
            });
        }

        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    where: {
                        token: token
                    }
                }).then(function (userFound) {
                    if (userFound) {
                        done(null, userFound);
                    } else {
                        return res.status(400).json({
                            error: "Token invalide",
                            data: null
                        })
                    }
                })
            } , function(userFound, done) {
              if(userFound)
              {
                var expires = new Date(userFound.expiresToken);
                var now = new Date();
                if (now > expires) {
                    return res.status(400).json({
                        error: "Le lien de réinitialisation du mot de passe a expiré",
                        data: null
                    })
                } else {
                    return res.status(200).json({
                        error: null,
                        data: 'scuccess'
                    })
                }
              }

            }
        ])

    },

    resetNewPassword :function (req, res)  {
        var token = req.body.token;
        var newPassword = req.body.newPassword;
        var confirmPassword = req.body.confirmPassword;

        if(token == null || token == "" || token == undefined) {
            return res.status(400).json({
                'error': "Impossible de trouver le jeton de réinitialisation du mot de passe",
                'data': null
            });
        }

        
        if (newPassword.length < 6) {
            return res.status(400).json({
                'error': "Le mot de passe doit contenir au moins 6 caractères",
                'data': null
            });
        }

        if (confirmPassword.length < 6) {
            return res.status(400).json({
                'error': "Confirmer mot de passe doit contenir au moins 6 caractères",
                'data': null
            });
        }

        if(newPassword != confirmPassword)
        {
            return res.status(400).json({
                'error': "Les mots de passe ne correspondent pas",
                'data': null
            });
        }

        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    where: {
                        token: token
                    }
                }).then(function (userFound) {
                    if (userFound) {
                        done(null, userFound);
                    } else {
                        return res.status(400).json({
                            error: "Aucun utilisateur avec ce token n'existe",
                            data: null
                        })
                    }
                })
            } , function(userFound, done) {
                bcrypt.hash(newPassword, 5, function (err, bcryptedPassword) {
                    if (err) {
                            return res.status(500).json({
                                'error': err,
                                'data': null
                            })
                    } else {
                        userFound.update({
                            password: bcryptedPassword,
                            token: null,
                            expiresToken: null,
                            updatedAt: new Date()

                                }).then(function (userUpdated) {    
                                    if(userUpdated)
                                    {
                                        return res.status(200).json({
                                            'error': null,
                                            'data': 'Le mot de passe a été réinitialisé avec succès'
                                        })
                                    } else {
                                        return res.status(500).json({
                                            'error': err,
                                            'data': null
                                        })
                                    }
                                }
                                  
                            )
               }
            })
        }
        ])
    },


    //change password
    changePassword :function (req, res)  {

    var userId= req.userId;
    var oldPassword = req.body.oldPassword;
    var newPassword =  req.body.newPassword;

    if (oldPassword.length < 6) {
        return res.status(400).json({
            'error': "Ancienne  mot de passe doit contenir au moins 6 caractères",
            'data': null
        });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({
            'error': "Nouvelle  mot de passe doit contenir au moins 6 caractères",
            'data': null
        });
    }

    // verif old password 
    asyncLib.waterfall([
        function (done) {
            models.User.findOne({
              
                where: {
                    id: userId
                }
            })
                .then(function (userFound) {
                    done(null, userFound);
                })
                .catch(function (err) {
                    return res.status(500).json({
                        'error': err,
                        'data': null
                    })
                });
        },
        function (userFound, done) {
            if (userFound) {
                bcrypt.compare(oldPassword, userFound.password, function (errBycrypt, resBycrypt) {
                    if (resBycrypt) {
                        // set new password
                        bcrypt.hash(newPassword, 5, function (err, bcryptedPassword) {
                            userFound.update({
                                password: (newPassword !== null ? bcryptedPassword : userFound.password),
                        }).then(function (userPasswordUpdated) {
                            if(userPasswordUpdated)
                            {
                                return res.status(200).json({
                                    'error': null,
                                    'data': "mot de passe modifiée avec succès"
                                })
                            } else {
                        
                                return res.status(500).json({
                                    'error': "une erreur s'est produite"+ err,
                                    'data': null
                                });
                
                            }

                        })
                    })
                    } else {
                        return res.status(400).json({
                            'error': "Ancienne mot de passe incorrecte",
                            'data': null
                        });
                    }
                });
            } else {
                return res.status(404).json({
                    'error': "Utilisateur non trouvé",
                    'data': null
                })
            }
        }
    ])

  
}












  }
