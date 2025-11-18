import React, { useState } from "react";
import axios from "axios";
import {
  Search,
  BookOpen,
  Leaf,
  Loader2,
  FlaskConical,
  Globe,
  ArrowRight,
  Sparkles,
  Network,
  ChevronRight,
  Languages,
} from "lucide-react";

// ---Translation Dictionary ---
const translations = {
  header: {
    title: { bn: "Mr. Botanist", en: "Mr. Botanist" },
    subtitle: {
      bn: "বাংলাদেশী শিক্ষার্থীদের জন্য",
      en: "For Bangladeshi Students",
    },
    navHome: { bn: "হোম", en: "Home" },
    navSearch: { bn: "অনুসন্ধান", en: "Search" },
    navResources: { bn: "রিসোর্স", en: "Resources" },
  },
  hero: {
    title: {
      bn: "উদ্ভিদ জগত অন্বেষণ করুন",
      en: "Explore the Plant Kingdom",
    },
    description: {
      bn: "যেকোনো উদ্ভিদের নাম অথবা বৈজ্ঞানিক নাম লিখে সার্চ করুন এবং বিস্তারিত জানুন।",
      en: "Search by Name or Scientific name of any plant to get details.",
    },
    subdescription: {
      bn: "শ্রেণীবিন্যাস দেখতে বৈজ্ঞানিক নাম দিয়ে সার্চ করুন।",
      en: "Search by scientific name to view taxonomy.",
    },
    placeholder: {
      bn: "অনুসন্ধান করুন (যেমন: Mango, Mangifera indica...)",
      en: "Search here (e.g., Mango, Mangifera indica...)",
    },
  },
  status: {
    loading: { bn: "তথ্য খোঁজা হচ্ছে...", en: "Fetching data..." },
    errorNotFound: {
      bn: "দুঃখিত, উদ্ভিদটি খুঁজে পাওয়া যায়নি। সঠিক ইংরেজি নাম বা বৈজ্ঞানিক নাম দিয়ে চেষ্টা করুন।",
      en: "Sorry, plant not found. Please try with correct English or Scientific name.",
    },
    errorNetwork: {
      bn: "তথ্য লোড করতে সমস্যা হচ্ছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।",
      en: "Error loading data. Please check your internet connection.",
    },
    noImage: { bn: "ছবি পাওয়া যায়নি", en: "No Image Found" },
  },
  plantCard: {
    sciNameLabel: { bn: "বৈজ্ঞানিক নাম", en: "Scientific Name" },
    verified: { bn: "উইকিডাটা দ্বারা যাচাইকৃত", en: "Verified from Wikidata" },
    readMore: {
      bn: "বিস্তারিত তথ্যের জন্য নিচের বাটন ব্যবহার করুন।",
      en: "Please use the buttons below for more details.",
    },
    btnWiki: { bn: "উইকিপিডিয়া ডিটেইলস", en: "Wikipedia Details" },
    btnGoogle: { bn: "গুগলে আরও খুঁজুন", en: "Search on Google" },
    notFoundSci: {
      bn: "বৈজ্ঞানিক নাম পাওয়া যায়নি",
      en: "Scientific name not found",
    },
  },
  taxonomy: {
    title: { bn: "শ্রেণীবিন্যাস", en: "Taxonomy" },
    subtitle: {
      bn: "বৈজ্ঞানিক শ্রেণীবিন্যাস",
      en: "Scientific Classification",
    },
    source: {
      bn: "ডেটা উৎস: উইকিডাটা ট্যাক্সোনমি ডাটাবেস",
      en: "Data source: Wikidata Taxonomy Database",
    },
  },
  resources: {
    title: { bn: "শিক্ষার্থীদের জন্য রিসোর্স", en: "Resources for Students" },
    author: { bn: "লেখক", en: "Author" },
    btnRead: { bn: "পড়তে ক্লিক করুন", en: "Click to Read" },
  },
  footer: {
    tagline: {
      bn: "বাংলাদেশের উদ্ভিদপ্রেমী ও শিক্ষার্থীদের জন্য নিবেদিত",
      en: "Dedicated to plant lovers and students of Bangladesh",
    },
    developed: { bn: "ডেভেলপ করেছেন", en: "Developed by" },
  },
};

// Taxonomy labels (Dynamic based on language)
const getTaxonomyLabel = (rank, lang) => {
  const labels = {
    kingdom: { bn: "জগত", en: "Kingdom" },
    phylum: { bn: "পর্ব", en: "Phylum" },
    class: { bn: "শ্রেণী", en: "Class" },
    order: { bn: "বর্গ", en: "Order" },
    family: { bn: "গোত্র", en: "Family" },
    genus: { bn: "গণ", en: "Genus" },
    species: { bn: "প্রজাতি", en: "Species" },
  };
  return labels[rank] ? labels[rank][lang] : rank;
};

// ডামি রিসোর্স ডাটা (টাইটেল ইংরেজিতেই রাখা হয়েছে কারণ এগুলো রিসার্চ পেপার)
const researchPapers = [
  {
    id: 1,
    title: "Medicinal Plants of Bangladesh",
    author: "Dr. M. Rahman",
    link: "https://ijesrc.com/wp-content/uploads/2024/10/MEDICINAL-PLANTS-OF-BANGLADESH-FOR-DRUG-DEVELOPMENT.pdf",
    type: "PDF",
  },
  {
    id: 2,
    title: "Flora of the Sundarbans",
    author: "Biodiversity Research Group",
    link: "https://www.researchgate.net/publication/353839905_Flora_of_the_Sundarbans",
    type: "Article",
  },
  {
    id: 3,
    title: "Rice Varieties and Cultivation (Drought-Tolerant BRRI dhan66)",
    author: "BRRI Publications",
    link: "https://www.banglajol.info/index.php/BRJ/article/view/46080",
    type: "Journal",
  },
  {
    id: 4,
    title: "Comparative Analysis of Aquatic Plant Biodiversity in Bangladesh",
    author: "Gazlima Chowdhury, Sumaiya Bhuian, et al.",
    link: "https://journalajfar.com/index.php/AJFAR/article/view/949",
    type: "Research",
  },
  {
    id: 5,
    title: "Quantitative Ethnobotany of Medicinal Plants in Bandarban",
    author: "M. J. Sultanul Amir, H. T. Sadia, et al.",
    link: "https://www.frontiersin.org/articles/10.3389/fphar.2018.00040/full",
    type: "Journal",
  },
  {
    id: 6,
    title: "Plant Taxonomy and Biodiversity Researches in Bangladesh",
    author: "M. Atiqur Rahman",
    link: "https://www.nepjol.info/index.php/IJE/article/view/10645",
    type: "PDF",
  },
];

function App() {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem("preferredLanguage");
    return saved || "bn";
  });

  const [query, setQuery] = useState("");
  const [plantData, setPlantData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [taxonomy, setTaxonomy] = useState(null);

  // language toggle function
  const toggleLanguage = () => {
    const newLang = lang === "bn" ? "en" : "bn";
    setLang(newLang);
    localStorage.setItem("preferredLanguage", newLang);
  };

  //  data fetch function for taxonomy from wikidata
  const fetchTaxonomy = async (wikidataId) => {
    try {
      const response = await axios.get("https://www.wikidata.org/w/api.php", {
        params: {
          action: "wbgetentities",
          ids: wikidataId,
          props: "claims|labels",
          languages: "en",
          format: "json",
          origin: "*",
        },
      });

      // Better approach: Get parent taxon iteratively
      const betterTaxonomy = await getTaxonomyHierarchy(wikidataId);
      return betterTaxonomy;
    } catch (err) {
      console.error("Taxonomy fetch error:", err);
      return null;
    }
  };

  // Get taxonomy hierarchy by following parent taxon chain
  const getTaxonomyHierarchy = async (wikidataId) => {
    const hierarchy = {};
    let currentId = wikidataId;
    const visited = new Set();

    try {
      // লুপ লিমিট বাড়িয়ে ১৫ করা হয়েছে যাতে Kingdom পর্যন্ত পৌঁছাতে পারে
      while (currentId && visited.size < 15) {
        if (visited.has(currentId)) break;
        visited.add(currentId);

        const response = await axios.get("https://www.wikidata.org/w/api.php", {
          params: {
            action: "wbgetentities",
            ids: currentId,
            props: "claims|labels",
            languages: "en",
            format: "json",
            origin: "*",
          },
        });

        const entity = response.data.entities[currentId];
        if (!entity) break;

        const claims = entity.claims;
        // বৈজ্ঞানিক নাম বা লেবেল নেওয়া
        const label = entity.labels?.en?.value;

        // Rank বের করা (P105)
        const rankId = claims.P105?.[0]?.mainsnak?.datavalue?.value?.id;
        const rank = await getTaxonRank(rankId);

        // যদি Rank এবং Label দুটোই থাকে, তাহলে লিস্টে যোগ করুন
        if (rank && label && !hierarchy[rank]) {
          hierarchy[rank] = label;
        }

        // Parent Taxon (P171) খোঁজা, না পেলে Subclass of (P279) দেখা
        const parentId =
          claims.P171?.[0]?.mainsnak?.datavalue?.value?.id ||
          claims.P279?.[0]?.mainsnak?.datavalue?.value?.id;

        if (!parentId) break;
        currentId = parentId;
      }

      return hierarchy;
    } catch (err) {
      console.error("Hierarchy fetch error:", err);
      return hierarchy;
    }
  };

  // ১. Taxon Rank ফাংশনটি আপডেট করুন (Division যোগ করা হয়েছে)
  const getTaxonRank = async (rankId) => {
    if (!rankId) return null;

    const rankMap = {
      Q7432: "species",
      Q34740: "genus",
      Q35409: "family",
      Q36602: "order",
      Q37517: "class",
      Q38348: "phylum", // Zoology-তে Phylum
      Q334460: "phylum", // Botany-তে Division (এটি মিসিং ছিল)
      Q36732: "kingdom",
    };

    return rankMap[rankId] || null;
  };

  // Wikipedia data fetch function
  // Modified searchPlant function to support Bengali
  const searchPlant = async (e) => {
    if (e) e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError("");
    setPlantData(null);
    setScientificName("");
    setTaxonomy(null);

    // আমরা একটি নতুন ভেরিয়েবল নিচ্ছি, কারণ 'query' স্টেট আমরা সরাসরি বদলাবো না
    let searchQuery = query;

    try {
      // ধাপ ১: ইনপুটটি বাংলা কি না তা চেক করা (Regex ব্যবহার করে)
      const isBengali = /[\u0980-\u09FF]/.test(query);

      if (isBengali) {
        // যদি বাংলা হয়, তবে বাংলা উইকিপিডিয়া থেকে ইংরেজি টাইটেল খুঁজে বের করা
        const bnUrl = "https://bn.wikipedia.org/w/api.php";
        const bnParams = {
          action: "query",
          format: "json",
          prop: "langlinks",
          lllang: "en", // আমাদের ইংরেজি লিংক দরকার
          titles: query,
          redirects: 1,
          origin: "*",
        };

        const bnResponse = await axios.get(bnUrl, { params: bnParams });
        const bnPages = bnResponse.data.query.pages;
        const bnPageId = Object.keys(bnPages)[0];

        if (bnPageId === "-1") {
          throw new Error("not_found_bn");
        }

        const englishTitle = bnPages[bnPageId].langlinks?.[0]?.["*"];

        if (englishTitle) {
          searchQuery = englishTitle; // যেমন: 'আম' ইনপুট দিলে এখানে 'Mango' সেট হবে
        } else {
          // বাংলা পেজ আছে কিন্তু ইংরেজি লিংক নেই
          throw new Error("no_english_link");
        }
      }

      // ধাপ ২: ইংরেজি নাম (searchQuery) দিয়ে মেইন ডাটা ফেচ করা (আপনার আগের লজিক)
      const url = `https://en.wikipedia.org/w/api.php`;
      const params = {
        action: "query",
        format: "json",
        prop: "extracts|pageimages|pageprops",
        titles: searchQuery, // এখানে query এর বদলে searchQuery ব্যবহার করছি
        pithumbsize: 600,
        exintro: true,
        explaintext: true,
        redirects: 1,
        origin: "*",
      };

      const response = await axios.get(url, { params });
      const pages = response.data.query.pages;
      const pageId = Object.keys(pages)[0];

      if (pageId === "-1") {
        setError(translations.status.errorNotFound[lang]);
      } else {
        const data = pages[pageId];
        setPlantData(data);

        // বৈজ্ঞানিক নাম বের করার লজিক
        let scientificNameFound = "";
        let wikidataId = null;

        if (data.pageprops && data.pageprops.wikibase_item) {
          wikidataId = data.pageprops.wikibase_item;
          try {
            const wikidataUrl = `https://www.wikidata.org/w/api.php`;
            const wikidataParams = {
              action: "wbgetentities",
              ids: wikidataId,
              props: "claims",
              format: "json",
              origin: "*",
            };

            const wikidataResponse = await axios.get(wikidataUrl, {
              params: wikidataParams,
            });
            const entity = wikidataResponse.data.entities[wikidataId];

            if (entity.claims && entity.claims.P225) {
              scientificNameFound =
                entity.claims.P225[0].mainsnak.datavalue.value;
            }

            const taxonomyData = await fetchTaxonomy(wikidataId);
            setTaxonomy(taxonomyData);
          } catch (err) {
            console.log("Wikidata fetch error:", err);
          }
        }

        if (!scientificNameFound) {
          const extractText = data.extract || "";
          const patterns = [
            /\(([A-Z][a-z]+ [a-z]+)\)/,
            /scientific name[:\s]+([A-Z][a-z]+ [a-z]+)/i,
            /binomial name[:\s]+([A-Z][a-z]+ [a-z]+)/i,
            /^([A-Z][a-z]+ [a-z]+)/,
          ];

          for (const pattern of patterns) {
            const match = extractText.match(pattern);
            if (match && match[1] && /^[A-Z][a-z]+ [a-z]+/.test(match[1])) {
              scientificNameFound = match[1];
              break;
            }
          }
        }

        setScientificName(
          scientificNameFound || translations.plantCard.notFoundSci[lang]
        );
      }
    } catch (err) {
      // এরর হ্যান্ডলিং কাস্টমাইজ করা হয়েছে
      if (err.message === "not_found_bn") {
        setError(
          lang === "bn"
            ? "বাংলা উইকিপিডিয়ায় এই উদ্ভিদটি পাওয়া যায়নি।"
            : "Plant not found in Bengali Wikipedia."
        );
      } else if (err.message === "no_english_link") {
        setError(
          lang === "bn"
            ? "দুঃখিত, এই উদ্ভিদের ইংরেজি তথ্য বা বৈজ্ঞানিক নাম ডাটাবেসে নেই।"
            : "Sorry, English data/Scientific name not linked for this item."
        );
      } else {
        setError(translations.status.errorNetwork[lang]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSearch = () => {
    if (plantData) {
      const searchUrl = `https://www.google.com/search?q=${plantData.title}+botany+scientific+details`;
      window.open(searchUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 text-gray-800 font-sans">
      {/* --- Header --- */}
      <header className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf size={32} className="text-emerald-200 animate-pulse" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-wide">
                {translations.header.title[lang]}
              </h1>
              <p className="text-[10px] md:text-xs text-emerald-100 uppercase tracking-wider">
                {translations.header.subtitle[lang]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* --- Navigation (Desktop) --- */}
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <a href="#" className="hover:text-emerald-200 transition">
                {translations.header.navHome[lang]}
              </a>
              <a href="#search" className="hover:text-emerald-200 transition">
                {translations.header.navSearch[lang]}
              </a>
              <a
                href="#resources"
                className="hover:text-emerald-200 transition"
              >
                {translations.header.navResources[lang]}
              </a>
            </nav>

            {/* ---  Language Toggle Button --- */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full transition-all text-xs md:text-sm font-semibold border border-white/10 backdrop-blur-sm"
            >
              <Languages size={16} />
              {lang === "bn" ? "English" : "বাংলা"}
            </button>
          </div>
        </div>
      </header>

      {/* --- Hero and Search Section --- */}
      <section id="search" className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-emerald-700 mb-4 font-serif">
            {translations.hero.title[lang]}
          </h2>
          <p className="text-gray-600 text-lg">
            {translations.hero.description[lang]}
          </p>
          <p className="text-gray-600 text-lg">
            {translations.hero.subdescription[lang]}
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto mb-16 group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchPlant(e)}
            placeholder={translations.hero.placeholder[lang]}
            className="w-full px-8 py-5 rounded-full border-2 border-emerald-300 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 shadow-lg text-lg transition-all"
          />
          <button
            onClick={searchPlant}
            className="absolute right-3 top-3 bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-full transition duration-300 shadow-md group-hover:scale-105"
          >
            <Search size={24} />
          </button>
        </div>

        {/* loading component */}
        {loading && (
          <div className="flex flex-col items-center justify-center my-12 gap-3">
            <Loader2 className="animate-spin text-emerald-600" size={48} />
            <p className="text-gray-500 animate-pulse">
              {translations.status.loading[lang]}
            </p>
          </div>
        )}

        {/* error message */}
        {error && (
          <div className="text-center text-red-600 bg-red-50 p-6 rounded-xl border border-red-200 max-w-2xl mx-auto">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* --- Result Card --- */}
        {plantData && (
          <div className="space-y-6">
            {/* Main Plant Card */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-200 animate-fade-in">
              <div className="grid md:grid-cols-2">
                <div className="h-72 md:h-auto bg-gray-100 relative overflow-hidden group">
                  {plantData.thumbnail ? (
                    <>
                      <img
                        src={plantData.thumbnail.source}
                        alt={plantData.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition duration-500"></div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-emerald-50">
                      <Leaf size={64} className="mb-2 opacity-50" />
                      <span>{translations.status.noImage[lang]}</span>
                    </div>
                  )}
                </div>

                {/* Information Section */}
                <div className="p-8 md:p-10 flex flex-col">
                  <div className="mb-6">
                    <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                      {plantData.title}
                    </h2>

                    {/* Scientific Name */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-5 rounded-2xl border-2 border-emerald-200 shadow-md">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-emerald-500 p-2 rounded-lg">
                          <FlaskConical size={20} className="text-white" />
                        </div>
                        <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
                          {translations.plantCard.sciNameLabel[lang]}
                        </span>
                      </div>
                      <div className="pl-11">
                        <p className="text-2xl font-serif italic text-emerald-900 font-bold tracking-wide">
                          {scientificName}
                        </p>
                        {scientificName !==
                          translations.plantCard.notFoundSci[lang] && (
                          <div className="flex items-center gap-2 mt-2">
                            <Sparkles size={14} className="text-emerald-500" />
                            <span className="text-xs text-emerald-600">
                              {translations.plantCard.verified[lang]}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed mb-8 text-justify border-l-4 border-emerald-300 pl-4">
                    {plantData.extract
                      ? plantData.extract.substring(0, 450) + "..."
                      : translations.plantCard.readMore[lang]}
                  </p>

                  {/* Button Group */}
                  <div className="mt-auto flex flex-col sm:flex-row gap-4">
                    <a
                      href={`https://en.wikipedia.org/?curid=${plantData.pageid}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg hover:shadow-emerald-200 transform hover:-translate-y-1"
                    >
                      {translations.plantCard.btnWiki[lang]}{" "}
                      <BookOpen size={18} />
                    </a>

                    <button
                      onClick={handleGoogleSearch}
                      className="flex-1 inline-flex justify-center items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg hover:shadow-teal-200 transform hover:-translate-y-1"
                    >
                      {translations.plantCard.btnGoogle[lang]}{" "}
                      <Globe size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Taxonomy Card */}
            {taxonomy && Object.keys(taxonomy).length > 0 && (
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-200 p-4 sm:p-6 md:p-10 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 sm:p-3 rounded-xl">
                    <Network size={24} className="sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {translations.taxonomy.title[lang]}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {translations.taxonomy.subtitle[lang]}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-3 sm:p-4 md:p-6 border-2 border-emerald-200">
                  <div className="space-y-2 sm:space-y-3 md:space-y-4">
                    {[
                      "kingdom",
                      "phylum",
                      "class",
                      "order",
                      "family",
                      "genus",
                      "species",
                    ].map((rank, index) => {
                      if (!taxonomy[rank]) return null;
                      return (
                        <div
                          key={rank}
                          className="flex items-start gap-2 sm:gap-3 md:gap-4 group hover:bg-white/50 p-2 sm:p-3 rounded-xl transition-all duration-300"
                          style={{
                            paddingLeft: `${index * 0.5}rem`,
                          }}
                        >
                          <ChevronRight
                            size={16}
                            className="text-emerald-600 group-hover:translate-x-1 transition-transform flex-shrink-0 mt-1 sm:w-[18px] sm:h-[18px]"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-baseline gap-1 sm:gap-2">
                              <span className="text-xs sm:text-sm font-bold text-emerald-700 uppercase whitespace-nowrap">
                                {/* Dynamic Taxonomy Label */}
                                {getTaxonomyLabel(rank, lang)}
                              </span>
                              <span className="text-[10px] sm:text-xs text-gray-500">
                                ({rank})
                              </span>
                            </div>
                            <p className="text-base sm:text-lg font-semibold text-gray-800 italic mt-0.5 sm:mt-1 break-words">
                              {taxonomy[rank]}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t-2 border-emerald-200">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-700">
                      <Sparkles
                        size={14}
                        className="flex-shrink-0 sm:w-4 sm:h-4"
                      />
                      <span className="font-medium">
                        {translations.taxonomy.source[lang]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* --- Resources Section --- */}
      <section
        id="resources"
        className="bg-gradient-to-b from-white via-emerald-50 to-teal-50 py-20"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-emerald-700 mb-2">
              {translations.resources.title[lang]}
            </h3>
            <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {researchPapers.map((paper) => (
              <div
                key={paper.id}
                className="bg-white p-8 rounded-2xl shadow-md border border-emerald-100 hover:shadow-xl transition duration-300 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-emerald-600 rounded-lg text-white group-hover:bg-emerald-400  transition">
                    <BookOpen size={24} />
                  </div>
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    {paper.type}
                  </span>
                </div>
                <h4 className="font-bold text-xl mb-2 text-gray-800 group-hover:text-emerald-600 transition line-clamp-2">
                  {paper.title}
                </h4>
                <p className="text-sm text-gray-500 mb-6 border-b pb-4 truncate">
                  {translations.resources.author[lang]}: {paper.author}
                </p>
                <a
                  href={paper.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center cursor-pointer gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition group-hover:translate-x-2 duration-300"
                >
                  {translations.resources.btnRead[lang]}{" "}
                  <ArrowRight size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-gradient-to-r from-emerald-700 via-teal-700 to-green-700 text-white py-10 border-t-4 border-emerald-400">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-4 mb-6">
            <Leaf className="text-emerald-300" />
          </div>
          <p className="mb-2 font-medium text-lg">
            &copy; {new Date().getFullYear()} Mr. Botanist
          </p>
          <p className="text-emerald-100 text-sm mb-4">
            {translations.footer.tagline[lang]}
          </p>
          <div className="inline-block bg-white/10 px-6 py-2 rounded-full backdrop-blur-sm">
            <p className="text-sm">
              {translations.footer.developed[lang]}{" "}
              <a
                target="_blank"
                href="http://skbarman.me/"
                className="font-bold text-emerald-200"
              >
                Subroto Kumar Barman
              </a>
            </p>
          </div>
          <div className="mt-4">
            <p className="text-xs text-emerald-200 italic"> ~ Student of</p>
            <p className="text-xs text-emerald-200 ">
              Dept. of Botany, Dhaka College, Dhaka, Bangladesh
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
