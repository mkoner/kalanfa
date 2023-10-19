const express = require('express');
const router = express.Router();
const {protect} = require('../Middleware/authMiddleware')

const appelOffreController = require('../Controllers/appelOffre')


router.route('/').get(appelOffreController.getAllAppelOffre).post(protect, appelOffreController.createAppelOffre)
router.route('/:id').put(protect, appelOffreController.updateAppelOffre).delete(protect, 
    appelOffreController.deleteAppelOffre).get(appelOffreController.getAppelOffre)

module.exports = router;