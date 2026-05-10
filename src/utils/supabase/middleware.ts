import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is not logged in and tries to access /adminz (but not /adminz/login)
  if (
    !user &&
    request.nextUrl.pathname.startsWith('/adminz') &&
    request.nextUrl.pathname !== '/adminz/login'
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/adminz/login';
    return NextResponse.redirect(url);
  }

  // If user is already logged in and tries to access /adminz/login
  if (
    user &&
    request.nextUrl.pathname === '/adminz/login'
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/adminz';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
