import { Enquiry } from '../models/enquiry.model.js';
import sendEmail from '../utils/email.js';

const formatEnquiryEmailForAdmin = (enquiry) => {
    let detailsHtml = '';
    if (enquiry.enquiryType === 'Part Request') {
        detailsHtml = `
            <h2 style="color: #333;">Shipping Address</h2>
            <address style="font-style: normal;">
                ${enquiry.shippingAddress.street}<br>
                ${enquiry.shippingAddress.city}, ${enquiry.shippingAddress.state} - ${enquiry.shippingAddress.zipCode}
            </address>
            <h2 style="color: #333;">Vehicle & Part Details</h2>
            <p><strong>Part Name/Description:</strong> ${enquiry.partName}</p>
            <p><strong>Car Brand:</strong> ${enquiry.carBrand || 'N/A'}</p>
            <p><strong>Car Model:</strong> ${enquiry.carModel || 'N/A'}</p>
            <p><strong>Car Year:</strong> ${enquiry.carYear || 'N/A'}</p>
        `;
    } else { // Support Ticket
        detailsHtml = `
            <h2 style="color: #333;">Support Ticket Details</h2>
            <p><strong>Subject:</strong> ${enquiry.subject}</p>
        `;
    }

    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h1 style="color: #333;">New Enquiry Received (${enquiry.enquiryType})</h1>
            
            <h2 style="color: #333;">Customer Details</h2>
            <p><strong>Name:</strong> ${enquiry.fullName}</p>
            <p><strong>Email:</strong> ${enquiry.email}</p>
            <p><strong>Phone:</strong> ${enquiry.phone || 'N/A'}</p>
            
            ${detailsHtml}

            <h2 style="color: #333;">Message</h2>
            <p>${enquiry.message}</p>
            
            <p style="margin-top: 20px;">Please log in to the admin dashboard to reply.</p>
        </div>
    `;
};

export const createEnquiryService = async (enquiryData) => {
    const newEnquiry = await Enquiry.create(enquiryData);

    if (process.env.ADMIN_EMAIL) {
        const adminEmailHtml = formatEnquiryEmailForAdmin(newEnquiry);
        try {
            await sendEmail({
                email: process.env.ADMIN_EMAIL,
                subject: `New ${newEnquiry.enquiryType} from ${newEnquiry.fullName}`,
                html: adminEmailHtml,
            });
        } catch (emailError) {
            console.error("Failed to send notification email to admin:", emailError);
        }
    }
    return newEnquiry;
};

export const getAllEnquiriesService = async () => {
    return await Enquiry.find().sort({ createdAt: -1 });
};

export const getEnquiryByIdService = async (id) => {
    const enquiry = await Enquiry.findById(id);
    if (!enquiry) throw new Error('Enquiry not found');
    return enquiry;
};

export const replyToEnquiryService = async (id, replyMessage) => {
    const enquiry = await Enquiry.findById(id);
    if (!enquiry) throw new Error('Enquiry not found');

    const reply = { message: replyMessage, sentBy: 'admin' };
    enquiry.replies.push(reply);
    enquiry.status = 'Replied';
    await enquiry.save();

    await sendEmail({
        email: enquiry.email,
        subject: `Re: Your Enquiry with OwnSilent [${enquiry.enquiryType}]`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <p>Hello ${enquiry.fullName},</p>
                <p>This is a reply to your recent enquiry:</p>
                <div style="background-color: #f5f5f5; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0;">
                    ${replyMessage}
                </div>
                <p>If you have any further questions, please reply to this email.</p>
                <p>Best regards,<br>The OwnSilent Team</p>
            </div>
        `,
    });

    return enquiry;
};