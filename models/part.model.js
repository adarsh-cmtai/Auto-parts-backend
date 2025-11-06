import mongoose from 'mongoose';
import slugify from 'slugify';

const specificationSchema = new mongoose.Schema({
    key: { type: String, required: true },
    value: { type: String, required: true },
});

const descriptionSchema = new mongoose.Schema({
    fullDescription: { type: String },
    highlights: { type: [String], default: [] },
    specifications: { type: [specificationSchema], default: [] },
});

const partSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    sku: { type: String, required: true },
    unit: { type: String, default: 'pcs' },
    itemType: { type: String, enum: ['inventory', 'non_inventory', 'service'], default: 'inventory' },
    
    description: { type: mongoose.Schema.Types.Mixed },
    
    mrp: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    purchasePrice: { type: Number, default: 0 },
    
    gst: { type: Number, default: 18, min: 0 },
    hsnCode: { type: String },

    stockQuantity: { type: Number, required: true, default: 0 },
    reorderPoint: { type: Number },

    images: { type: [String], required: true },
    
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    model: { type: mongoose.Schema.Types.ObjectId, ref: 'CarModel', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
}, { timestamps: true });

partSchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

const convertDescription = (doc) => {
    if (doc && typeof doc.description === 'string') {
        doc.description = {
            fullDescription: doc.description,
            highlights: [],
            specifications: [],
        };
    }
};

partSchema.post('find', function(docs) {
    if (Array.isArray(docs)) {
        docs.forEach(convertDescription);
    }
});

partSchema.post('findOne', function(doc) {
    convertDescription(doc);
});

partSchema.post('findOneAndUpdate', function(doc) {
    convertDescription(doc);
});


export const Part = mongoose.model('Part', partSchema);