import mongoose from 'mongoose';
import slugify from 'slugify';

const brandSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true },
    logo: { type: String },
}, { timestamps: true });

brandSchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

export const Brand = mongoose.model('Brand', brandSchema);