/**
 * Gallery breakpoints. `Down` is exclusive by default, matching the source
 * project's breakpoint helpers; pass `true` when the upper bound is inclusive.
 */
export const breakpoints = {
  phoneSmall: 375,
  phoneMedium: 400,
  narrowPhone: 420,
  phone: 560,
  smallTablet: 700,
  tablet: 768,
  tabletWide: 850,
  smallDesktop: 900,
  modal: 1000,
  compact: 1200,
  xxl: 1440,
  desktop: 1600,
  wide: 1728,
  fhd: 1920,
  qhd: 2400,
  uhd: 2560,
} as const;

export type Breakpoint = keyof typeof breakpoints;

export const mediaBreakpointUp = (breakpoint: Breakpoint, offset = 0) =>
  `@media (min-width: ${breakpoints[breakpoint] + offset}px)`;

export const mediaBreakpointDown = (breakpoint: Breakpoint, inclusive = false) =>
  `@media (max-width: ${breakpoints[breakpoint] - (inclusive ? 0 : 1)}px)`;

export const mediaBreakpointBetween = (min: Breakpoint, max: Breakpoint) =>
  `@media (min-width: ${breakpoints[min]}px) and (max-width: ${breakpoints[max] - 1}px)`;

/** Convert a design value at a reference width into a viewport-relative size. */
export const vw = (value: number, screenWidth = 1920) => `${(value / screenWidth) * 100}vw`;

/** Linearly interpolate between two pixel values across a viewport range. */
export const smoothValue = (
  minValue: number,
  maxValue: number,
  minPoint: number,
  maxPoint: number,
  dimension: 'w' | 'h' = 'w',
) =>
  `calc(
    ${minValue}px
    + ${maxValue - minValue}
    * (100v${dimension} - ${minPoint}px)
    / (${maxPoint - minPoint})
  )`;