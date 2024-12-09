const snsService = require('./snsService');

class SubscriptionService {
    constructor() {
        this.topicArn = process.env.APPOINTMENT_TOPIC_ARN;
    }

    async subscribeEmail(email) {
        try {
            if (!this.topicArn) {
                throw new Error('APPOINTMENT_TOPIC_ARN not configured in environment variables');
            }

            const response = await snsService.subscribe(
                this.topicArn,
                'email',
                email
            );
            
            console.log(`Successfully subscribed ${email} to notifications`);
            return response;
        } catch (error) {
            console.error('Failed to subscribe email:', error);
            throw error;
        }
    }

    async subscribeSMS(phoneNumber) {
        try {
            if (!this.topicArn) {
                throw new Error('APPOINTMENT_TOPIC_ARN not configured in environment variables');
            }

            const response = await snsService.subscribe(
                this.topicArn,
                'sms',
                phoneNumber
            );
            
            console.log(`Successfully subscribed ${phoneNumber} to SMS notifications`);
            return response;
        } catch (error) {
            console.error('Failed to subscribe SMS:', error);
            throw error;
        }
    }

    async subscribeHTTPS(url) {
        try {
            if (!this.topicArn) {
                throw new Error('APPOINTMENT_TOPIC_ARN not configured in environment variables');
            }

            const response = await snsService.subscribe(
                this.topicArn,
                'https',
                url
            );
            
            console.log(`Successfully subscribed ${url} to HTTPS notifications`);
            return response;
        } catch (error) {
            console.error('Failed to subscribe HTTPS endpoint:', error);
            throw error;
        }
    }
}

module.exports = new SubscriptionService(); 