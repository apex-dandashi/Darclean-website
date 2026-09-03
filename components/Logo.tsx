'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export type LogoVariant = 'header' | 'footer' | 'symbol' | 'symbol-white' | 'full';

interface LogoProps {
  lang?: 'ar' | 'en';
  variant?: LogoVariant;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isWhite?: boolean;
  compactOnMobile?: boolean;
  href?: string;
}

export default function Logo({
  lang = 'ar',
  variant = 'header',
  size = 'md',
  className = '',
  isWhite = false,
  compactOnMobile = false,
  href,
}: LogoProps) {
  const targetHref = href !== undefined ? href : `/${lang}`;

  // Determine logo source
  let logoSrc = '/darclean-header-logo-transparent.png';
  let altText = 'DarClean / دار كلين';
  let aspectRatio = 'aspect-[2.25/1]'; // approximate header aspect ratio

  if (variant === 'footer' || isWhite) {
    logoSrc = '/darclean-header-white.png';
    aspectRatio = 'aspect-[2.25/1]';
  } else if (variant === 'symbol') {
    logoSrc = '/darclean-symbol-512.png';
    aspectRatio = 'aspect-square';
    altText = 'DarClean Symbol / رمز دار كلين';
  } else if (variant === 'symbol-white') {
    logoSrc = '/darclean-symbol-white.png';
    aspectRatio = 'aspect-square';
    altText = 'DarClean Symbol / رمز دار كلين';
  } else if (variant === 'full') {
    logoSrc = '/darclean-full-logo-transparent.png';
    aspectRatio = 'aspect-[1.8/1]';
    altText = 'DarClean دار كلين - من البيت للشغل، النظافة علينا';
  }

  // Size definitions adhering to strict aspect ratio without stretching
  const sizeStyles = {
    sm: {
      header: 'h-8 sm:h-9 w-auto',
      symbol: 'h-8 w-8',
      full: 'h-12 sm:h-14 w-auto',
    },
    md: {
      header: 'h-9 sm:h-11 md:h-12 w-auto',
      symbol: 'h-10 w-10 sm:h-11 sm:w-11',
      full: 'h-16 sm:h-20 w-auto',
    },
    lg: {
      header: 'h-11 sm:h-14 md:h-16 w-auto',
      symbol: 'h-14 w-14 sm:h-16 sm:w-16',
      full: 'h-24 sm:h-28 md:h-32 w-auto',
    },
    xl: {
      header: 'h-16 sm:h-20 w-auto',
      symbol: 'h-20 w-20 sm:h-24 sm:w-24',
      full: 'h-32 sm:h-40 md:h-48 w-auto',
    },
  }[size];

  const currentSizeClass =
    variant === 'symbol' || variant === 'symbol-white'
      ? sizeStyles.symbol
      : variant === 'full'
      ? sizeStyles.full
      : sizeStyles.header;

  const content = (
    <div className={`inline-flex items-center select-none ${className}`}>
      {/* If compactOnMobile is true, show symbol on mobile (<sm) and header logo on sm+ */}
      {compactOnMobile ? (
        <>
          {/* Mobile Symbol */}
          <div className="sm:hidden flex items-center">
            <Image
              src={isWhite ? '/darclean-symbol-white.png' : '/darclean-symbol-512.png'}
              alt={altText}
              width={44}
              height={44}
              priority
              className="h-10 w-10 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Desktop Header Logo */}
          <div className="hidden sm:flex items-center">
            <Image
              src={isWhite ? '/darclean-header-white.png' : '/darclean-header-logo-transparent.png'}
              alt={altText}
              width={220}
              height={98}
              priority
              className={`${currentSizeClass} object-contain transition-opacity duration-200`}
              referrerPolicy="no-referrer"
            />
          </div>
        </>
      ) : (
        <Image
          src={logoSrc}
          alt={altText}
          width={variant === 'full' ? 400 : variant === 'symbol' || variant === 'symbol-white' ? 120 : 260}
          height={variant === 'full' ? 220 : variant === 'symbol' || variant === 'symbol-white' ? 120 : 115}
          priority
          className={`${currentSizeClass} object-contain`}
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  );

  if (targetHref) {
    return (
      <Link
        href={targetHref}
        id="darclean-brand-logo-link"
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B4F55] rounded-lg inline-flex items-center"
        aria-label="DarClean / دار كلين"
      >
        {content}
      </Link>
    );
  }

  return content;
}
