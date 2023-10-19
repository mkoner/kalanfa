const express = require('express');
const router = express.Router();
const {protect} = require('../Middleware/authMiddleware')

const abonnementController = require('../Controllers/abonnement')


router.route('/').get(abonnementController.getAllAbonnement).post(protect, abonnementController.createAbonnement)
router.route('/:id').put(abonnementController.updateAbonnement).delete(
    abonnementController.deleteAbonnement).get(abonnementController.getAbonnement)

module.exports = router;