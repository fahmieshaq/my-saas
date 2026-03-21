import { auth } from "@/auth";
import FormAddBoard from "@/components/FormAddBoard";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const session = await auth();
    console.log("Session data:");
    console.log(session);

    if(!session) {
        console.log("User is not authenticated.");
        redirect("/"); // redirect to home page if user is not authenticated
    } else {
        console.log("User is authenticated. User data:");
        console.log(session.user.email);
    }

    return (
       <FormAddBoard />
    )
}