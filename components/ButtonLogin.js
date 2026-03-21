"use client";
import Link from "next/link";
//import { signIn } from "@/auth"; // we have to import signIn from next-auth/react whenever you want to implement signIn at the client side
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";  // Use "next-auth/react" for client-side (buttons, forms, UI interactions).... Use "@/auth" for server-side (server actions, loaders, API routes).

const ButtonLogin = () => {
  const router = useRouter();

  return (
    <button className="btn btn-neutral" onClick={() => { 
        // router.push("/dashboard");
        // router.replace("/dashboard");
        signIn(undefined, { callbackUrl: "/dashboard" });
    }}>
      Login
    </button>
  );
};

export default ButtonLogin;
