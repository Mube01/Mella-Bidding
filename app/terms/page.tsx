"use client";

import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileText,
  Gavel,
  ShieldCheck,
  Scale,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";

type Language = "en" | "am";

type TermSection = {
  id: string;
  number: number;
  title: string;
  content: string[];
  bullets?: string[];
};

const englishSections: TermSection[] = [
  {
    id: "acceptance",
    number: 1,
    title: "ACCEPTANCE OF THESE TERMS",
    content: [
      `Mella operates a paid, product-based Lowest Unique Bid auction service in Ethiopia ("Mella", "we", "us", "our"), available through our own digital channels and, where an integration is in place, through the telebirr Super App operated by Ethio Telecom.`,
      `These Terms and Conditions ("Terms") form a binding agreement between Mella and anyone who registers an account, buys a Bid, or takes part in an auction ("you"). You accept these Terms the moment you complete registration, top up your Bid balance, or place a Bid — whichever happens first.`,
      `If any part of these Terms is unacceptable to you, your only recourse is to stop using Mella. Continuing to hold an account or to take part in auctions after a revised version of these Terms is published means you accept the revised version.`,
    ],
  },
  {
    id: "definitions",
    number: 2,
    title: "DEFINITIONS",
    content: [
      `The words below carry a fixed meaning wherever they appear in these Terms, capitalised:`,
    ],
    bullets: [
      `Auction — a scheduled event on Mella in which a single Item is awarded to the participant who places the winning Bid under the Lowest Unique Bid rule.`,
      `Item — the product put up for an Auction, spanning consumer electronics, Vehicles, and Mystery Box prizes.`,
      `Bid — a numeric offer placed by a participant during an open Auction.`,
      `Unique — a Bid value is Unique if no other participant placed that exact value in the same Auction.`,
      `Winning Bid — the smallest Unique Bid placed before an Auction closes.`,
      `Bid Package — a bundle of several Bids sold together at a reduced combined price, described in Section 6.`,
      `Mystery Box — a recurring Auction type in which the prize is drawn from a disclosed category of Items but its exact identity stays hidden until after the Auction closes, described in Section 7.`,
      `Vehicle — a car, motorcycle, or other registrable motor vehicle offered as an Auction Item.`,
      `Account — your registered Mella profile, used to buy Bids and take part in Auctions.`,
      `telebirr — the mobile money and Super App service run by Ethio Telecom, through which Mella may be reached.`,
    ],
  },
  {
    id: "eligibility",
    number: 3,
    title: "WHO MAY USE MELLA",
    content: [
      `To open an Account and take part in an Auction, you confirm that:`,
    ],
    bullets: [
      `you are at least 18 years old;`,
      `you are able to lawfully hold and use a telebirr account or another payment method Mella accepts;`,
      `nothing in Ethiopian law bars you personally from using an auction or gaming-adjacent digital service; and`,
      `the details you give us at registration are your own, true, and current.`,
    ],
    content: [
      `To open an Account and take part in an Auction, you confirm that:`,
      `We may ask you to confirm your identity at registration, before releasing a prize, or at any other point, and we may pause your access while we do so. If we cannot confirm you meet the conditions above, we may refuse, suspend, or end your access to Mella.`,
    ],
  },
  {
    id: "account",
    number: 4,
    title: "YOUR ACCOUNT",
    content: [
      `One person, one Account. Creating or controlling more than one Account, or letting someone else use yours, is a breach of these Terms and may result in every affected Account being closed.`,
      `You are responsible for anything done through your Account, whether or not you authorised it, unless the activity resulted from a security failure on Mella's side. Tell us immediately if you think someone else has accessed your Account.`,
      `You may close your Account at any time by contacting us. Bids you have already placed into an open Auction are not affected by closing your Account and are dealt with under Section 6.`,
    ],
  },
  {
    id: "lowest-unique-bid",
    number: 5,
    title: "HOW THE LOWEST UNIQUE BID AUCTION WORKS",
    content: [
      `Each Auction has a fixed opening time, closing time, and a published set of rules covering the Bid range, the smallest step between allowed Bid values, and any limits on how many Bids one person may place. These rules are shown before the Auction opens for Bids and do not change once it is underway.`,
      `Once the Auction closes, our system compares every Bid placed. Any Bid value that more than one participant placed is discarded as not Unique. Among the remaining values, the smallest is the Winning Bid, and the participant who placed it is the winner.`,
      `To illustrate: if participants placed 310, 340, 340, and 385, the value 340 was placed twice and is discarded. Between 310 and 385, 310 is lower, so 310 is the Winning Bid, provided it was placed by only one participant.`,
      `We do not show a running leaderboard, a count of Bids already placed on a given value, or any other live signal while an Auction is open. Publishing that information mid-Auction would let participants react to each other in real time and change the character of the game, so it is withheld until after closing.`,
      `Once closed, an Auction cannot be reopened, and Bids cannot be withdrawn, edited, or reassigned to a different Auction.`,
    ],
  },
  {
    id: "bids",
    number: 6,
    title: "BIDS, BID FEES, AND BID PACKAGES",
    content: [
      `Placing a Bid costs a fee, shown to you before you confirm the Bid. Paying this fee buys you the chance to have that Bid counted in the Auction — it is not a partial payment toward the Item and is not refunded if you do not win, regardless of the reason.`,
      `Rather than buying single Bids, you may buy a Bid Package covering several Bids at once, at a lower combined price than buying them one at a time. At launch, two Package sizes are offered:`,
    ],
    bullets: [
      `a 5-Bid Package, priced 5% below the cost of five single Bids; and`,
      `a 10-Bid Package, priced 12% below the cost of ten single Bids.`,
    ],
    content: [
      `We may introduce other Package sizes, retire existing ones, or change the discount attached to a Package. Any such change takes effect only for Packages bought after the change and does not touch Bids you already hold.`,
      `No participant may place more than 100 Bids in a single Auction, whether those Bids come from single purchases, a Package, or a mix of both.`,
      `All payments for Bids and Bid Packages are handled through telebirr or another payment channel we make available. If money leaves your account but the Bid does not appear against the Auction, tell us and we will investigate and put it right.`,
    ],
  },
  {
    id: "mystery-box",
    number: 7,
    title: "MYSTERY BOX AND JACKPOT AUCTIONS",
    content: [
      `Alongside our regular, named-Item Auctions, we run a Mystery Box Auction roughly every three days. The winner receives a genuine physical prize, but its precise identity is not announced until the Auction has closed.`,
      `Before you place a Bid in a Mystery Box Auction, we will tell you the category the prize is drawn from and its approximate value range. The current pool draws from items such as earphones, smartwatches, phones, laptops and tablets, and televisions, though the exact make and model awarded is only confirmed to the winner afterward.`,
      `Apart from the prize being undisclosed in advance, a Mystery Box Auction runs on exactly the same Lowest Unique Bid rule, Bid limits, and closing mechanics as any other Auction on Mella.`,
    ],
  },
  {
    id: "payments",
    number: 8,
    title: "PAYMENTS",
    content: [
      `Prices for Bids, Packages, and any charges connected with claiming a won Item are shown in Ethiopian Birr and include any tax we are required to add at the time of sale.`,
      `We rely on telebirr and other payment providers to process your payments correctly. If a payment fails, is delayed, or is processed twice because of an error on a payment provider's side, we will help you pursue a correction with that provider, but we are not the guarantor of their systems.`,
    ],
  },
  {
    id: "claiming-prize",
    number: 9,
    title: "CLAIMING AND RECEIVING A PRIZE",
    content: [
      `We contact the winner of an Auction using the phone number or Account details on file. You should respond and follow the claim steps we send you within 7 calendar days; if you do not, we treat the prize as unclaimed and may offer it to another eligible participant or otherwise deal with it at our discretion.`,
      `Before releasing a prize, we may ask for proof of identity, proof of address, or other documents reasonably needed to confirm you are entitled to receive it.`,
      `For most Items, once your claim is confirmed, we arrange collection from a nominated point or delivery to an address you provide, generally within 10 working days.`,
    ],
  },
  {
    id: "vehicles",
    number: 10,
    title: "VEHICLE PRIZES",
    content: [
      `Winning a Vehicle carries extra steps beyond those for other Items, which may include confirming the vehicle's identification details, verifying the supplying dealer, arranging ownership transfer and registration paperwork, sorting insurance, and a physical handover inspection.`,
      `These steps, and the order in which they happen, are set out in the specific rules published for that Vehicle Auction and must all be completed before the Vehicle changes hands.`,
      `Registration fees, transfer taxes, insurance premiums, and any other cost a third party charges to put the Vehicle in your name are for the winner's account, unless the Auction rules for that Vehicle say otherwise.`,
    ],
  },
  {
    id: "faulty-prizes",
    number: 11,
    title: "FAULTY, DAMAGED, OR INCORRECT PRIZES",
    content: [
      `Check a delivered or collected Item as soon as you get it. If it is damaged, does not match its published description, or is missing something it should include, tell us within 48 hours of receiving it.`,
      `Where we find the Item was faulty or wrongly described when it left our hands, we will repair it, replace it, or, if neither is practical, refund the Bid Fees you spent winning that specific Auction. This does not apply where the fault results from something that happened after you received the Item.`,
      `Beyond what we set out here, an Item carries only whatever warranty its manufacturer provides.`,
    ],
  },
  {
    id: "nature",
    number: 12,
    title: "THE NATURE OF THIS SERVICE",
    content: [
      `Placing a Bid buys you a chance, not an outcome. Most participants in a given Auction do not win it, and the fee you pay to Bid is the cost of taking part, not a deposit or instalment toward owning the Item.`,
      `Mella awards physical Items only. We do not run cash-prize draws, and nothing on Mella should be read as, or treated as equivalent to, a lottery ticket, a wager, or a financial investment.`,
    ],
  },
  {
    id: "conduct",
    number: 13,
    title: "RULES OF CONDUCT",
    content: [
      `When using Mella, you agree that you will not:`,
    ],
    bullets: [
      `operate or benefit from more than one Account;`,
      `use a script, bot, or other automated tool to place Bids;`,
      `try to access, alter, or disrupt any part of Mella's systems beyond normal use of the service;`,
      `give us false information at registration or during identity checks; or`,
      `arrange with other participants to place or withhold Bids in a way designed to control an Auction's outcome.`,
    ],
    content: [
      `When using Mella, you agree that you will not:`,
      `Breaking any of these rules can lead to the Bids in question being disregarded, your Account being suspended or closed, forfeiture of a prize you would otherwise have won, and, where the law requires it, a report to the relevant authorities.`,
    ],
  },
  {
    id: "monitoring",
    number: 14,
    title: "MONITORING, INVESTIGATIONS, AND ENFORCEMENT",
    content: [
      `We keep records of Bids, Auction outcomes, and Account activity, and we may review them at any time to check that an Auction ran the way its published rules said it would.`,
      `If our review flags a pattern that looks coordinated, automated, or otherwise inconsistent with ordinary participation, we may hold the affected Auction result, ask the participants involved for an explanation, and act under Section 13 if the explanation does not satisfy us.`,
    ],
  },
  {
    id: "privacy",
    number: 15,
    title: "YOUR PRIVACY",
    content: [
      `We collect the personal information needed to run your Account, verify you are eligible to participate, process payments, and deliver a prize to you if you win — nothing beyond that.`,
      `Your information is handled in line with Ethiopian data protection law and any additional requirement that applies because a given Auction is reached through telebirr. Full detail on what we collect and why is set out in our separate Privacy Notice, which forms part of these Terms.`,
      `We do not publish a winner's personal details as part of Auction results; where we mention a winner publicly, we do so only with that person's separate agreement.`,
    ],
  },
  {
    id: "intellectual-property",
    number: 16,
    title: "INTELLECTUAL PROPERTY",
    content: [
      `The Mella name, logo, and the software and design behind the auction service belong to Mella or its licensors. You may use them only as needed to take part in Auctions in the ordinary way, and not to copy, adapt, or build a competing service.`,
    ],
  },
  {
    id: "liability",
    number: 17,
    title: "OUR LIABILITY TO YOU",
    content: [
      `If something goes wrong on our side and you are entitled to compensation, the most we owe you in connection with a given Auction is the amount you actually paid in Bid Fees for that Auction.`,
      `We are not liable for a Bid you expected to place but could not because of a problem with your device, your network connection, or a payment provider outside our systems.`,
      `Nothing in these Terms cuts down any protection Ethiopian law gives you as a consumer that cannot lawfully be limited by agreement.`,
    ],
  },
  {
    id: "suspending",
    number: 18,
    title: "SUSPENDING OR CLOSING YOUR ACCOUNT",
    content: [
      `We may suspend or close your Account, with or without advance notice, if we reasonably believe you have broken these Terms, if telebirr or Ethio Telecom asks us to, or if we are required to by law.`,
      `Closing your Account does not entitle you to a refund of Bid Fees already spent on Auctions that had not yet closed, except where Section 11 applies.`,
    ],
  },
  {
    id: "changes",
    number: 19,
    title: "CHANGES WE MAY MAKE",
    content: [
      `We may update these Terms as Mella develops, as our agreement with Ethio Telecom evolves, or as Ethiopian law requires. We will post the updated version on Mella and, for changes that materially affect you, give reasonable advance notice through the service.`,
      `A change never reaches back to affect an Auction that already closed under the previous version of these Terms.`,
    ],
  },
  {
    id: "events",
    number: 20,
    title: "EVENTS OUTSIDE OUR CONTROL",
    content: [
      `We are not responsible for a delay, disruption, or cancellation of an Auction caused by something reasonably outside our control, such as a nationwide network or telebirr outage, a natural disaster, government action, or similar disruption. Where this happens, we will restart or reschedule affected Auctions once it is reasonably possible to do so.`,
    ],
  },
  {
    id: "disagreement",
    number: 21,
    title: "RESOLVING A DISAGREEMENT",
    content: [
      `If you disagree with an Auction result or any other decision we have made, contact our support team first, with as much detail as you can give us, within 10 calendar days of the event you are querying.`,
      `We will look into the matter against our records and the published rules for that Auction and give you a substantive response. If, after that, you still believe the matter is unresolved, you may pursue it under Section 22.`,
    ],
  },
  {
    id: "governing-law",
    number: 22,
    title: "GOVERNING LAW",
    content: [
      `These Terms are governed by the law of the Federal Democratic Republic of Ethiopia, and any claim arising from them or from your use of Mella that cannot be settled directly falls under the jurisdiction of the competent Ethiopian courts.`,
    ],
  },
  {
    id: "general",
    number: 23,
    title: "GENERAL PROVISIONS",
    content: [
      `If a court finds part of these Terms unenforceable, only that part is affected; the rest continues to apply. Our not acting on a breach straight away does not mean we give up the right to act on it, or a similar breach, later.`,
      `These Terms, together with the auction-specific rules published for each Auction and our Privacy Notice, are the whole agreement between you and Mella about using the service, replacing anything discussed beforehand.`,
    ],
  },
  {
    id: "contact",
    number: 24,
    title: "HOW TO REACH US",
    content: [
      `Questions about these Terms, an Account, or an Auction can be sent to our support team through the contact channels published on Mella or, where applicable, through the telebirr Super App.`,
    ],
  },
];

const amharicSections: TermSection[] = [
  {
    id: "acceptance",
    number: 1,
    title: "እነዚህን ውሎች መቀበል",
    content: [
      `Mella በኢትዮጵያ ውስጥ የተከፈለ፣ ምርት-ተኮር ዝቅተኛ ብቸኛ ዋጋ ጨረታ አገልግሎት ("Mella"፣ "እኛ"፣ "የእኛ") ያካሂዳል፤ ይህም በራሳችን ዲጂታል ቻናሎችና፣ ውህደት ባለበት ሁኔታ፣ በኢትዮ ቴሌኮም በሚንቀሳቀሰው በቴሌብር ሱፐር አፕ በኩል ይገኛል።`,
      `እነዚህ ውሎችና ሁኔታዎች ("ውሎች") በMellaና መለያ በሚመዘግብ፣ ዋጋ በሚገዛ ወይም በጨረታ በሚሳተፍ ማንኛውም ሰው ("እርስዎ") መካከል አስገዳጅ ስምምነት ይመሰርታሉ። ምዝገባን ካጠናቀቁ፣ የዋጋ ቀሪ ሂሳብዎን ከሞሉ ወይም ዋጋ ካቀረቡ - መጀመሪያ የትኛው ቢከሰት - በዚያኑ ቅጽበት እነዚህን ውሎች ተቀብለዋል ማለት ነው።`,
      `የእነዚህ ውሎች ማንኛውም ክፍል ለእርስዎ ተቀባይነት ከሌለው፣ ብቸኛው አማራጭዎ Mellaን መጠቀም ማቆም ነው። የተሻሻለ የእነዚህ ውሎች ቅጂ ከታተመ በኋላ መለያ መያዙን ወይም በጨረታ መሳተፉን መቀጠል የተሻሻለውን ቅጂ እንደመቀበል ይቆጠራል።`,
    ],
  },
  {
    id: "definitions",
    number: 2,
    title: "ትርጓሜዎች",
    content: [
      `ከዚህ በታች ያሉት ቃላት በእነዚህ ውሎች ውስጥ በተደጋጋሚ ሲጠቀሱ የተወሰነ ትርጉም አላቸው፦`,
    ],
    bullets: [
      `ጨረታ — አንድ ዕቃ በዝቅተኛ ብቸኛ ዋጋ ደንብ መሠረት አሸናፊ ዋጋ ላቀረበው ተሳታፊ የሚሰጥበት በ Mella ላይ የሚዘጋጅ የተወሰነ ክስተት ነው።`,
      `ዕቃ — ለጨረታ የሚቀርበው ምርት ሲሆን፣ የኤሌክትሮኒክስ ዕቃዎችን፣ ተሽከርካሪዎችንና የሚስጥራዊ ሳጥን ሽልማቶችን ያካትታል።`,
      `ዋጋ — ተሳታፊ ጨረታ ክፍት ሆኖ ባለበት ወቅት የሚያቀርበው የቁጥር ጥያቄ ነው።`,
      `ብቸኛ — አንድ የዋጋ መጠን ብቸኛ ተብሎ የሚቆጠረው ያንኑ ትክክለኛ መጠን በተመሳሳይ ጨረታ ውስጥ ሌላ ተሳታፊ ካላቀረበ ብቻ ነው።`,
      `አሸናፊ ዋጋ — ጨረታ ከመዘጋቱ በፊት የቀረበ ትንሹ ብቸኛ ዋጋ ነው።`,
      `የዋጋ ጥቅል — በክፍል 6 እንደተገለጸው፣ በቅናሽ ተጠቃለለ ዋጋ አንድ ላይ የሚሸጥ የበርካታ ዋጋዎች ስብስብ ነው።`,
      `ሚስጥራዊ ሳጥን — በክፍል 7 እንደተገለጸው፣ ሽልማቱ ከተገለጸ የዕቃ ምድብ የሚመረጥ ነገር ግን ትክክለኛ ማንነቱ ጨረታው እስኪዘጋ ድረስ የተሰወረ ተደጋጋሚ የጨረታ ዓይነት ነው።`,
      `ተሽከርካሪ — እንደ ጨረታ ዕቃ ሆኖ የሚቀርብ መኪና፣ ሞተር ሳይክል ወይም ሌላ ሊመዘገብ የሚችል ተሽከርካሪ ነው።`,
      `መለያ — ዋጋዎችን ለመግዛትና በጨረታዎች ለመሳተፍ የሚያገለግል የተመዘገበ የ Mella መገለጫዎ ነው።`,
      `ቴሌብር — Mella ሊደረስበት የሚችልበት፣ በኢትዮ ቴሌኮም የሚንቀሳቀሰው የሞባይል ገንዘብና ሱፐር አፕ አገልግሎት ነው።`,
    ],
  },
  {
    id: "eligibility",
    number: 3,
    title: "MELLAን ማን መጠቀም ይችላል",
    content: [
      `መለያ ለመክፈትና በጨረታ ለመሳተፍ፣ እርስዎ የሚከተሉትን እንደሚያሟሉ ያረጋግጣሉ፦`,
    ],
    bullets: [
      `ቢያንስ 18 ዓመት ዕድሜ አለዎት፤`,
      `በህጋዊ መንገድ የቴሌብር መለያ ወይም Mella የሚቀበለውን ሌላ የክፍያ ዘዴ መያዝና መጠቀም ይችላሉ፤`,
      `በኢትዮጵያ ህግ እርስዎ በግልዎ ጨረታ ወይም ከጨዋታ ጋር የተያያዘ ዲጂታል አገልግሎት እንዳይጠቀሙ የሚከለክል ነገር የለም፤ እና`,
      `በምዝገባ ወቅት የሰጡን ዝርዝሮች የእርስዎ፣ እውነተኛና ወቅታዊ ናቸው።`,
    ],
    content: [
      `መለያ ሲመዘገቡ፣ ሽልማት ከመልቀቃችን በፊት ወይም በማንኛውም ሌላ ጊዜ ማንነትዎን እንዲያረጋግጡ ልንጠይቅዎት እንችላለን፤ ይህን ስናደርግም መዳረሻዎን ለጊዜው ልናቆም እንችላለን። ከላይ ያሉትን ሁኔታዎች እንደሚያሟሉ ማረጋገጥ ካልቻልን፣ ወደ Mella ያለዎትን መዳረሻ ልንከለክል፣ ልናግድ ወይም ልንዘጋ እንችላለን።`,
    ],
  },
  {
    id: "account",
    number: 4,
    title: "መለያዎ",
    content: [
      `አንድ ሰው፣ አንድ መለያ። ከአንድ በላይ መለያ መፍጠር ወይም መቆጣጠር፣ ወይም ሌላ ሰው መለያዎን እንዲጠቀም መፍቀድ የእነዚህ ውሎች ጥሰት ሲሆን በውጤቱም ሁሉም የተነኩ መለያዎች ሊዘጉ ይችላሉ።`,
      `የደህንነት ችግሩ ከ Mella በኩል ካልሆነ በስተቀር፣ ፈቃድ ሰጥተውትም ሆነ ሳይሰጡ በመለያዎ በኩል ለሚደረገው ማንኛውም ነገር እርስዎ ኃላፊነት አለብዎት። ሌላ ሰው መለያዎን እንደገባበት ካሰቡ ወዲያውኑ ያሳውቁን።`,
      `መለያዎን በማንኛውም ጊዜ በማነጋገር መዝጋት ይችላሉ። ቀድሞ በተከፈተ ጨረታ ውስጥ ያቀረቧቸው ዋጋዎች መለያዎን በመዝጋት አይነኩም፤ እነሱም በክፍል 6 መሠረት ይተናገዳሉ።`,
    ],
  },
  {
    id: "lowest-unique-bid",
    number: 5,
    title: "የዝቅተኛ ብቸኛ ዋጋ ጨረታ እንዴት እንደሚሰራ",
    content: [
      `እያንዳንዱ ጨረታ የተወሰነ የመክፈቻ ሰዓት፣ የመዝጊያ ሰዓት እና የዋጋ ክልል፣ በሚፈቀዱ ዋጋዎች መካከል ያለው ትንሹ የልዩነት መጠን፣ እና አንድ ሰው ሊያቀርባቸው ስለሚችሉ ዋጋዎች የሚወስኑ የታተሙ ደንቦች አሉት። እነዚህ ደንቦች ጨረታው ዋጋ ከመቀበል በፊት ይታያሉ፣ እና ጨረታው ከጀመረ በኋላ አይቀየሩም።`,
      `ጨረታው ከተዘጋ በኋላ ስርዓታችን የቀረቡትን ሁሉንም ዋጋዎች ያወዳድራል። ከአንድ በላይ ተሳታፊ ያቀረበው ማንኛውም የዋጋ መጠን ብቸኛ ስላልሆነ ይወገዳል። ከቀሩት ዋጋዎች መካከል ትንሹ የአሸናፊ ዋጋ ሲሆን፣ ያንን ዋጋ ያቀረበው ተሳታፊ አሸናፊ ይሆናል።`,
      `ለምሳሌ፦ ተሳታፊዎች 310፣ 340፣ 340 እና 385 ካቀረቡ፣ 340 ሁለት ጊዜ ስለቀረበ ይወገዳል። ከ310 እና 385 መካከል 310 ዝቅተኛ ስለሆነ፣ በአንድ ተሳታፊ ብቻ ከቀረበ 310 የአሸናፊ ዋጋ ይሆናል።`,
      `ጨረታው ክፍት በሆነበት ጊዜ የሚካሄድ የዋጋ መሪ ሰሌዳ፣ በተወሰነ ዋጋ ላይ የቀረቡ ዋጋዎች ብዛት ወይም ሌላ የቀጥታ ምልክት አናሳይም። እንዲህ ያለ መረጃ በጨረታ መካከል ማተም ተሳታፊዎች በቀጥታ እርስ በርስ እንዲለዋወጡ እና የጨረታውን ባህሪ እንዲለውጡ ስለሚያደርግ እስከ መዘጋቱ ድረስ ተይዞ ይቆያል።`,
      `ከተዘጋ በኋላ ጨረታ እንደገና ሊከፈት አይችልም፣ ዋጋዎችም ሊነሱ፣ ሊስተካከሉ ወይም ወደ ሌላ ጨረታ ሊዘዋወሩ አይችሉም።`,
    ],
  },
  {
    id: "bids",
    number: 6,
    title: "ዋጋዎች፣ የዋጋ ክፍያዎችና የዋጋ ጥቅሎች",
    content: [
      `ዋጋ ማቅረብ ክፍያ ያስከፍላል፤ ይህም ዋጋውን ከማረጋገጥዎ በፊት ይታይዎታል። ይህን ክፍያ በመክፈል ያ ዋጋ በጨረታው ውስጥ የመቆጠር ዕድል ይገዛሉ - ይህ ለዕቃው ከፊል ክፍያ ሳይሆን፣ ካላሸነፉም ምንም ይሁን ምን ተመላሽ አይደረግም።`,
      `ነጠላ ዋጋዎችን ከመግዛት ይልቅ፣ በአንድ ጊዜ በርካታ ዋጋዎችን የሚሸፍን የዋጋ ጥቅል መግዛት ይችላሉ፤ ይህም ከነጠላ ዋጋዎች ግዢ ያነሰ ጠቅላላ ዋጋ አለው። በመጀመሪያ ማስጀመሪያ፣ ሁለት የጥቅል መጠኖች ይቀርባሉ፦`,
    ],
    bullets: [
      `የ5-ዋጋ ጥቅል፣ ከአምስት ነጠላ ዋጋዎች ወጪ በ5% ያነሰ ዋጋ የሚያስከፍል፤ እና`,
      `የ10-ዋጋ ጥቅል፣ ከአስር ነጠላ ዋጋዎች ወጪ በ12% ያነሰ ዋጋ የሚያስከፍል።`,
    ],
  },
  {
    id: "bids-more",
    number: 6,
    title: "የዋጋ ጥቅሎች — ቀጣይ",
    content: [
      `ሌሎች የጥቅል መጠኖችን ልናስተዋውቅ፣ ነባሮቹን ልናቋርጥ ወይም ከጥቅል ጋር የተያያዘውን ቅናሽ ልንቀይር እንችላለን። እንዲህ ዓይነት ለውጥ ተፈጻሚ የሚሆነው ከለውጡ በኋላ ለተገዙ ጥቅሎች ብቻ ሲሆን፣ ቀድሞ የያዙዋቸውን ዋጋዎች አይነካም።`,
      `ማንም ተሳታፊ ከነጠላ ግዢዎች፣ ከጥቅል ወይም ከሁለቱ ቅንብር ቢሆኑም፣ በአንድ ጨረታ ውስጥ ከ100 ዋጋዎች በላይ ማቅረብ አይችልም።`,
      `ለዋጋዎችና ለዋጋ ጥቅሎች የሚደረጉ ሁሉም ክፍያዎች በቴሌብር ወይም እኛ በምናቀርበው በሌላ የክፍያ ቻናል ይስተናገዳሉ። ገንዘብ ከመለያዎ ከወጣ ነገር ግን ዋጋው በጨረታው ላይ ካልታየ፣ ያሳውቁን፤ እንመረምርና ችግሩን እናስተካክላለን።`,
    ],
  },
  {
    id: "mystery-box",
    number: 7,
    title: "ሚስጥራዊ ሳጥንና ጃክፖት ጨረታዎች",
    content: [
      `ከመደበኛ፣ ስም-ያላቸው ዕቃ ጨረታዎቻችን ጎን ለጎን፣ በግምት በየሦስት ቀኑ የሚስጥራዊ ሳጥን ጨረታ እናካሂዳለን። አሸናፊው እውነተኛ አካላዊ ሽልማት ይቀበላል፣ ነገር ግን ትክክለኛ ማንነቱ ጨረታው እስኪዘጋ ድረስ አይገለጽም።`,
      `በሚስጥራዊ ሳጥን ጨረታ ውስጥ ዋጋ ከማቅረብዎ በፊት፣ ሽልማቱ ከየትኛው ምድብ እንደሚመረጥና ግምታዊ የዋጋ ክልሉን እንነግርዎታለን። አሁን ያለው ስብስብ እንደ ጆሮ ማዳመጫዎች፣ ስማርት ሰዓቶች፣ ስልኮች፣ ላፕቶፖችና ታብሌቶች፣ እንዲሁም ቴሌቪዥኖች ካሉ ዕቃዎች ይመረጣል፤ ትክክለኛው ስሪትና ሞዴል ግን ለአሸናፊው በኋላ ብቻ ይረጋገጣል።`,
      `ሽልማቱ አስቀድሞ ካለመገለጹ በስተቀር፣ የሚስጥራዊ ሳጥን ጨረታ በ Mella ላይ እንዳለ ማንኛውም ጨረታ በተመሳሳይ የዝቅተኛ ብቸኛ ዋጋ ደንብ፣ የዋጋ ገደቦችና የመዝጊያ አሰራር ይካሄዳል።`,
    ],
  },
  {
    id: "payments",
    number: 8,
    title: "ክፍያዎች",
    content: [
      `ለዋጋዎች፣ ለጥቅሎችና ከተሸለመ ዕቃ ጋር ለተያያዘ ማንኛውም ክፍያ ዋጋዎች በኢትዮጵያ ብር የሚታዩ ሲሆን፣ በሽያጭ ጊዜ ልንጨምር የሚገባንን ማንኛውንም ታክስ ያካትታሉ።`,
      `ክፍያዎትን በትክክል ለማስኬድ በቴሌብርና በሌሎች የክፍያ አቅራቢዎች ላይ እንመካለን። ክፍያ ካልተሳካ፣ ከተዘገየ ወይም በክፍያ አቅራቢው ስህተት ምክንያት ሁለት ጊዜ ከተፈጸመ፣ ከዚያ አቅራቢ ጋር እርማት እንዲያገኙ እናግዝዎታለን፣ ነገር ግን የስርዓቶቻቸው ዋስትና ሰጪ አይደለንም።`,
    ],
  },
  {
    id: "claiming-prize",
    number: 9,
    title: "ሽልማት መጠየቅና መቀበል",
    content: [
      `የጨረታውን አሸናፊ በመዝገብ ላይ ባለው የስልክ ቁጥር ወይም የመለያ ዝርዝሮች እናገኘዋለን። የምንልክልዎትን የይገባኛል ደረጃዎች በ7 የቀን መቁጠሪያ ቀናት ውስጥ ምላሽ ሰጥተው መከተል አለብዎት፤ ይህን ካላደረጉ፣ ሽልማቱን ያልተጠየቀ አድርገን እንቆጥረውና ለሌላ ብቁ ተሳታፊ ልናቀርበው ወይም በራሳችን ውሳኔ ልናስተናግደው እንችላለን።`,
      `ሽልማት ከመልቀቃችን በፊት፣ ሽልማቱን የመቀበል መብት እንዳለዎት ለማረጋገጥ በምክንያታዊነት አስፈላጊ የሆኑ የመታወቂያ ማስረጃ፣ የመኖሪያ አድራሻ ማስረጃ ወይም ሌሎች ሰነዶችን ልንጠይቅ እንችላለን።`,
      `ለአብዛኞቹ ዕቃዎች፣ የይገባኛል ጥያቄዎ ከተረጋገጠ በኋላ፣ ከተሰየመ ቦታ ርክክብ ወይም እርስዎ ወደ ሰጡት አድራሻ ማድረስ እናዘጋጃለን፣ በአጠቃላይ በ10 የስራ ቀናት ውስጥ።`,
    ],
  },
  {
    id: "vehicles",
    number: 10,
    title: "የተሽከርካሪ ሽልማቶች",
    content: [
      `የተሽከርካሪ አሸናፊነት ከሌሎች ዕቃዎች በተጨማሪ ተሽከርካሪውን መለያ ዝርዝሮች ማረጋገጥ፣ አቅራቢውን ማረጋገጥ፣ የባለቤትነት ማስተላለፊያና የምዝገባ ሰነዶችን ማዘጋጀት፣ ኢንሹራንስ ማስተካከልና የአካል ርክክብ ምርመራን የመሳሰሉ ተጨማሪ ደረጃዎችን ያካትታል።`,
      `እነዚህ ደረጃዎችና የሚከናወኑበት ቅደም ተከተል ለዚያ የተሽከርካሪ ጨረታ በሚታተሙት ልዩ ደንቦች ውስጥ ይገለጻሉ፣ እና ተሽከርካሪው እጅ ከመቀየሩ በፊት ሁሉም መጠናቀቅ አለባቸው።`,
      `የምዝገባ ክፍያዎች፣ የማስተላለፊያ ታክሶች፣ የኢንሹራንስ ክፍያዎችና ተሽከርካሪውን በስምዎ ለማስመዝገብ ሶስተኛ ወገን የሚያስከፍለው ማንኛውም ወጪ የአሸናፊው ኃላፊነት ነው፣ ለዚያ ተሽከርካሪ የጨረታ ደንቦች ሌላ ካልሉ።`,
    ],
  },
  {
    id: "faulty-prizes",
    number: 11,
    title: "ጉድለት ያለባቸው፣ የተጎዱ ወይም ትክክል ያልሆኑ ሽልማቶች",
    content: [
      `የደረሰዎትን ወይም የተረከቡትን ዕቃ እንደደረሰዎት ወዲያውኑ ይመርምሩ። ከተጎዳ፣ ከታተመው መግለጫ ጋር የማይመሳሰል ከሆነ ወይም ሊኖረው የሚገባ ነገር ጎድሎት ከሆነ፣ ከደረሰዎት በ48 ሰዓታት ውስጥ ያሳውቁን።`,
      `ዕቃው ከእጃችን ሲወጣ ጉድለት እንደነበረበት ወይም በስህተት እንደተገለጸ ካረጋገጥን፣ እንጠግነዋለን፣ እንተካዋለን፣ ወይም ሁለቱም የማይሆኑ ከሆነ፣ ያንን ልዩ ጨረታ ለማሸነፍ ያወጡትን የዋጋ ክፍያዎች ተመላሽ እናደርጋለን። ይህ ተፈጻሚ የማይሆነው ጉድለቱ ዕቃውን ከተቀበሉ በኋላ በተከሰተ ነገር ምክንያት ከሆነ ነው።`,
      `ከዚህ ውጪ፣ ዕቃ የያዘው አምራቹ የሚሰጠውን ዋስትና ብቻ ነው።`,
    ],
  },
  {
    id: "nature",
    number: 12,
    title: "የዚህ አገልግሎት ባህሪ",
    content: [
      `ዋጋ ማቅረብ ውጤት ሳይሆን ዕድል ይገዛልዎታል። በአንድ ጨረታ ውስጥ ያሉ አብዛኞቹ ተሳታፊዎች አያሸንፉም፤ ለመሳተፍ የሚከፍሉት ክፍያም ለመሳተፍ የሚያስከፍል ወጪ እንጂ ለዕቃው ባለቤትነት ማስያዣ ወይም ክፍያ አይደለም።`,
      `Mella የሚሸልመው አካላዊ ዕቃዎችን ብቻ ነው። የገንዘብ-ሽልማት ዕጣ አናካሂድም፤ በ Mella ላይ ያለ ማንኛውም ነገር እንደ ሎተሪ ትኬት፣ ውርርድ ወይም የፋይናንስ ኢንቨስትመንት ተደርጎ መታየት ወይም መቆጠር የለበትም።`,
    ],
  },
  {
    id: "conduct",
    number: 13,
    title: "የባህሪ ደንቦች",
    content: [
      `Mellaን ሲጠቀሙ የሚከተሉትን እንደማያደርጉ ተስማምተዋል፦`,
    ],
    bullets: [
      `ከአንድ በላይ መለያ መስራት ወይም መጠቀም፤`,
      `ዋጋዎችን ለማቅረብ ስክሪፕት፣ ቦት ወይም ሌላ አውቶማቲክ መሳሪያ መጠቀም፤`,
      `ከመደበኛ የአገልግሎት አጠቃቀም ውጪ የ Mella ስርዓቶችን ለመድረስ፣ ለመቀየር ወይም ለማስተጓጎል መሞከር፤`,
      `በምዝገባ ወይም በማንነት ማረጋገጫ ወቅት የሐሰት መረጃ መስጠት፤ ወይም`,
      `የጨረታን ውጤት ለመቆጣጠር በማሰብ ከሌሎች ተሳታፊዎች ጋር ዋጋ ለማቅረብ ወይም ላለማቅረብ መስማማት።`,
    ],
    content: [
      `ከእነዚህ ደንቦች የትኛውንም መጣስ የተጠየቁት ዋጋዎች እንዳይቆጠሩ ሊያደርግ፣ መለያዎ ሊታገድ ወይም ሊዘጋ፣ እንዲያሸንፉ የሚገባዎትን ሽልማት ሊያሳጣዎት እና ህግ በሚጠይቅበት ጊዜ ለሚመለከታቸው ባለሥልጣናት ሪፖርት ሊደረግ ይችላል።`,
    ],
  },
  {
    id: "monitoring",
    number: 14,
    title: "ክትትል፣ ምርመራና አፈጻጸም",
    content: [
      `የዋጋዎችን፣ የጨረታ ውጤቶችንና የመለያ እንቅስቃሴዎችን መዝገብ እንይዛለን፤ ጨረታው በታተመው ደንብ መሠረት መካሄዱን ለማረጋገጥ በማንኛውም ጊዜ ልንገመግማቸው እንችላለን።`,
      `ግምገማችን የተቀናጀ፣ አውቶማቲክ ወይም ከመደበኛ ተሳትፎ ጋር የማይጣጣም የሚመስል ንድፍ ካገኘ፣ የተነካውን የጨረታ ውጤት ልንይዝ፣ ለተካተቱት ተሳታፊዎች ማብራሪያ ልንጠይቅ እንችላለን፤ ማብራሪያውም የማያረካን ከሆነ በክፍል 13 መሠረት እርምጃ እንወስዳለን።`,
    ],
  },
  {
    id: "privacy",
    number: 15,
    title: "ግላዊነትዎ",
    content: [
      `መለያዎን ለማስኬድ፣ ተሳትፎ ለማድረግ ብቁ መሆንዎን ለማረጋገጥ፣ ክፍያዎችን ለማስኬድና ካሸነፉ ሽልማት ለማድረስ የሚያስፈልገንን የግል መረጃ እንሰበስባለን — ከዚያ በላይ አይደለም።`,
      `መረጃዎ በኢትዮጵያ የመረጃ ጥበቃ ህግና አንድ የተወሰነ ጨረታ በቴሌብር በኩል በሚደረስበት ጊዜ ተጨማሪ በሚመለከተው መስፈርት መሠረት ይያዛል። ምን እንደምንሰበስብና ለምን እንደምንሰበስብ ሙሉ ዝርዝር በእነዚህ ውሎች አካል በሆነው የተለየ የግላዊነት ማስታወቂያችን ውስጥ ተገልጿል።`,
      `የአሸናፊውን የግል መረጃ እንደ ጨረታ ውጤት አካል አናትም። አሸናፊን በይፋ ስንጠቅስ የዚያን ሰው የተለየ ፈቃድ ካገኘን ብቻ ነው።`,
    ],
  },
  {
    id: "intellectual-property",
    number: 16,
    title: "የአዕምሮ ንብረት",
    content: [
      `የMella ስም፣ አርማ፣ እና ከጨረታ አገልግሎቱ በስተጀርባ ያለው ሶፍትዌርና ንድፍ የ Mella ወይም የፈቃድ ሰጪዎቹ ንብረት ናቸው። እነሱን መጠቀም የሚችሉት በመደበኛ መንገድ በጨረታዎች ለመሳተፍ በሚያስፈልግ መጠን ብቻ ሲሆን፣ ለመቅዳት፣ ለማስማማት ወይም ተወዳዳሪ አገልግሎት ለመገንባት አይደለም።`,
    ],
  },
  {
    id: "liability",
    number: 17,
    title: "የእኛ ኃላፊነት ለእርስዎ",
    content: [
      `በእኛ በኩል ችግር ከተከሰተና ካሳ የማግኘት መብት ካለዎት፣ ለተወሰነ ጨረታ ልንከፍልዎት የምንችለው ከፍተኛ መጠን ለዚያ ጨረታ በትክክል የከፈሉት የዋጋ ክፍያ መጠን ነው።`,
      `ከመሣሪያዎ፣ ከኔትወርክ ግንኙነትዎ ወይም ከስርዓቶቻችን ውጪ ካለ የክፍያ አቅራቢ ችግር የተነሳ ሊያቀርቡት ላሰቡት ነገር ግን ላላቀረቡት ዋጋ ኃላፊነት አንወስድም።`,
      `በእነዚህ ውሎች ውስጥ ያለ ምንም ነገር በስምምነት በህጋዊ መንገድ ሊገደብ የማይችል የኢትዮጵያ ህግ ለእርስዎ እንደ ሸማች የሚሰጠውን ጥበቃ አይቀንስም።`,
    ],
  },
  {
    id: "suspending",
    number: 18,
    title: "መለያዎን ማገድ ወይም መዝጋት",
    content: [
      `እነዚህን ውሎች እንደጣሱ በምክንያታዊነት ካመንን፣ ቴሌብር ወይም ኢትዮ ቴሌኮም እንድናደርግ ከጠየቁን ወይም በህግ ከተጠየቅን፣ ቀድሞ ማስጠንቀቂያ ሰጥተንም ይሁን ሳንሰጥ መለያዎን ልናግድ ወይም ልንዘጋ እንችላለን።`,
      `መለያዎን መዝጋት ገና ባልተዘጉ ጨረታዎች ላይ ቀድሞ ለወጡ የዋጋ ክፍያዎች፣ ክፍል 11 ተፈጻሚ ካልሆነ በስተቀር፣ ተመላሽ የማግኘት መብት አይሰጥዎትም።`,
    ],
  },
  {
    id: "changes",
    number: 19,
    title: "ልናደርጋቸው የምንችላቸው ለውጦች",
    content: [
      `Mella እያደገ ሲሄድ፣ ከኢትዮ ቴሌኮም ጋር ያለን ስምምነት ሲለወጥ ወይም የኢትዮጵያ ህግ ሲጠይቅ እነዚህን ውሎች ልናዘምን እንችላለን። የተዘመነውን ቅጂ በ Mella ላይ እናወጣለን፤ እርስዎን በእጅጉ ለሚነኩ ለውጦችም በአገልግሎቱ በኩል ምክንያታዊ ቅድመ ማስታወቂያ እንሰጣለን።`,
      `ለውጥ በቀድሞው የእነዚህ ውሎች ቅጂ ስር አስቀድሞ የተዘጋን ጨረታ ወደኋላ ተመልሶ አይነካም።`,
    ],
  },
  {
    id: "events",
    number: 20,
    title: "ከቁጥጥራችን ውጪ የሆኑ ክስተቶች",
    content: [
      `ብሔራዊ የኔትወርክ ወይም የቴሌብር መቆራረጥ፣ የተፈጥሮ አደጋ፣ የመንግስት እርምጃ ወይም ተመሳሳይ መስተጓጎልን የመሳሰሉ በምክንያታዊነት ከቁጥጥራችን ውጪ በሆነ ነገር ለሚከሰት የጨረታ መዘግየት፣ መስተጓጎል ወይም ስረዛ ኃላፊነት አንወስድም። ይህ ሲከሰት፣ ምክንያታዊ በሆነ ጊዜ ውስጥ የተነኩ ጨረታዎችን እናስጀምራለን ወይም እንደገና እናስተካክላለን።`,
    ],
  },
  {
    id: "disagreement",
    number: 21,
    title: "አለመግባባትን መፍታት",
    content: [
      `ከጨረታ ውጤት ወይም ከሌላ ማንኛውም ውሳኔያችን ጋር ካልተስማሙ፣ የሚጠይቁትን ክስተት ተከትሎ በ10 የቀን መቁጠሪያ ቀናት ውስጥ በተቻለ መጠን ዝርዝር መረጃ ይዘው መጀመሪያ የድጋፍ ቡድናችንን ያነጋግሩ።`,
      `ጉዳዩን ከመዝገቦቻችንና ለዚያ ጨረታ ከታተሙት ደንቦች ጋር እናመሳክራለን፣ ተጨባጭ ምላሽም እንሰጥዎታለን። ከዚያ በኋላ ጉዳዩ ገና እንዳልተፈታ ካሰቡ፣ በክፍል 22 መሠረት ሊቀጥሉበት ይችላሉ።`,
    ],
  },
  {
    id: "governing-law",
    number: 22,
    title: "ተፈጻሚ ህግ",
    content: [
      `እነዚህ ውሎች በኢትዮጵያ ፌዴራላዊ ዲሞክራሲያዊ ሪፐብሊክ ህግ የሚመሩ ሲሆኑ፣ ከእነዚህ ውሎች ወይም ከ Mella አጠቃቀምዎ የሚነሳ በቀጥታ ሊፈታ የማይችል ማንኛውም የይገባኛል ጥያቄ በብቁ የኢትዮጵያ ፍርድ ቤቶች ስልጣን ስር ይወድቃል።`,
    ],
  },
  {
    id: "general",
    number: 23,
    title: "አጠቃላይ ድንጋጌዎች",
    content: [
      `ፍርድ ቤት የእነዚህ ውሎች ክፍል ተፈጻሚ ሊሆን እንደማይችል ካገኘ፣ የተነካው ያ ክፍል ብቻ ነው፤ የቀረው ተፈጻሚ ሆኖ ይቀጥላል። ጥሰትን ወዲያውኑ አለመያዛችን በኋላ ላይ በዚያ ወይም በተመሳሳይ ጥሰት ላይ የመርምራት መብታችንን እንደተውን አያሳይም።`,
      `እነዚህ ውሎች፣ ለእያንዳንዱ ጨረታ ከሚታተሙት ልዩ ደንቦችና ከግላዊነት ማስታወቂያችን ጋር፣ አገልግሎቱን ስለመጠቀም በእርስዎና በMella መካከል ያለው ሙሉ ስምምነት ሲሆኑ፣ ቀድሞ የተወያየበትን ማንኛውንም ነገር ይተካሉ።`,
    ],
  },
  {
    id: "contact",
    number: 24,
    title: "እኛን እንዴት ማግኘት እንደሚቻል",
    content: [
      `ስለእነዚህ ውሎች፣ ስለ መለያ ወይም ስለ ጨረታ ጥያቄዎች በ Mella ላይ በታተሙት የመገናኛ ቻናሎች ወይም እንደ አግባቡ በቴሌብር ሱፐር አፕ በኩል ለድጋፍ ቡድናችን ሊላኩ ይችላሉ።`,
    ],
  },
];

const englishNav = englishSections.filter(
  (section, index, array) =>
    array.findIndex((item) => item.number === section.number) === index
);

const amharicNav = amharicSections.filter(
  (section, index, array) =>
    array.findIndex((item) => item.number === section.number) === index
);

function TermsSectionCard({
  section,
  isAmharic,
}: {
  section: TermSection;
  isAmharic: boolean;
}) {
  return (
    <section
      id={`section-${section.id}`}
      className="scroll-mt-32 rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.04)] sm:rounded-3xl sm:p-8 lg:p-10"
    >
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1681C5]/10 text-sm font-bold text-[#1681C5]">
          {section.number}
        </div>

        <div className="min-w-0">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#F78000]">
            {isAmharic ? `ክፍል ${section.number}` : `SECTION ${section.number}`}
          </p>

          <h2
            className={`font-display text-xl font-bold leading-tight text-[#111827] sm:text-2xl ${
              isAmharic ? "font-medium" : ""
            }`}
          >
            {section.title}
          </h2>
        </div>
      </div>

      <div
        className={`space-y-5 text-[15px] leading-7 text-black/70 sm:text-base sm:leading-8 ${
          isAmharic ? "font-medium" : ""
        }`}
      >
        {section.content.map((paragraph, index) => (
          <p key={`${section.id}-p-${index}`}>{paragraph}</p>
        ))}

        {section.bullets && section.bullets.length > 0 && (
          <ul className="space-y-3 pl-0">
            {section.bullets.map((bullet, index) => (
              <li
                key={`${section.id}-b-${index}`}
                className="flex items-start gap-3"
              >
                <span className="mt-[9px] h-2 w-2 shrink-0 rounded-full bg-[#F78000]" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default function TermsPage() {
  const { language } = useLanguage();

  const isAmharic = language === "am";

  const sections = useMemo(
    () => (isAmharic ? amharicSections : englishSections),
    [isAmharic]
  );

  const navigation = isAmharic ? amharicNav : englishNav;

  return (
    <main
      className={`min-h-screen overflow-x-hidden bg-[#F7F8FA] ${
        isAmharic ? "font-sans" : ""
      }`}
    >
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-white pt-[100px] sm:pt-[120px]">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1681C5]/10 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-[#F78000]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-12 sm:px-6 sm:pb-16 lg:px-10 lg:pb-20">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-black/60 transition hover:text-[#1681C5]"
          >
            <ArrowLeft className={`h-4 w-4 ${isAmharic ? "rotate-180" : ""}`} />
            {isAmharic ? "ወደ መነሻ ገጽ" : "Back to home"}
          </Link>

          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1681C5]/15 bg-[#1681C5]/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1681C5]">
              <FileText className="h-4 w-4" />
              {isAmharic ? "MELLA · የውል ውሎች" : "MELLA · TERMS"}
            </div>

            <h1 className="font-display text-4xl font-bold tracking-tight text-[#111827] sm:text-5xl lg:text-6xl">
              {isAmharic
                ? "የውል ውሎችና ሁኔታዎች"
                : "Terms & Conditions"}
            </h1>

            <p
              className={`mt-5 max-w-3xl text-base leading-7 text-black/60 sm:text-lg sm:leading-8 ${
                isAmharic ? "font-medium" : ""
              }`}
            >
              {isAmharic
                ? "በቴሌብር ሱፐር አፕ በኩል መድረሱን ጨምሮ የ Mella ዝቅተኛ ብቸኛ ዋጋ ጨረታ አገልግሎት አጠቃቀምን የሚመራ።"
                : "Governing the use of the Mella Lowest Unique Bid Auction service, including where accessed through the telebirr Super App."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-black/70 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-[#1681C5]" />
                {isAmharic ? "እትም 1.0" : "Version 1.0"}
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-black/70 shadow-sm">
                <Scale className="h-4 w-4 text-[#F78000]" />
                {isAmharic ? "መስከረም 2026" : "Effective September 2026"}
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-black/70 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-[#1681C5]" />
                {isAmharic ? "ለግምገማ" : "For Review"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DOCUMENT */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:items-start">
          {/* DESKTOP SIDE NAV */}
          <aside className="hidden lg:block lg:sticky lg:top-28">
            <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.04)]">
              <div className="mb-4 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#1681C5]" />
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-black/50">
                  {isAmharic ? "በዚህ ገጽ ላይ" : "On this page"}
                </p>
              </div>

              <nav className="space-y-1">
                {navigation.map((section) => (
                  <a
                    key={`${section.number}-${section.id}`}
                    href={`#section-${section.id}`}
                    className="group flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-black/60 transition hover:bg-[#1681C5]/5 hover:text-[#1681C5]"
                  >
                    <span className="w-5 shrink-0 text-xs font-bold text-black/30 group-hover:text-[#1681C5]">
                      {section.number}
                    </span>

                    <span className="min-w-0 flex-1 truncate">
                      {section.title}
                    </span>

                    <ChevronRight
                      className={`h-3.5 w-3.5 shrink-0 opacity-0 transition group-hover:opacity-100 ${
                        isAmharic ? "rotate-180" : ""
                      }`}
                    />
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* MOBILE DOCUMENT INDEX */}
          <div className="lg:hidden">
            <details className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-semibold text-[#111827]">
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#1681C5]" />
                  {isAmharic ? "የውሎች ማውጫ" : "Terms index"}
                </span>

                <ChevronRight className="h-4 w-4 text-black/40" />
              </summary>

              <div className="border-t border-black/10 px-4 py-3">
                <nav className="grid gap-1 sm:grid-cols-2">
                  {navigation.map((section) => (
                    <a
                      key={`${section.number}-${section.id}-mobile`}
                      href={`#section-${section.id}`}
                      className="rounded-xl px-3 py-2.5 text-sm text-black/65 transition hover:bg-[#1681C5]/5 hover:text-[#1681C5]"
                    >
                      <span className="mr-2 font-bold text-[#1681C5]">
                        {section.number}.
                      </span>
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </details>
          </div>

          {/* TERMS */}
          <div className="min-w-0 space-y-6 sm:space-y-8">
            {sections.map((section, index) => (
              <div key={`${section.number}-${section.id}-${index}`}>
                <TermsSectionCard
                  section={section}
                  isAmharic={isAmharic}
                />
              </div>
            ))}

            {/* FINAL NOTICE */}
            <div className="overflow-hidden rounded-2xl bg-[#1681C5] p-6 text-white shadow-[0_15px_45px_rgba(22,129,197,0.2)] sm:rounded-3xl sm:p-8 lg:p-10">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-2xl">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                    <Gavel className="h-5 w-5" />
                  </div>

                  <h2 className="font-display text-2xl font-bold sm:text-3xl">
                    {isAmharic
                      ? "እነዚህን ውሎች በጥንቃቄ ያንብቡ"
                      : "Please read these Terms carefully"}
                  </h2>

                  <p
                    className={`mt-3 text-sm leading-7 text-white/75 sm:text-base ${
                      isAmharic ? "font-medium" : ""
                    }`}
                  >
                    {isAmharic
                      ? "Mellaን በመመዝገብ፣ ዋጋ በመግዛት ወይም በጨረታ በመሳተፍ እነዚህን ውሎች እንደተቀበሉ ይቆጠራል።"
                      : "By registering, buying a Bid, or participating in an Auction, you agree to these Terms."}
                  </p>
                </div>

                <Link
                  href="/"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1681C5] transition hover:bg-white/90"
                >
                  {isAmharic ? "ወደ መነሻ" : "Back home"}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
