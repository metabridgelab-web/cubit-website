import * as migration_20261024_081911_initial from './20261024_081911_initial';
import * as migration_20261025_070144_storage_fields from './20261025_070144_storage_fields';
import * as migration_20261025_080918_campaign_no_talent from './20261025_080918_campaign_no_talent';
import * as migration_20261025_092149_artist_genres from './20261025_092149_artist_genres';

export const migrations = [
  {
    up: migration_20261024_081911_initial.up,
    down: migration_20261024_081911_initial.down,
    name: '20261024_081911_initial',
  },
  {
    up: migration_20261025_070144_storage_fields.up,
    down: migration_20261025_070144_storage_fields.down,
    name: '20261025_070144_storage_fields',
  },
  {
    up: migration_20261025_080918_campaign_no_talent.up,
    down: migration_20261025_080918_campaign_no_talent.down,
    name: '20261025_080918_campaign_no_talent',
  },
  {
    up: migration_20261025_092149_artist_genres.up,
    down: migration_20261025_092149_artist_genres.down,
    name: '20261025_092149_artist_genres'
  },
];
