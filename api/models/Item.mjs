import mongoose, { Schema, model } from "mongoose"

const schema = Schema({
	name: String,
    price: Number,
    ingradients: String,
    description: String,
    category: String,
    restaurant: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    }
})

export default model("Item", schema)
