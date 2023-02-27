const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var phonebookSchema = new Schema({
   name: String,
   phoneNumber: String
});

module.exports = mongoose.model('Record', phonebookSchema);