const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const familySchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

familySchema.plugin(uniqueValidator);

module.exports = mongoose.model("Family", familySchema);
