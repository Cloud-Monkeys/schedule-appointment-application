const { SNSClient, PublishCommand, CreateTopicCommand, SubscribeCommand } = require('@aws-sdk/client-sns');
require('dotenv').config();

class SNSService {
    constructor() {
        this.snsClient = new SNSClient({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                sessionToken: process.env.AWS_SESSION_TOKEN
            }
        });
    }

    async createTopic(topicName) {
        try {
            const command = new CreateTopicCommand({
                Name: topicName
            });
            const response = await this.snsClient.send(command);
            return response.TopicArn;
        } catch (error) {
            console.error('Error creating SNS topic:', error);
            throw error;
        }
    }

    async publishMessage(topicArn, message, subject = null) {
        try {
            const command = new PublishCommand({
                TopicArn: topicArn,
                Message: JSON.stringify(message),
                Subject: subject,
                MessageStructure: 'json'
            });
            return await this.snsClient.send(command);
        } catch (error) {
            console.error('Error publishing message to SNS:', error);
            throw error;
        }
    }

    async subscribe(topicArn, protocol, endpoint) {
        try {
            const command = new SubscribeCommand({
                TopicArn: topicArn,
                Protocol: protocol, // 'email', 'sms', 'http', 'https', etc.
                Endpoint: endpoint
            });
            return await this.snsClient.send(command);
        } catch (error) {
            console.error('Error subscribing to SNS topic:', error);
            throw error;
        }
    }
}

module.exports = new SNSService();