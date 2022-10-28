const APP_NAME = 'Sukuma Market Place';
const SEPARATOR = ' | ';
const APP_SEP = APP_NAME + SEPARATOR;

// const CONTRACT = "supercode.testnet"
const CONTRACT = "livedev.testnet"

const CONTRACT_TOKEN_VIEW_METHODS = [
  "get_account_token_offers",
  "get_buy_token_offers",
  "get_token_offer",
  "get_sell_token_offers",
  "update_token_offer_status",
  "get_token",
  "get_buy_token_offers_by_token",
  "get_sell_token_offers_by_token",
  "get_tokens"
]

const CONTRACT_VIEW_METHODS = [
  "pub_get_account",
  "get_account_offers",
  "get_buy_offers",
  "get_sell_offers",
  "get_offer",
  "pub_get_offer",
  "get_account_transfers",
  "get_currencies",
  "get_payments"].concat(CONTRACT_TOKEN_VIEW_METHODS);

const CONTRACT_TOKEN_CHANGE_METHODS = [
  "add_token_offer",
  "add_token_buy_chat",
  "add_token_sell_chat",
  "get_token_chat",
  "pub_get_token_chat",
  "mark_token_as_paid",
  "mark_token_as_received",
  "remove_token_chat",
  "get_token_account_chats",
  "clear_token_chats",
  "cancel_token_chat",
  "release_tokens",
  "receiver_token_rate_chat",
  "payer_token_rate_chat",
  "add_token"
]

const CONTRACT_CHANGE_METHODS = [
  "register_new_account",
  "contract_deposit",
  "contract_withdraw",
  "contract_withdraw_near",
  "get_account_balance_as_string",
  "add_offer",
  "add_sell_chat",
  "add_buy_chat",
  "get_account_chats",
  "get_chat",
  "cancel_chat",
  "receiver_rate_chat",
  "payer_rate_chat",
  "release_near",
  "mark_as_paid",
  "mark_as_received",
  "get_trades_by_account",
  "add_payment_method",
  "add_currency",
  "withdraw_near"].concat(CONTRACT_TOKEN_CHANGE_METHODS);


const WHITELISTEDTOKENS = ['usdn.testnet', 'usdt.testnet', 'wrap.testnet', 'dai.fakes.testnet']
const WHITELISTEDTOKENS_ = [
  {
    name: 'USN',
    symbol: 'USN',
    decimals: 18,
    address: "usdn.testnet",
  },
  {
    name: 'USDT',
    symbol: 'USDT',
    decimals: 6,
    address: "usdt.testnet",
  },
  {
    name: 'WRAPPED NEAR',
    symbol: 'WRAPPED NEAR',
    decimals: 24,
    address: "wrap.testnet",
  },
  {
    name: 'DAI',
    symbol: 'DAI',
    decimals: 18,
    address: "dai.fakes.testnet",
  }
]

const TOKEN_DETAILS = {
  'usdn.testnet': {
    name: 'USN',
    symbol: 'USN',
    decimals: 18,
    address: "usdn.testnet",
  },
  'usdt.testnet': {
    name: 'USDT',
    symbol: 'USDT',
    decimals: 6,
    address: "usdt.testnet",
  },
  'wrap.testnet': {
    name: 'WRAPPED NEAR',
    symbol: 'WRAPPED NEAR',
    decimals: 24,
    address: "wrap.testnet",
  },
  'dai.fakes.testnet': {
    name: 'DAI',
    symbol: 'DAI',
    decimals: 18,
    address: "dai.fakes.testnet",
  }
}

const PAYMENT_OPTIONS = [
  {
    name: 'M-Pesa',
    img_url: ""
  },
  {
    name: 'Bank',
    img_url: ""
  },
  {
    name: 'Paypal',
    img_url: ""
  },
  {
    name: 'Crpto',
    img_url: ""
  },
  {
    name: 'WireTransfer',
    img_url: ""
  },
  {
    name: 'Other',
    img_url: ""
  }
]

const NETWORKS = [
  {
    name: 'Near',
    network_id: 'near',
    icon: "https://assets.coingecko.com/coins/images/10365/small/near_icon.png?1601359077",
    active: true,
  },
  {
    name: "Ethereum",
    network_id: "eth",
    icon: "data:image/png;base64,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",
    active: false,
  },
  {
    name: "Polygon",
    network_id: "polygon",
    icon: "https://app.uniswap.org/static/media/polygon-matic-logo.97ff139c.svg",
    active: false,
  },
  {
    name: "Optimism",
    network_id: "optimism",
    icon: "https://app.uniswap.org/static/media/optimistic_ethereum.34412af2.svg",
    active: false
  },
  {
    name: "Arbitrum",
    network_id: "arbitrum",
    icon: "https://app.uniswap.org/static/media/arbitrum_logo.ec8e5080.svg",
    active: false
  },
  {
    name: "Celo",
    network_id: "celo",
    icon: "https://app.uniswap.org/static/media/celo_logo.faaa57f7.svg",
    active: false
  }

]

const NEAR_OBJECT = { name: 'Near', symbol: 'NEAR', address: 'near', icon: "https://assets.coingecko.com/coins/images/10365/small/near_icon.png?1601359077", decimals: 24 }

const SELECT_NEAR_OBJECT = { value: 'near', label: 'Near', symbol: 'NEAR', address: '', icon: "https://assets.coingecko.com/coins/images/10365/small/near_icon.png?1601359077" }


const CONNECTION_TIMEOUT = 5000

const CURRENCIES = [
  {
      "name": "United Arab Emirates Dirham",
      "symbol": "AED"
  },
  {
      "name": "Afghan Afghani",
      "symbol": "AFN"
  },
  {
      "name": "Albanian Lek",
      "symbol": "ALL"
  },
  {
      "name": "Armenian Dram",
      "symbol": "AMD"
  },
  {
      "name": "Netherlands Antillean Guilder",
      "symbol": "ANG"
  },
  {
      "name": "Angolan Kwanza",
      "symbol": "AOA"
  },
  {
      "name": "Argentine Peso",
      "symbol": "ARS"
  },
  {
      "name": "Australian Dollar",
      "symbol": "AUD"
  },
  {
      "name": "Aruban Florin",
      "symbol": "AWG"
  },
  {
      "name": "Azerbaijani Manat",
      "symbol": "AZN"
  },
  {
      "name": "Bosnia-Herzegovina Convertible Mark",
      "symbol": "BAM"
  },
  {
      "name": "Barbadian Dollar",
      "symbol": "BBD"
  },
  {
      "name": "Bangladeshi Taka",
      "symbol": "BDT"
  },
  {
      "name": "Bulgarian Lev",
      "symbol": "BGN"
  },
  {
      "name": "Bahraini Dinar",
      "symbol": "BHD"
  },
  {
      "name": "Burundian Franc",
      "symbol": "BIF"
  },
  {
      "name": "Bermudan Dollar",
      "symbol": "BMD"
  },
  {
      "name": "Brunei Dollar",
      "symbol": "BND"
  },
  {
      "name": "Bolivian Boliviano",
      "symbol": "BOB"
  },
  {
      "name": "Brazilian Real",
      "symbol": "BRL"
  },
  {
      "name": "Bahamian Dollar",
      "symbol": "BSD"
  },
  {
      "name": "Bitcoin",
      "symbol": "BTC"
  },
  {
      "name": "Bhutanese Ngultrum",
      "symbol": "BTN"
  },
  {
      "name": "Botswanan Pula",
      "symbol": "BWP"
  },
  {
      "name": "New Belarusian Ruble",
      "symbol": "BYN"
  },
  {
      "name": "Belarusian Ruble",
      "symbol": "BYR"
  },
  {
      "name": "Belize Dollar",
      "symbol": "BZD"
  },
  {
      "name": "Canadian Dollar",
      "symbol": "CAD"
  },
  {
      "name": "Congolese Franc",
      "symbol": "CDF"
  },
  {
      "name": "Swiss Franc",
      "symbol": "CHF"
  },
  {
      "name": "Chilean Unit of Account (UF)",
      "symbol": "CLF"
  },
  {
      "name": "Chilean Peso",
      "symbol": "CLP"
  },
  {
      "name": "Chinese Yuan",
      "symbol": "CNY"
  },
  {
      "name": "Colombian Peso",
      "symbol": "COP"
  },
  {
      "name": "Costa Rican Colón",
      "symbol": "CRC"
  },
  {
      "name": "Cuban Convertible Peso",
      "symbol": "CUC"
  },
  {
      "name": "Cuban Peso",
      "symbol": "CUP"
  },
  {
      "name": "Cape Verdean Escudo",
      "symbol": "CVE"
  },
  {
      "name": "Czech Republic Koruna",
      "symbol": "CZK"
  },
  {
      "name": "Djiboutian Franc",
      "symbol": "DJF"
  },
  {
      "name": "Danish Krone",
      "symbol": "DKK"
  },
  {
      "name": "Dominican Peso",
      "symbol": "DOP"
  },
  {
      "name": "Algerian Dinar",
      "symbol": "DZD"
  },
  {
      "name": "Egyptian Pound",
      "symbol": "EGP"
  },
  {
      "name": "Eritrean Nakfa",
      "symbol": "ERN"
  },
  {
      "name": "Ethiopian Birr",
      "symbol": "ETB"
  },
  {
      "name": "Euro",
      "symbol": "EUR"
  },
  {
      "name": "Fijian Dollar",
      "symbol": "FJD"
  },
  {
      "name": "Falkland Islands Pound",
      "symbol": "FKP"
  },
  {
      "name": "British Pound Sterling",
      "symbol": "GBP"
  },
  {
      "name": "Georgian Lari",
      "symbol": "GEL"
  },
  {
      "name": "Guernsey Pound",
      "symbol": "GGP"
  },
  {
      "name": "Ghanaian Cedi",
      "symbol": "GHS"
  },
  {
      "name": "Gibraltar Pound",
      "symbol": "GIP"
  },
  {
      "name": "Gambian Dalasi",
      "symbol": "GMD"
  },
  {
      "name": "Guinean Franc",
      "symbol": "GNF"
  },
  {
      "name": "Guatemalan Quetzal",
      "symbol": "GTQ"
  },
  {
      "name": "Guyanaese Dollar",
      "symbol": "GYD"
  },
  {
      "name": "Hong Kong Dollar",
      "symbol": "HKD"
  },
  {
      "name": "Honduran Lempira",
      "symbol": "HNL"
  },
  {
      "name": "Croatian Kuna",
      "symbol": "HRK"
  },
  {
      "name": "Haitian Gourde",
      "symbol": "HTG"
  },
  {
      "name": "Hungarian Forint",
      "symbol": "HUF"
  },
  {
      "name": "Indonesian Rupiah",
      "symbol": "IDR"
  },
  {
      "name": "Israeli New Sheqel",
      "symbol": "ILS"
  },
  {
      "name": "Manx pound",
      "symbol": "IMP"
  },
  {
      "name": "Indian Rupee",
      "symbol": "INR"
  },
  {
      "name": "Iraqi Dinar",
      "symbol": "IQD"
  },
  {
      "name": "Iranian Rial",
      "symbol": "IRR"
  },
  {
      "name": "Icelandic Króna",
      "symbol": "ISK"
  },
  {
      "name": "Jersey Pound",
      "symbol": "JEP"
  },
  {
      "name": "Jamaican Dollar",
      "symbol": "JMD"
  },
  {
      "name": "Jordanian Dinar",
      "symbol": "JOD"
  },
  {
      "name": "Japanese Yen",
      "symbol": "JPY"
  },
  {
      "name": "Kenyan Shilling",
      "symbol": "KES"
  },
  {
      "name": "Kyrgystani Som",
      "symbol": "KGS"
  },
  {
      "name": "Cambodian Riel",
      "symbol": "KHR"
  },
  {
      "name": "Comorian Franc",
      "symbol": "KMF"
  },
  {
      "name": "North Korean Won",
      "symbol": "KPW"
  },
  {
      "name": "South Korean Won",
      "symbol": "KRW"
  },
  {
      "name": "Kuwaiti Dinar",
      "symbol": "KWD"
  },
  {
      "name": "Cayman Islands Dollar",
      "symbol": "KYD"
  },
  {
      "name": "Kazakhstani Tenge",
      "symbol": "KZT"
  },
  {
      "name": "Laotian Kip",
      "symbol": "LAK"
  },
  {
      "name": "Lebanese Pound",
      "symbol": "LBP"
  },
  {
      "name": "Sri Lankan Rupee",
      "symbol": "LKR"
  },
  {
      "name": "Liberian Dollar",
      "symbol": "LRD"
  },
  {
      "name": "Lesotho Loti",
      "symbol": "LSL"
  },
  {
      "name": "Lithuanian Litas",
      "symbol": "LTL"
  },
  {
      "name": "Latvian Lats",
      "symbol": "LVL"
  },
  {
      "name": "Libyan Dinar",
      "symbol": "LYD"
  },
  {
      "name": "Moroccan Dirham",
      "symbol": "MAD"
  },
  {
      "name": "Moldovan Leu",
      "symbol": "MDL"
  },
  {
      "name": "Malagasy Ariary",
      "symbol": "MGA"
  },
  {
      "name": "Macedonian Denar",
      "symbol": "MKD"
  },
  {
      "name": "Myanma Kyat",
      "symbol": "MMK"
  },
  {
      "name": "Mongolian Tugrik",
      "symbol": "MNT"
  },
  {
      "name": "Macanese Pataca",
      "symbol": "MOP"
  },
  {
      "name": "Mauritanian Ouguiya",
      "symbol": "MRO"
  },
  {
      "name": "Mauritian Rupee",
      "symbol": "MUR"
  },
  {
      "name": "Maldivian Rufiyaa",
      "symbol": "MVR"
  },
  {
      "name": "Malawian Kwacha",
      "symbol": "MWK"
  },
  {
      "name": "Mexican Peso",
      "symbol": "MXN"
  },
  {
      "name": "Malaysian Ringgit",
      "symbol": "MYR"
  },
  {
      "name": "Mozambican Metical",
      "symbol": "MZN"
  },
  {
      "name": "Namibian Dollar",
      "symbol": "NAD"
  },
  {
      "name": "Nigerian Naira",
      "symbol": "NGN"
  },
  {
      "name": "Nicaraguan Córdoba",
      "symbol": "NIO"
  },
  {
      "name": "Norwegian Krone",
      "symbol": "NOK"
  },
  {
      "name": "Nepalese Rupee",
      "symbol": "NPR"
  },
  {
      "name": "New Zealand Dollar",
      "symbol": "NZD"
  },
  {
      "name": "Omani Rial",
      "symbol": "OMR"
  },
  {
      "name": "Panamanian Balboa",
      "symbol": "PAB"
  },
  {
      "name": "Peruvian Nuevo Sol",
      "symbol": "PEN"
  },
  {
      "name": "Papua New Guinean Kina",
      "symbol": "PGK"
  },
  {
      "name": "Philippine Peso",
      "symbol": "PHP"
  },
  {
      "name": "Pakistani Rupee",
      "symbol": "PKR"
  },
  {
      "name": "Polish Zloty",
      "symbol": "PLN"
  },
  {
      "name": "Paraguayan Guarani",
      "symbol": "PYG"
  },
  {
      "name": "Qatari Rial",
      "symbol": "QAR"
  },
  {
      "name": "Romanian Leu",
      "symbol": "RON"
  },
  {
      "name": "Serbian Dinar",
      "symbol": "RSD"
  },
  {
      "name": "Russian Ruble",
      "symbol": "RUB"
  },
  {
      "name": "Rwandan Franc",
      "symbol": "RWF"
  },
  {
      "name": "Saudi Riyal",
      "symbol": "SAR"
  },
  {
      "name": "Solomon Islands Dollar",
      "symbol": "SBD"
  },
  {
      "name": "Seychellois Rupee",
      "symbol": "SCR"
  },
  {
      "name": "Sudanese Pound",
      "symbol": "SDG"
  },
  {
      "name": "Swedish Krona",
      "symbol": "SEK"
  },
  {
      "name": "Singapore Dollar",
      "symbol": "SGD"
  },
  {
      "name": "Saint Helena Pound",
      "symbol": "SHP"
  },
  {
      "name": "Sierra Leonean Leone",
      "symbol": "SLL"
  },
  {
      "name": "Somali Shilling",
      "symbol": "SOS"
  },
  {
      "name": "Surinamese Dollar",
      "symbol": "SRD"
  },
  {
      "name": "São Tomé and Príncipe Dobra",
      "symbol": "STD"
  },
  {
      "name": "Salvadoran Colón",
      "symbol": "SVC"
  },
  {
      "name": "Syrian Pound",
      "symbol": "SYP"
  },
  {
      "name": "Swazi Lilangeni",
      "symbol": "SZL"
  },
  {
      "name": "Thai Baht",
      "symbol": "THB"
  },
  {
      "name": "Tajikistani Somoni",
      "symbol": "TJS"
  },
  {
      "name": "Turkmenistani Manat",
      "symbol": "TMT"
  },
  {
      "name": "Tunisian Dinar",
      "symbol": "TND"
  },
  {
      "name": "Tongan Paʻanga",
      "symbol": "TOP"
  },
  {
      "name": "Turkish Lira",
      "symbol": "TRY"
  },
  {
      "name": "Trinidad and Tobago Dollar",
      "symbol": "TTD"
  },
  {
      "name": "New Taiwan Dollar",
      "symbol": "TWD"
  },
  {
      "name": "Tanzanian Shilling",
      "symbol": "TZS"
  },
  {
      "name": "Ukrainian Hryvnia",
      "symbol": "UAH"
  },
  {
      "name": "Ugandan Shilling",
      "symbol": "UGX"
  },
  {
      "name": "United States Dollar",
      "symbol": "USD"
  },
  {
      "name": "Uruguayan Peso",
      "symbol": "UYU"
  },
  {
      "name": "Uzbekistan Som",
      "symbol": "UZS"
  },
  {
      "name": "Venezuelan Bolívar Fuerte",
      "symbol": "VEF"
  },
  {
      "name": "Vietnamese Dong",
      "symbol": "VND"
  },
  {
      "name": "Vanuatu Vatu",
      "symbol": "VUV"
  },
  {
      "name": "Samoan Tala",
      "symbol": "WST"
  },
  {
      "name": "CFA Franc BEAC",
      "symbol": "XAF"
  },
  {
      "name": "Silver (troy ounce)",
      "symbol": "XAG"
  },
  {
      "name": "Gold (troy ounce)",
      "symbol": "XAU"
  },
  {
      "name": "East Caribbean Dollar",
      "symbol": "XCD"
  },
  {
      "name": "Special Drawing Rights",
      "symbol": "XDR"
  },
  {
      "name": "CFA Franc BCEAO",
      "symbol": "XOF"
  },
  {
      "name": "CFP Franc",
      "symbol": "XPF"
  },
  {
      "name": "Yemeni Rial",
      "symbol": "YER"
  },
  {
      "name": "South African Rand",
      "symbol": "ZAR"
  },
  {
      "name": "Zambian Kwacha (pre-2013)",
      "symbol": "ZMK"
  },
  {
      "name": "Zambian Kwacha",
      "symbol": "ZMW"
  },
  {
      "name": "Zimbabwean Dollar",
      "symbol": "ZWL"
  }
]

const PAYMENT_METHODS = [
    {
        name: "M-Pesa",
        symbol: "M-Pesa",
        icon: ""
    }
]

export {
  APP_NAME,
  SEPARATOR,
  APP_SEP,
  CONTRACT,
  CONTRACT_VIEW_METHODS,
  CONTRACT_CHANGE_METHODS,
  WHITELISTEDTOKENS,
  WHITELISTEDTOKENS_,
  TOKEN_DETAILS,
  PAYMENT_OPTIONS,
  NETWORKS,
  NEAR_OBJECT,
  SELECT_NEAR_OBJECT,
  CONNECTION_TIMEOUT,
  CURRENCIES
}