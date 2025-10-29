import mongoose from 'mongoose';

const carModelSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true,
    },
}, { timestamps: true });

export const CarModel = mongoose.model('CarModel', carModelSchema);