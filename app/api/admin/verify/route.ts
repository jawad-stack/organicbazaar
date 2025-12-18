import { NextResponse } from "next/server"

const ADMIN_USER = process.env.ADMIN_USER || "admin"
const ADMIN_PASS = process.env.ADMIN_PASS || "password123"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 })
    }

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  } catch (error) {
    console.error('Auth verify error', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
