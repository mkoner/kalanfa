// import the mongoose
const mongoose = require('mongoose');

// create a schema
const Schema = mongoose.Schema;

const apprenantSchema  = new Schema({
    nom: {type: String, required: [true, "Le non ne peut etre vide"]},
    prenom: {type: String, required: [true, "Le prenom ne peut etre vide"]},
    addresse: {type: {
        ville: {type: String, required: true},
        commune: {type: String, required: true},
        quartier: {type: String, required: true},
        rue: {type: String, required: false},
        description: {type: String, required: false},
        longitude: {type: Number, required: false},
        lagitude: {type: Number, required: false}
    }, 
        required: [true, "addresse ne peut etre vide"]},
    email: {type: String, required: [true, "L'email ne peut etre vide"], unique: [true, "cet email existe deja"]},
    numero: {type: String, required: [true, "Le numero ne peut etre vide"], unique: [true, "ce numero existe deja"]},
    motDePasse: {type: String, required: [true, "Le motDePasse ne peut etre vide"]},
    dateInscription:{ type: Date, required: [true, "dateInscription ne peut etre vide"]}
})

module.exports = mongoose.model('Apprenant', apprenantSchema, 'apprenant');