import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Use "@/auth" for server-side (server actions, loaders, API routes).
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Stripe from "stripe";


export async function POST(req) {
  try {
    // # Step 1: receive json request payload from the frontend
    const body = await req.json();

    // # Step 2: we need to know where to direct user once they leave the manage billing portal
    if (!body.returnUrl) {
      return NextResponse.json(
        { error: "Return UR is required." },
        { status: 400 },
      );
    }

    // # Step 3: Get the user session to identify the user who is trying to checkout.
    const session = await auth();

    // # Step 4: Get the user details from the database using the session information. 
    //           We need the user's email to prefill the checkout page
    // we need to connect to the database and
    // fetch the user to get their email and other
    // details that we might need to create the
    // checkout session.
    await connectMongo();
    const user = await User.findById(session.user.id);

    // # Step 5: Create a checkout session in Stripe using the Stripe API.
    // stripe object has all access to it neends to perform actions
    // on our stripe account.
    const stripe = new Stripe(process.env.STRIPE_API_KEY);

    // Lets create stripe billing portal session. This will generate a link for us to redirect 
    // user to the stripe billing portal where they can manage their subscription, update payment method, etc.
    const stripeCustomerPortal = await stripe.billingPortal.sessions.create({
        customer: user.customerId,
        return_url: body.returnUrl,
    });

    // # Step 6: Send back a link to stripe manage billing portal to the frontend
    return NextResponse.json({ url: stripeCustomerPortal.url });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
