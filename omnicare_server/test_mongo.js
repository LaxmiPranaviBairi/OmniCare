const mongoose = require("mongoose");
const uri = "mongodb://admin:OmniCare2026@ac-rwmfwqt-shard-00-00.bj9onx4.mongodb.net:27017,ac-rwmfwqt-shard-00-01.bj9onx4.mongodb.net:27017,ac-rwmfwqt-shard-00-02.bj9onx4.mongodb.net:27017/?ssl=true&replicaSet=atlas-rwmfwqt-shard-0&authSource=admin&retryWrites=true&w=majority&appName=OmniCoreDBnp";
mongoose.connect(uri)
  .then(() => { console.log("SUCCESS"); process.exit(0); })
  .catch(err => { console.error("ERROR", err); process.exit(1); });
