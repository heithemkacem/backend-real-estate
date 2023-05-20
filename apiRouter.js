var express = require('express');
var authCtrl = require('./routes/authCtrl');
var jwtUtils = require('./utils/jwt.utils');
var annoncesCtrl =require('./routes/annoncesCtrl')
var categoriesCtrl =require('./routes/categoriesCtrl')
var usersCtrl =require('./routes/usersCtrl')
var feedbacksCtrl =require('./routes/feedbacksCtrl')
var reservationCtrl =require('./routes/reservationCtrl')
var dashboardCtrl =require('./routes/dashboardCtrl')

const multer = require('multer');

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);

    }
};

const storageAnnonce = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/annonces/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const uploadAnnonce= multer({
    storage: storageAnnonce,
    fileFilter: fileFilter
});
function validateToken(req, res, next) {

        var authHeaders = req.headers['authorization'];
        var user = jwtUtils.getUser(authHeaders);
        if (user) {

            if (user.id < 0) {
                return res.status(401).json({
                    'error': 'wrong token'
                });
            } else {
                req.userId = user.id;
                req.userRole = user.role;
                next();
            }

        } else {
            return res.status(401).json({
                'error': 'wrong token'
            });
        }

}
exports.router = (function () {
    var apiRouter = express.Router();

    apiRouter.route('/register').post(authCtrl.register);
    apiRouter.route('/login').post(authCtrl.login);
    apiRouter.route('/forgotPassword').post(authCtrl.forgotPassword);
    apiRouter.route('/verifResetPasswordToken').post(authCtrl.verifResetPasswordToken);
    apiRouter.route('/resetNewPassword').post(authCtrl.resetNewPassword);
    apiRouter.route('/changePassword').post(validateToken , authCtrl.changePassword);
    apiRouter.route('/annonces/createAnnonce').post(uploadAnnonce.single('file'),validateToken ,  annoncesCtrl.createAnnonce);
    apiRouter.route('/annonces/findAll').post(validateToken, annoncesCtrl.findAll);
    apiRouter.route('/annonces/getAnnonceById').post( validateToken , annoncesCtrl.getAnnonceById);
    apiRouter.route('/annonces/updateAnnonce/:annonce_id').put(uploadAnnonce.single('file') ,  validateToken , annoncesCtrl.updateAnnonce);
    apiRouter.route('/annonces/deleteAnnonce/:annonce_id').delete( validateToken , annoncesCtrl.deleteAnnonce);
    apiRouter.route('/categories/createCategorie').post( categoriesCtrl.createCategorie);
    apiRouter.route('/categories/findAll').post( categoriesCtrl.findAll);
    apiRouter.route('/categories/updateCategorie/:categorie_id').put( validateToken,categoriesCtrl.updateCategorie);
    apiRouter.route('/categories/deleteCategorie/:categorie_id').delete( validateToken,categoriesCtrl.deleteCategorie);
   
    apiRouter.route('/users/getUserById').post(validateToken,usersCtrl.getUserById);
    apiRouter.route('/users/findAll').post(validateToken ,  usersCtrl.findAll);
    apiRouter.route('/users/updateUser/:user_id').put(validateToken,  usersCtrl.updateUser);
    apiRouter.route('/users/deleteUser/:user_id').delete(validateToken ,  usersCtrl.deleteUser);
    
    apiRouter.route('/feedbacks/createFeedback').post(validateToken,feedbacksCtrl.createFeedback);
    apiRouter.route('/feedbacks/getFeedbackById').post(validateToken,feedbacksCtrl.getFeedbackById);

    apiRouter.route('/feedbacks/findAll').post( validateToken,feedbacksCtrl.findAll);
    apiRouter.route('/feedbacks/updateFeedback/:feedback_id').put( validateToken,feedbacksCtrl.updateFeedback);
    apiRouter.route('/feedbacks/deleteFeedback/:feedback_id').delete(validateToken, feedbacksCtrl.deleteFeedback);
    // apiRouter.route('/feedbacks/acceptFeedback/:feedback_id').put( validateToken , validateToken , feedbacksCtrl.acceptFeedback);
    // apiRouter.route('/feedback/createfeedback/:annonceId').post( validateToken , feedbacksCtrl.reserverFeedback);


    apiRouter.route('/reservation/createReservation/:annonceId').post( validateToken , reservationCtrl.reserverAnnonce);

    apiRouter.route('/reservation/getAllReservations').post( validateToken , reservationCtrl.getAllReservations);
    apiRouter.route('/reservation/deleteReservation/:reservation_id').delete( validateToken , reservationCtrl.deleteReservation);
    apiRouter.route('/reservation/acceptReservation/:reservation_id').put( validateToken  , reservationCtrl.acceptReservation);
    apiRouter.route('/reservation/getReservationById').post( validateToken , reservationCtrl.getReservationById);

    apiRouter.route('/dashboard/getNumberUsersByFilter/:filter').get( validateToken  , dashboardCtrl.getNumberOfUsersByFilter);

    apiRouter.route('/dashboard/getNumberAnnoncesByFilter/:filter').get( validateToken  , dashboardCtrl.getNumberOfAnnoncesByFilter);
    apiRouter.route('/dashboard/getNumberReservationsByFilter/:filter').get( validateToken  , dashboardCtrl.getNumberReservationsByFilter);
    apiRouter.route('/dashboard/getNumberFeedbacksByFilter/:filter').get( validateToken  , dashboardCtrl.getNumberOfFeedbacksByFilter);
    apiRouter.route('/dashboard/prepareDataForBarChart').get( validateToken  , dashboardCtrl.prepareDataForBarChart);


    return apiRouter;
})();