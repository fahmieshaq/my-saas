import Stripe from "stripe";
import { headers } from "next/headers";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

export async function POST(req) {
    try {
        // Step 1: Verify the webhook event is from Stripe
        // *** setup stripe object
        const stripe = new Stripe(process.env.STRIPE_API_KEY);

        // *** stripe sends the event body in text format
        const body = await req.text();

        // *** stripe sends the signature in the headers in the http request.
        // We are going to use the signature to verify that the event is coming
        // from Stripe and not from some malicious actor.
        const signature = headers().get("stripe-signature");
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        // This checks if the body, signature, and webhook secret all
        // match togther. If it doesn't throw an error, means the
        // webhook is legit and it comes from stripe
        const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

        // Oncde you reach here, it means the webhook is verified and you can safely process the event
        // type tells you what type of event it is, for example, subscription is created, renewed, 
        // invoice sent, etc. data object holds details about the event such as customer info, etc.
        const { data, type } = event;

        // Step 2: Stripe sends you a lot of events, but handle the events we are interested in only. 
        // "checkout.session.completed" this event is sent when a checkout session is 
        // completed, which means a customer has successfully made a payment
        if (type === "checkout.session.completed") { 
            // Lets grant access to the product
            // Connect to the database
            await connectMongo();
            // client_reference_id is the user id that we sent to stripe when we created the checkout session
            // Everytime stripe sends out webhook event, it will hold client_reference_id which allows us
            // easily to identify users. 
            // data.object holds the checkout session object: https://docs.stripe.com/api/checkout/sessions/object
            // In our case, we just want to access client_reference_id
            const user = await User.findById(data.object.client_reference_id);

            // Now that we found the user, we want to give user access to the product
            user.hasAccess = true;
            user.customerId = data.object.customer;

            await user.save();
        } else if (type === "customer.subscription.deleted") {
            // Revoke access to the product (subscription is cancelled/expired, or failed)
            await connectMongo();

            // data.object is the customer.subscription object we get from stripe https://docs.stripe.com/api/subscriptions/object
            const user = await User.findOne({ customerId: data.object.customer});

            // Since we found the user, lets revoke acces 
            user.hasAccess = false;
            await user.save();

        }
    } catch(e) {
        console.log("Stripe error:", e?.message)
    }
}