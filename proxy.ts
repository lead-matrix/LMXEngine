import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Obsidian Palace Proxy (Next.js 16+)
 * Unified security and routing layer at the Edge.
 */
export default async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Safety check for build phase
    if (!supabaseUrl || !supabaseAnonKey) {
        return response;
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // 1. Admin Portal Protection
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || profile.role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // 2. Checkout Flow Protection
    if (request.nextUrl.pathname.startsWith('/checkout')) {
        if (!user) {
            return NextResponse.redirect(new URL(`/login?next=${request.nextUrl.pathname}`, request.url))
        }
    }

    // 3. Login Redirect Logic
    if (user && request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // 4. Kill Switch (Store Enabled Check)
    // Skip for admin routes and api routes to allow admins to re-enable
    if (!request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/api') && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/_next')) {
        const { data: settings } = await supabase
            .from('system_settings')
            .select('value')
            .eq('key', 'store_enabled')
            .single();

        // Default to true if setting missing (fail open or closed? Safe to fail open for now unless strict req)
        // Directive says "Middleware must block checkout if false".
        // Let's block everything if false, or just checkout?
        // "Middleware must block checkout if false." -> implied maybe just checkout?
        // But "Emergency Store Kill Switch" usually implies whole site maintenance mode.
        // Let's implement Maintenance Mode page redirect if false.

        if (settings && settings.value === false) {
            // Allow viewing home page? Or full block?
            // Let's block checkout specifically as requested, or maybe maintenance page.
            // If we block everything, we need a maintenance page.
            // For now, let's block /checkout, /cart, /account
            const protectedPaths = ['/checkout', '/cart', '/account', '/products'];
            if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
                return NextResponse.redirect(new URL('/maintenance', request.url));
            }
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - api/webhooks (Stripe needs public access to these)
         */
        '/((?!_next/static|_next/image|favicon.ico|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}

