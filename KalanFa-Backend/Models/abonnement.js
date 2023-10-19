const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const abonnementSchema = new Schema({
    nom: { type: String, required: true},
    dateAchat: {type: Date, required: true},
    dateExpiration: {type: Date},
    valide: {type: Boolean}, 
    credits: {type: Number},
    prix: {type: Number, required: true},
    achetePar: {type: mongoose.Schema.Types.ObjectId, ref: "Enseignant", required: true}
})
module.exports = mongoose.model('Abonnement', abonnementSchema, 'abonnement');