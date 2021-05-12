import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { tap } from 'rxjs/operators';
import { ProgressStore } from './progress.store';
import {InMemoryApiService} from '../../in-memory-api/in-memory-api.service';
import {UserProgressEvent} from '../../in-memory-api/types';
import {Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProgressService {

  constructor(private progressStore: ProgressStore, private api: InMemoryApiService) {
  }


  get(userIds: number[]): Observable<UserProgressEvent[]> {
    return this.api.getUsersProgress(userIds).pipe(tap(entities => {
      this.progressStore.set(entities);
    }));
  }

  add(progress: UserProgressEvent): void {
    this.progressStore.add(progress);
  }

  update(id: ID, progress: Partial<UserProgressEvent>): void {
    this.progressStore.update(id, progress);
  }

  remove(id: ID): void {
    this.progressStore.remove(id);
  }

}
