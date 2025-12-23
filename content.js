// Cache for prices (updates every 30 seconds)
let priceCache = {};
let lastFetchTime = {};

// Full asset mapping: Crypto first (sorted), then Equities (sorted)
const assetInfo = {
  // === Crypto (alphabetically sorted) ===
  "$0G": { "id": "0xfa9e8d4591613476ad0961732475dc08969d248faca270cc6c47efe009ea3070", "url": "https://insights.pyth.network/price-feeds/Crypto.0G%2FUSD" },
  "$1INCH": { "id": "0x63f341689d98a12ef60a5cff1d7f85c70a9e17bf1575f0e7c0b2512d48b1c8b3", "url": "https://insights.pyth.network/price-feeds/Crypto.1INCH%2FUSD" },
  "$AAVE": { "id": "0x2b9ab1e972a281585084148ba1389800799bd4be63b957507db1349314e47445", "url": "https://insights.pyth.network/price-feeds/Crypto.AAVE%2FUSD" },
  "$ADA": { "id": "0x2a01deaec9e51a579277b34b122399984d0bbf57e2458a7e42fecd2829867a0d", "url": "https://insights.pyth.network/price-feeds/Crypto.ADA%2FUSD" },
  "$AERO": { "id": "0x9db37f4d5654aad3e37e2e14ffd8d53265fb3026d1d8f91146539eebaa2ef45f", "url": "https://insights.pyth.network/price-feeds/Crypto.AERO%2FUSD" },
  "$APT": { "id": "0x03ae4db29ed4ae33d323568895aa00337e658e348b37509f5372ae51f0af00d5", "url": "https://insights.pyth.network/price-feeds/Crypto.APT%2FUSD" },
  "$ARB": { "id": "0x3fa4252848f9f0a1480be62745a4629d9eb1322aebab8a791e344b3b9c1adcf5", "url": "https://insights.pyth.network/price-feeds/Crypto.ARB%2FUSD" },
  "$ASTER": { "id": "0xa903b5a82cb572397e3d47595d2889cf80513f5b4cf7a36b513ae10cc8b1e338", "url": "https://insights.pyth.network/price-feeds/Crypto.ASTER%2FUSD" },
  "$ATOM": { "id": "0xb00b60f88b03a6a625a8d1c048c3f66653edf217439983d037e7222c4e612819", "url": "https://insights.pyth.network/price-feeds/Crypto.ATOM%2FUSD" },
  "$AVAIL": { "id": "0xe886cf22d4daa8b85beb7cdeff20261248c5337443cb388b521cde838ffcaf79", "url": "https://insights.pyth.network/price-feeds/Crypto.AVAIL%2FUSD" },
  "$AVAX": { "id": "0x93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7", "url": "https://insights.pyth.network/price-feeds/Crypto.AVAX%2FUSD" },
  "$AVNT": { "id": "0xc4aa2587b3d35cd526b8e7827f78399d16c7861f719331869c07e5fa499606d0", "url": "https://insights.pyth.network/price-feeds/Crypto.AVNT%2FUSD" },
  "$BCH": { "id": "0x3dd2b63686a450ec7290df3a1e0b583c0481f651351edfa7636f39aed55cf8a3", "url": "https://insights.pyth.network/price-feeds/Crypto.BCH%2FUSD" },
  "$BNB": { "id": "0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f", "url": "https://insights.pyth.network/price-feeds/Crypto.BNB%2FUSD" },
  "$BONK": { "id": "0x72b021217ca3fe68922a19aaf990109cb9d84e9ad004b4d2025ad6f529314419", "url": "https://insights.pyth.network/price-feeds/Crypto.BONK%2FUSD" },
  "$BTC": { "id": "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43", "url": "https://insights.pyth.network/price-feeds/Crypto.BTC%2FUSD" },
  "$CAKE": { "id": "0x2356af9529a1064d41e32d617e2ce1dca5733afa901daba9e2b68dee5d53ecf9", "url": "https://insights.pyth.network/price-feeds/Crypto.CAKE%2FUSD" },
  "$CRO": { "id": "0x23199c2bcb1303f667e733b9934db9eca5991e765b45f5ed18bc4b231415f2fe", "url": "https://insights.pyth.network/price-feeds/Crypto.CRO%2FUSD" },
  "$CRV": { "id": "0xa19d04ac696c7a6616d291c7e5d1377cc8be437c327b75adb5dc1bad745fcae8", "url": "https://insights.pyth.network/price-feeds/Crypto.CRV%2FUSD" },
  "$DOGE": { "id": "0xdcef50dd0a4cd2dcc17e45df1676dcb336a11a61c69df7a0299b0150c672d25c", "url": "https://insights.pyth.network/price-feeds/Crypto.DOGE%2FUSD" },
  "$DOT": { "id": "0xca3eed9b267293f6595901c734c7525ce8ef49adafe8284606ceb307afa2ca5b", "url": "https://insights.pyth.network/price-feeds/Crypto.DOT%2FUSD" },
  "$DRIFT": { "id": "0x5c1690b27bb02446db17cdda13ccc2c1d609ad6d2ef5bf4983a85ea8b6f19d07", "url": "https://insights.pyth.network/price-feeds/Crypto.DRIFT%2FUSD" },
  "$EIGEN": { "id": "0xc65db025687356496e8653d0d6608eec64ce2d96e2e28c530e574f0e4f712380", "url": "https://insights.pyth.network/price-feeds/Crypto.EIGEN%2FUSD" },
  "$ENA": { "id": "0xb7910ba7322db020416fcac28b48c01212fd9cc8fbcbaf7d30477ed8605f6bd4", "url": "https://insights.pyth.network/price-feeds/Crypto.ENA%2FUSD" },
  "$ETH": { "id": "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", "url": "https://insights.pyth.network/price-feeds/Crypto.ETH%2FUSD" },
  "$FARTCOIN": { "id": "0x58cd29ef0e714c5affc44f269b2c1899a52da4169d7acc147b9da692e6953608", "url": "https://insights.pyth.network/price-feeds/Crypto.FARTCOIN%2FUSD" },
  "$FIL": { "id": "0x150ac9b959aee0051e4091f0ef5216d941f590e1c5e7f91cf7635b5c11628c0e", "url": "https://insights.pyth.network/price-feeds/Crypto.FIL%2FUSD" },
  "$GRASS": { "id": "0x299ac948742a799d27a1649c76035b26577ad0eb6585a5ae2a691d31f2ee90c4", "url": "https://insights.pyth.network/price-feeds/Crypto.GRASS%2FUSD" },
  "$GIGA": { "id": "0x7bc1234d6195d67c317d59c1e5841128eac2ace68922fa202111309c30059a74", "url": "https://insights.pyth.network/price-feeds/Crypto.GIGA%2FUSD" },
  "$HBAR": { "id": "0x3728e591097635310e6341af53db8b7ee42da9b3a8d918f9463ce9cca886dfbd", "url": "https://insights.pyth.network/price-feeds/Crypto.HBAR%2FUSD" },
  "$HNT": { "id": "0x649fdd7ec08e8e2a20f425729854e90293dcbe2376abc47197a14da6ff339756", "url": "https://insights.pyth.network/price-feeds/Crypto.HNT%2FUSD" },
  "$HYPE": { "id": "0x4279e31cc369bbcc2faf022b382b080e32a8e689ff20fbc530d2a603eb6cd98b", "url": "https://insights.pyth.network/price-feeds/Crypto.HYPE%2FUSD" },
  "$INJ": { "id": "0x7a5bc1d2b56ad029048cd63964b3ad2776eadf812edc1a43a31406cb54bff592", "url": "https://insights.pyth.network/price-feeds/Crypto.INJ%2FUSD" },
  "$IP": { "id": "0xb620ba83044577029da7e4ded7a2abccf8e6afc2a0d4d26d89ccdd39ec109025", "url": "https://insights.pyth.network/price-feeds/Crypto.IP%2FUSD" },
  "$JLP": { "id": "0xc811abc82b4bad1f9bd711a2773ccaa935b03ecef974236942cec5e0eb845a3a", "url": "https://insights.pyth.network/price-feeds/Crypto.JLP%2FUSD" },
  "$JUP": { "id": "0x0a0408d619e9380abad35060f9192039ed5042fa6f82301d0e48bb52be830996", "url": "https://insights.pyth.network/price-feeds/Crypto.JUP%2FUSD" },
  "$KAITO": { "id": "0x7302dee641a08507c297a7b0c8b3efa74a48a3baa6c040acab1e5209692b7e59", "url": "https://insights.pyth.network/price-feeds/Crypto.KAITO%2FUSD" },
  "$KAVA": { "id": "0xa6e905d4e85ab66046def2ef0ce66a7ea2a60871e68ae54aed50ec2fd96d8584", "url": "https://insights.pyth.network/price-feeds/Crypto.KAVA%2FUSD" },
  "$KCS": { "id": "0xc8acad81438490d4ebcac23b3e93f31cdbcb893fcba746ea1c66b89684faae2f", "url": "https://insights.pyth.network/price-feeds/Crypto.KCS%2FUSD" },
  "$KMNO": { "id": "0xb17e5bc5de742a8a378b54c9c75442b7d51e30ada63f28d9bd28d3c0e26511a0", "url": "https://insights.pyth.network/price-feeds/Crypto.KMNO%2FUSD" },
  "$LEO": { "id": "0x19e4e2b451406cf99311bb5127b12a948db17f30b69c323c8657d71119a58619", "url": "https://insights.pyth.network/price-feeds/Crypto.LEO%2FUSD" },
  "$LINK": { "id": "0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221", "url": "https://insights.pyth.network/price-feeds/Crypto.LINK%2FUSD" },
  "$LTC": { "id": "0x6e3f3fa8253588df9326580180233eb791e03b443a3ba7a1d892e73874e19a54", "url": "https://insights.pyth.network/price-feeds/Crypto.LTC%2FUSD" },
  "$MET": { "id": "0x0292e0f405bcd4a496d34e48307f6787349ad2bcd8505c3d3a9f77d81a67a682", "url": "https://insights.pyth.network/price-feeds/Crypto.MET%2FUSD" },
  "$MNT": { "id": "0x4e3037c822d852d79af3ac80e35eb420ee3b870dca49f9344a38ef4773fb0585", "url": "https://insights.pyth.network/price-feeds/Crypto.MNT%2FUSD" },
  "$MON": { "id": "0x31491744e2dbf6df7fcf4ac0820d18a609b49076d45066d3568424e62f686cd1", "url": "https://insights.pyth.network/price-feeds/Crypto.MON%2FUSD" },
  "$MORPHO": { "id": "0x5b2a4c542d4a74dd11784079ef337c0403685e3114ba0d9909b5c7a7e06fdc42", "url": "https://insights.pyth.network/price-feeds/Crypto.MORPHO%2FUSD" },
  "$NEAR": { "id": "0xc415de8d2eba7db216527dff4b60e8f3a5311c740dadb233e13e12547e226750", "url": "https://insights.pyth.network/price-feeds/Crypto.NEAR%2FUSD" },
  "$ONDO": { "id": "0xd40472610abe56d36d065a0cf889fc8f1dd9f3b7f2a478231a5fc6df07ea5ce3", "url": "https://insights.pyth.network/price-feeds/Crypto.ONDO%2FUSD" },
  "$OP": { "id": "0x385f64d993f7b77d8182ed5003d97c60aa3361f3cecfe711544d2d59165e9bdf", "url": "https://insights.pyth.network/price-feeds/Crypto.OP%2FUSD" },
  "$PAXG": { "id": "0x273717b49430906f4b0c230e99aa1007f83758e3199edbc887c0d06c3e332494", "url": "https://insights.pyth.network/price-feeds/Crypto.PAXG%2FUSD" },
  "$PENDLE": { "id": "0x9a4df90b25497f66b1afb012467e316e801ca3d839456db028892fe8c70c8016", "url": "https://insights.pyth.network/price-feeds/Crypto.PENDLE%2FUSD" },
  "$PENGU": { "id": "0xbed3097008b9b5e3c93bec20be79cb43986b85a996475589351a21e67bae9b61", "url": "https://insights.pyth.network/price-feeds/Crypto.PENGU%2FUSD" },
  "$PI": { "id": "0x8c102183926ffc9a1a1347a5a583661af37b415e93ea3f3591e94c303ed4f514", "url": "https://insights.pyth.network/price-feeds/Crypto.PI%2FUSD" },
  "$PEPE": { "id": "0xd69731a2e74ac1ce884fc3890f7ee324b6deb66147055249568869ed700882e4", "url": "https://insights.pyth.network/price-feeds/Crypto.PEPE%2FUSD" },
  "$PLUME": { "id": "0xded84d57dbf810bf86b97936f12e1f01b8d6d01c251a4d6eac592147988d475c", "url": "https://insights.pyth.network/price-feeds/Crypto.PLUME%2FUSD" },
  "$POL": { "id": "0xffd11c5a1cfd42f80afb2df4d9f264c15f956d68153335374ec10722edd70472", "url": "https://insights.pyth.network/price-feeds/Crypto.POL%2FUSD" },
  "$POPCAT": { "id": "0xb9312a7ee50e189ef045aa3c7842e099b061bd9bdc99ac645956c3b660dc8cce", "url": "https://insights.pyth.network/price-feeds/Crypto.POPCAT%2FUSD" },
  "$PUMP": { "id": "0x7a01fca212788bba7c5bf8c9efd576a8a722f070d2c17596ff7bb609b8d5c3b9", "url": "https://insights.pyth.network/price-feeds/Crypto.PUMP%2FUSD" },
  "$PYTH": { "id": "0x0bbf28e9a841a1cc788f6a361b17ca072d0ea3098a1e5df1c3922d06719579ff", "url": "https://insights.pyth.network/price-feeds/Crypto.PYTH%2FUSD" },
  "$SEI": { "id": "0x53614f1cb0c031d4af66c04cb9c756234adad0e1cee85303795091499a4084eb", "url": "https://insights.pyth.network/price-feeds/Crypto.SEI%2FUSD" },
  "$SHIB": { "id": "0xf0d57deca57b3da2fe63a493f4c25925fdfd8edf834b20f93e1f84dbd1504d4a", "url": "https://insights.pyth.network/price-feeds/Crypto.SHIB%2FUSD" },
  "$SKY": { "id": "0xa483243eed64ca27a1f6e26385b7d1e0d07e9fe264bb6903efb3efc4689d3fe7", "url": "https://insights.pyth.network/price-feeds/Crypto.SKY%2FUSD" },
  "$SOL": { "id": "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d", "url": "https://insights.pyth.network/price-feeds/Crypto.SOL%2FUSD" },
  "$SUI": { "id": "0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744", "url": "https://insights.pyth.network/price-feeds/Crypto.SUI%2FUSD" },
  "$TAO": { "id": "0x410f41de235f2db824e562ea7ab2d3d3d4ff048316c61d629c0b93f58584e1af", "url": "https://insights.pyth.network/price-feeds/Crypto.TAO%2FUSD" },
  "$TIA": { "id": "0x09f7c1d7dfbb7df2b8fe3d3d87ee94a2259d212da4f30c1f0540d066dfa44723", "url": "https://insights.pyth.network/price-feeds/Crypto.TIA%2FUSD" },
  "$TON": { "id": "0x8963217838ab4cf5cadc172203c1f0b763fbaa45f346d8ee50ba994bbcac3026", "url": "https://insights.pyth.network/price-feeds/Crypto.TON%2FUSD" },
  "$TRUMP": { "id": "0x879551021853eec7a7dc827578e8e69da7e4fa8148339aa0d3d5296405be4b1a", "url": "https://insights.pyth.network/price-feeds/Crypto.TRUMP%2FUSD" },
  "$UNI": { "id": "0x78d185a741d07edb3412b09008b7c5cfb9bbbd7d568bf00ba737b456ba171501", "url": "https://insights.pyth.network/price-feeds/Crypto.UNI%2FUSD" },
  "$USELESS": { "id": "0xf4b55102bfc9ea1bb2342ea2cb050209ed2a398f7c534afbbc5164541861ba23", "url": "https://insights.pyth.network/price-feeds/Crypto.USELESS%2FUSD" },
  "$USUAL": { "id": "0x226ae20a70afb9d55a5724e1569a6da7a6e65fdb7eb56924ef1262e05a28b505", "url": "https://insights.pyth.network/price-feeds/Crypto.USUAL%2FUSD" },
  "$VIRTUAL": { "id": "0x8132e3eb1dac3e56939a16ff83848d194345f6688bff97eb1c8bd462d558802b", "url": "https://insights.pyth.network/price-feeds/Crypto.VIRTUAL%2FUSD" },
  "$W": { "id": "0xeff7446475e218517566ea99e72a4abec2e1bd8498b43b7d8331e29dcb059389", "url": "https://insights.pyth.network/price-feeds/Crypto.W%2FUSD" },
  "$WIF": { "id": "0x4ca4beeca86f0d164160323817a4e42b10010a724c2217c6ee41b54cd4cc61fc", "url": "https://insights.pyth.network/price-feeds/Crypto.WIF%2FUSD" },
  "$WLFI": { "id": "0xd41369178d64f41d51ca95465c144a2c74d2fff30be69164835911943fa64c3e", "url": "https://insights.pyth.network/price-feeds/Crypto.WLFI%2FUSD" },
  "$WLD": { "id": "0xd6835ad1f773de4a378115eb6824bd0c0e42d84d1c84d9750e853fb6b6c7794a", "url": "https://insights.pyth.network/price-feeds/Crypto.WLD%2FUSD" },
  "$XMR": { "id": "0x46b8cc9347f04391764a0361e0b17c3ba394b001e7c304f7650f6376e37c321d", "url": "https://insights.pyth.network/price-feeds/Crypto.XMR%2FUSD" },
  "$XRP": { "id": "0xec5d399846a9209f3fe5881d70aae9268c94339ff9817e8d18ff19fa05eea1c8", "url": "https://insights.pyth.network/price-feeds/Crypto.XRP%2FUSD" },
  "$ZEC": { "id": "0xbe9b59d178f0d6a97ab4c343bff2aa69caa1eaae3e9048a65788c529b125bb24", "url": "https://insights.pyth.network/price-feeds/Crypto.ZEC%2FUSD" },
  "$ZK": { "id": "0xcc03dc09298fb447e0bf9afdb760d5b24340fd2167fd33d8967dd8f9a141a2e8", "url": "https://insights.pyth.network/price-feeds/Crypto.ZK%2FUSD" },
  "$ZORA": { "id": "0x93eacee7286be62044cd8dfbdfdf1bea8f52a3ca6e0f512f4a05bd383f5666b1", "url": "https://insights.pyth.network/price-feeds/Crypto.ZORA%2FUSD" },

  // === US Equities (alphabetically sorted) ===
  "$AAPL": { "id": "0x49f6b65cb1de6b10eaf75e7c03ca029c306d0357e91b5311b175084a5ad55688", "url": "https://insights.pyth.network/price-feeds/Equity.US.AAPL%2FUSD" },
  "$ABBV": { "id": "0x019ae7cb58ee716ebdd1288b057373d60224fc98a9a43ee373c6b0df1f3ffdf5", "url": "https://insights.pyth.network/price-feeds/Equity.US.ABBV%2FUSD" },
  "$ABNB": { "id": "0xccab508da0999d36e1ac429391d67b3ac5abf1900978ea1a56dab6b1b932168e", "url": "https://insights.pyth.network/price-feeds/Equity.US.ABNB%2FUSD" },
  "$ADBE": { "id": "0xdf82dc88ea742bb42bdb845e5fc3ca4eef2354c67357d338221e8a696891b4ca", "url": "https://insights.pyth.network/price-feeds/Equity.US.ADBE%2FUSD" }, 
  "$AMAT": { "id": "0xb9bc74cc1243b706efacf664ed206d08ab1dda79e8b87752c7c44b3bdf1b9e08", "url": "https://insights.pyth.network/price-feeds/Equity.US.AMAT%2FUSD" },
  "$AMD": { "id": "0x3622e381dbca2efd1859253763b1adc63f7f9abb8e76da1aa8e638a57ccde93e", "url": "https://insights.pyth.network/price-feeds/Equity.US.AMD%2FUSD" },
  "$AMZN": { "id": "0xb5d0e0fa58a1f8b81498ae670ce93c872d14434b72c364885d4fa1b257cbb07a", "url": "https://insights.pyth.network/price-feeds/Equity.US.AMZN%2FUSD" },
  "$ARKF": { "id": "0x60a2f5372a890ea26f1564b01378944d22b322490a060ad4060a94040e725c30", "url": "https://insights.pyth.network/price-feeds/Equity.US.ARKF%2FUSD" },
  "$ARKK": { "id": "0xb2fe0af6c828efefda3ffda664f919825a535aa28a0f19fc238945c7aff540b1", "url": "https://insights.pyth.network/price-feeds/Equity.US.ARKK%2FUSD" },
  "$ARKQ": { "id": "0x954577a53bf2074e6b0fb124f0aac1c331de1cb6af075ca3768374a456948e95", "url": "https://insights.pyth.network/price-feeds/Equity.US.ARKQ%2FUSD" },
  "$ASML": { "id": "0x1a6e324589a0e355919fb1c0389edc3fdf4c46034626bd82aad4e47714cfa94f", "url": "https://insights.pyth.network/price-feeds/Equity.US.ASML%2FUSD" },
  "$AVGO": { "id": "0xd0c9aef79b28308b256db7742a0a9b08aaa5009db67a52ea7fa30ed6853f243b", "url": "https://insights.pyth.network/price-feeds/Equity.US.AVGO%2FUSD" },
  "$BA": { "id": "0x8419416ba640c8bbbcf2d464561ed7dd860db1e38e51cec9baf1e34c4be839ae", "url": "https://insights.pyth.network/price-feeds/Equity.US.BA%2FUSD" },
  "$BABA": { "id": "0x72bc23b1d0afb1f8edef20b7fb60982298993161bc0fd749587d6f60cd1ee9a3", "url": "https://insights.pyth.network/price-feeds/Equity.US.BABA%2FUSD" },
  "$BAC": { "id": "0x21debc1718a4b76ff74dadf801c261d76c46afaafb74d9645b65e00b80f5ee3e", "url": "https://insights.pyth.network/price-feeds/Equity.US.BAC%2FUSD" },
  "$BBAI": { "id": "0xd66fd5fb5d53b65340d1772cf658d451eb9dd8f528f6433743cd87f51f43638c", "url": "https://insights.pyth.network/price-feeds/Equity.US.BBAI%2FUSD" },
  "$BYND": { "id": "0xa4bd17109f2fbee701b0901eda1a67ceca3cdddefa509a5a3bebdde4bd458991", "url": "https://insights.pyth.network/price-feeds/Equity.US.BYND%2FUSD" },
  "$C": { "id": "0xe7e7aac1ac0524cd3666fae4ecafae5e1fee880c11f3a7b4b7ea61bd6e434a63", "url": "https://insights.pyth.network/price-feeds/Equity.US.C%2FUSD" },
  "$COIN": { "id": "0xfee33f2a978bf32dd6b662b65ba8083c6773b494f8401194ec1870c640860245", "url": "https://insights.pyth.network/price-feeds/Equity.US.COIN%2FUSD" },
  "$CRCL": { "id": "0x92b8527aabe59ea2b12230f7b532769b133ffb118dfbd48ff676f14b273f1365", "url": "https://insights.pyth.network/price-feeds/Equity.US.CRCL%2FUSD" },
  "$CRWD": { "id": "0xbaed936d3c6c2e34104e92c6b015b97ce96adc5ab4f04230c1270e1162e7a270", "url": "https://insights.pyth.network/price-feeds/Equity.US.CRWD%2FUSD" },
  "$CRM": { "id": "0xfeff234600320f4d6bb5a01d02570a9725c1e424977f2b823f7231e6857bdae8", "url": "https://insights.pyth.network/price-feeds/Equity.US.CRM%2FUSD" },
  "$DIS": { "id": "0x703e36203020ae6761e6298975764e266fb869210db9b35dd4e4225fa68217d0", "url": "https://insights.pyth.network/price-feeds/Equity.US.DIS%2FUSD" },
  "$F": { "id": "0x6c267962d46cec4a5baf6105de67ef08e1306f75973ce6eb8db8527f06e28f33", "url": "https://insights.pyth.network/price-feeds/Equity.US.F%2FUSD" },
  "$GME": { "id": "0x6f9cd89ef1b7fd39f667101a91ad578b6c6ace4579d5f7f285a4b06aa4504be6", "url": "https://insights.pyth.network/price-feeds/Equity.US.GME%2FUSD" },
  "$GOOGL": { "id": "0x5a48c03e9b9cb337801073ed9d166817473697efff0d138874e0f6a33d6d5aa6", "url": "https://insights.pyth.network/price-feeds/Equity.US.GOOGL%2FUSD" },
  "$HOOD": { "id": "0x306736a4035846ba15a3496eed57225b64cc19230a50d14f3ed20fd7219b7849", "url": "https://insights.pyth.network/price-feeds/Equity.US.HOOD%2FUSD" },
  "$INTC": { "id": "0xc1751e085ee292b8b3b9dd122a135614485a201c35dfc653553f0e28c1baf3ff", "url": "https://insights.pyth.network/price-feeds/Equity.US.INTC%2FUSD" },
  "$IWM": { "id": "0xeff690a187797aa225723345d4612abec0bf0cec1ae62347c0e7b1905d730879", "url": "https://insights.pyth.network/price-feeds/Equity.US.IWM%2FUSD" },
  "$JNJ": { "id": "0x12848738d5db3aef52f51d78d98fc8b8b8450ffb19fb3aeeb67d38f8c147ff63", "url": "https://insights.pyth.network/price-feeds/Equity.US.JNJ%2FUSD" },
  "$JPM": { "id": "0x7f4f157e57bfcccd934c566df536f34933e74338fe241a5425ce561acdab164e", "url": "https://insights.pyth.network/price-feeds/Equity.US.JPM%2FUSD" },
  "$KO": { "id": "0x9aa471dccea36b90703325225ac76189baf7e0cc286b8843de1de4f31f9caa7d", "url": "https://insights.pyth.network/price-feeds/Equity.US.KO%2FUSD" },
  "$LLY": { "id": "0x70dcf5fd56553d0023693e4b590336a8c9bcfd0d98dd9f093b1f697820d98325", "url": "https://insights.pyth.network/price-feeds/Equity.US.LLY%2FUSD" },
  "$LMT": { "id": "0x880d96a272d5ccbb3cd6f6aacb881a996cb4976b3f252b58c595cd2a418b6ea9", "url": "https://insights.pyth.network/price-feeds/Equity.US.LMT%2FUSD" },
  "$MA": { "id": "0x639db3fe6951d2465bd722768242e68eb0285f279cb4fa97f677ee8f80f1f1c0", "url": "https://insights.pyth.network/price-feeds/Equity.US.MA%2FUSD" },
  "$MARA": { "id": "0x0fc2ad77a9ab75bcbc3ebd7a9ff60facd08c517309e2d684baa979c910a0e43e", "url": "https://insights.pyth.network/price-feeds/Equity.US.MARA%2FUSD" },
  "$MDB": { "id": "0x91fc07facc1b1ec2e8336dfa66e2b5f0892af06f491c606f67690bf4c55aaee6", "url": "https://insights.pyth.network/price-feeds/Equity.US.MDB%2FUSD" },
  "$META": { "id": "0x78a3e3b8e676a8f73c439f5d749737034b139bbbe899ba5775216fba596607fe", "url": "https://insights.pyth.network/price-feeds/Equity.US.META%2FUSD" },
  "$MSFT": { "id": "0xd0ca23c1cc005e004ccf1db5bf76aeb6a49218f43dac3d4b275e92de12ded4d1", "url": "https://insights.pyth.network/price-feeds/Equity.US.MSFT%2FUSD" },
  "$MSTR": { "id": "0xe1e80251e5f5184f2195008382538e847fafc36f751896889dd3d1b1f6111f09", "url": "https://insights.pyth.network/price-feeds/Equity.US.MSTR%2FUSD" },
  "$MU": { "id": "0x152244dc24665ca7dd3f257b8f442dc449b6346f48235b7b229268cb770dda2d", "url": "https://insights.pyth.network/price-feeds/Equity.US.MU%2FUSD" },
  "$NFLX": { "id": "0x8376cfd7ca8bcdf372ced05307b24dced1f15b1afafdeff715664598f15a3dd2", "url": "https://insights.pyth.network/price-feeds/Equity.US.NFLX%2FUSD" },
  "$NKE": { "id": "0x67649450b4ca4bfff97cbaf96d2fd9e40f6db148cb65999140154415e4378e14", "url": "https://insights.pyth.network/price-feeds/Equity.US.NKE%2FUSD" },
  "$NVDA": { "id": "0xb1073854ed24cbc755dc527418f52b7d271f6cc967bbf8d8129112b18860a593", "url": "https://insights.pyth.network/price-feeds/Equity.US.NVDA%2FUSD" },
  "$ORCL": { "id": "0xe47ff732eaeb6b4163902bdee61572659ddf326511917b1423bae93fcdf3153c", "url": "https://insights.pyth.network/price-feeds/Equity.US.ORCL%2FUSD" },
  "$PLTR": { "id": "0x11a70634863ddffb71f2b11f2cff29f73f3db8f6d0b78c49f2b5f4ad36e885f0", "url": "https://insights.pyth.network/price-feeds/Equity.US.PLTR%2FUSD" },
  "$PYPL": { "id": "0x773c3b11f6be58e8151966a9f5832696d8cd08884ccc43ac8965a7ebea911533", "url": "https://insights.pyth.network/price-feeds/Equity.US.PYPL%2FUSD" },
  "$QCOM": { "id": "0x54350ebf587c3f14857efcfec50e5c4f6e10220770c2266e9fe85bd5e42e4022", "url": "https://insights.pyth.network/price-feeds/Equity.US.QCOM%2FUSD" },
  "$QQQ": { "id": "0x9695e2b96ea7b3859da9ed25b7a46a920a776e2fdae19a7bcfdf2b219230452d", "url": "https://insights.pyth.network/price-feeds/Equity.US.QQQ%2FUSD" },
  "$RIOT": { "id": "0x46417522a59b245c5af35c33c13426d991b36514c4c85aaefe1cf787e7daad90", "url": "https://insights.pyth.network/price-feeds/Equity.US.RIOT%2FUSD" },
  "$SCHW": { "id": "0xd437b2f1470d5f007f18a5565eaab1ed182d97204d80b7dd3dac29839f61c9e6", "url": "https://insights.pyth.network/price-feeds/Equity.US.SCHW%2FUSD" },
  "$SNOW": { "id": "0x14291d2651ecf1f9105729bdc59553c1ce73fb3d6c931dd98a9d2adddc37e00f", "url": "https://insights.pyth.network/price-feeds/Equity.US.SNOW%2FUSD" },
  "$SOFI": { "id": "0x72fae0e0683c186f5ce9444afac9909cf5d60b499f4f9569dd75442f19c625c8", "url": "https://insights.pyth.network/price-feeds/Equity.US.SOFI%2FUSD" },
  "$SMCI": { "id": "0x8f34132a42f8bb7a47568d77a910f97174a30719e16904e9f2915d5b2c6c2d52", "url": "https://insights.pyth.network/price-feeds/Equity.US.SMCI%2FUSD" },
  "$SPOT": { "id": "0x547ef6a2ea7db9baf50788876d3c062facaecfc896d898f37ba12efd0a13383a", "url": "https://insights.pyth.network/price-feeds/Equity.US.SPOT%2FUSD" },
  "$SPY": { "id": "0x19e09bb805456ada3979a7d1cbb4b6d63babc3a0f8e8a9509f68afa5c4c11cd5", "url": "https://insights.pyth.network/price-feeds/Equity.US.SPY%2FUSD" },
  "$TSLA": { "id": "0x16dad506d7db8da01c87581c87ca897a012a153557d4d578c3b9c9e1bc0632f1", "url": "https://insights.pyth.network/price-feeds/Equity.US.TSLA%2FUSD" },
  "$TLT": { "id": "0x9f383d612ac09c7e6ffda24deca1502fce72e0ba58ff473fea411d9727401cc1", "url": "https://insights.pyth.network/price-feeds/Equity.US.TLT%2FUSD" },
  "$UBER": { "id": "0xc04665f62a0eabf427a834bb5da5f27773ef7422e462d40c7468ef3e4d39d8f1", "url": "https://insights.pyth.network/price-feeds/Equity.US.UBER%2FUSD" },  
  "$UVXY": { "id": "0x7d9c04b949c64bef946910c9cdf4390737731fca2c5356aa5fe36844bab1cb16", "url": "https://insights.pyth.network/price-feeds/Equity.US.UVXY%2FUSD" },  
  "$V": { "id": "0xc719eb7bab9b2bc060167f1d1680eb34a29c490919072513b545b9785b73ee90", "url": "https://insights.pyth.network/price-feeds/Equity.US.V%2FUSD" },
  "$VRTX": { "id": "0xac9de86ae3dcff03514bde733f5793f1446b2cd31f1539a1c449acc3e76cacc1", "url": "https://insights.pyth.network/price-feeds/Equity.US.VRTX%2FUSD" },
  "$WMT": { "id": "0x327ae981719058e6fb44e132fb4adbf1bd5978b43db0661bfdaefd9bea0c82dc", "url": "https://insights.pyth.network/price-feeds/Equity.US.WMT%2FUSD" },
  "$XOM": { "id": "0x4a1a12070192e8db9a89ac235bb032342a390dde39389b4ee1ba8e41e7eae5d8", "url": "https://insights.pyth.network/price-feeds/Equity.US.XOM%2FUSD" }
};

// === Credible Users Mapping ===
const credibleUsers = {
  "vitalikbuterin": { role: "Ethereum Founder" },
  "aeyakovenko": { role: "Solana Founder" },
  "cz_binance": { role: "Binance Founder" },
  "haydenzadams": { role: "Uniswap Founder" },
  "stanikulechov": { role: "Aave Founder" },
  "brian_armstrong": { role: "Coinbase Founder" },
  "tyler": { role: "Gemini Founder" },
  "cameron": { role: "Gemini Founder" },
  "saylor": { role: "MicroStrategy Founder" },
  "apompliano": { role: "Morgan Creek Founder" },
  "cdixon": { role: "A16Z Founder" },
  "pmarca": { role: "A16Z Founder" },
  "raoulgmi": { role: "Real Vision Founder" },
  "camirusso": { role: "Defiant Founder" },
  "chameleon_jeff": { role: "Hyperliquid Founder" },
  "weremeow": { role: "Jupiter Founder" },
  "gdog97_": { role: "Ethena Founder" },
  "mdomcahill": { role: "Pyth Founder" },
  "jayantkrish": { role: "Pyth Founder" },
  "rouz_cc": { role: "Pyth Founder" },
  "robinson": { role: "Wormhole Founder" },
  "danreecer_": { role: "Wormhole Founder" },
  "cathiedwood": { role: "ARK Invest Founder" },
  "dtapcap": { role: "50T Founder" },
  "lizannsonders": { role: "Schwab Strategist" },
  "a1lon9": { role: "Pumpfun Founder" },
  "kaiynne": { role: "Synthetix & Infinex Founder" },
  "justinsuntron": { role: "TRON Founder" },
  "runekek": { role: "MakerDAO Founder" },
  "jespow": { role: "Kraken Founder" },
  "iohk_charles": { role: "Cardano Founder" },
  "zooko": { role: "Zcash Founder" },
  "evanweb3": { role: "Sui Founder" },
  "el33th4xor": { role: "Avalanche Founder" },
  "kris": { role: "Crypto.com Founder" },
  "averyching": { role: "Aptos Founder" },
  "nathanlallman": { role: "Ondo Founder" },
  "ilblackdragon": { role: "Near Founder" },
  "matthuang": { role: "Paradigm Founder" },
  "fehrsam": { role: "Paradigm Founder" },
  "dan_pantera": { role: "Pantera Founder" },
  "zxocw": { role: "Polychain Founder" },
  "alpackap": { role: "Hack & Dragonfly Founder" },
  "benbybit": { role: "Bybit Founder" },
  "star_okx": { role: "OKX Founder" },
  "cryptohayes": { role: "Bitmex Founder" },
  "satoshilite": { role: "Litecoin Founder" },
  "ethereumjoseph": { role: "Ethereum & Consensys Founder" },
  "keonehd": { role: "Monad Founder" },
  "robertsagurton": { role: "Fogo Founder" },
  "laurashin": { role: "Unchained Founder" },
  "jasonyanowitz": { role: "Blockworks Founder" },
  "y2kappa": { role: "Kamino Founder" },
  "buffalu__": { role: "Jito Founder" },
  "jessepollak": { role: "Base Founder" },
  "dwr": { role: "Farcaster Founder" },
  "punk9277": { role: "Kaito Founder" },
  "sreeramkannan": { role: "Eigenlayer Founder" },
  "programmer": { role: "x402 Creator" },
  "jdkanani": { role: "Polygon Founder" },
  "sandeepnailwal": { role: "Polygon & Sentient Founder" },
  "rleshner": { role: "Compound Founder" },
  "nickszabo4": { role: "Smart Contracts Pioneer" },
  "brendaneich": { role: "Brave Founder" },
  "juanbenet": { role: "Filecoin Founder" },
  "andrecronjetech": { role: "DeFi Pioneer" },
  "samkazemian": { role: "Frax Founder" },
  "cindyleowtt": { role: "Drift Founder" },
  "0xmert_": { role: "Helius Founder" },
};

// Fetch price and confidence from Hermes API
async function fetchPrice(feedId) {
  const now = Date.now();
  if (priceCache[feedId] && now - lastFetchTime[feedId] < 30000) {
    return priceCache[feedId];
  }

  try {
    const url = `https://hermes.pyth.network/v2/updates/price/latest?ids[]=${feedId}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    
    const json = await response.json();
    if (!json.parsed || !Array.isArray(json.parsed) || json.parsed.length === 0) {
      throw new Error('No parsed data in response');
    }
    
    const priceData = json.parsed[0].price;
    const price = Number(priceData.price) * Math.pow(10, priceData.expo);
    const conf = Number(priceData.conf) * Math.pow(10, priceData.expo);
    
    const result = { price, conf };
    priceCache[feedId] = result;
    lastFetchTime[feedId] = now;
    return result;
  } catch (e) {
    console.error('Pyth fetch error:', e.message);
    return { price: 'N/A', conf: 'N/A' };
  }
}

// Format price — treats zero or negative as unavailable
function formatPrice(price) {
  if (price === 'N/A' || typeof price !== 'number') return 'N/A';
  if (price <= 0) return 'N/A';

  if (price >= 1) {
    return price.toFixed(2);
  } else {
    let str = price.toPrecision(4);
    str = parseFloat(str).toString();
    if (str.includes('e')) {
      return parseFloat(str).toFixed(8);
    }
    return str;
  }
}

// Format confidence to 3 significant figures
function formatConf(conf) {
  if (conf === 'N/A' || typeof conf !== 'number' || conf <= 0) return 'N/A';
  return conf.toPrecision(3);
}

// Single merged processTweet function
async function processTweet(tweetElement) {
  if (tweetElement.dataset.pythProcessed === 'true') return;

  const textElement = tweetElement.querySelector('div[data-testid="tweetText"]');
  if (!textElement) return;

// === Credible User Badge ===
const userNameDiv = tweetElement.querySelector('div[data-testid="User-Name"]');
if (userNameDiv) {
  const repostText = userNameDiv.innerText.toLowerCase();
  if (repostText.includes('repost') || repostText.includes('quote') || repostText.includes('republish')) {
    return; // Skip for reposts (comment out to allow prices)
  }

  // Get true username from link href
  const handleLink = userNameDiv.querySelector('a[role="link"][href^="/"]');
  let username = null;
  if (handleLink) {
    const href = handleLink.getAttribute('href');
    username = href.slice(1).toLowerCase();
  }

  if (username && credibleUsers[username]) {
    const role = credibleUsers[username].role;

    // Find visible text to append badge
    let handleSpan = null;
    const spans = userNameDiv.querySelectorAll('span');
    for (const span of spans) {
      const text = span.innerText.trim();
      if (text.startsWith('@') || text.endsWith('.eth')) {
        handleSpan = span;
        break;
      }
    }

    if (handleSpan) {
      if (handleSpan.parentNode.querySelector('.pyth-cred-badge')) return;

      const badge = document.createElement('span');
      badge.className = 'pyth-cred-badge';
      badge.textContent = ` ${role} `;
      badge.style.display = 'inline-block';
      badge.style.backgroundColor = '#008000';
      badge.style.color = 'white';
      badge.style.fontSize = '11px';
      badge.style.fontWeight = '600';
      badge.style.padding = '2px 8px';
      badge.style.borderRadius = '12px';
      badge.style.marginLeft = '6px';
      badge.style.lineHeight = '1.4';
      badge.title = `${role} (Credible Founder/Educator)`;

      handleSpan.parentNode.appendChild(badge);
    }
  }
}
  // === Price Overlay Logic ===
  const tweetText = textElement.innerText.toUpperCase();

  const cashtagRegex = /\$[A-Z0-9]+/g;
  let match;
  const detectedCashtags = [];
  const seen = new Set();

  while ((match = cashtagRegex.exec(tweetText)) !== null) {
    const tag = match[0];
    if (assetInfo.hasOwnProperty(tag) && !seen.has(tag)) {
      detectedCashtags.push({ tag, index: match.index });
      seen.add(tag);
    }
  }

  detectedCashtags.sort((a, b) => a.index - b.index);
  const orderedTags = detectedCashtags.map(item => item.tag);

  if (orderedTags.length === 0) return;

  const results = {};
  await Promise.all(
    orderedTags.map(async (tag) => {
      results[tag] = await fetchPrice(assetInfo[tag].id);
    })
  );

  if (tweetElement.querySelector('.pyth-price-overlay')) return;

  const container = document.createElement('span');
  container.className = 'pyth-price-overlay';
  container.style.marginBottom = '4px';
  container.style.display = 'inline-block';
  container.style.width = '100%';
  container.style.fontSize = '13px';
  container.style.fontWeight = 'bold';

  const isSingleCashtag = orderedTags.length === 1;

  orderedTags.forEach((tag, index) => {
    const asset = tag.slice(1);
    const { price, conf } = results[tag];
    const formattedPrice = formatPrice(price);

    const link = document.createElement('a');
    link.href = assetInfo[tag].url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    if (isSingleCashtag && formattedPrice !== 'N/A') {
      const formattedConf = formatConf(conf);
      link.textContent = `${asset}: $${formattedPrice} (Confidence: ±${formattedConf})`;
    } else {
      link.textContent = `${asset}: $${formattedPrice}`;
    }

    link.style.color = '#5D3FD3';
    link.style.textDecoration = 'underline';
    link.style.cursor = 'pointer';
    link.style.transition = 'color 0.2s ease';

    link.addEventListener('mouseover', () => link.style.color = '#9333EA');
    link.addEventListener('mouseout', () => link.style.color = '#5D3FD3');

    container.appendChild(link);

    if (index < orderedTags.length - 1) {
      container.appendChild(document.createTextNode(' | '));
    }
  });

  const pill = document.createElement('span');
  pill.textContent = 'Powered by Pyth';
  pill.style.backgroundColor = '#5D3FD3';
  pill.style.color = 'white';
  pill.style.padding = '2px 10px';
  pill.style.borderRadius = '999px';
  pill.style.fontSize = '11px';
  pill.style.fontWeight = '600';
  pill.style.whiteSpace = 'nowrap';
  pill.style.marginLeft = '8px';
  container.appendChild(pill);

  textElement.parentNode.insertBefore(container, textElement);

  tweetElement.dataset.pythProcessed = 'true';
}

// Observer and initial processing
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === 1) {
        if (node.matches('article')) processTweet(node);
        node.querySelectorAll?.('article').forEach(processTweet);
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });

document.querySelectorAll('article').forEach(processTweet);