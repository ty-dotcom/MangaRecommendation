
import { ListFilter, Search } from 'lucide-react'
import './App.css'
import type {Manga} from './card'
import CardList from './CardList'
import { useEffect, useState } from 'react'
import Drawer from '@mui/material/Drawer'
import FilterDraw, { type Filter, type FilterKey } from './filter'
import { FilterContext } from './context'
import { CircularProgress } from '@mui/material'
import axios from 'axios'


function App() {

  const [manga_list, setMangaList] = useState<Manga[]>([]);
  const [titleRec, settitleRec] = useState('');
  const [isOpen, setisOpen] = useState(false);
  const [IsLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(false);

  useEffect(()=>{
    const fetchData = async () =>{
      try{
        setIsLoading(true)
        const response = await axios.get(`http://127.0.0.1:5000/find_recs/${titleRec}`);
        if (response.status !== 200){
          throw new Error("Http error")
        }
        const result = await response.data
        if (result === "Manga Not Found."){
          setError(result)
        }else{
            setMangaList(result)
        }  
      }catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
        setSearch(false);
      }
    }
    if (search){
      fetchData();
    }
  },[search, titleRec])

  function setFilterVals(option: string){
    const List: string[] = [];
    manga_list.map((manga)=>{
      if (option === 'genres'){
        manga.genres.forEach((genre)=>{
        if (!List.includes(genre)){
          List.push(genre)
        }
      })
      }else{
        manga.tags.forEach((tag)=>{
        if (!List.includes(tag)){
          List.push(tag)
        }
      })
      }
    })
    return List;
  }
  const [filter, setFilters] = useState<Filter>({
    'status': [],
    'origin' : [],
    'genres': [],
    'tags': [],
  });

  const filterOptions : Filter = {
    'status': ['RELEASING', 'FINISHED', 'CANCELLED', 'NOT_YET_RELEASED'],
    'origin' : ['JP', 'KR', 'CN', 'TW'],
    'genres': setFilterVals('genres'),
    'tags': setFilterVals('tags'),
  }

  const handleFilterChange = (name: FilterKey, value: string) => {
    setFilters(prevFilters => {
      let newFilters: string[];

      if (prevFilters[name].includes(value)){
        newFilters = prevFilters[name].filter( item => item !== value)
      }else{
        newFilters = [...prevFilters[name], value]
      }
      return {
        ...prevFilters,
        [name]: newFilters
      }
    }) 
    };

  const filteredMangaList = manga_list.filter((manga) => {
    if (filter.status.length !== 0 || filter.origin.length !== 0 || filter.genres.length !== 0 || filter.tags.length !== 0)
        return (
            (manga.status === '' ||
                filter.status.includes(manga.status)) ||
            (manga.countryOfOrigin === '' ||
                filter.origin.includes(manga.countryOfOrigin)) ||
            (manga.genres.length === 0 ||
                manga.genres.some((genre) => {
                  return filter.genres.includes(genre);
                })) ||
            (manga.tags.length === 0 ||
                manga.tags.some((tag) => {
                  return filter.tags.includes(tag)
            }))
        );
      else{
        return manga_list
      }
    }); 

  const handleEnter = (event: any) => {
    if (event.key === 'Enter'){

      setSearch(true);
    }
  }
  return (
    <FilterContext.Provider value={{filter, handleFilterChange}}>
      <div className='flex flex-col gap-10 text-center items-center'>
          <div className='flex flex-col gap-10'>
            <h1 className='font-bold underline'>
              Manga Recommendations
            </h1>
            <p>
              Find mangas/manhwas/manhuas similar to the title entered, from 50K different titles.
            </p>
            <p>
              May take a few seconds to find recommendations.
            </p>
            <div className='flex justify-between items-center gap-2'>
              <div className='flex w-full bg-gray-700 rounded-3xl h-10 pl-3 pr-3 gap-2 items-center justify-between'>
              <input type="text" placeholder="Enter title..." 
              className=" size-full  text-lg focus:outline-none" 
              value={titleRec}
              onChange={(e) => settitleRec(e.target.value)}
              onKeyDown={handleEnter}
              />
              <Search className='cursor-pointer' onClick={()=>setSearch(true)} />
              
            </div>
            <ListFilter className='cursor-pointer' onClick={()=> setisOpen(true)}/>
            </div>
            
          </div>
          {IsLoading ? (
            <CircularProgress className='text-purple-500' color="inherit" />
          ) : error !== '' ? (
            <p>
              {error}
            </p>
          ): (
            <CardList mangaList={filteredMangaList}/>
          )
          }
          <Drawer
            anchor={'right'}
            open={isOpen}
            onClose={()=> setisOpen(false)}
          >
            <FilterDraw filter={filterOptions}/>
          </Drawer>
          </div>

    </FilterContext.Provider>
    
  )
}

export default App
