import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import {UserProgressEvent} from '../in-memory-api/types';

export interface ProgressState extends EntityState<UserProgressEvent> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'progress' })
export class ProgressStore extends EntityStore<ProgressState> {

  constructor() {
    super();
  }

}
