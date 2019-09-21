const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var SpecificationSchema = new Schema({
  name: { type: String, unique: true },
  created: { type: Date, default: Date.now },
  enabled: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "users" },
  filtering: { type: Boolean, default: false }
});
module.exports = mongoose.model(
  "Specification",
  SpecificationSchema,
  "Specifications"
);
