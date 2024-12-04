import { AppError } from '../errors/AppError.js';
import cron from 'node-cron';
import { stripe } from '../../app.js';

import { prisma } from '../../app.js';

const processScheduledJobs =cron.schedule('* * * * *', async () => { // Runs every minute
    console.log('Running job processor...');

    // Fetch jobs that are due
    const dueJobs = await prisma.scheduledJob.findMany({
        where: {
            status: 'pending',
            runAt: { lte: new Date() }, // Jobs that are due
        },
    });

    for (const job of dueJobs) {
        try {
            const intent = await stripe.paymentIntents.retrieve(job.paymentIntentId);
            if (
                intent.status === 'requires_payment_method' ||
                intent.status === 'requires_confirmation'
            ) {
                await stripe.paymentIntents.cancel(job.paymentIntentId);
                console.log(`PaymentIntent ${job.paymentIntentId} canceled.`);
            }

            // Mark job as completed
            await prisma.scheduledJob.update({
                where: { id: job.id },
                data: { status: 'completed' },
            });
        } catch (error) {
            console.error(`Error processing job ${job.id}:`, error);

            // Mark job as failed
            await prisma.scheduledJob.update({
                where: { id: job.id },
                data: { status: 'failed' },
            });
        }
    }
});


// export const cancelIntent=async ()=>{

// setTimeout(async () => {
//     try {
//         console.log('kkkkkkkkkk')

//         // const intent = await stripe.paymentIntents.retrieve(paymentIntent.id);
//         // if (
//         //     intent.status === 'requires_payment_method' ||
//         //     intent.status === 'requires_confirmation'
//         // ) {
//         //     await stripe.paymentIntents.cancel(paymentIntent.id);
//         //     console.log(`PaymentIntent ${paymentIntent.id} canceled due to timeout.`);
//         // }
//     } catch (error) {
//         console.error('Error during PaymentIntent cancellation:', error);
//     }
// }, 1 * 60 * 1000); // 1 minutes in milliseconds
// }


cron.schedule('0 0 * * *', async () => { // Runs daily at midnight
    console.log('Running cleanup task...');

    await prisma.scheduledJob.deleteMany({
        where: {
            status: { in: ['completed', 'failed'] },
            createdAt: { lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Older than 30 days
        },
    });

    console.log('Old jobs cleaned up.');
});

// Export the cron job
export const startCrons = () => {
    console.log('Starting cron jobs...');
    processScheduledJobs.start();
};

export const stopCrons = () => {
    console.log('Stopping cron jobs...');
    processScheduledJobs.stop();
};

