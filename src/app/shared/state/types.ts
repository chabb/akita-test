import {User, UserProgressEvent} from '../in-memory-api/types';

export interface UserWithProgress extends User, UserProgressEvent {}

export enum FilterType {
  REMOVE_ROW = 'remove_row',
  GRAY_ROW = 'gray_row'
}
