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
  "$AEVO": { "id": "0x104e4d9ba218610b9af53c887f9fcb7396615259867a5a4b5983a65802aeee0b", "url": "https://insights.pyth.network/price-feeds/Crypto.AEVO%2FUSD" },
  "$AIXBT": { "id": "0x0fc54579a29ba60a08fdb5c28348f22fd3bec18e221dd6b90369950db638a5a7", "url": "https://insights.pyth.network/price-feeds/Crypto.AIXBT%2FUSD" },
  "$ALGO": { "id": "0xfa17ceaf30d19ba51112fdcc750cc83454776f47fb0112e4af07f15f4bb1ebc0", "url": "https://insights.pyth.network/price-feeds/Crypto.ALGO%2FUSD" },
  "$APT": { "id": "0x03ae4db29ed4ae33d323568895aa00337e658e348b37509f5372ae51f0af00d5", "url": "https://insights.pyth.network/price-feeds/Crypto.APT%2FUSD" },
  "$AR": { "id": "0xf610eae82767039ffc95eef8feaeddb7bbac0673cfe7773b2fde24fd1adb0aee", "url": "https://insights.pyth.network/price-feeds/Crypto.AR%2FUSD" },
  "$ARB": { "id": "0x3fa4252848f9f0a1480be62745a4629d9eb1322aebab8a791e344b3b9c1adcf5", "url": "https://insights.pyth.network/price-feeds/Crypto.ARB%2FUSD" },
  "$ASTER": { "id": "0xa903b5a82cb572397e3d47595d2889cf80513f5b4cf7a36b513ae10cc8b1e338", "url": "https://insights.pyth.network/price-feeds/Crypto.ASTER%2FUSD" },
  "$ATOM": { "id": "0xb00b60f88b03a6a625a8d1c048c3f66653edf217439983d037e7222c4e612819", "url": "https://insights.pyth.network/price-feeds/Crypto.ATOM%2FUSD" },
  "$AVAIL": { "id": "0xe886cf22d4daa8b85beb7cdeff20261248c5337443cb388b521cde838ffcaf79", "url": "https://insights.pyth.network/price-feeds/Crypto.AVAIL%2FUSD" },
  "$AVAX": { "id": "0x93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7", "url": "https://insights.pyth.network/price-feeds/Crypto.AVAX%2FUSD" },
  "$AVNT": { "id": "0xc4aa2587b3d35cd526b8e7827f78399d16c7861f719331869c07e5fa499606d0", "url": "https://insights.pyth.network/price-feeds/Crypto.AVNT%2FUSD" },
  "$AXL": { "id": "0x60144b1d5c9e9851732ad1d9760e3485ef80be39b984f6bf60f82b28a2b7f126", "url": "https://insights.pyth.network/price-feeds/Crypto.AXL%2FUSD" },
  "$BCH": { "id": "0x3dd2b63686a450ec7290df3a1e0b583c0481f651351edfa7636f39aed55cf8a3", "url": "https://insights.pyth.network/price-feeds/Crypto.BCH%2FUSD" },
  "$BERA": { "id": "0x962088abcfdbdb6e30db2e340c8cf887d9efb311b1f2f17b155a63dbb6d40265", "url": "https://insights.pyth.network/price-feeds/Crypto.BERA%2FUSD" },
  "$BLUE": { "id": "0x04cfeb7b143eb9c48e9b074125c1a3447b85f59c31164dc20c1beaa6f21f2b6b", "url": "https://insights.pyth.network/price-feeds/Crypto.BLUE%2FUSD" },
  "$BNB": { "id": "0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f", "url": "https://insights.pyth.network/price-feeds/Crypto.BNB%2FUSD" },
  "$BONK": { "id": "0x72b021217ca3fe68922a19aaf990109cb9d84e9ad004b4d2025ad6f529314419", "url": "https://insights.pyth.network/price-feeds/Crypto.BONK%2FUSD" },
  "$BTC": { "id": "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43", "url": "https://insights.pyth.network/price-feeds/Crypto.BTC%2FUSD" },
  "$CAKE": { "id": "0x2356af9529a1064d41e32d617e2ce1dca5733afa901daba9e2b68dee5d53ecf9", "url": "https://insights.pyth.network/price-feeds/Crypto.CAKE%2FUSD" },
  "$CLOUD": { "id": "0x7358313661dcd4f842a1423aa4f7a05f009001c9113201c719621d3f1aa80a73", "url": "https://insights.pyth.network/price-feeds/Crypto.CLOUD%2FUSD" },
  "$CRO": { "id": "0x23199c2bcb1303f667e733b9934db9eca5991e765b45f5ed18bc4b231415f2fe", "url": "https://insights.pyth.network/price-feeds/Crypto.CRO%2FUSD" },
  "$CRV": { "id": "0xa19d04ac696c7a6616d291c7e5d1377cc8be437c327b75adb5dc1bad745fcae8", "url": "https://insights.pyth.network/price-feeds/Crypto.CRV%2FUSD" },
  "$DOGE": { "id": "0xdcef50dd0a4cd2dcc17e45df1676dcb336a11a61c69df7a0299b0150c672d25c", "url": "https://insights.pyth.network/price-feeds/Crypto.DOGE%2FUSD" },
  "$DOT": { "id": "0xca3eed9b267293f6595901c734c7525ce8ef49adafe8284606ceb307afa2ca5b", "url": "https://insights.pyth.network/price-feeds/Crypto.DOT%2FUSD" },
  "$DRIFT": { "id": "0x5c1690b27bb02446db17cdda13ccc2c1d609ad6d2ef5bf4983a85ea8b6f19d07", "url": "https://insights.pyth.network/price-feeds/Crypto.DRIFT%2FUSD" },
  "$DYM": { "id": "0xa9f3b2a89c6f85a6c20a9518abde39b944e839ca49a0c92307c65974d3f14a57", "url": "https://insights.pyth.network/price-feeds/Crypto.DYM%2FUSD" },
  "$EIGEN": { "id": "0xc65db025687356496e8653d0d6608eec64ce2d96e2e28c530e574f0e4f712380", "url": "https://insights.pyth.network/price-feeds/Crypto.EIGEN%2FUSD" },
  "$ENA": { "id": "0xb7910ba7322db020416fcac28b48c01212fd9cc8fbcbaf7d30477ed8605f6bd4", "url": "https://insights.pyth.network/price-feeds/Crypto.ENA%2FUSD" },
  "$ETH": { "id": "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", "url": "https://insights.pyth.network/price-feeds/Crypto.ETH%2FUSD" },
  "$FARTCOIN": { "id": "0x58cd29ef0e714c5affc44f269b2c1899a52da4169d7acc147b9da692e6953608", "url": "https://insights.pyth.network/price-feeds/Crypto.FARTCOIN%2FUSD" },
  "$FET": { "id": "0x7da003ada32eabbac855af3d22fcf0fe692cc589f0cfd5ced63cf0bdcc742efe", "url": "https://insights.pyth.network/price-feeds/Crypto.FET%2FUSD" },
  "$FIL": { "id": "0x150ac9b959aee0051e4091f0ef5216d941f590e1c5e7f91cf7635b5c11628c0e", "url": "https://insights.pyth.network/price-feeds/Crypto.FIL%2FUSD" },
  "$GRASS": { "id": "0x299ac948742a799d27a1649c76035b26577ad0eb6585a5ae2a691d31f2ee90c4", "url": "https://insights.pyth.network/price-feeds/Crypto.GRASS%2FUSD" },
  "$GIGA": { "id": "0x7bc1234d6195d67c317d59c1e5841128eac2ace68922fa202111309c30059a74", "url": "https://insights.pyth.network/price-feeds/Crypto.GIGA%2FUSD" },
  "$GMX": { "id": "0xb962539d0fcb272a494d65ea56f94851c2bcf8823935da05bd628916e2e9edbf", "url": "https://insights.pyth.network/price-feeds/Crypto.GMX%2FUSD" },
  "$HBAR": { "id": "0x3728e591097635310e6341af53db8b7ee42da9b3a8d918f9463ce9cca886dfbd", "url": "https://insights.pyth.network/price-feeds/Crypto.HBAR%2FUSD" },
  "$HNT": { "id": "0x649fdd7ec08e8e2a20f425729854e90293dcbe2376abc47197a14da6ff339756", "url": "https://insights.pyth.network/price-feeds/Crypto.HNT%2FUSD" },
  "$HYPE": { "id": "0x4279e31cc369bbcc2faf022b382b080e32a8e689ff20fbc530d2a603eb6cd98b", "url": "https://insights.pyth.network/price-feeds/Crypto.HYPE%2FUSD" },
  "$INJ": { "id": "0x7a5bc1d2b56ad029048cd63964b3ad2776eadf812edc1a43a31406cb54bff592", "url": "https://insights.pyth.network/price-feeds/Crypto.INJ%2FUSD" },
  "$IP": { "id": "0xb620ba83044577029da7e4ded7a2abccf8e6afc2a0d4d26d89ccdd39ec109025", "url": "https://insights.pyth.network/price-feeds/Crypto.IP%2FUSD" },
  "$JLP": { "id": "0xc811abc82b4bad1f9bd711a2773ccaa935b03ecef974236942cec5e0eb845a3a", "url": "https://insights.pyth.network/price-feeds/Crypto.JLP%2FUSD" },
  "$JOE": { "id": "0xa3f37baf54dbd24e1d67040d566a762e62be3edbf8ef423038b091afc1722915", "url": "https://insights.pyth.network/price-feeds/Crypto.JOE%2FUSD" },
  "$JUP": { "id": "0x0a0408d619e9380abad35060f9192039ed5042fa6f82301d0e48bb52be830996", "url": "https://insights.pyth.network/price-feeds/Crypto.JUP%2FUSD" },
  "$KAITO": { "id": "0x7302dee641a08507c297a7b0c8b3efa74a48a3baa6c040acab1e5209692b7e59", "url": "https://insights.pyth.network/price-feeds/Crypto.KAITO%2FUSD" },
  "$KAVA": { "id": "0xa6e905d4e85ab66046def2ef0ce66a7ea2a60871e68ae54aed50ec2fd96d8584", "url": "https://insights.pyth.network/price-feeds/Crypto.KAVA%2FUSD" },
  "$KCS": { "id": "0xc8acad81438490d4ebcac23b3e93f31cdbcb893fcba746ea1c66b89684faae2f", "url": "https://insights.pyth.network/price-feeds/Crypto.KCS%2FUSD" },
  "$KMNO": { "id": "0xb17e5bc5de742a8a378b54c9c75442b7d51e30ada63f28d9bd28d3c0e26511a0", "url": "https://insights.pyth.network/price-feeds/Crypto.KMNO%2FUSD" },
  "$LDO": { "id": "0xc63e2a7f37a04e5e614c07238bedb25dcc38927fba8fe890597a593c0b2fa4ad", "url": "https://insights.pyth.network/price-feeds/Crypto.LDO%2FUSD" },
  "$LEO": { "id": "0x19e4e2b451406cf99311bb5127b12a948db17f30b69c323c8657d71119a58619", "url": "https://insights.pyth.network/price-feeds/Crypto.LEO%2FUSD" },
  "$LINEA": { "id": "0x49e50653755fbf8018ab65a07be2f208ac8c4bdfc43200934304ca17ee663cab", "url": "https://insights.pyth.network/price-feeds/Crypto.LINEA%2FUSD" },
  "$LINK": { "id": "0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221", "url": "https://insights.pyth.network/price-feeds/Crypto.LINK%2FUSD" },
  "$LTC": { "id": "0x6e3f3fa8253588df9326580180233eb791e03b443a3ba7a1d892e73874e19a54", "url": "https://insights.pyth.network/price-feeds/Crypto.LTC%2FUSD" },
  "$ME": { "id": "0x91519e3e48571e1232a85a938e714da19fe5ce05107f3eebb8a870b2e8020169", "url": "https://insights.pyth.network/price-feeds/Crypto.ME%2FUSD" },
  "$MELANIA": { "id": "0x8fef7d52c7f4e3a6258d663f9d27e64a1b6fd95ab5f7d545dbf9a515353d0064", "url": "https://insights.pyth.network/price-feeds/Crypto.MELANIA%2FUSD" },
  "$MET": { "id": "0x0292e0f405bcd4a496d34e48307f6787349ad2bcd8505c3d3a9f77d81a67a682", "url": "https://insights.pyth.network/price-feeds/Crypto.MET%2FUSD" },
  "$METIS": { "id": "0xc22aa7943f65c9b1bb8d765bf4d5136590c48508f61912314f23bb730325b159", "url": "https://insights.pyth.network/price-feeds/Crypto.METIS%2FUSD" },
  "$MNT": { "id": "0x4e3037c822d852d79af3ac80e35eb420ee3b870dca49f9344a38ef4773fb0585", "url": "https://insights.pyth.network/price-feeds/Crypto.MNT%2FUSD" },
  "$MOBY": { "id": "0xedbaef2120caa0cc107c332bc2e9ef79b51c80fa4bb746098015c5c366aec42f", "url": "https://insights.pyth.network/price-feeds/Crypto.MOBY%2FUSD" },
  "$MODE": { "id": "0x0386e113cc716a7c6a55decd97b19c90ce080d9f2f5255ac78a0e26889446d1e", "url": "https://insights.pyth.network/price-feeds/Crypto.MODE%2FUSD" },
  "$MON": { "id": "0x31491744e2dbf6df7fcf4ac0820d18a609b49076d45066d3568424e62f686cd1", "url": "https://insights.pyth.network/price-feeds/Crypto.MON%2FUSD" },
  "$MORPHO": { "id": "0x5b2a4c542d4a74dd11784079ef337c0403685e3114ba0d9909b5c7a7e06fdc42", "url": "https://insights.pyth.network/price-feeds/Crypto.MORPHO%2FUSD" },
  "$NEAR": { "id": "0xc415de8d2eba7db216527dff4b60e8f3a5311c740dadb233e13e12547e226750", "url": "https://insights.pyth.network/price-feeds/Crypto.NEAR%2FUSD" },
  "$NIL": { "id": "0xa2f034a194c3b3336f22a2e4f053517253fcaf14f602fb4e2a118f5d55905259", "url": "https://insights.pyth.network/price-feeds/Crypto.NIL%2FUSD" },
  "$ONDO": { "id": "0xd40472610abe56d36d065a0cf889fc8f1dd9f3b7f2a478231a5fc6df07ea5ce3", "url": "https://insights.pyth.network/price-feeds/Crypto.ONDO%2FUSD" },
  "$OP": { "id": "0x385f64d993f7b77d8182ed5003d97c60aa3361f3cecfe711544d2d59165e9bdf", "url": "https://insights.pyth.network/price-feeds/Crypto.OP%2FUSD" },
  "$ORE": { "id": "0x142b804c658e14ff60886783e46e5a51bdf398b4871d9d8f7c28aa1585cad504", "url": "https://insights.pyth.network/price-feeds/Crypto.ORE%2FUSD" },
  "$PAXG": { "id": "0xb34a7ddd3a5b4a70ee2f09dd6cd708b3a0dedb5b0ba2add892fb7d94a3606c7a", "url": "https://insights.pyth.network/price-feeds/Crypto.PAXG%2FUSD" },
  "$PENDLE": { "id": "0x9a4df90b25497f66b1afb012467e316e801ca3d839456db028892fe8c70c8016", "url": "https://insights.pyth.network/price-feeds/Crypto.PENDLE%2FUSD" },
  "$PENGU": { "id": "0xbed3097008b9b5e3c93bec20be79cb43986b85a996475589351a21e67bae9b61", "url": "https://insights.pyth.network/price-feeds/Crypto.PENGU%2FUSD" },
  "$PEPE": { "id": "0xd69731a2e74ac1ce884fc3890f7ee324b6deb66147055249568869ed700882e4", "url": "https://insights.pyth.network/price-feeds/Crypto.PEPE%2FUSD" },
  "$PI": { "id": "0x8c102183926ffc9a1a1347a5a583661af37b415e93ea3f3591e94c303ed4f514", "url": "https://insights.pyth.network/price-feeds/Crypto.PI%2FUSD" },
  "$PLUME": { "id": "0xded84d57dbf810bf86b97936f12e1f01b8d6d01c251a4d6eac592147988d475c", "url": "https://insights.pyth.network/price-feeds/Crypto.PLUME%2FUSD" },
  "$POL": { "id": "0xffd11c5a1cfd42f80afb2df4d9f264c15f956d68153335374ec10722edd70472", "url": "https://insights.pyth.network/price-feeds/Crypto.POL%2FUSD" },
  "$POPCAT": { "id": "0xb9312a7ee50e189ef045aa3c7842e099b061bd9bdc99ac645956c3b660dc8cce", "url": "https://insights.pyth.network/price-feeds/Crypto.POPCAT%2FUSD" },
  "$PUMP": { "id": "0x7a01fca212788bba7c5bf8c9efd576a8a722f070d2c17596ff7bb609b8d5c3b9", "url": "https://insights.pyth.network/price-feeds/Crypto.PUMP%2FUSD" },
  "$PYTH": { "id": "0x0bbf28e9a841a1cc788f6a361b17ca072d0ea3098a1e5df1c3922d06719579ff", "url": "https://insights.pyth.network/price-feeds/Crypto.PYTH%2FUSD" },
  "$RED": { "id": "0x0bb28b82f08477fadbf9607fc8408ff61ca129fae40adc7a8d2ab8945f97ee74", "url": "https://insights.pyth.network/price-feeds/Crypto.RED%2FUSD" },
  "$RON": { "id": "0x97cfe19da9153ef7d647b011c5e355142280ddb16004378573e6494e499879f3", "url": "https://insights.pyth.network/price-feeds/Crypto.RON%2FUSD" },
  "$S": { "id": "0xf490b178d0c85683b7a0f2388b40af2e6f7c90cbe0f96b31f315f08d0e5a2d6d", "url": "https://insights.pyth.network/price-feeds/Crypto.S%2FUSD" },
  "$SEI": { "id": "0x53614f1cb0c031d4af66c04cb9c756234adad0e1cee85303795091499a4084eb", "url": "https://insights.pyth.network/price-feeds/Crypto.SEI%2FUSD" },
  "$SHIB": { "id": "0xf0d57deca57b3da2fe63a493f4c25925fdfd8edf834b20f93e1f84dbd1504d4a", "url": "https://insights.pyth.network/price-feeds/Crypto.SHIB%2FUSD" },
  "$SKY": { "id": "0xa483243eed64ca27a1f6e26385b7d1e0d07e9fe264bb6903efb3efc4689d3fe7", "url": "https://insights.pyth.network/price-feeds/Crypto.SKY%2FUSD" },
  "$SOL": { "id": "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d", "url": "https://insights.pyth.network/price-feeds/Crypto.SOL%2FUSD" },
  "$SUI": { "id": "0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744", "url": "https://insights.pyth.network/price-feeds/Crypto.SUI%2FUSD" },
  "$TAIKO": { "id": "0xd878b9766566a87675421e9b11992c1f2ca2438d5b7d841cb147308e1bd6bb99", "url": "https://insights.pyth.network/price-feeds/Crypto.TAIKO%2FUSD" },
  "$TAO": { "id": "0x410f41de235f2db824e562ea7ab2d3d3d4ff048316c61d629c0b93f58584e1af", "url": "https://insights.pyth.network/price-feeds/Crypto.TAO%2FUSD" },
  "$TIA": { "id": "0x09f7c1d7dfbb7df2b8fe3d3d87ee94a2259d212da4f30c1f0540d066dfa44723", "url": "https://insights.pyth.network/price-feeds/Crypto.TIA%2FUSD" },
  "$TON": { "id": "0x8963217838ab4cf5cadc172203c1f0b763fbaa45f346d8ee50ba994bbcac3026", "url": "https://insights.pyth.network/price-feeds/Crypto.TON%2FUSD" },
  "$TRUMP": { "id": "0x879551021853eec7a7dc827578e8e69da7e4fa8148339aa0d3d5296405be4b1a", "url": "https://insights.pyth.network/price-feeds/Crypto.TRUMP%2FUSD" },
  "$TURBO": { "id": "0xa00e67c6232f2f564932c252c440ed30759d10fee966b601c1613b0ed8692a5c", "url": "https://insights.pyth.network/price-feeds/Crypto.TURBO%2FUSD" },
  "$UNI": { "id": "0x78d185a741d07edb3412b09008b7c5cfb9bbbd7d568bf00ba737b456ba171501", "url": "https://insights.pyth.network/price-feeds/Crypto.UNI%2FUSD" },
  "$USELESS": { "id": "0xf4b55102bfc9ea1bb2342ea2cb050209ed2a398f7c534afbbc5164541861ba23", "url": "https://insights.pyth.network/price-feeds/Crypto.USELESS%2FUSD" },
  "$USUAL": { "id": "0x226ae20a70afb9d55a5724e1569a6da7a6e65fdb7eb56924ef1262e05a28b505", "url": "https://insights.pyth.network/price-feeds/Crypto.USUAL%2FUSD" },
  "$VIRTUAL": { "id": "0x8132e3eb1dac3e56939a16ff83848d194345f6688bff97eb1c8bd462d558802b", "url": "https://insights.pyth.network/price-feeds/Crypto.VIRTUAL%2FUSD" },
  "$W": { "id": "0xeff7446475e218517566ea99e72a4abec2e1bd8498b43b7d8331e29dcb059389", "url": "https://insights.pyth.network/price-feeds/Crypto.W%2FUSD" },
  "$WIF": { "id": "0x4ca4beeca86f0d164160323817a4e42b10010a724c2217c6ee41b54cd4cc61fc", "url": "https://insights.pyth.network/price-feeds/Crypto.WIF%2FUSD" },
  "$WLFI": { "id": "0xd41369178d64f41d51ca95465c144a2c74d2fff30be69164835911943fa64c3e", "url": "https://insights.pyth.network/price-feeds/Crypto.WLFI%2FUSD" },
  "$WLD": { "id": "0xd6835ad1f773de4a378115eb6824bd0c0e42d84d1c84d9750e853fb6b6c7794a", "url": "https://insights.pyth.network/price-feeds/Crypto.WLD%2FUSD" },
  "$XION": { "id": "0x436ccb0d465f3cb48554bcc8def65ff695341b3ebe0897563d118b9291178d0f", "url": "https://insights.pyth.network/price-feeds/Crypto.XION%2FUSD" },
  "$XLM": { "id": "0xb7a8eba68a997cd0210c2e1e4ee811ad2d174b3611c22d9ebf16f4cb7e9ba850", "url": "https://insights.pyth.network/price-feeds/Crypto.XLM%2FUSD" },
  "$XMR": { "id": "0x46b8cc9347f04391764a0361e0b17c3ba394b001e7c304f7650f6376e37c321d", "url": "https://insights.pyth.network/price-feeds/Crypto.XMR%2FUSD" },
  "$XRP": { "id": "0xec5d399846a9209f3fe5881d70aae9268c94339ff9817e8d18ff19fa05eea1c8", "url": "https://insights.pyth.network/price-feeds/Crypto.XRP%2FUSD" },
  "$ZEC": { "id": "0xbe9b59d178f0d6a97ab4c343bff2aa69caa1eaae3e9048a65788c529b125bb24", "url": "https://insights.pyth.network/price-feeds/Crypto.ZEC%2FUSD" },
  "$ZK": { "id": "0xcc03dc09298fb447e0bf9afdb760d5b24340fd2167fd33d8967dd8f9a141a2e8", "url": "https://insights.pyth.network/price-feeds/Crypto.ZK%2FUSD" },
  "$ZORA": { "id": "0x93eacee7286be62044cd8dfbdfdf1bea8f52a3ca6e0f512f4a05bd383f5666b1", "url": "https://insights.pyth.network/price-feeds/Crypto.ZORA%2FUSD" },
  "$ZRO": { "id": "0x3bd860bea28bf982fa06bcf358118064bb114086cc03993bd76197eaab0b8018", "url": "https://insights.pyth.network/price-feeds/Crypto.ZRO%2FUSD" },

  // === US Equities (alphabetically sorted) ===
  "$AAPL": { "id": "0x49f6b65cb1de6b10eaf75e7c03ca029c306d0357e91b5311b175084a5ad55688", "url": "https://insights.pyth.network/price-feeds/Equity.US.AAPL%2FUSD" },
  "$ABBV": { "id": "0x019ae7cb58ee716ebdd1288b057373d60224fc98a9a43ee373c6b0df1f3ffdf5", "url": "https://insights.pyth.network/price-feeds/Equity.US.ABBV%2FUSD" },
  "$ABNB": { "id": "0xccab508da0999d36e1ac429391d67b3ac5abf1900978ea1a56dab6b1b932168e", "url": "https://insights.pyth.network/price-feeds/Equity.US.ABNB%2FUSD" },
  "$ADBE": { "id": "0xdf82dc88ea742bb42bdb845e5fc3ca4eef2354c67357d338221e8a696891b4ca", "url": "https://insights.pyth.network/price-feeds/Equity.US.ADBE%2FUSD" }, 
  "$AMAT": { "id": "0xb9bc74cc1243b706efacf664ed206d08ab1dda79e8b87752c7c44b3bdf1b9e08", "url": "https://insights.pyth.network/price-feeds/Equity.US.AMAT%2FUSD" },
  "$AMC": { "id": "0x5b1703d7eb9dc8662a61556a2ca2f9861747c3fc803e01ba5a8ce35cb50a13a1", "url": "https://insights.pyth.network/price-feeds/Equity.US.AMC%2FUSD" },
  "$AMD": { "id": "0x3622e381dbca2efd1859253763b1adc63f7f9abb8e76da1aa8e638a57ccde93e", "url": "https://insights.pyth.network/price-feeds/Equity.US.AMD%2FUSD" },
  "$AMT": { "id": "0x8a80397a6e962b6e260d620e3c68d08ab94bdc82fd27d2c506d41b8a52280364", "url": "https://insights.pyth.network/price-feeds/Equity.US.AMT%2FUSD" },
  "$AMZN": { "id": "0xb5d0e0fa58a1f8b81498ae670ce93c872d14434b72c364885d4fa1b257cbb07a", "url": "https://insights.pyth.network/price-feeds/Equity.US.AMZN%2FUSD" },
  "$ARKF": { "id": "0x60a2f5372a890ea26f1564b01378944d22b322490a060ad4060a94040e725c30", "url": "https://insights.pyth.network/price-feeds/Equity.US.ARKF%2FUSD" },
  "$ARKK": { "id": "0xb2fe0af6c828efefda3ffda664f919825a535aa28a0f19fc238945c7aff540b1", "url": "https://insights.pyth.network/price-feeds/Equity.US.ARKK%2FUSD" },
  "$ARKQ": { "id": "0x954577a53bf2074e6b0fb124f0aac1c331de1cb6af075ca3768374a456948e95", "url": "https://insights.pyth.network/price-feeds/Equity.US.ARKQ%2FUSD" },
  "$ASML": { "id": "0x1a6e324589a0e355919fb1c0389edc3fdf4c46034626bd82aad4e47714cfa94f", "url": "https://insights.pyth.network/price-feeds/Equity.US.ASML%2FUSD" },
  "$AVGO": { "id": "0xd0c9aef79b28308b256db7742a0a9b08aaa5009db67a52ea7fa30ed6853f243b", "url": "https://insights.pyth.network/price-feeds/Equity.US.AVGO%2FUSD" },
  "$AXP": { "id": "0x9ff7b9a93df40f6d7edc8184173c50f4ae72152c6142f001e8202a26f951d710", "url": "https://insights.pyth.network/price-feeds/Equity.US.AXP%2FUSD" },
  "$BA": { "id": "0x8419416ba640c8bbbcf2d464561ed7dd860db1e38e51cec9baf1e34c4be839ae", "url": "https://insights.pyth.network/price-feeds/Equity.US.BA%2FUSD" },
  "$BABA": { "id": "0x72bc23b1d0afb1f8edef20b7fb60982298993161bc0fd749587d6f60cd1ee9a3", "url": "https://insights.pyth.network/price-feeds/Equity.US.BABA%2FUSD" },
  "$BAC": { "id": "0x21debc1718a4b76ff74dadf801c261d76c46afaafb74d9645b65e00b80f5ee3e", "url": "https://insights.pyth.network/price-feeds/Equity.US.BAC%2FUSD" },
  "$BBAI": { "id": "0xd66fd5fb5d53b65340d1772cf658d451eb9dd8f528f6433743cd87f51f43638c", "url": "https://insights.pyth.network/price-feeds/Equity.US.BBAI%2FUSD" },
  "$BRK.B": { "id": "0xe21c688b7fc65b4606a50f3635f466f6986db129bf16979875d160f9c508e8c7", "url": "https://insights.pyth.network/price-feeds/Equity.US.BRK-B%2FUSD" },
  "$BYND": { "id": "0xa4bd17109f2fbee701b0901eda1a67ceca3cdddefa509a5a3bebdde4bd458991", "url": "https://insights.pyth.network/price-feeds/Equity.US.BYND%2FUSD" },
  "$C": { "id": "0xe7e7aac1ac0524cd3666fae4ecafae5e1fee880c11f3a7b4b7ea61bd6e434a63", "url": "https://insights.pyth.network/price-feeds/Equity.US.C%2FUSD" },
  "$CAT": { "id": "0xad04597ba688c350a97265fcb60585d6a80ebd37e147b817c94f101a32e58b4c", "url": "https://insights.pyth.network/price-feeds/Equity.US.CAT%2FUSD" },
  "$CB": { "id": "0xff65ec3cf0931c4c489baecd95da35d3db5aa0278150d0d09a3fdc25970fc690", "url": "https://insights.pyth.network/price-feeds/Equity.US.CB%2FUSD" },
  "$CBOE": { "id": "0x566241bb0d53283a8a1765b759341490dbf69e7fa7653c4b5f86aabf37567595", "url": "https://insights.pyth.network/price-feeds/Equity.US.CBOE%2FUSD" },
  "$CBRE": { "id": "0xc153deece90e57f0c4b2bd1b693deed41e32a8117fd6eb8269a49e71d5080292", "url": "https://insights.pyth.network/price-feeds/Equity.US.CBRE%2FUSD" },
  "$COIN": { "id": "0xfee33f2a978bf32dd6b662b65ba8083c6773b494f8401194ec1870c640860245", "url": "https://insights.pyth.network/price-feeds/Equity.US.COIN%2FUSD" },
  "$COST": { "id": "0x163f6a6406d65305e8e27965b9081ac79b0cf9529f0fcdc14fe37e65e3b6b5cb", "url": "https://insights.pyth.network/price-feeds/Equity.US.COST%2FUSD" },
  "$CRCL": { "id": "0x92b8527aabe59ea2b12230f7b532769b133ffb118dfbd48ff676f14b273f1365", "url": "https://insights.pyth.network/price-feeds/Equity.US.CRCL%2FUSD" },
  "$CRWD": { "id": "0xbaed936d3c6c2e34104e92c6b015b97ce96adc5ab4f04230c1270e1162e7a270", "url": "https://insights.pyth.network/price-feeds/Equity.US.CRWD%2FUSD" },
  "$CRM": { "id": "0xfeff234600320f4d6bb5a01d02570a9725c1e424977f2b823f7231e6857bdae8", "url": "https://insights.pyth.network/price-feeds/Equity.US.CRM%2FUSD" },
  "$CSCO": { "id": "0x3f4b77dd904e849f70e1e812b7811de57202b49bc47c56391275c0f45f2ec481", "url": "https://insights.pyth.network/price-feeds/Equity.US.CSCO%2FUSD" },
  "$DDOG": { "id": "0x5c49964b5e5420d84e445a2f5e9e3965cf3a82a275d83f8efc30cdeeaf2d062f", "url": "https://insights.pyth.network/price-feeds/Equity.US.DDOG%2FUSD" },
  "$DELL": { "id": "0xa2950270a22ce39a22cb3488ba91e60474cd93c6d01da2ecc5a97c1dd40f4995", "url": "https://insights.pyth.network/price-feeds/Equity.US.DELL%2FUSD" },
  "$DIS": { "id": "0x703e36203020ae6761e6298975764e266fb869210db9b35dd4e4225fa68217d0", "url": "https://insights.pyth.network/price-feeds/Equity.US.DIS%2FUSD" },
  "$EA": { "id": "0x4a6538143c76292692d430d939d868cc15ca22b9c551cf683f1c59374b38594b", "url": "https://insights.pyth.network/price-feeds/Equity.US.EA%2FUSD" },
  "$EBAY": { "id": "0x6264a259e2cc90dfd3207f5831949eced2da6bf53965834c9160e4ceb9240947", "url": "https://insights.pyth.network/price-feeds/Equity.US.EBAY%2FUSD" },
  "$ENPH": { "id": "0x5ec583659f690a921cd7a5be9dd2730d67b2541528ca5b1ff99df3e5d44bbedb", "url": "https://insights.pyth.network/price-feeds/Equity.US.ENPH%2FUSD" },
  "$F": { "id": "0x6c267962d46cec4a5baf6105de67ef08e1306f75973ce6eb8db8527f06e28f33", "url": "https://insights.pyth.network/price-feeds/Equity.US.F%2FUSD" },
  "$FSLR": { "id": "0x787a166618ea8831a100371b51be91328b0171d0ac57265007b30f10e03de4e6", "url": "https://insights.pyth.network/price-feeds/Equity.US.FSLR%2FUSD" },
  "$GE": { "id": "0xe1d3115c6e7ac649faca875b3102f1000ab5e06b03f6903e0d699f0f5315ba86", "url": "https://insights.pyth.network/price-feeds/Equity.US.GE%2FUSD" },
  "$GME": { "id": "0x6f9cd89ef1b7fd39f667101a91ad578b6c6ace4579d5f7f285a4b06aa4504be6", "url": "https://insights.pyth.network/price-feeds/Equity.US.GME%2FUSD" },
  "$GOOGL": { "id": "0x5a48c03e9b9cb337801073ed9d166817473697efff0d138874e0f6a33d6d5aa6", "url": "https://insights.pyth.network/price-feeds/Equity.US.GOOGL%2FUSD" },
  "$HOOD": { "id": "0x306736a4035846ba15a3496eed57225b64cc19230a50d14f3ed20fd7219b7849", "url": "https://insights.pyth.network/price-feeds/Equity.US.HOOD%2FUSD" },
  "$IBM": { "id": "0xcfd44471407f4da89d469242546bb56f5c626d5bef9bd8b9327783065b43c3ef", "url": "https://insights.pyth.network/price-feeds/Equity.US.IBM%2FUSD" },
  "$ICE": { "id": "0xb2e33e4daa44d9b0c0783ededd335520a0f7eeed7608ff60c93c7c2294b2d813", "url": "https://insights.pyth.network/price-feeds/Equity.US.ICE%2FUSD" },
  "$INTC": { "id": "0xc1751e085ee292b8b3b9dd122a135614485a201c35dfc653553f0e28c1baf3ff", "url": "https://insights.pyth.network/price-feeds/Equity.US.INTC%2FUSD" },
  "$INTU": { "id": "0x43ef64ff6af44e0648f0328ee56e88fee57943b0aa077c24ef175bb9ecd37133", "url": "https://insights.pyth.network/price-feeds/Equity.US.INTU%2FUSD" },
  "$IWM": { "id": "0xeff690a187797aa225723345d4612abec0bf0cec1ae62347c0e7b1905d730879", "url": "https://insights.pyth.network/price-feeds/Equity.US.IWM%2FUSD" },
  "$JNJ": { "id": "0x12848738d5db3aef52f51d78d98fc8b8b8450ffb19fb3aeeb67d38f8c147ff63", "url": "https://insights.pyth.network/price-feeds/Equity.US.JNJ%2FUSD" },
  "$JPM": { "id": "0x7f4f157e57bfcccd934c566df536f34933e74338fe241a5425ce561acdab164e", "url": "https://insights.pyth.network/price-feeds/Equity.US.JPM%2FUSD" },
  "$KO": { "id": "0x9aa471dccea36b90703325225ac76189baf7e0cc286b8843de1de4f31f9caa7d", "url": "https://insights.pyth.network/price-feeds/Equity.US.KO%2FUSD" },
  "$LLY": { "id": "0x70dcf5fd56553d0023693e4b590336a8c9bcfd0d98dd9f093b1f697820d98325", "url": "https://insights.pyth.network/price-feeds/Equity.US.LLY%2FUSD" },
  "$LMT": { "id": "0x880d96a272d5ccbb3cd6f6aacb881a996cb4976b3f252b58c595cd2a418b6ea9", "url": "https://insights.pyth.network/price-feeds/Equity.US.LMT%2FUSD" },
  "$LRCX": { "id": "0x01a67883f58bd0f0e9cf8f52f21d7cf78c144d7e7ae32ce9256420834b33fb75", "url": "https://insights.pyth.network/price-feeds/Equity.US.LRCX%2FUSD" },
  "$LULU": { "id": "0x13a19eb6a936a8c7020fe675687979b44e991efbfb4d3d2ca91425ce57b9e6f8", "url": "https://insights.pyth.network/price-feeds/Equity.US.LULU%2FUSD" },
  "$LUV": { "id": "0xf8554a560dd9f59f36aff9ea5536d1c281141907ebc010b2fa94f411f912e30b", "url": "https://insights.pyth.network/price-feeds/Equity.US.LUV%2FUSD" },
  "$MA": { "id": "0x639db3fe6951d2465bd722768242e68eb0285f279cb4fa97f677ee8f80f1f1c0", "url": "https://insights.pyth.network/price-feeds/Equity.US.MA%2FUSD" },
  "$MARA": { "id": "0x0fc2ad77a9ab75bcbc3ebd7a9ff60facd08c517309e2d684baa979c910a0e43e", "url": "https://insights.pyth.network/price-feeds/Equity.US.MARA%2FUSD" },
  "$MCD": { "id": "0xd3178156b7c0f6ce10d6da7d347952a672467b51708baaf1a57ffe1fb005824a", "url": "https://insights.pyth.network/price-feeds/Equity.US.MCD%2FUSD" },
  "$MCO": { "id": "0x81ec776dd73898187779458dcd0c282a91322c7bd5fcb38b565f1b94bd8adff0", "url": "https://insights.pyth.network/price-feeds/Equity.US.MCO%2FUSD" },
  "$MDB": { "id": "0x91fc07facc1b1ec2e8336dfa66e2b5f0892af06f491c606f67690bf4c55aaee6", "url": "https://insights.pyth.network/price-feeds/Equity.US.MDB%2FUSD" },
  "$META": { "id": "0x78a3e3b8e676a8f73c439f5d749737034b139bbbe899ba5775216fba596607fe", "url": "https://insights.pyth.network/price-feeds/Equity.US.META%2FUSD" },
  "$MSFT": { "id": "0xd0ca23c1cc005e004ccf1db5bf76aeb6a49218f43dac3d4b275e92de12ded4d1", "url": "https://insights.pyth.network/price-feeds/Equity.US.MSFT%2FUSD" },
  "$MSTR": { "id": "0xe1e80251e5f5184f2195008382538e847fafc36f751896889dd3d1b1f6111f09", "url": "https://insights.pyth.network/price-feeds/Equity.US.MSTR%2FUSD" },
  "$MU": { "id": "0x152244dc24665ca7dd3f257b8f442dc449b6346f48235b7b229268cb770dda2d", "url": "https://insights.pyth.network/price-feeds/Equity.US.MU%2FUSD" },
  "$NEM": { "id": "0x29caf4d900d3080e56306ac41a9856735b89cb4df6813dd7b83e9eb96c04700d", "url": "https://insights.pyth.network/price-feeds/Equity.US.NEM%2FUSD" },
  "$NFLX": { "id": "0x8376cfd7ca8bcdf372ced05307b24dced1f15b1afafdeff715664598f15a3dd2", "url": "https://insights.pyth.network/price-feeds/Equity.US.NFLX%2FUSD" },
  "$NKE": { "id": "0x67649450b4ca4bfff97cbaf96d2fd9e40f6db148cb65999140154415e4378e14", "url": "https://insights.pyth.network/price-feeds/Equity.US.NKE%2FUSD" },
  "$NOW": { "id": "0x69d2eebcc3c62889f1c0105ff347f296eb435cba8d2e4705a486fd47a8fe1a1b", "url": "https://insights.pyth.network/price-feeds/Equity.US.NOW%2FUSD" },
  "$NVDA": { "id": "0xb1073854ed24cbc755dc527418f52b7d271f6cc967bbf8d8129112b18860a593", "url": "https://insights.pyth.network/price-feeds/Equity.US.NVDA%2FUSD" },
  "$OPEN": { "id": "0xb4ef19d348a726dad5a655bcac5fe6e09c83af142bf1006b45d0f9ca4d5a46b5", "url": "https://insights.pyth.network/price-feeds/Equity.US.OPEN%2FUSD" },
  "$ORCL": { "id": "0xe47ff732eaeb6b4163902bdee61572659ddf326511917b1423bae93fcdf3153c", "url": "https://insights.pyth.network/price-feeds/Equity.US.ORCL%2FUSD" },
  "$OXY": { "id": "0x54ba7b095dfa286f556cd41d4bfefe956ebd4df3d9eec8fe0188d0727f07e344", "url": "https://insights.pyth.network/price-feeds/Equity.US.OXY%2FUSD" },
  "$PFE": { "id": "0x0704ad7547b3dfee329266ee53276349d48e4587cb08264a2818288f356efd1d", "url": "https://insights.pyth.network/price-feeds/Equity.US.PFE%2FUSD" },
  "$PLTR": { "id": "0x11a70634863ddffb71f2b11f2cff29f73f3db8f6d0b78c49f2b5f4ad36e885f0", "url": "https://insights.pyth.network/price-feeds/Equity.US.PLTR%2FUSD" },
  "$PYPL": { "id": "0x773c3b11f6be58e8151966a9f5832696d8cd08884ccc43ac8965a7ebea911533", "url": "https://insights.pyth.network/price-feeds/Equity.US.PYPL%2FUSD" },
  "$QCOM": { "id": "0x54350ebf587c3f14857efcfec50e5c4f6e10220770c2266e9fe85bd5e42e4022", "url": "https://insights.pyth.network/price-feeds/Equity.US.QCOM%2FUSD" },
  "$QQQ": { "id": "0x9695e2b96ea7b3859da9ed25b7a46a920a776e2fdae19a7bcfdf2b219230452d", "url": "https://insights.pyth.network/price-feeds/Equity.US.QQQ%2FUSD" },
  "$REGN": { "id": "0x2a45d16204f3588259fddf5a81a1129efab873571a4cef38641e16bfeac364ef", "url": "https://insights.pyth.network/price-feeds/Equity.US.REGN%2FUSD" },
  "$RIOT": { "id": "0x46417522a59b245c5af35c33c13426d991b36514c4c85aaefe1cf787e7daad90", "url": "https://insights.pyth.network/price-feeds/Equity.US.RIOT%2FUSD" },
  "$SBUX": { "id": "0x86cd9abb315081b136afc72829058cf3aaf1100d4650acb2edb6a8e39f03ef75", "url": "https://insights.pyth.network/price-feeds/Equity.US.SBUX%2FUSD" },
  "$SCHW": { "id": "0xd437b2f1470d5f007f18a5565eaab1ed182d97204d80b7dd3dac29839f61c9e6", "url": "https://insights.pyth.network/price-feeds/Equity.US.SCHW%2FUSD" },
  "$SLV": { "id": "0x6fc08c9963d266069cbd9780d98383dabf2668322a5bef0b9491e11d67e5d7e7", "url": "https://insights.pyth.network/price-feeds/Equity.US.SLV%2FUSD" },
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
  "mert": { role: "Helius Founder" }
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
  const tweetText = textElement.textContent.toUpperCase();

  const cashtagRegex = /\$[A-Z0-9]+(?:\.[A-Z0-9]+)*(?=\b|[\s.,!?;:'"()[\]{}<>])/g;
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

  const container = document.createElement('div');
  container.className = 'pyth-price-overlay';
  container.style.marginBottom = '6px';
  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.gap = '8px';                    // Uniform gap (horizontal & vertical)
  container.style.alignItems = 'center';
  container.style.fontSize = '13px';
  container.style.fontWeight = '400';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif';

  const isSingleCashtag = orderedTags.length === 1;

  orderedTags.forEach((tag) => {
    const asset = tag.slice(1);
    const { price, conf } = results[tag];
    let formattedPrice = formatPrice(price);

    if (formattedPrice !== 'N/A' && typeof price === 'number' && price >= 1000) {
      formattedPrice = Number(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    const pill = document.createElement('a');
    pill.href = assetInfo[tag].url;
    pill.target = '_blank';
    pill.rel = 'noopener noreferrer';
    pill.style.textDecoration = 'none';

    const isEquity = assetInfo[tag].url.includes('Equity.US');
    const bgColor = isEquity ? '#0D47A1' : '#311B5E';
    const hoverColor = isEquity ? '#1565C0' : '#4B2E83';

    pill.style.backgroundColor = bgColor;
    pill.style.color = 'white';
    pill.style.padding = '3px 12px';
    pill.style.borderRadius = '999px';
    pill.style.fontWeight = '400';
    pill.style.transition = 'background-color 0.2s ease';
    pill.style.lineHeight = '1.3';
    pill.style.whiteSpace = 'nowrap'; // Prevents text wrapping inside pill

    if (formattedPrice !== 'N/A') {
  const formattedConf = formatConf(conf);

  if (isSingleCashtag) {
    // Single cashtag: show confidence inline
    pill.textContent = `${asset}: $${formattedPrice} (Confidence: ±${formattedConf})`;
  } else {
    // Multiple cashtags: show price only, confidence on hover
    pill.textContent = `${asset}: $${formattedPrice}`;
    pill.title = `Confidence: ±${formattedConf}`;
  }
} else {
  // Price unavailable
  pill.textContent = `${asset}: $${formattedPrice}`;
}
    pill.addEventListener('mouseover', () => {
      pill.style.backgroundColor = hoverColor;
    });
    pill.addEventListener('mouseout', () => {
      pill.style.backgroundColor = bgColor;
    });

    container.appendChild(pill);
  });

      // "Powered by Pyth" — pill shape, darker solid grey background, text color fade animation
  const poweredPill = document.createElement('a');
  poweredPill.href = 'https://www.pyth.network/';
  poweredPill.target = '_blank';
  poweredPill.rel = 'noopener noreferrer';
  poweredPill.style.textDecoration = 'none';
  poweredPill.style.display = 'inline-block';
  poweredPill.style.backgroundColor = '#222222';   // Slightly darker solid grey
  poweredPill.style.padding = '3px 12px';
  poweredPill.style.borderRadius = '999px';
  poweredPill.style.fontSize = '13px';
  poweredPill.style.fontWeight = '400';
  poweredPill.style.lineHeight = '1.3';

  const poweredText = document.createElement('span');
poweredText.textContent = 'Powered by Pyth';
poweredText.className = 'pyth-powered-text';  // Apply the animation via class

  poweredPill.appendChild(poweredText);
  container.appendChild(poweredPill);

  // Add keyframes once (smooth, continuous color fade cycle)
if (!document.getElementById('pyth-color-fade-style')) {
  const style = document.createElement('style');
  style.id = 'pyth-color-fade-style';
  style.textContent = `
    @keyframes colorFade {
      0%   { color: #FFFFFF; }
      20%  { color: #E0E0E0; }
      40%  { color: #B8B8B8; }
      50%  { color: #A0A0A0; } /* Peak at mid-gray (Quicksilver-like) */
      60%  { color: #B8B8B8; }
      80%  { color: #E0E0E0; }
      100% { color: #FFFFFF; }
    }
    
    .pyth-powered-text {
      animation: colorFade 4s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
}

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
