import { adminDB } from '../../../../../lib/firebaseAdmin';

export async function GET(req: { url: string | URL; }) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  try {
    const doc = await adminDB.collection("users").doc(userId as string).get();

    if (!doc.exists) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(doc.data(), { status: 200 });
  } catch (error: any) {
    console.error("Admin SDK error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { userId, ...data } = body;

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    const updateData = {
      ...data,
      updatedAt: Date.now(),
    };

    await adminDB.collection("users").doc(userId).update(updateData);

    // Fetch and return the updated user data
    const doc = await adminDB.collection("users").doc(userId).get();
    
    if (!doc.exists) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ userData: doc.data() }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return Response.json({ error: error.message || "Failed to update user" }, { status: 500 });
  }
}
