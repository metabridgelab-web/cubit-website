import * as migration_20261024_081911_initial from './20261024_081911_initial';
import * as migration_20261025_070144_storage_fields from './20261025_070144_storage_fields';

export const migrations = [
  {
    up: migration_20261024_081911_initial.up,
    down: migration_20261024_081911_initial.down,
    name: '20261024_081911_initial',
  },
  {
    up: migration_20261025_070144_storage_fields.up,
    down: migration_20261025_070144_storage_fields.down,
    name: '20261025_070144_storage_fields'
  },
];
