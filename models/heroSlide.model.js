import mongoose from 'mongoose';

const heroSlideSchema = new mongoose.Schema({
    beforeImage: { type: String, required: true },
    afterImage: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    ctaPrimary: { type: String, required: true },
    ctaPrimaryLink: { type: String, required: true },
    ctaSecondary: { type: String, required: true },
    ctaSecondaryLink: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const HeroSlide = mongoose.model('HeroSlide', heroSlideSchema);