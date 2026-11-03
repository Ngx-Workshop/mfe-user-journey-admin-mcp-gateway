import { FormControl, FormGroup } from '@angular/forms';
export function createConsoleForm() {
  return new FormGroup({
    sectionId: new FormControl('', { nonNullable: true }),
    workshopId: new FormControl('', { nonNullable: true }),
    labId: new FormControl('', { nonNullable: true }),
    versionId: new FormControl('', { nonNullable: true }),
  });
}
export type ConsoleForm = ReturnType<typeof createConsoleForm>;
