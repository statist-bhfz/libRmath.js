/*  AUTHOR
 *  Jacob Bogers, jkfbogers@gmail.com
 *  March 25, 2017
 * 
 *  ORGINAL AUTHOR
 *  Mathlib : A C Library of Special Functions
 *  Copyright (C) 1998   Ross Ihaka
 *  Copyright (C) 2000-9 The R Core Team
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, a copy is available at
 *  https://www.R-project.org/Licenses/
 *
 *  SYNOPSIS
 *
 *    #include <Rmath.h>
 *    double norm_rand(void);
 *
 *  DESCRIPTION
 *
 *    Random variates from the STANDARD normal distribution  N(0,1).
 *
 * Is called from  rnorm(..), but also rt(), rf(), rgamma(), ...
 */

/*
 *  REFERENCE
 *
 *    Ahrens, J.H. and Dieter, U.
 *    Extensions of Forsythe's method for random sampling from
 *    the normal distribution.
 *    Math. Comput. 27, 927-937.
 *
 *    The definitions of the constants a[k], d[k], t[k] and
 *    h[k] are according to the abovementioned article
 */

/*-----------------------------------------------------------*/

import { IRNG } from '../';
import { MersenneTwister } from '../mersenne-twister';
import { IRNGNormal } from './inormal-rng';

const { exp, log, sqrt, max: fmax2, min: fmin2, abs: fabs } = Math;

const A = 2.216035867166471;
const C1 = 0.398942280401433;
const C2 = 0.180025191068563;
/*----------- Constants and definitions for  Kinderman - Ramage --- */
/*
     *  REFERENCE
     *
     *    Kinderman A. J. and Ramage J. G. (1976).
     *    Computer generation of normal random variables.
     *    JASA 71, 893-896.
     */
export class KindermanRamage extends IRNGNormal {
  constructor(_rng: IRNG  = new MersenneTwister(0) ) {
    super(_rng);
  }

  public norm_rand() {
    let u1;
    let u2;
    let u3;
    let tt;
    const g = (x: number) => C1 * exp(-x * x / 2.0) - C2 * (A - x);
    // corrected version from Josef Leydold

    u1 = this.rng.unif_rand();

    if (u1 < 0.884070402298758) {
      u2 = this.rng.unif_rand();
      return A * (1.13113163544418 * u1 + u2 - 1);
    }

    if (u1 >= 0.973310954173898) {
      /* tail: */
      for (;;) {
        u2 = this.rng.unif_rand();
        u3 = this.rng.unif_rand();
        tt = A * A - 2 * log(u3);
        if (u2 * u2 < A * A / tt)
          return u1 < 0.986655477086949 ? sqrt(tt) : -sqrt(tt);
      }
    }

    if (u1 >= 0.958720824790463) {
      /* region3: */
      for (;;) {
        u2 = this.rng.unif_rand();
        u3 = this.rng.unif_rand();
        tt = A - 0.63083480192196 * fmin2(u2, u3);
        if (fmax2(u2, u3) <= 0.755591531667601) return u2 < u3 ? tt : -tt;
        if (0.034240503750111 * fabs(u2 - u3) <= g(tt))
          return u2 < u3 ? tt : -tt;
      }
    }

    if (u1 >= 0.911312780288703) {
      /* region2: */
      for (;;) {
        u2 = this.rng.unif_rand();
        u3 = this.rng.unif_rand();
        tt = 0.479727404222441 + 1.10547366102207 * fmin2(u2, u3);
        if (fmax2(u2, u3) <= 0.87283497667179) return u2 < u3 ? tt : -tt;
        if (0.049264496373128 * fabs(u2 - u3) <= g(tt))
          return u2 < u3 ? tt : -tt;
      }
    }

    /* ELSE	 region1: */
    for (;;) {
      u2 = this.rng.unif_rand();
      u3 = this.rng.unif_rand();
      tt = 0.479727404222441 - 0.59550713801594 * fmin2(u2, u3);
      if (tt < 0) continue;
      if (fmax2(u2, u3) <= 0.805577924423817) return u2 < u3 ? tt : -tt;
      if (0.053377549506886 * fabs(u2 - u3) <= g(tt)) return u2 < u3 ? tt : -tt;
    }
  }
}
