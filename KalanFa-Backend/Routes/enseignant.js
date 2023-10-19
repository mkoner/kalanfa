const express = require('express');
const router = express.Router();
const {protect} = require('../Middleware/authMiddleware')

const ensignantController = require('../Controllers/enseignant')

router.route('/').get(ensignantController.getAllEnseignants).post(ensignantController.createEnseignant)
router.route('/:id').put(protect, ensignantController.updateEnseignant).delete(protect, ensignantController.deleteEnseignant).
get(ensignantController.getEnseignant)
router.route('/login').post(ensignantController.login)

module.exports = router;