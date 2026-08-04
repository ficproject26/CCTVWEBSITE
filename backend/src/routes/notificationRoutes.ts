import express from 'express';
import webpush from 'web-push';
import Subscription from '../models/Subscription';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const publicVapidKey = process.env.VAPID_PUBLIC_KEY || '';
const privateVapidKey = process.env.VAPID_PRIVATE_KEY || '';
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@skcctv.com';

if (publicVapidKey && privateVapidKey) {
  webpush.setVapidDetails(vapidSubject, publicVapidKey, privateVapidKey);
}

// Subscribe Route
router.post('/subscribe', async (req, res) => {
  try {
    const subscription = req.body;
    
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Invalid subscription object' });
    }
    
    await Subscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      subscription,
      { upsert: true, new: true }
    );
    
    res.status(201).json({ message: 'Subscription saved successfully.' });
  } catch (error) {
    console.error('Error saving subscription', error);
    res.status(500).json({ error: 'Failed to save subscription.' });
  }
});

// Send Notification Route
router.post('/send', async (req, res) => {
  try {
    const { title, message, url } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }
    
    const payload = JSON.stringify({
      title,
      message,
      url: url || '/'
    });

    const subscriptions = await Subscription.find();
    let sentCount = 0;
    
    const sendPromises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: sub.keys
          },
          payload
        );
        sentCount++;
      } catch (err: any) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          // Subscription has expired or is no longer valid, delete it
          await Subscription.findByIdAndDelete(sub._id);
        } else {
          console.error('Error sending notification to endpoint:', sub.endpoint, err);
        }
      }
    });

    await Promise.all(sendPromises);
    
    res.status(200).json({ message: `Notifications sent successfully to ${sentCount} subscribers.` });
  } catch (error) {
    console.error('Error in send route', error);
    res.status(500).json({ error: 'Failed to send notifications.' });
  }
});

export default router;
