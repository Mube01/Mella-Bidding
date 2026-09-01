"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Language = "en" | "am";

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
    seeTheResult: "See the result",

    browseProducts:
      "Browse vehicles, electronics, appliances and special drops.",

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
    entryFrom: "Service Fee",

    builtForFairPlay: "Built for fair play.",
    trustFirst: "Trust first.",
    newKindOfAuction: "A new kind of auction.",

    securePayments: "SECURE PAYMENTS",

    terms: "Terms",
    privacy: "Privacy",

    footerDescription: "A new way to bid",
    allRightsReserved: "All rights reserved.",

    fairPlayTitle: "Built for fair play.",

    fairPlayDescription:
      "Mella will make the winning process clear, verifiable and easy to understand.",

    trustFirstTitle: "Trust first.",

    trustFirstDescription:
      "Clear auction rules, visible results and a payment experience designed for Ethiopia.",

    newAuctionTitle: "A new kind of auction.",

    newAuctionDescription:
      "Not a traditional highest-bid-wins marketplace. Mella is built around strategy.",

    howMellaDescription:
      "We designed Mella around one principle: you should always understand what is happening with your bid.",

    chooseAuctionDescription:
      "Browse vehicles, electronics, appliances and special drops.",

    getYourBidsDescription:
      "Choose a bid package and use your credits to participate.",

    seeTheResultDescription:
      "When the auction closes, the winning logic and result are published.",

    footerTagline:
      "A new way to bid",

    copyright:
      "© 2026 Mella. All rights reserved.",

    liveAuctions: "LIVE AUCTIONS",

    findYourNextWin: "Find your next win.",

    auctionsPageDescription:
      "Explore live Mella auctions and discover vehicles, electronics, appliances and other exceptional products.",

    all: "All",

    electronics: "Electronics",

    automotive: "Vehicle",

    home: "Home",

    searchAuctions: "Search auctions...",

    filters: "Filters",

    auctionsAvailable: "auctions available",

    endingSoon: "ENDING SOON",

    noAuctionsFound: "No auctions found",

    tryAnotherSearch:
      "Try a different search or category to find an auction.",

    clearFilters: "Clear filters",

    mysteryBox: "Mystery Box",

    /* FEATURED AUCTION */

    liveAuction: "LIVE AUCTION",

    electric: "ELECTRIC",

    featuredAutomotiveAuction:
      "FEATURED VEHICLE AUCTION",

    electricBrandNew: "Electric • Brand New",

    power: "Power",

    fullyElectric: "100% Electric",

    condition: "Condition",

    brandNew: "Brand New",

    /* RESULTS / INDIVIDUAL RESULT */

    resultNotFound: "Result not found",

    resultNotFoundDescription:
      "The auction result you're looking for does not exist.",

    backToResults: "Back to results",

    allResults: "All results",

    completed: "COMPLETED",

    participantsLabel: "Participants",

    completedLabel: "Completed",

    resultLabel: "Result",

    winningResult: "WINNING RESULT",

    auctionWinner: "Auction winner",

    winner: "WINNER",

    winningBid: "WINNING BID",

    completedOn: "Completed",

    viewAllResults: "View all results",

    resultIsPublic: "The result is public.",

    resultPublicDescription:
      "Once an auction closes, its result is published so participants can clearly see the outcome.",

    publishedWinner: "Published winner",

    publishedWinnerDescription:
      "The winning participant is displayed after the auction closes.",

    finalResult: "Final result",

    finalResultDescription:
      "The winning bid and completion information are published.",

    participationRecord: "Participation record",

    participationRecordDescription:
      "The number of participants is included in the published result.",

    auctionStatus: "AUCTION STATUS",

    auctionCompleted: "Auction completed",

        /* =====================================================
       LOGIN PAGE
    ===================================================== */

    mellaAccount:
      "MELLA ACCOUNT",

    loginPageTitle:
      "Welcome back.",

    loginPageDescription:
      "Sign in to your Mella account and continue participating in auctions.",

    password:
      "Password",

    forgotPassword:
      "Forgot password?",

    enterPassword:
      "Enter your password",

    signIn:
      "Sign in",

    dontHaveAccount:
      "Don't have a Mella account?",

    createAccount:
      "Create an account",

    showPassword:
      "Show password",

    hidePassword:
      "Hide password",

          /* =====================================================
       REGISTER PAGE
    ===================================================== */

    joinMella:
      "JOIN MELLA",

    createYourAccount:
      "Create your account.",

    registerPageDescription:
      "Create your Mella account and start participating in exciting auctions.",

    fullName:
      "Full Name",

    yourFullName:
      "Your full name",

    phoneNumber:
      "Phone Number",

    createPassword:
      "Create a password",

    passwordRequirement:
      "Password must contain at least 8 characters.",

    confirmPassword:
      "Confirm Password",

    confirmYourPassword:
      "Confirm your password",

    agreeToMella:
      "I agree to Mella's",

    termsAndConditions:
      "Terms & Conditions",

    and:
      "and",

    privacyPolicy:
      "Privacy Policy",

    alreadyHaveAccount:
      "Already have a Mella account?",

    passwordsDoNotMatch:
      "Passwords do not match.",

    pleaseAcceptTerms:
      "Please accept the Terms & Conditions.",

      // EN
adminLabel: "ADMINISTRATION",
userLabel: "MELLA",

adminHeroTitle: "Everything under control.",
userHeroTitle: "Your chance. Your win.",

adminHeroDescription:
  "Manage auctions, participants, bids and transactions from one secure place.",

userHeroDescription:
  "Participate in exciting Mella auctions and discover what you could win.",

allRightsReservedShort:
  "All rights reserved.",

      seeTheWins: "See the wins.",

    resultsPageDescription:
      "See completed Mella auctions, their winners and published results. Transparency doesn't stop when the auction ends.",

    completedAuctions: "COMPLETED AUCTIONS",

    publishedResults: "published results",

    searchResults: "Search results...",

    winnerLabel: "WINNER",

    winningBidLabel: "WINNING BID",

    completedStatus: "COMPLETED",

    viewResult: "View Result",

    auctionCompletedStatus: "Auction completed",

    noResultsFound: "No results found",

    noResultsDescription:
      "Try searching for another auction, product or winner.",

    clearSearch: "Clear search",

    resultsVisibleTitle: "Results are visible.",

    resultsVisibleDescription:
      "Every completed auction have a clear record of its result. Mella is designed so participants can understand what happened after the countdown reaches zero.",

    publishedWinnerPoint: "Published winner",

    publishedWinnerPointDescription:
      "The winning participant is shown after the auction closes.",

    auctionRecordPoint: "Auction record",

    auctionRecordPointDescription:
      "Each auction has a unique identifier and completion date.",

    participantVisibilityPoint: "Participant visibility",

    participantVisibilityPointDescription:
      "The completed auction records participation information.",

    readyForNextWin: "Ready for your next win?",

    exploreAvailableAuctions:
      "Explore the auctions currently available on Mella.",

    electronicsCategory: "Electronics",

    mysteryBoxCategory: "Mystery Box",

    homeCategory: "Home",

    brandNewSubtitle: "256GB • Brand New",

    smartTvSubtitle: "4K Smart TV",

    premiumTechnologyBoxSubtitle: "Premium Technology Box",

    playstationSubtitle: "Slim Edition • 1TB",

    refrigeratorSubtitle: "450L • Inverter",

    macbookSubtitle: "M4 • 16GB RAM • 256GB",

    decreaseBid: "Decrease bid",

increaseBid: "Increase bid",

registrationFailed: "Registration failed",
loginFailed: "Login failed",
somethingWentWrong: "Something went wrong. Please try again.",

myAccount: "My account",
manageYourProfile: "Manage your profile",
myAuctions: "My auctions",
viewBiddingActivity: "View your bidding activity",
logout: "Logout",
signingOut: "Signing out...",
openMenu: "Open menu",
closeMenu: "Close menu",
welcome: "Welcome",
accountDescription:
  "Manage your Mella account, participate in auctions and keep track of your activity.",
mellaMember: "Mella member",
findNextOpportunity: "Find your next opportunity.",
myActivity: "MY ACTIVITY",
trackAuctionsAndBids:
  "Track auctions you've joined and your bids.",
viewCompletedResults:
  "View completed auction results.",
signOut: "Sign out",
// ENGLISH
myAuctionsTitle: "My auctions.",
myAuctionsDescription:
  "Keep track of the auctions you've joined, your bids and your wins.",

active: "Active",
won: "Won",
ended: "Ended",
notWon: "Not won",

allAuctions: "All auctions",
bids: "bids",
myBid: "MY BID",

noAuctionsDescription:
  "You don't have any auctions in this category yet.",

viewAuction: "View auction",

auctionCurrentlyActive:
  "Your auction is currently active.",

congratulationsWon:
  "Congratulations! You won this auction.",

auctionHasEnded:
  "This auction has ended.",

keepBidding: "KEEP BIDDING",
nextOpportunity:
  "Find your next opportunity.",

exploreLiveAuctions:
      "Explore live Mella auctions and see what's available right now.",

    // Auction Details Page
    status: "Status",
    auction: "Auction",
    yourBid: "YOUR BID",
    bidAmount: "Bid amount",
    enterAmount: "Enter amount",
    submitting: "Submitting...",
    bidSubmitted: "Bid submitted successfully.",
    bidFailed: "Unable to submit bid.",
    bidFailedRetry: "Unable to submit bid. Please try again.",
    signInRequired: "You must be signed in and have enough bid credits to participate.",
    bidPackages: "BID PACKAGES",
    chooseBidPackage: "Choose a bid package",
    discountedPrice: "Discounted package price",
    continueWithBids: "Continue with {count} bids",
    paymentNotConnected: "Payment is not connected yet. This package is ready for checkout.",
    knowTheRules: "Know the rules.",
    placeYourBid: "Place your bid",
    placeYourBidDescription: "Choose your amount and submit your bid before the auction closes.",
    competeStrategically: "Compete strategically",
    competeDescription: "Other participants are competing using their own bidding strategies.",
    transparentProcess: "Transparent process",
    transparentDescription: "Auction rules and results are presented clearly.",
    securePaymentsDescription: "The payment process is convenient for users.",
    differentExperience: "A different auction experience",
    differentExperienceDescription: "Mella offers a strategic experience different from traditional auctions.",
    auctionNotFound: "Auction not found",
    auctionNotFoundDescription: "The auction you're looking for doesn't exist or is no longer available.",
    backToAuctions: "Back to auctions",
    serviceFee: "Service Fee",
  },

  am: {
    auctions: "ጨረታዎች",

    howItWorks: "እንዴት ይሰራል",

    results: "ውጤቶች",

    about: "ስለ እኛ",

    login: "ግባ",

    startBidding: "መጫረት ይጀምሩ",

    liveNow: "አሁን በቀጥታ",

    auctionsWorthWatching:
      "ጨረታዎች",

    viewAllAuctions:
      "ሁሉንም ጨረታዎች ይመልከቱ",

    exploreAuctions:
      "ጨረታዎችን ይመልከቱ",

    aNewWayToWin:
      "ለማሸነፍ አዲስ መንገድ",

    bidSmart:
      "በብልሃት",

    winMore:
      "የበለጠ ያሸንፉ",

    heroDescription:
      "Mella አዲስና ግልጽ የጨረታ ልምድን አምጥቷል። ልዩ ምርቶችን ያግኙ፣ መጫረቻዎን ያስገቡ እና ብልህ ስትራቴጂዎ እንዲያሸንፍ ያድርጉ።",

    transparent:
      "ሙሉ ግልጽነት",

    localPayments:
      "ክፍያዎች",

    auctions247:
      "ጨረታዎች",

    howMellaWorks:
      "MELLA እንዴት ይሰራል",

    simpleEnough:
      "ለመረዳት ቀላል",

    chooseAuction:
      "ጨረታ ይምረጡ",

    getYourBids:
      "ስትራቴጂዎን ይተግብሩ",

    seeTheResult:
      "ውጤቱን ይመልከቱ",

    browseProducts:
      "ተሽከርካሪዎችን፣ ኤሌክትሮኒክስን፣ የቤት እቃዎችን እና ልዩ ምርቶችን ይመልከቱ።",

    choosePackage:
      "የመጫረቻ ፓኬጅ ይምረጡ እና ክሬዲቶችዎን በመጠቀም ይሳተፉ።",

    submitBids:
      "ቆጣሪው ወደ ዜሮ ከመድረሱ በፊት መጫረቻዎን ያስገቡ።",

    winningLogic:
      "ጨረታው ሲያበቃ የአሸናፊው መለያ ዘዴና ውጤቱ ይገለጻል።",

    endsIn:
      "የሚያበቃበት ጊዜ",

    participants:
      "ተሳታፊዎች",

    enterYourBid:
      "መጫረቻዎን ያስገቡ",

    submitBid:
      "መጫረቻ ያስገቡ",

    entryFrom:
      "የአገልግሎት ክፍያ",

    builtForFairPlay:
      "ለፍትሃዊ ጨዋታ የተገነባ",

    trustFirst:
      "እምነት በመጀመሪያ",

    newKindOfAuction:
      "አዲስ ዓይነት ጨረታ",

    securePayments:
      "አስተማማኝ ክፍያዎች",

    terms:
      "ደንቦች",

    privacy:
      "የግላዊነት መመሪያ",

    footerDescription:
      "ለመጫረት አዲስ መንገድ",

    allRightsReserved:
      "መብቱ በሙሉ የተጠበቀ ነው።",

    fairPlayTitle:
      "ለፍትሃዊ ጨዋታ የተገነባ",

    fairPlayDescription:
      "Mella የአሸናፊውን አመራረጥ ሂደት ግልጽ፣ ሊረጋገጥ የሚችል እና ለመረዳት ቀላል ያደርገዋል።",

    trustFirstTitle:
      "እምነት በመጀመሪያ",

    trustFirstDescription:
      "ግልጽ የጨረታ ደንቦች፣ ይፋ የሆኑ ውጤቶች እና ለኢትዮጵያ የተዘጋጀ የክፍያ ልምድ።",

    newAuctionTitle:
      "አዲስ ዓይነት ጨረታ",

    newAuctionDescription:
      "ባህላዊው ከፍተኛ ጨረታ የሚያሸንፍበት የገበያ ስርዓት አይደለም። Mella በስትራቴጂ ላይ የተመሰረተ ነው።",

    howMellaDescription:
      "Mella ን የነደፍነው በአንድ መርህ ላይ በመመስረት ነው፤ በጨረታዎ ላይ ምን እየተፈጠረ እንዳለ ሁልጊዜ ማወቅ አለብዎት።",

    chooseAuctionDescription:
      "ተሽከርካሪዎችን፣ ኤሌክትሮኒክስን፣ የቤት እቃዎችን እና ልዩ ምርቶችን ይመልከቱ",

    getYourBidsDescription:
      "ዝቅተኛ ልዩ ይሆናል ብለው የሚያስቡትን ዋጋ ይምረጡ",

    seeTheResultDescription:
      "ጨረታው ሲዘጋ የአሸናፊው አመራረጥ ሂደት እና ውጤቱ ይፋ ይደረጋል",

    footerTagline:
      "ጨረታ የሚሳተፉበት አዲስ መንገድ",

    copyright:
      "© 2026 Mella. መብቱ በሙሉ የተጠበቀ ነው።",

    liveAuctions:
      "የቀጥታ ጨረታዎች",

    findYourNextWin:
      "ቀጣዩን ዕድልዎን ያግኙ",

    auctionsPageDescription:
      "የ Mella ን የቀጥታ ጨረታዎች ይመልከቱ፤ ተሽከርካሪዎችን፣ ኤሌክትሮኒክስን፣ የቤት እቃዎችን እና ሌሎች ልዩ ምርቶችን ያግኙ።",

    all:
      "ሁሉም",

    electronics:
      "ኤሌክትሮኒክስ",

    automotive:
      "ተሽከርካሪዎች",

    home:
      "የቤት እቃዎች",

    searchAuctions:
      "ጨረታዎችን ይፈልጉ...",

    filters:
      "ማጣሪያዎች",

    auctionsAvailable:
      "ጨረታዎች ይገኛሉ",

    endingSoon:
      "በቅርቡ የሚያበቃ",

    noAuctionsFound:
      "ምንም ጨረታ አልተገኘም",

    tryAnotherSearch:
      "ሌላ ፍለጋ ወይም የተለየ ምድብ ይሞክሩ።",

    clearFilters:
      "ማጣሪያዎችን አጽዳ",

    mysteryBox:
      "የሚስጥር ሳጥን",

    /* FEATURED AUCTION */

    liveAuction:
      "የቀጥታ ጨረታ",

    electric:
      "ኤሌክትሪክ",

    featuredAutomotiveAuction:
      "ልዩ የተሽከርካሪ ጨረታ",

    electricBrandNew:
      "ኤሌክትሪክ • አዲስ",

    power:
      "ኃይል",

    fullyElectric:
      "100% ኤሌክትሪክ",

    condition:
      "ሁኔታ",

    brandNew:
      "አዲስ",

    /* RESULTS / INDIVIDUAL RESULT */

    resultNotFound:
      "ውጤቱ አልተገኘም",

    resultNotFoundDescription:
      "የፈለጉት የጨረታ ውጤት አልተገኘም።",

    backToResults:
      "ወደ ውጤቶች ተመለስ",

    allResults:
      "ሁሉም ውጤቶች",

    completed:
      "ተጠናቋል",

    participantsLabel:
      "ተሳታፊዎች",

    completedLabel:
      "የተጠናቀቀ",

    resultLabel:
      "ውጤት",

    winningResult:
      "የአሸናፊ ውጤት",

    auctionWinner:
      "የጨረታው አሸናፊ",

    winner:
      "አሸናፊ",

    winningBid:
      "የአሸናፊ መጫረቻ",

    completedOn:
      "የተጠናቀቀበት ቀን",

    viewAllResults:
      "ሁሉንም ውጤቶች ይመልከቱ",

    resultIsPublic:
      "ውጤቱ ግልጽ ነው።",

    resultPublicDescription:
      "ጨረታው ከተጠናቀቀ በኋላ የአሸናፊው መረጃ እና የጨረታው ውጤት ለግልጽነት ይታያሉ።",

    publishedWinner:
      "አሸናፊ ታትሟል",

    publishedWinnerDescription:
      "የጨረታው አሸናፊ ከጨረታው መጠናቀቅ በኋላ በግልጽ ይታያል።",

    finalResult:
      "የመጨረሻ ውጤት",

    finalResultDescription:
      "የአሸናፊው መጫረቻ እና የጨረታው መረጃ ታትሟል።",

    participationRecord:
      "የተሳታፊዎች መረጃ",

    participationRecordDescription:
      "የጨረታው ተሳታፊዎች ቁጥር በውጤቱ ውስጥ ይታያል።",

    auctionStatus:
      "የጨረታ ሁኔታ",

    auctionCompleted:
      "ጨረታው ተጠናቋል",

          /* =====================================================
       LOGIN PAGE
    ===================================================== */

    mellaAccount:
      "የ MELLA መለያ",

    loginPageTitle:
      "እንኳን ደህና መጡ",

    loginPageDescription:
      "ወደ Mella መለያዎ ይግቡ እና በጨረታዎች ላይ መሳተፍዎን ይቀጥሉ",

    password:
      "የይለፍ ቃል",

    forgotPassword:
      "የይለፍ ቃልዎን ረስተዋል?",

    enterPassword:
      "የይለፍ ቃልዎን ያስገቡ",

    signIn:
      "ግባ",

    dontHaveAccount:
      "የ Mella መለያ የሎትም?",

    createAccount:
      "መለያ ይፍጠሩ",

    showPassword:
      "የይለፍ ቃሉን አሳይ",

    hidePassword:
      "የይለፍ ቃሉን ደብቅ",

          /* =====================================================
       REGISTER PAGE
    ===================================================== */

    joinMella:
      "MELLAን ይቀላቀሉ",

    createYourAccount:
      "መለያዎን ይፍጠሩ",

    registerPageDescription:
      "የ Mella መለያዎን ይፍጠሩ እና በአስደሳች ጨረታዎች ላይ መሳተፍ ይጀምሩ",

    fullName:
      "ሙሉ ስም",

    yourFullName:
      "ሙሉ ስምዎን ያስገቡ",

    phoneNumber:
      "ስልክ ቁጥር",

    createPassword:
      "የይለፍ ቃል ይፍጠሩ",

    passwordRequirement:
      "የይለፍ ቃሉ ቢያንስ 8 ቁምፊዎችን መያዝ አለበት።",

    confirmPassword:
      "የይለፍ ቃል ያረጋግጡ",

    confirmYourPassword:
      "የይለፍ ቃልዎን እንደገና ያስገቡ",

    agreeToMella:
      "የ Mella",

    termsAndConditions:
      "ደንቦች እና ስምምነቶች",

    and:
      "እና",

    privacyPolicy:
      "የግላዊነት መመሪያ",

    alreadyHaveAccount:
      "የ Mella መለያ አስቀድመው አለዎት?",

    passwordsDoNotMatch:
      "የይለፍ ቃሎቹ አይመሳሰሉም።",

    pleaseAcceptTerms:
      "እባክዎ ደንቦች እና ስምምነቶችን ይቀበሉ።",

      // AM
adminLabel: "አስተዳደር",
userLabel: "Mella",

adminHeroTitle:
  "ሁሉንም ነገር በቁጥጥር ስር ያድርጉ።",

userHeroTitle:
  "ዕድልዎ፣ ድልዎ",

adminHeroDescription:
  "ጨረታዎችን፣ ተሳታፊዎችን፣ መጫረቻዎችን እና ግብይቶችን ከአንድ ደህንነታማ ቦታ ያስተዳድሩ።",

userHeroDescription:
  "በአስደሳች የMella ጨረታዎች ይሳተፉ እና ሊያሸንፉት የሚችሉትን ይወቁ።",

allRightsReservedShort:
  "መብቱ በሙሉ የተጠበቀ ነው።",

      seeTheWins: "ድሎቹን ይመልከቱ",

    resultsPageDescription:
      "የተጠናቀቁ የ Mella ጨረታዎችን፣ አሸናፊዎቻቸውን እና ይፋ የሆኑ ውጤቶቻቸውን ይመልከቱ። ጨረታው ሲያበቃም ግልጽነት አያበቃም።",

    completedAuctions: "የተጠናቀቁ ጨረታዎች",

    publishedResults: "ይፋ የሆኑ ውጤቶች",

    searchResults: "ውጤቶችን ይፈልጉ...",

    winnerLabel: "አሸናፊ",

    winningBidLabel: "የአሸናፊ መጫረቻ",

    completedStatus: "ተጠናቋል",

    viewResult: "ውጤቱን ይመልከቱ",

    auctionCompletedStatus: "ጨረታው ተጠናቋል",

    noResultsFound: "ምንም ውጤት አልተገኘም",

    noResultsDescription:
      "ሌላ ጨረታ፣ ምርት ወይም አሸናፊ በመፈለግ ይሞክሩ።",

    clearSearch: "ፍለጋን አጽዳ",

    resultsVisibleTitle:
      "ውጤቶች ግልጽ ሆነው ይታያሉ",

    resultsVisibleDescription:
      "እያንዳንዱ የተጠናቀቀ ጨረታ ግልጽ የውጤት መዝገብ አለው።",

    publishedWinnerPoint: "ይፋ የሆነ አሸናፊ",

    publishedWinnerPointDescription:
      "ጨረታው ከተዘጋ በኋላ የአሸናፊው ተሳታፊ ይታያል።",

    auctionRecordPoint: "የጨረታ መዝገብ",

    auctionRecordPointDescription:
      "እያንዳንዱ ጨረታ ልዩ መለያ እና የተጠናቀቀበት ቀን አለው።",

    participantVisibilityPoint: "የተሳታፊዎች መረጃ",

    participantVisibilityPointDescription:
      "የተጠናቀቀው የጨረታ መዝገብ የተሳታፊዎችን መረጃ ያካትታል።",

    readyForNextWin: "ለሚቀጥለው ድልዎ ዝግጁ ነዎት?",

    exploreAvailableAuctions:
      "በአሁኑ ጊዜ በ Mella ላይ የሚገኙትን ጨረታዎች ይመልከቱ።",

    electronicsCategory: "ኤሌክትሮኒክስ",

    mysteryBoxCategory: "የሚስጥር ሳጥን",

    homeCategory: "የቤት እቃዎች",

    brandNewSubtitle: "256GB • አዲስ",

    smartTvSubtitle: "4K ስማርት ቲቪ",

    premiumTechnologyBoxSubtitle:
      "ፕሪሚየም የቴክኖሎጂ ሳጥን",

    playstationSubtitle: "Slim Edition • 1TB",

    refrigeratorSubtitle: "450L • Inverter",

    macbookSubtitle: "M4 • 16GB RAM • 256GB",

    decreaseBid: "መጫረቻውን ቀንስ",
increaseBid: "መጫረቻውን ጨምር",

registrationFailed: "ምዝገባው አልተሳካም",
loginFailed: "መግባት አልተሳካም",
somethingWentWrong: "የሆነ ችግር ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።",

myAccount: "የእኔ መለያ",
manageYourProfile: "መለያዎን ያስተዳድሩ",
myAuctions: "የእኔ ጨረታዎች",
viewBiddingActivity: "የጨረታ ተሳትፎዎን ይመልከቱ",
logout: "ውጣ",
signingOut: "በመውጣት ላይ...",
openMenu: "ምናሌ ክፈት",
closeMenu: "ምናሌ ዝጋ",

welcome: "እንኳን ደህና መጡ",
accountDescription:
  "የ Mella መለያዎን ያስተዳድሩ፣ በጨረታዎች ይሳተፉ እና የእንቅስቃሴዎን መረጃ ይከታተሉ።",
mellaMember: "የ Mella አባል",
findNextOpportunity: "ቀጣዩን እድልዎን ያግኙ።",
myActivity: "የእኔ እንቅስቃሴ",
trackAuctionsAndBids:
  "የተሳተፉባቸውን ጨረታዎች እና ጨረታ መረጃዎን ይከታተሉ።",
viewCompletedResults:
  "የተጠናቀቁ የጨረታ ውጤቶችን ይመልከቱ።",
signOut: "ውጣ",

// AMHARIC
myAuctionsTitle: "የእኔ ጨረታዎች",
myAuctionsDescription:
  "የተሳተፉባቸውን ጨረታዎች፣ ዋጋ ያቀረቡባቸውን ጨረታዎች እና ያሸነፉባቸውን ጨረታዎች ይከታተሉ።",

active: "ንቁ",
won: "አሸንፈዋል",
ended: "ያበቃ",
notWon: "አላሸነፉም",

noAuctionsDescription:
  "በዚህ ምድብ ውስጥ እስካሁን የተሳተፉበት ጨረታ የለም።",

viewAuction: "ጨረታውን ይመልከቱ",

auctionCurrentlyActive:
  "የተሳተፍክበት ጨረታ አሁን ንቁ ነው።",

congratulationsWon:
  "እንኳን ደስ አለዎት! ይህንን ጨረታ አሸንፈዋል።",

auctionHasEnded:
  "ይህ ጨረታ አብቅቷል።",

keepBidding: "ጨረታዎን ይቀጥሉ",
nextOpportunity:
  "ቀጣዩን እድልዎን ያግኙ።",

exploreLiveAuctions:
      "የMella ንቁ ጨረታዎችን ይመልከቱ እና አሁን ያሉትን እድሎች ያስሱ።",

// Auction Details Page - Amharic
    allAuctions: "ሁሉም ጨረታዎች",
    status: "ሁኔታ",
    auction: "ጨረታ",
    yourBid: "የመጫረቻ መጠን",
    myBid: "የእኔ ጨረታ",
    bidAmount: "የመጫረቻ መጠን",
    enterAmount: "መጠን ያስገቡ",
    submitting: "በመላክ ላይ...",
    bidSubmitted: "መጫረቻዎ በተሳካ ሁኔታ ተልኳል።",
    bidFailed: "መጫረቻውን መላክ አልተቻለም።",
    bidFailedRetry: "መጫረቻውን መላክ አልተቻለም። እባክዎ እንደገና ይሞክሩ።",
    signInRequired: "መጫረቻ ለማስገባት በመለያዎ መግባት እና በቂ የመጫረቻ ክሬዲት መኖር አለበት።",
    bidPackages: "የመጫረቻ ጥቅሎች",
    chooseBidPackage: "የመጫረቻ ጥቅል ይምረጡ",
    bids: "መጫረቻዎች",
    discountedPrice: "ቅናሽ ያለው ዋጋ",
    continueWithBids: "{count} መጫረቻዎችን ይግዙ",
    paymentNotConnected: "የክፍያ አገልግሎቱ ሲዘጋጅ ይህ ጥቅል ይገኛል።",
    knowTheRules: "ደንቦቹን ይረዱ።",
    placeYourBid: "መጫረቻዎን ያስገቡ",
    placeYourBidDescription: "የሚፈልጉትን መጠን ይምረጡና መጫረቻዎን ከጨረታው ጊዜ ከማለቁ በፊት ያስገቡ።",
    competeStrategically: "ከሌሎች ጋር ይወዳደሩ",
    competeDescription: "ሌሎች ተሳታፊዎችም የራሳቸውን ስትራቴጂ በመጠቀም ይሳተፋሉ።",
    transparentProcess: "ግልጽ ሂደት",
    transparentDescription: "የጨረታ ደንቦች እና ውጤቶች በግልጽ ይታያሉ።",
    securePaymentsDescription: "የክፍያ ሂደቱ ተጠቃሚዎች ምቹ ነው።",
    differentExperience: "ልዩ የጨረታ ልምድ",
    differentExperienceDescription: "Mella ከተለመዱት የጨረታ ስርዓቶች የተለየ ስትራቴጂያዊ ልምድ ያቀርባል።",
    auctionNotFound: "ጨረታው አልተገኘም",
    auctionNotFoundDescription: "የጠየቁት ጨረታ አሁን አይገኝም ወይም ከስርዓቱ ተወግዷል።",
    backToAuctions: "ወደ ጨረታዎች ተመለስ",
    serviceFee: "የአገልግሎት ክፍያ",
  },
};

type TranslationKey = keyof typeof translations.en;

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<
  LanguageContextType | undefined
>(undefined);

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] =
    useState<Language>("am");

  useEffect(() => {
    const savedLanguage = localStorage.getItem(
      "mella-language"
    ) as Language | null;

    if (
      savedLanguage === "en" ||
      savedLanguage === "am"
    ) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (
    newLanguage: Language
  ) => {
    setLanguageState(newLanguage);

    localStorage.setItem(
      "mella-language",
      newLanguage
    );
  };

  const t = (key: TranslationKey) => {
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