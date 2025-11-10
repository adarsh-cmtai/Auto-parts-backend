import mongoose from 'mongoose';

const descriptionSchema = new mongoose.Schema({
    mainText: { type: String, required: true },
    highlights: { type: [String], default: [] },
    specifications: [{
        key: { type: String, required: true },
        value: { type: String, required: true },
    }],
});

const categorySlideSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
        unique: true, 
    },
    images: { type: [String], required: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: descriptionSchema },
    ctaText: { type: String, required: true },
    ctaLink: { type: String, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const CategorySlide = mongoose.model('CategorySlide', categorySlideSchema);