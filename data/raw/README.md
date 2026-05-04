# Raw Public Data

Place permitted public Team USA CSV exports here before running:

```bash
npm run build:archive
```

The repository includes `sample-team-usa-public.csv`, an anonymous balanced sample used to demonstrate the pipeline. Replace or extend it with permitted public Team USA-scope CSV exports for a stronger submission.

The archive builder accepts flexible column names, filters rows to US/Team USA scope, removes athlete names from every output, and writes anonymous aggregate clusters to `data/processed/team-usa-archetype-clusters.json`.

Recommended source policy:

- Use public Team USA, Olympic, and Paralympic data only.
- If a source contains international rows, filter to US/Team USA scope before using the output.
- Do not include finish times, exact scoring results, athlete images, logos, or private/identifiable athlete details in generated app output.
- Raw files can include names for deduplication/source work, but generated outputs never preserve names.

Supported columns include:

- `height_cm`, `height`, `Height`
- `weight_kg`, `weight`, `Weight`
- `age`, `Age`
- `sport`, `Sport`, `event`
- `games_type`, `GamesType`, `competition_type` with values like `Olympic` or `Paralympic`
- `team`, `Team`, `noc`, `NOC`, `country`
- `year`, `Year`
- `hometown_region`, `region`, `state`
- `classification`, `para_classification`
