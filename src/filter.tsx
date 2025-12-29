import React, { useContext } from 'react'
import './App.css'
import { FilterContext } from './context'

export interface Filter{
    status: string[],
    origin: string[],
    genres: string[],
    tags: string[]
}

export type FilterKey = keyof Filter

function Capitalize(word: string){
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

const OptionFilter = ({option, parameter}: {option: string[], parameter: FilterKey}) =>{
    const { filter, handleFilterChange } = useContext(FilterContext);
    function isSelected(parameter: FilterKey, choice: string){
        return filter[parameter].includes(choice)
    }
    return(
        <>
        <div className='flex gap-x-3 gap-y-3 overflow-hidden flex-wrap p-3 py-4'>
           {option.map((filteroption, index)=>(
            <div key={index} className={`flex items-center ${option.includes('JP') ? 'w-18' : ''}
             justify-center text-white text-center rounded-4xl bg-gray-800 p-3 cursor-pointer
              transition ease-in duration-75  hover:bg-gray-900
              ${isSelected(parameter, filteroption) ? 'border-purple-600 border': ''}
              `
            }
              onClick={()=>handleFilterChange(parameter, filteroption)}
              >
                <p className='capitalize'>
                    {filteroption}
                </p>
            </div>
           ))}
        </div>
        <hr className='w-full border-2 my-3'/>
        </>
        
    )
}

function FilterDraw({filter}: {filter: Filter}) {
    const values = Object.values(filter);
    const keys = Object.keys(filter) as (keyof typeof filter)[];
  return (
    <>
    <div className="w-100 h-full bg-gray-700 p-3 overflow-x-hidden">
        <h2 className='text-center font-bold text-gray-300 underline text-3xl'>
            Fitler
        </h2>
        {values.map((option, index)=> (
            <div key={index}>
                <h3 className='font-bold text-gray-300 underline text-xl'>
                    {Capitalize(keys[index])}
                </h3>
                <OptionFilter option={option} parameter={keys[index]}/>
            </div>
        ))}
      </div>
    </>
  )
}



export default FilterDraw;
