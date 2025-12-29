
import './App.css'


export interface Manga{
    id: number,
    title: string[],
    status: string,
    countryOfOrigin: string,
    genres: string[],
    tags: string[],
    image: string
}
function Card({manga}: {manga: Manga}) {

  const openMangaSearch = () => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(manga.title[0] ? manga.title[0] : manga.title[1])}`, '_blank', 'noopener,noreferrer');
  };

  return (
    
    <div key={manga.id} 
    className="group container rounded-lg overflow-hidden cursor-pointer relative w-50 h-79 "
    onClick={openMangaSearch}
    >
        <img
          src={manga.image}
          className="rounded-lg bg-gray-200 object-cover w-50 h-79 transition duration-200 ease-in group-hover:scale-110 "
        />
        <div className='absolute inset-0 content-end size-full p-2 rounded-lg backdrop-filter-none overflow-hidden transition duration-200 ease-in group-hover:backdrop-blur-xs backdrop-grayscale-50 '>
          <p className='font-bold text-xl text-white text-start hidden transition duration-200 ease-linear group-hover:block'>
            {manga.title[0] ? manga.title[0] : manga.title[1]}
          </p>
        </div>        
      </div>
  )
}

export default Card
