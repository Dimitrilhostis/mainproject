import React from "react";

const sites = [
  {
    title: "Bibliothèque de recettes",
    image: "https://img-3.journaldesfemmes.fr/mrK-0E6Jw7lGJUv9Y0mpK5yfCMg=/1500x/smart/0a6c4b8084be4b9d91265bbe65a5ba93/ccmcms-jdf/11437802.png",
    url: "https://thesmartway.fr",
  },
  {
    title: "Coaching sportif",
    image: "https://img.freepik.com/photos-gratuite/outils-sport_53876-138077.jpg?t=st=1742215582~exp=1742219182~hmac=5cc2144d973a273094b61f3d526ecb367f5994db7315f94ed0163370ce47bb66&w=996",
    url: "https://thesmartway.fr",
  },
  {
    title: "Timer",
    image: "https://img.freepik.com/vecteurs-libre/homme-affaires-tenant-doigt-chronometre_3446-522.jpg?t=st=1742215633~exp=1742219233~hmac=cd79e80d6ed59a43d9ab48151089b0ae4de6949bff825e65d7c052c733ac9852&w=740",
    url: "https://thesmartway.fr",
  },
  {
    title: "Tracking emploi du temps",
    image: "https://static.vecteezy.com/system/resources/previews/049/329/506/non_2x/golden-3d-number-2025-new-year-2025-isolated-png.png",
    url: "https://thesmartway.fr",
  },
];

const EntryPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Bienvenue sur ma page d'accueil</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {sites.map((site, index) => (
          <a
            key={index}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl shadow-lg bg-white hover:scale-105 transition-transform"
          >
            <img
              src={site.image}
              alt={site.title}
              className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <span className="text-white text-xl font-semibold group-hover:scale-110 transition-transform">
                {site.title}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default EntryPage;
