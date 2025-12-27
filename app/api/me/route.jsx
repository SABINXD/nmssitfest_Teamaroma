
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function GET() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ user: null }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { payload } = await jwtVerify(token, secret);

    return new Response(
      JSON.stringify({
        user: { id: payload.id, contact: payload.contact },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch {
    return new Response(JSON.stringify({ user: null }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}
