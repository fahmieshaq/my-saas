import Link from "next/link";
import React from "react";

function Success() {
  return (
    <div>
      <div>Successful Payment</div>
      <Link href="/dashboard" className="btn btn-neutral mt-4">
        Go to Dashboard
      </Link>
    </div>
  );
}

export default Success;
