// The app's own signup form posts here. The ONE place this app uses its
// API key: Kaman makes the person a Member of the app's organisation with
// the password they chose (the key's owner must be allowed to add people
// there), then signs them in.
import { auth } from "../../../lib/kaman";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { email, password, name } = (await req.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
    name?: string;
  };
  if (!email || !password) return Response.json({ error: "Enter an email and a password." }, { status: 400 });
  const r = await auth.signup(req, { email: email.trim(), password, ...(name?.trim() ? { displayName: name.trim() } : {}) });
  return r.ok ? r.respond(Response.json({ ok: true })) : Response.json({ error: r.error }, { status: r.status });
}
