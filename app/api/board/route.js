import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import Board from "@/models/Board";
import User from "@/models/User";

export async function POST(req) {
  try {
    const body = await req.json();

    const session = await auth();

    // connect api to db
    await connectMongo();
    
    const user = await User.findById(session.user.id);
    const board = await Board.create({ userId: user._id, name: body.myName});
    user.boards.push(board._id)
    await user.save();

    return NextResponse.json(board);
  } catch (error) {
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    );
  }
}

// get query params like /api/board?boardId=46466
export async function DELETE(req) {
  try {
    const { searchParams } = req.nextUrl;
    const boardId = searchParams.get("boardId");
    const session = await auth();

    // connect api to db
    await connectMongo();
    
    const user = await User.findById(session.user.id);
    await Board.deleteOne({ _id: boardId, userId: user._id});
    // MongoDB does not automatically cascade deletes for 
    // referenced documents. You must handle it in your code 
    user.boards = user.boards.filter((id) => id.toString() !== boardId); // Removes the boardId from the user's boards array.
    await user.save();

    return NextResponse.json({});
  } catch (error) {
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    );
  }
}