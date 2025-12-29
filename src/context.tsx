import { createContext } from 'react'
import type { Filter, FilterKey } from './filter';
interface Context{
    filter: Filter,
    handleFilterChange: ((name: FilterKey, value: string)=> void)
}
const val: Context = {
    'filter': {
    'status': [],
    'origin' : [],
    'genres': [],
    'tags': [],
  },
    'handleFilterChange': () => {}
};
export const FilterContext = createContext(val);