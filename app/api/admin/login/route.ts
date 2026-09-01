import { NextResponse } from "next/server";


export async function POST(req: Request) {
  const { code } = await req.json();
  if (code !== process.env.ADMIN_ACCESS_CODE) {
    return NextResponse.json({ error: "Incorrect code." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("nfcs_admin", code, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 8, path: "/" });
  return res;
}
