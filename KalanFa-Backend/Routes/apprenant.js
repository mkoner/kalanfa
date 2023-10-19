const express = require('express');
const router = express.Router();
const {protect} = require('../Middleware/authMiddleware')


const apprenantController = require('../Controllers/apprenant')

router.route('/').get(protect, apprenantController.getAllApprenants).post(apprenantController.createApprenant)
router.route('/:id').put(protect, apprenantController.updateApprenant).delete(protect, apprenantController.deleteApprenant).
get(apprenantController.getApprenant)
router.route('/login').post(apprenantController.login)

module.exports = router;