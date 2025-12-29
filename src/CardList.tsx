import { useEffect, useState } from "react"
import type { Manga } from "./card"
import Card from "./card"

function CardList({mangaList}: {mangaList: Manga[]}) {
    const [firstItemNum, setfirstItemNum] = useState(1);
    const [lastItemNum, setlastItemNum] = useState(30);
    const [newList, setNewList] = useState<Manga[]>(mangaList.slice(firstItemNum-1, lastItemNum-1));

    const updateList = (choice: string)=>{
        if (choice === 'prev'){
            setfirstItemNum(firstItemNum-30);
            setlastItemNum(lastItemNum-30);
        }else{
            setfirstItemNum(firstItemNum+30);
            setlastItemNum(lastItemNum+30);
        }
    }

  useEffect(()=>{
    setNewList(mangaList.slice(firstItemNum-1, lastItemNum));
  }, [firstItemNum, lastItemNum, mangaList])
  return (
    <>
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-x-8">
        {
            newList.map((manga,index)=> (
                <Card key={index} manga={manga}/>
            ))
        }
    </div>
    {mangaList.length > 0 && (
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-300">
            Showing <span className="font-medium">{firstItemNum}</span> to <span className="font-medium">{lastItemNum}</span> of{' '}
            <span className="font-medium">{mangaList.length}</span> results
          </p>
        </div>
        <div className="flex justify-around gap-4 p-3">
            <button className="rounded-sm w-30 p-2 text-center shadow-2xl transition duration-200 ease-in cursor-pointer " 
            onClick={()=>updateList('prev')}
            disabled={firstItemNum===1}
            >
                Previous
            </button>
            <button className="rounded-sm p-2 w-30 text-center shadow-2xl  transition duration-200 ease-in cursor-pointer "
             onClick={()=>updateList('next')}
             disabled={lastItemNum===mangaList.length}
             >
                Next
            </button>
        </div>
    </div>
    )}
    
    </>
    
  )
}

export default CardList
