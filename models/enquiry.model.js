import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
    enquiryType: { type: String, enum: ['Part Request', 'Support Ticket'], required: true },
    
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },

    // Part Request Fields
    shippingAddress: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
    },
    partName: { type: String },
    carBrand: { type: String },
    carModel: { type: String },
    carYear: { type: String },

    // Support Ticket Fields
    subject: { type: String },
    
    // Common Field
    message: { type: String, required: true },
    
    status: {
        type: String,
        enum: ['New', 'In Progress', 'Replied', 'Closed'],
        default: 'New'
    },
    
    replies: [{
        message: String,
        sentBy: { type: String, enum: ['admin', 'customer'], default: 'admin' },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export const Enquiry = mongoose.model('Enquiry', enquirySchema);