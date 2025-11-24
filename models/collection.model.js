import mongoose from 'mongoose';
import slugify from 'slugify';

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Collection name is required'],
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    coverImage: {
        type: String,
        required: [true, 'Cover image is required']
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Part'
    }],
    status: {
        type: String,
        enum: ['Active', 'Draft'],
        default: 'Draft'
    }
}, { timestamps: true });

collectionSchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

export const Collection = mongoose.model('Collection', collectionSchema);