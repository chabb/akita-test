import {UserViewModel} from './users/users.store';
import {searchFilter, searchFilterIn} from 'akita-filters-plugin';

export enum FILTERS {
  SEARCH_FILTER_ID = 'search',
  STATE_FILTER_ID = 'state',
  SEARCH_BY_NAME_FILTER_ID = 'searchByName',
  SEARCH_BY_PROGRESS_FILTER_ID = 'progress'
}

export const getBaseFilter = (id: FILTERS, name: string, order: number) => ({id, name, order});

export const baseSearchFilter = getBaseFilter(FILTERS.SEARCH_FILTER_ID, FILTERS.SEARCH_FILTER_ID, 2);
export const baseStateFilter = getBaseFilter(FILTERS.STATE_FILTER_ID, FILTERS.STATE_FILTER_ID, 3);
export const baseSearchByNameFilter = getBaseFilter(FILTERS.SEARCH_BY_NAME_FILTER_ID, FILTERS.SEARCH_BY_NAME_FILTER_ID, 4);
export const baseProgressFilter = getBaseFilter(FILTERS.SEARCH_BY_PROGRESS_FILTER_ID, FILTERS.SEARCH_BY_PROGRESS_FILTER_ID, 5);

export const getSearchFilter = (search: string) =>
  ({...baseSearchFilter,
    value: search,
    predicate: (v: UserViewModel) => searchFilter(search, v) });

export const getStateFilter = (states: Set<'a' | 'b' | 'c'>) =>
  ({...baseStateFilter,
    value: states,
    predicate: (v: UserViewModel) => states.has(v.state as 'a' | 'b' | 'c')
  });

export const getSearchOnNameFilter = (search: string) =>
  ({...baseSearchByNameFilter,
    value: search,
    predicate: (v: UserViewModel) => searchFilterIn(search, v, 'name')
  });

export const getProgressFilter = (range: [number, number]) =>
  ({...baseProgressFilter,
    value: range,
    predicate: (v: UserViewModel) => v.progress ? v.progress * 100 >= range[0] && v.progress * 100 <= range[1] : false
  });

export const STATE_FILTERS = [
  { text: 'a', value: 'a' },
  { text: 'b', value: 'b' },
  { text: 'c', value: 'c' },
  { text: 'd', value: 'd' },
];
