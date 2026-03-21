import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Use "@/auth" for server-side (server actions, loaders, API routes).
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Stripe from "stripe";


export async function POST(req) {
  try {
    // # Step 1: receive json request payload from the frontend
    const body = await req.json();

    // # Step 2: 
    // The frontend should pass the success and cancel URLs in the request body
    // so we know where to redirect the user after succcessful checkout or 
    // cancelled checkout. We can also add more validation here to ensure the URLs 
    // are valid and belong to our domain.
    if (!body.successUrl || !body.cancelUrl) {
      return NextResponse.json(
        { error: "Success and cancel URLs are required." },
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

    // Lets create stripe checkout session.
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      // Stripe gives you alots of parameters. You can prefill email, name.
      // You can add discount coupons here, etc.
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1, // customer can subscribe to one plan. It does not make sense to 
                       // give the customer the option to choose qty for subscription.
        },
      ], // List all the items you want to display in the checkout page.
      success_url: body.successUrl,
      cancel_url: body.cancelUrl,

      // The above parameters mode, line_items, succcess_url, and 
      // cancel_url are the minimum required to create a checkout session.
      customer_email: user.email, // Prefill the customer's email in the checkout page.
      client_reference_id: user._id.toString(), // Set unique id to identify customer in stripe
    });

    // # Step 6: Send back a link to stripe checkout session
    return NextResponse.json({ url: stripeCheckoutSession.url });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
