import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { i18n } from '../i18.config'

import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  console.log('Negotiator Headers:', negotiatorHeaders);

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()


  console.log('Accepted Languages:', languages);
  console.log('Supported Locales:', locales);

  const locale = matchLocale(languages, locales, i18n.defaultLocale)

  console.log('Matched Locale:', locale);
  return locale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  console.log('Request Pathname:', pathname);

  const pathnameIsMissingLocale = i18n.locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )


  console.log('Is Pathname Missing Locale:', pathnameIsMissingLocale);

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)

    console.log(`Redirecting to locale: ${locale}`);

    
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    )
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}