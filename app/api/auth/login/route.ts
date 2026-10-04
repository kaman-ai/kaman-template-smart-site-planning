// The app's own login form posts here. The password is checked by Kaman
// (POST /oauth/token, grant_type=password); the person never sees Kaman.
// On success the session lives in httpOnly cookies scoped to this app.
import { auth } from "../../../lib/kaman";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { email, password } = (await req.json().catch(() => ({}))) as { email?: string; password?: string };
  if (!email || !password) return Response.json({ error: "Enter your email and password." }, { status: 400 });
  const r = await auth.login(req, email.trim(), password);
  return r.ok ? r.respond(Response.json({ ok: true })) : Response.json({ error: r.error }, { status: r.status });
}
