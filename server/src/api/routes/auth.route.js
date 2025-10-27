const { Router } = require('express');
const controller = require('../../modules/auth/auth.controller.js');
const { upload } = require('../../middleware/upload/upload.js');
const jwtAuth = require('../../middleware/auth/jwtAuth.js');

const AuthRouter = Router();
AuthRouter
  .post('/singup', controller.authUserSingUp)
  .post('/signin', controller.authUserSignIn)
  .post('/forget-password', controller.authForgetPassword)
  .post('/forget-password/otp-verification', controller.authForgetPasswordVarification)
  .get('/', jwtAuth('admin', 'student'), controller.getUserById)
  .put('/', upload.any(), jwtAuth('admin', 'student'), controller.updateUser)
  .get('/user',
    // jwtAuth('admin'),
    controller.getAllUser)
  .get('/user/:id', controller.getSingleUser)
  .delete('/user/:id', controller.getDeleteUser);

module.exports = AuthRouter;
