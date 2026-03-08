import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/write(.*)'])

// Next.js 16 prefers a named export 'proxy' or default export
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // In Clerk v6, auth is the object. Use await auth.protect()
    await auth.protect(); 
  }
})

export const config = {
  matcher: [
    // This matcher is critical for Vercel
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}