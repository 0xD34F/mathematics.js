﻿(function(factory) {
    if (typeof window === 'undefined') {
        module.exports = factory();
    } else {
        window.Complex = factory();
    }
}(function() {
    function Complex(a, b) {
        var c = Object.create(Complex.prototype);

        if (a instanceof Object) {
            if ('re' in a && 'im' in a) {
                b = a.im;
                a = a.re;
            } else if ('abs' in a && 'arg' in a) {
                b = a.abs * Math.sin(a.arg);
                a = a.abs * Math.cos(a.arg);
            } else if ('r' in a && 'phi' in a) {
                b = a.r * Math.sin(a.phi);
                a = a.r * Math.cos(a.phi);
            }
        }

        c.re = a || 0;
        c.im = b || 0;

        return c;
    }

    function complexParam(f) {
        return function(re, im) {
            return f.call(this, re instanceof Complex ? re : Complex(re, im));
        };
    }

    Object.assign(Complex.prototype, {
        toString: function() {
            var r = this.re,
                i = this.im,
                str = '';

            if (isNaN(r) || isNaN(i)) {
                return 'NaN';
            }

            if (r !== 0) {
                str += r;
            }

            if (i !== 0) {
                if (r) {
                    str += i > 0 ? ' + ' : ' - '
                } else if (i < 0) {
                    str += '-';
                }

                i = Math.abs(i);
                str += i === 1 ? 'i' : i + 'i';
            }

            return str || '0';
        },
        get abs() {
            return Math.sqrt(this.re * this.re + this.im * this.im);
        },
        get arg() {
            return Math.atan2(this.im, this.re);
        },
        get conj() {
            return Complex(this.re, -this.im);
        },
        get sqrt() {
            var abs = this.abs,
                sign = this.im >= 0 ? 1 : -1;

            return Complex(Math.sqrt((abs + this.re) * 0.5), sign * Math.sqrt((abs - this.re) * 0.5));
        },
        equals: complexParam(function(c) {
            return (this.re === c.re) && (this.im === c.im);
        }),
        add: complexParam(function(c) {
            return Complex(this.re + c.re, this.im + c.im);
        }),
        sub: complexParam(function(c) {
            return Complex(this.re - c.re, this.im - c.im);
        }),
        mul: complexParam(function(c) {
            return Complex(this.re * c.re - this.im * c.im, this.im * c.re + this.re * c.im);
        }),
        div: complexParam(function(c) {
            var d = c.re * c.re + c.im * c.im;
            return Complex((this.re * c.re + this.im * c.im) / d, (this.im * c.re - this.re * c.im) / d);
        }),
        pow: function(n) {
            return n > 1 ? this.mul(this.pow(n - 1)) : this;
        },
        /*
        формула Муавра - быстрее, но менее точно:
        (2 + 2i).pow(2) = 4.898587196589414e-16 + 8.000000000000002i вместо 8i

        pow: function(n) {
            var absN = Math.pow(this.abs, n),
                argN = n * this.arg;

            return Complex(absN * Math.cos(argN), absN * Math.sin(argN));
        }*/
        nthRoots: function(n) {
            var absN = Math.pow(this.abs, 1 / n),
                argN = this.arg / n,
                pi2_n = Math.PI * 2 / n;

            return [...Array(n)].map((k, i) => Complex(absN * Math.cos(argN + pi2_n * i), absN * Math.sin(argN + pi2_n * i)));
        }
    });

    return Complex;
}));
