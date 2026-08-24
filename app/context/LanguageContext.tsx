"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Language = "en" | "am";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations.en) => string;
};

const translations = {
  en: {
    auctions: "Auctions",
    howItWorks: "How It Works",
    results: "Results",
    about: "About",

    login: "Log in",
    startBidding: "Start Bidding",

    liveNow: "LIVE NOW",
    auctionsWorthWatching: "Auctions worth watching.",
    viewAllAuctions: "View all auctions",

    exploreAuctions: "Explore Auctions",
    aNewWayToWin: "A NEW WAY TO WIN",
    bidSmart: "Bid smart.",
    winMore: "Win more.",

    heroDescription:
      "Mella brings a fresh, transparent auction experience to Ethiopia. Discover exceptional products, place your bids, and let the smartest strategy win.",

    transparent: "TRANSPARENT",
    localPayments: "LOCAL PAYMENTS",
    auctions247: "AUCTIONS",

    howMellaWorks: "HOW MELLA WORKS",
    simpleEnough:
      "Simple enough to understand. Exciting enough to remember.",

    chooseAuction: "Choose an auction",
    getYourBids: "Get your bids",
    placeYourStrategy: "Place your strategy",
    seeTheResult: "See the result",

    browseProducts:
      "Browse cars, electronics, appliances and special drops.",

    choosePackage:
      "Choose a bid package and use your credits to participate.",

    submitBids:
      "Submit your bids before the countdown reaches zero.",

    winningLogic:
      "When the auction closes, the winning logic and result are published.",

    endsIn: "ENDS IN",
    participants: "PARTICIPANTS",
    enterYourBid: "ENTER YOUR BID",
    submitBid: "Submit Bid",
    entryFrom: "Entry from",

    builtForFairPlay: "Built for fair play.",
    trustFirst: "Trust first.",
    newKindOfAuction: "A new kind of auction.",

    securePayments: "SECURE PAYMENTS",

    terms: "Terms",
    privacy: "Privacy",

    footerDescription: "A new way to bid in Ethiopia.",
    allRightsReserved: "All rights reserved.",

    fairPlayTitle:
  "Built for fair play.",

fairPlayDescription:
  "Mella will make the winning process clear, verifiable and easy to understand.",

trustFirstTitle:
  "Trust first.",

trustFirstDescription:
  "Clear auction rules, visible results and a payment experience designed for Ethiopia.",

newAuctionTitle:
  "A new kind of auction.",

newAuctionDescription:
  "Not a traditional highest-bid-wins marketplace. Mella is built around strategy.",

howMellaDescription:
  "We designed Mella around one principle: you should always understand what is happening with your bid.",

chooseAuctionDescription:
  "Browse cars, electronics, appliances and special drops.",


getYourBidsDescription:
  "Choose a bid package and use your credits to participate.",

placeYourStrategyDescription:
  "Submit your bids before the countdown reaches zero.",


seeTheResultDescription:
  "When the auction closes, the winning logic and result are published.",
  },

  am: {
    auctions: "ጨረታዎች",
    howItWorks: "እንዴት ይሰራል",
    results: "ውጤቶች",
    about: "ስለ እኛ",

    login: "ግባ",
    startBidding: "መጫረቻ ይጀምሩ",

    liveNow: "አሁን በቀጥታ",
    auctionsWorthWatching: "ሊከታተሏቸው የሚገቡ ጨረታዎች።",
    viewAllAuctions: "ሁሉንም ጨረታዎች ይመልከቱ",

    exploreAuctions: "ጨረታዎችን ይመልከቱ",
    aNewWayToWin: "ለማሸነፍ አዲስ መንገድ",
    bidSmart: "በብልሃት ይጫረቱ።",
    winMore: "የበለጠ ያሸንፉ።",

    heroDescription:
      "Mella በኢትዮጵያ አዲስና ግልጽ የጨረታ ልምድን ያመጣል። ልዩ ምርቶችን ያግኙ፣ መጫረቻዎን ያስገቡ እና ብልህ ስትራቴጂዎ እንዲያሸንፍ ያድርጉ።",

    transparent: "ሙሉ ግልጽነት",
    localPayments: "የአካባቢ ክፍያዎች",
    auctions247: "ጨረታዎች",

    howMellaWorks: "MELLA እንዴት ይሰራል",
    simpleEnough:
      "ለመረዳት ቀላል። ለማስታወስ የሚያስደስት።",

    chooseAuction: "ጨረታ ይምረጡ",
    getYourBids: "መጫረቻዎን ያግኙ",
    placeYourStrategy: "ስትራቴጂዎን ይተግብሩ",
    seeTheResult: "ውጤቱን ይመልከቱ",

    browseProducts:
      "መኪናዎችን፣ ኤሌክትሮኒክስን፣ የቤት እቃዎችን እና ልዩ ምርቶችን ይመልከቱ።",

    choosePackage:
      "የመጫረቻ ፓኬጅ ይምረጡ እና ክሬዲቶችዎን በመጠቀም ይሳተፉ።",

    submitBids:
      "ቆጣሪው ወደ ዜሮ ከመድረሱ በፊት መጫረቻዎን ያስገቡ።",

    winningLogic:
      "ጨረታው ሲያበቃ የአሸናፊው መለያ ዘዴና ውጤቱ ይገለጻል።",

    endsIn: "የሚያበቃበት ጊዜ",
    participants: "ተሳታፊዎች",
    enterYourBid: "መጫረቻዎን ያስገቡ",
    submitBid: "መጫረቻ ያስገቡ",
    entryFrom: "መግቢያ ከ",

    builtForFairPlay: "ለፍትሃዊ ጨዋታ የተገነባ።",
    trustFirst: "እምነት በመጀመሪያ።",
    newKindOfAuction: "አዲስ ዓይነት ጨረታ።",

    securePayments: "አስተማማኝ ክፍያዎች",

    terms: "ደንቦች",
    privacy: "የግላዊነት መመሪያ",

    footerDescription: "በኢትዮጵያ ለመጫረት አዲስ መንገድ።",
    allRightsReserved: "መብቱ በሙሉ የተጠበቀ ነው።",

    fairPlayTitle:
  "ለፍትሃዊ ጨዋታ የተገነባ።",

fairPlayDescription:
  "ሜላ የአሸናፊውን አመራረጥ ሂደት ግልጽ፣ ሊረጋገጥ የሚችል እና ለመረዳት ቀላል ያደርገዋል።",

trustFirstTitle:
  "እምነት በመጀመሪያ።",

trustFirstDescription:
  "ግልጽ የጨረታ ደንቦች፣ ይፋ የሆኑ ውጤቶች እና ለኢትዮጵያ የተዘጋጀ የክፍያ ልምድ።",

newAuctionTitle:
  "አዲስ ዓይነት ጨረታ።",

newAuctionDescription:
  "ባህላዊው ከፍተኛ ጨረታ የሚያሸንፍበት የገበያ ስርዓት አይደለም። ሜላ በስትራቴጂ ላይ የተመሰረተ ነው።",

howMellaDescription:
  "ሜላን የነደፍነው በአንድ መርህ ላይ በመመስረት ነው፤ በጨረታዎ ላይ ምን እየተፈጠረ እንዳለ ሁልጊዜ መረዳት አለብዎት።",

chooseAuctionDescription:
  "መኪናዎችን፣ ኤሌክትሮኒክስን፣ የቤት እቃዎችን እና ልዩ ምርቶችን ይመልከቱ።",


getYourBidsDescription:
  "የጨረታ ፓኬጅ ይምረጡና የጨረታ ክሬዲቶችዎን በመጠቀም ይሳተፉ።",

placeYourStrategyDescription:
  "የጨረታው ጊዜ ከማለቁ በፊት ጨረታዎን ያስገቡ።",


seeTheResultDescription:
  "ጨረታው ሲዘጋ የአሸናፊው አመራረጥ ሂደት እና ውጤቱ ይፋ ይደረጋል።",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem(
      "mella-language"
    ) as Language | null;

    if (savedLanguage === "en" || savedLanguage === "am") {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("mella-language", newLanguage);
  };

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key];
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}