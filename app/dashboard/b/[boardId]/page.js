import { auth } from "@/auth";
import ButtonDeleteBoard from "@/components/ButtonDeleteBoard";
import { redirect } from "next/navigation";
import connectMongo from "@/libs/mongoose";
import Board from "@/models/Board";

const getBoard = async (boardId) => {
  const session = await auth();

  await connectMongo();

  //const board = await Board.findById(boardId);
  const board = await Board.findOne({
    _id: boardId,
    userId: session?.user?.id,
  });

  if (!board) {
    console.log("Board not found or user does not have access to this board.");
    redirect("/dashboard");
  }

  return board;
};

export default async function DashboardDetail({ params }) {
    const board = await getBoard(params.boardId);

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
        <div>
       <p>Dashboard for board ID: {session.user.email} | Board ID: {params.boardId}</p>
       <ButtonDeleteBoard boardId={params.boardId} />
    </div>
    )
}
