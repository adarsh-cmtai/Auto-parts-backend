import mongoose from 'mongoose';

const specificationSchema = new mongoose.Schema({
    key: { type: String, required: true },
    value: { type: String, required: true },
});

const descriptionSchema = new mongoose.Schema({
    mainText: { type: String, required: true },
    highlights: { type: [String], default: [] },
    specifications: [specificationSchema],
});

const heroSlideSchema = new mongoose.Schema({
    beforeImage: { type: String, required: true },
    afterImage: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: mongoose.Schema.Types.Mixed, required: true },
    ctaPrimary: { type: String, required: true },
    ctaPrimaryLink: { type: String, required: true },
    ctaSecondary: { type: String, required: true },
    ctaSecondaryLink: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const convertDescription = (doc) => {
    if (doc && typeof doc.description === 'string') {
        doc.description = {
            mainText: doc.description,
            highlights: [],
            specifications: [],
        };
    }
};

heroSlideSchema.post('find', (docs) => {
    if (Array.isArray(docs)) {
        docs.forEach(convertDescription);
    }
});

heroSlideSchema.post('findOne', (doc) => {
    convertDescription(doc);
});

heroSlideSchema.post('findOneAndUpdate', (doc) => {
    convertDescription(doc);
});


export const HeroSlide = mongoose.model('HeroSlide', heroSlideSchema);