import mongoose from 'mongoose';
import slugify from 'slugify';

const newsArticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'CarModel', required: true },
    part: { type: mongoose.Schema.Types.ObjectId, ref: 'Part', required: true },
}, { timestamps: true });

newsArticleSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

export const NewsArticle = mongoose.model('NewsArticle', newsArticleSchema);