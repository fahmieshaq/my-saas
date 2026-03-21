"use client";
//import { signIn } from "@/auth"; // we have to import signIn from next-auth/react whenever you want to implement signIn at the client side
import { signOut } from "next-auth/react";  // Use "next-auth/react" for client-side (buttons, forms, UI interactions).... Use "@/auth" for server-side (server actions, loaders, API routes).

const ButtonLogout = () => {
  return (
    // By default, signOut() from next-auth/react redirects the user to the home page ("/") after signing out. This is the standard behavior unless you specify a different callbackUrl.
    <button className="btn btn-neutral" onClick={() => signOut()}>
      Logout
    </button>
  );
};

export default ButtonLogout;
