//https://stat.ethz.ch/R-manual/R-devel/library/base/html/Bessel.html
//https://en.wikipedia.org/wiki/Bessel_function
process.env.DEBUG = 'bessel_j, bessel_y, bessel_i, bessel_k, K_bessel';
const libR = require('./lib-r-math');

//strip mining
const {
    special: {
        besselJ,
        besselK,
        besselI,
        besselY
    },
    R: {
        seq: _seq,
        numberPrecision,
        multiplexer,
        arrayrify,
        mult,
        selector,
        map,
        flatten
    }
} = libR;
//some usefull helpers
const seq = _seq()();
const precision4 = numberPrecision(4); // restrict to 4 significant digits
const precision9 = numberPrecision(9); // restrict to 9 significant digits
const exp = arrayrify(Math.exp);

//some data for bessels
// orders
const musLarge = precision4(exp(seq(-2, 3.8, 1.1))); //large fractional orders
const musSmall = precision4(exp(seq(4, 4.3, 0.15))); // small fractional orders
const musLargeNegative = mult(musLarge, -1);
const musSmallNegative = mult(musSmall, -1);

// x >= 0
const x = precision4(exp(seq(-4, 10)));

function calculate(fn) {

    return function(x, mu) {
        return {
            x: x,
            nu: mu,
            answer: fn(x, mu)
        };
    }
}

// mixing curry
const Jbessel1 = multiplexer(x, musLarge)(calculate(besselJ)).filter(selector(7, 4, 6));
const Jbessel2 = multiplexer(x, musSmall)(calculate(besselJ)).filter(selector(10, 6, 11));
const Jbessel3 = multiplexer(x, musLargeNegative)(calculate(besselJ)).filter(selector(14, 13, 3));
const Jbessel4 = multiplexer(x, musSmallNegative)(calculate(besselJ)).filter(selector(11, 1, 6));
const dataJ = map(flatten(Jbessel1, Jbessel2, Jbessel3, Jbessel4))(o => ({ x: o.x, nu: o.nu }));
/*
J
0.01831563888873418 0.1353 0.564900684281691
0.049787068367863944 0.4066 0.25105619656840983
0.1353352832366127 1.221 0.03341005155419249
0.36787944117144233 3.669 0.0001348473329746306
1 11.02 1.1251994729479687e-11
2.718281828459045 33.12 1.8552507171510993e-33
7.38905609893065 0.1353 0.29197150972323743
20.085536923187668 0.4066 0.17481214274918472
54.598150033144236 1.221 -0.007541785690682562
148.4131591025766 3.669 -0.056272536771274015
403.4287934927351 11.02 -0.023674326061502576
1096.6331584284585 33.12 0.0061142058288721195
2980.9579870417283 0.1353 -0.0023194284477515443
8103.083927575384 0.4066 -0.0077460398392223875
22026.465794806718 1.221 0.0019581864829830197

0.01831563888873418 54.6 2.0288879533405182e-184
0.049787068367863944 63.43 1.5513286938493397e-190
0.1353352832366127 73.7 6.93251456577162e-194
0.36787944117144233 54.6 2.7824705421594225e-113
1 63.43 6.775163389160978e-108
2.718281828459045 73.7 7.123376390717112e-98
7.38905609893065 54.6 2.987316250320408e-42
20.085536923187668 63.43 6.113191594765449e-26
54.598150033144236 73.7 0.0000015892293515458067
148.4131591025766 54.6 -0.06606992302720846
403.4287934927351 63.43 0.03964569843006415
1096.6331584284585 73.7 -0.017466014563825256
2980.9579870417283 54.6 -0.0010297214737851825
8103.083927575384 63.43 -0.0025865616436620523
22026.465794806718 73.7 0.004529536984631713

0.01831563888873418 -0.1353 1.717103243325671
0.049787068367863944 -0.4066 2.9805486008431217
0.1353352832366127 -1.221 -5.08527441637124
0.36787944117144233 -3.669 -557.8465077598937
1 -11.02 -161861608.74874264
2.718281828459045 -33.12 -1.9134671618653725e+30
7.38905609893065 -0.1353 0.2548327309932144
20.085536923187668 -0.4066 0.08278034469958677
54.598150033144236 -1.221 0.07472571852476251
148.4131591025766 -3.669 -0.05740610453553527
403.4287934927351 -11.02 0.025631146126124462
1096.6331584284585 -33.12 0.0028965124213905383
2980.9579870417283 -0.1353 -0.008062971337294448
8103.083927575384 -0.4066 -0.0063648456372237955
22026.465794806718 -1.221 0.0016986754208463241

0.01831563888873418 -54.6 2.7327869247145505e+181
0.049787068367863944 -63.43 -3.1569267248691465e+187
0.1353352832366127 -73.7 -5.040228498966214e+190
0.36787944117144233 -54.6 1.9927053936022974e+110
1 -63.43 -7.229402614868305e+104
2.718281828459045 -73.7 -4.908514132375438e+94
7.38905609893065 -54.6 1.8732589453849992e+39
20.085536923187668 -63.43 -8.446019239230315e+22
54.598150033144236 -73.7 -3275.284661949388
148.4131591025766 -54.6 0.005447586607349087
403.4287934927351 -63.43 -0.003661352967373707
1096.6331584284585 -73.7 0.0031930106733106273
2980.9579870417283 -54.6 0.014183341386054408
8103.083927575384 -63.43 -0.007709624146636468
22026.465794806718 -73.7 0.005005187212092447
*/

const Ybessel1 = multiplexer(x, musLarge)(calculate(besselY)).filter(selector(2, 14, 9));
const Ybessel2 = multiplexer(x, musSmall)(calculate(besselY)).filter(selector(10, 11, 7));
const Ybessel3 = multiplexer(x, musLargeNegative)(calculate(besselY)).filter(selector(5, 12, 2));
const Ybessel4 = multiplexer(x, musSmallNegative)(calculate(besselY)).filter(selector(4, 14, 13));
const dataY = map(flatten(Ybessel1, Ybessel2, Ybessel3, Ybessel4))(o => ({ x: o.x, nu: o.nu }));

/*
x=0.01831563888873418   mu=0.1353,Ybessel=-2.915976031066784
x=0.049787068367863944  mu=0.4066,Ybessel=-3.03777265978053
x=0.1353352832366127    mu=1.221,Ybessel=-7.9075813730313875
x=0.36787944117144233   mu=3.669,Ybessel=-646.9009106138234
x=1     mu=11.02,Ybessel=-2577803304.7358594
x=2.718281828459045     mu=33.12,Ybessel=-5.197879760833058e+30
x=7.38905609893065      mu=0.1353,Ybessel=0.027057295686163774
x=20.085536923187668    mu=0.4066,Ybessel=-0.033657589107771814
x=54.598150033144236    mu=1.221,Ybessel=0.10772950226090076
x=148.4131591025766     mu=3.669,Ybessel=-0.03352907415855172
x=403.4287934927351     mu=11.02,Ybessel=0.031908255485664096
x=1096.6331584284585    mu=33.12,Ybessel=0.02331101571023812
x=2980.9579870417283    mu=0.1353,Ybessel=0.014428526976261678
x=8103.083927575384     mu=0.4066,Ybessel=0.004308594683201495
x=22026.465794806718    mu=1.221,Ybessel=0.005006795251028275

x=0.01831563888873418   mu=54.6,Ybessel=-2.8734222182296196e+181
x=0.049787068367863944  mu=63.43,Ybessel=-3.2348319528784657e+187
x=0.1353352832366127    mu=73.7,Ybessel=-6.230065046854009e+190
x=0.36787944117144233   mu=54.6,Ybessel=-2.0952544454086664e+110
x=1     mu=63.43,Ybessel=-7.407806584350945e+104
x=2.718281828459045     mu=73.7,Ybessel=-6.067257136134481e+94
x=7.38905609893065      mu=54.6,Ybessel=-1.9696610172887447e+39
x=20.085536923187668    mu=63.43,Ybessel=-8.654446330495985e+22
x=54.598150033144236    mu=73.7,Ybessel=-4048.4744889865315
x=148.4131591025766     mu=54.6,Ybessel=0.015739487789238518
x=403.4287934927351     mu=63.43,Ybessel=0.005110157331126304
x=1096.6331584284585    mu=73.7,Ybessel=0.016636580620474618
x=2980.9579870417283    mu=54.6,Ybessel=-0.01457867089244467
x=8103.083927575384     mu=63.43,Ybessel=-0.00847804383564444
x=22026.465794806718    mu=73.7,Ybessel=0.0028958503827507974

x=0.01831563888873418   mu=-0.1353,Ybessel=-2.423548111471769
x=0.049787068367863944  mu=-0.4066,Ybessel=-0.6382961572480138
x=0.1353352832366127    mu=-1.221,Ybessel=6.055653846849074
x=0.36787944117144233   mu=-3.669,Ybessel=-327.5485642360576
x=1     mu=-11.02,Ybessel=2572716598.757117
x=2.718281828459045     mu=-33.12,Ybessel=4.83286637809704e+30
x=7.38905609893065      mu=-0.1353,Ybessel=0.14505081507683804
x=20.085536923187668    mu=-0.4066,Ybessel=0.15760562518046914
x=54.598150033144236    mu=-1.221,Ybessel=-0.0779653203658112
x=148.4131591025766     mu=-3.669,Ybessel=0.031548951974023506
x=403.4287934927351     mu=-11.02,Ybessel=-0.030358768599302706
x=1096.6331584284585    mu=-33.12,Ybessel=-0.023924823555326644
x=2980.9579870417283    mu=-0.1353,Ybessel=0.012188134895992837
x=8103.083927575384     mu=-0.4066,Ybessel=-0.006168781188309874
x=22026.465794806718    mu=-1.221,Ybessel=-0.005100685718848915

x=0.01831563888873418   mu=-54.6,Ybessel=8.879362974475232e+180
x=0.049787068367863944  mu=-63.43,Ybessel=7.056567275740185e+186
x=0.1353352832366127    mu=-73.7,Ybessel=-3.661940355363646e+190
x=0.36787944117144233   mu=-54.6,Ybessel=6.474692311709421e+109
x=1     mu=-63.43,Ybessel=1.6159629399489705e+104
x=2.718281828459045     mu=-73.7,Ybessel=-3.566244266486157e+94
x=7.38905609893065      mu=-54.6,Ybessel=6.086587275000774e+38
x=20.085536923187668    mu=-63.43,Ybessel=1.8879089750268134e+22
x=54.598150033144236    mu=-73.7,Ybessel=-2379.6336001943314
x=148.4131591025766     mu=-54.6,Ybessel=-0.06770000003577746
x=403.4287934927351     mu=-63.43,Ybessel=-0.03980564792092648
x=1096.6331584284585    mu=-73.7,Ybessel=0.023909039343424733
x=2980.9579870417283    mu=-54.6,Ybessel=0.003525733743552399
x=8103.083927575384     mu=-63.43,Ybessel=0.004373696826847094
x=22026.465794806718    mu=-73.7,Ybessel=-0.0019623342493904346

*/

const Ibessel1 = multiplexer(x, musLarge)(calculate(besselI)).filter(selector(3, 14, 4));
const Ibessel2 = multiplexer(x, musSmall)(calculate(besselI)).filter(selector(8, 10, 1));
const Ibessel3 = multiplexer(x, musLargeNegative)(calculate(besselI)).filter(selector(13, 12, 1));
const Ibessel4 = multiplexer(x, musSmallNegative)(calculate(besselI)).filter(selector(5, 3, 2));
const dataI = map(flatten(Ibessel1, Ibessel2, Ibessel3, Ibessel4))(o => ({ x: o.x, nu: o.nu }));

//> sample.int(14,4)
//[1] 4 7 2 1
//Ibessel1.forEach(o => console.log('x=%d\tmu=%d,Ybessel=%d', o.x, o.nu, o.answer));
/*
x=0.01831563888873418   mu=0.1353,Ibessel=0.5649841499152735
x=0.049787068367863944  mu=0.4066,Ibessel=0.2512775033882724
x=0.1353352832366127    mu=1.221,Ibessel=0.03354809520060091
x=0.36787944117144233   mu=3.669,Ibessel=0.00013681590287639397
x=1     mu=11.02,Ibessel=1.1729919802779188e-11
x=2.718281828459045     mu=33.12,Ibessel=2.0674178945806418e-33
x=7.38905609893065      mu=0.1353,Ibessel=241.5439863767789
x=20.085536923187668    mu=0.4066,Ibessel=47146089.773142576
x=54.598150033144236    mu=1.221,Ibessel=2.7479919607574767e+22
x=148.4131591025766     mu=3.669,Ibessel=8.928841929270613e+62
x=403.4287934927351     mu=11.02,Ibessel=2.7518025164388865e+173
x=1096.6331584284585    mu=33.12,Ibessel=Infinity
x=2980.9579870417283    mu=0.1353,Ibessel=Infinity
x=8103.083927575384     mu=0.4066,Ibessel=Infinity
x=22026.465794806718    mu=1.221,Ibessel=Infinity

[1] 13 11 14  8
x=0.01831563888873418   mu=-0.1353,Ibessel=1.7174363529811445
x=0.049787068367863944  mu=-0.4066,Ibessel=2.9867802854956707
x=0.1353352832366127    mu=-1.221,Ibessel=-4.878814874513239
x=0.36787944117144233   mu=-3.669,Ibessel=-543.8797815173608
x=1     mu=-11.02,Ibessel=-153982847.64300072
x=2.718281828459045     mu=-33.12,Ibessel=-1.705560724436977e+30
x=7.38905609893065      mu=-0.1353,Ibessel=241.544060083567
x=20.085536923187668    mu=-0.4066,Ibessel=47146089.773142576
x=54.598150033144236    mu=-1.221,Ibessel=2.7479919607574767e+22
x=148.4131591025766     mu=-3.669,Ibessel=8.928841929270613e+62
x=403.4287934927351     mu=-11.02,Ibessel=2.7518025164388865e+173
x=1096.6331584284585    mu=-33.12,Ibessel=Infinity
x=2980.9579870417283    mu=-0.1353,Ibessel=Infinity
x=8103.083927575384     mu=-0.4066,Ibessel=Infinity
x=22026.465794806718    mu=-1.221,Ibessel=Infinity

//[1]  5  6  2 13
x=0.01831563888873418   mu=-54.6,Ibessel=2.7327783729752895e+181
x=0.049787068367863944  mu=-63.43,Ibessel=-3.1568640533865414e+187
x=0.1353352832366127    mu=-73.7,Ibessel=-5.039593635204097e+190
x=0.36787944117144233   mu=-54.6,Ibessel=1.990191278035044e+110
x=1     mu=-63.43,Ibessel=-7.171733787916701e+104
x=2.718281828459045     mu=-73.7,Ibessel=-4.665301457183278e+94
x=7.38905609893065      mu=-54.6,Ibessel=1.1256497798466454e+39
x=20.085536923187668    mu=-63.43,Ibessel=-3.332464214392146e+21
x=54.598150033144236    mu=-73.7,Ibessel=940.4013083227237
x=148.4131591025766     mu=-54.6,Ibessel=4.387120353380187e+58
x=403.4287934927351     mu=-63.43,Ibessel=2.194003343054528e+171
x=1096.6331584284585    mu=-73.7,Ibessel=Infinity
x=2980.9579870417283    mu=-54.6,Ibessel=Infinity
x=8103.083927575384     mu=-63.43,Ibessel=Infinity
x=22026.465794806718    mu=-73.7,Ibessel=Infinity
*/

const Kbessel1 = multiplexer(x, musLarge)(calculate(besselK)).filter(selector(10, 5, 3));
const Kbessel2 = multiplexer(x, musSmall)(calculate(besselK)).filter(selector(4, 8, 12));
const Kbessel3 = multiplexer(x, musLargeNegative)(calculate(besselK)).filter(selector(3, 14, 9));
const Kbessel4 = multiplexer(x, musSmallNegative)(calculate(besselK)).filter(selector(5, 2, 9));

const dataK = map(flatten(Kbessel1, Kbessel2, Kbessel3, Kbessel4))(o => ({ x: o.x, nu: o.nu }));

//Kbessel1.forEach(o => console.log('x=%d\tmu=%d,Kbessel=%d', o.x, o.nu, o.answer));
/*
//[1]  1  4  5 10
x=0.01831563888873418   mu=0.1353,Kbessel=4.389877648284731
x=0.049787068367863944  mu=0.4066,Kbessel=4.488772613323117
x=0.1353352832366127    mu=1.221,Kbessel=12.059739736408275
x=0.36787944117144233   mu=3.669,Kbessel=990.7085051082918
x=1     mu=11.02,Kbessel=3852105274.493387
x=2.718281828459045     mu=33.12,Kbessel=7.277668662774874e+30
x=7.38905609893065      mu=0.1353,Kbessel=0.0002807611289873902
x=20.085536923187668    mu=0.4066,Kbessel=5.280640883468615e-10
x=54.598150033144236    mu=1.221,Kbessel=3.3318558470809886e-25
x=148.4131591025766     mu=3.669,Kbessel=3.7720048692020474e-66
x=403.4287934927351     mu=11.02,Kbessel=4.502194115998399e-177
x=1096.6331584284585    mu=33.12,Kbessel=0
x=2980.9579870417283    mu=0.1353,Kbessel=0
x=8103.083927575384     mu=0.4066,Kbessel=0
x=22026.465794806718    mu=1.221,Kbessel=0

//[1]  5 14  3 11
> Kbessel2.forEach(o => console.log('x=%d\tmu=%d,Kbessel=%d', o.x, o.nu, o.answer));
x=0.01831563888873418   mu=54.6,Kbessel=4.513546941391162e+181
x=0.049787068367863944  mu=63.43,Kbessel=5.081161275885189e+187
x=0.1353352832366127    mu=73.7,Kbessel=9.784930632802938e+190
x=0.36787944117144233   mu=54.6,Kbessel=3.287065590312935e+110
x=1     mu=63.43,Kbessel=1.1543333950357402e+105
x=2.718281828459045     mu=73.7,Kbessel=9.058200808249114e+94
x=7.38905609893065      mu=54.6,Kbessel=1.85916032238389e+39
x=20.085536923187668    mu=63.43,Kbessel=5.363800224871198e+21
x=54.598150033144236    mu=73.7,Kbessel=0.0000057967600708438374
x=148.4131591025766     mu=54.6,Kbessel=7.2070078789752995e-62
x=403.4287934927351     mu=63.43,Kbessel=5.580375385573021e-175
x=1096.6331584284585    mu=73.7,Kbessel=0
x=2980.9579870417283    mu=54.6,Kbessel=0
x=8103.083927575384     mu=63.43,Kbessel=0
x=22026.465794806718    mu=73.7,Kbessel=0

//[1] 14  8  2  9
> Kbessel3.forEach(o => console.log('x=%d\tmu=%d,Kbessel=%d', o.x, o.nu, o.answer));
x=0.01831563888873418   mu=-0.1353,Kbessel=4.389877648284731
x=0.049787068367863944  mu=-0.4066,Kbessel=4.488772613323117
x=0.1353352832366127    mu=-1.221,Kbessel=12.059739736408275
x=0.36787944117144233   mu=-3.669,Kbessel=990.7085051082918
x=1     mu=-11.02,Kbessel=3852105274.493387
x=2.718281828459045     mu=-33.12,Kbessel=7.277668662774874e+30
x=7.38905609893065      mu=-0.1353,Kbessel=0.0002807611289873902
x=20.085536923187668    mu=-0.4066,Kbessel=5.280640883468615e-10
x=54.598150033144236    mu=-1.221,Kbessel=3.3318558470809886e-25
x=148.4131591025766     mu=-3.669,Kbessel=3.7720048692020474e-66
x=403.4287934927351     mu=-11.02,Kbessel=4.502194115998399e-177
x=1096.6331584284585    mu=-33.12,Kbessel=0
x=2980.9579870417283    mu=-0.1353,Kbessel=0
x=8103.083927575384     mu=-0.4066,Kbessel=0
x=22026.465794806718    mu=-1.221,Kbessel=0

//[1]  5 10  6 13
>  Kbessel4.forEach(o => console.log('x=%d\tmu=%d,Kbessel=%d', o.x, o.nu, o.answer));
x=0.01831563888873418   mu=-54.6,Kbessel=4.513546941391162e+181
x=0.049787068367863944  mu=-63.43,Kbessel=5.081161275885189e+187
x=0.1353352832366127    mu=-73.7,Kbessel=9.784930632802938e+190
x=0.36787944117144233   mu=-54.6,Kbessel=3.287065590312935e+110
x=1     mu=-63.43,Kbessel=1.1543333950357402e+105
x=2.718281828459045     mu=-73.7,Kbessel=9.058200808249114e+94
x=7.38905609893065      mu=-54.6,Kbessel=1.85916032238389e+39
x=20.085536923187668    mu=-63.43,Kbessel=5.363800224871198e+21
x=54.598150033144236    mu=-73.7,Kbessel=0.0000057967600708438374
x=148.4131591025766     mu=-54.6,Kbessel=7.2070078789752995e-62
x=403.4287934927351     mu=-63.43,Kbessel=5.580375385573021e-175
x=1096.6331584284585    mu=-73.7,Kbessel=0
x=2980.9579870417283    mu=-54.6,Kbessel=0
x=8103.083927575384     mu=-63.43,Kbessel=0
x=22026.465794806718    mu=-73.7,Kbessel=0
*/



precision9(map(dataI)(o => besselI(o.x, o.nu)));