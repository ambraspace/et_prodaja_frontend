import { CanDeactivateFn } from '@angular/router';
import { HasUnsaavedChanges } from '../model/has-unsaaved-changes';

export const pendingChangesGuard: CanDeactivateFn<HasUnsaavedChanges> = (component, currentRoute, currentState, nextState) => {

  if (component.hasUnsavedChanges())
  {
    if (confirm("Stranica ima izmjene koje je potrebno sačuvati. Da li želite napustiti stranicu?"))
    {
      return true;
    } else {
      return false;
    }
  }

  return true;

};
