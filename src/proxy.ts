import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals, static media and any file with an
  // extension (robots.txt, sitemap.xml, favicon.ico, …).
  matcher: ["/((?!api|_next|_vercel|images|videos|.*\\..*).*)"],
};
