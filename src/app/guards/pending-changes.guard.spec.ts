import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { pendingChangesGuard } from './pending-changes.guard';
import { HasUnsaavedChanges } from '../model/has-unsaaved-changes';

describe('pendingChangesGuard', () => {
  const executeGuard: CanDeactivateFn<HasUnsaavedChanges> = (...guardParameters) => 
      TestBed.runInInjectionContext(() => pendingChangesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
