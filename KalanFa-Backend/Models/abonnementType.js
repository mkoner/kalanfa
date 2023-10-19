const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const abonnementTypeSchema = new Schema({
    nom: { type: String, required: true, unique: true},
    validite: { type: Number},
    credits: {type: Number}, 
    dateCreation: {type: Date, required: true},
    prix: {type: Number, required: true}
})
module.exports = mongoose.model('AbonnementType', abonnementTypeSchema, 'abonnementType');