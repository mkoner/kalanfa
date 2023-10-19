const express = require('express');
const router = express.Router();
const {protect} = require('../Middleware/authMiddleware')

const abonnementTypeController = require('../Controllers/abonnementType')


router.route('/').get(abonnementTypeController.getAllAbonnementType).post(abonnementTypeController.createAbonnementType)
router.route('/:id').put(abonnementTypeController.updateAbonnementType).delete(
    abonnementTypeController.deleteAbonnementType).get(abonnementTypeController.getAbonnementType)

module.exports = router;