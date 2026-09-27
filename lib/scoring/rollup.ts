/**
 * Rollup scoring — how an asset's DQ score aggregates to its catalog, and a
 * catalog's to its business unit.
 *
 * A parent's score is the unweighted mean of the latest scores of the assets
 * beneath it, rounded to a whole number. Assets that have never been run carry
 * no score and are excluded from the mean rather than counted as zero, so a
 * catalog of one scored and three unscored assets reports the one score rather
 * than a quarter of it. A parent with nothing scored beneath it has no score at
 * all (`undefined`), which the UI renders as "Not scored" instead of 0.
 *
 * The mean is unweighted: a 10-row asset counts the same as a 10-million-row
 * asset. Label it as an average in the UI so the number is not read as a
 * row-weighted quality rate.
 *
 * These are pure functions over already-fetched rows — they issue no queries,
 * so callers must pass the full asset set they want rolled up.
 */

/** Mean of the defined scores, rounded. `undefined` when nothing is scored. */
export function averageScore(
  values: ReadonlyArray<number | null | undefined>
): number | undefined {
  const scores = values.filter((s): s is number => s != null);
  if (scores.length === 0) return undefined;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

interface AssetLike {
  catalog_id: string | null;
  latest_dq_score?: number | null;
}

interface CatalogLike {
  id: string;
  business_unit_id: string;
}

interface BusinessUnitLike {
  id: string;
}

/** The assets belonging to one catalog. */
export function assetsInCatalog<A extends AssetLike>(
  catalogId: string,
  assets: readonly A[]
): A[] {
  return assets.filter((a) => a.catalog_id === catalogId);
}

/** The assets belonging to one business unit, across all of its catalogs. */
export function assetsInBusinessUnit<A extends AssetLike, C extends CatalogLike>(
  businessUnitId: string,
  catalogs: readonly C[],
  assets: readonly A[]
): A[] {
  const catalogIds = new Set(
    catalogs.filter((c) => c.business_unit_id === businessUnitId).map((c) => c.id)
  );
  return assets.filter((a) => a.catalog_id != null && catalogIds.has(a.catalog_id));
}

/** Adds `asset_count` and the rolled-up `latest_dq_score` to each catalog. */
export function withCatalogRollups<C extends CatalogLike, A extends AssetLike>(
  catalogs: readonly C[],
  assets: readonly A[]
): Array<C & { asset_count: number; latest_dq_score: number | undefined }> {
  return catalogs.map((c) => {
    const members = assetsInCatalog(c.id, assets);
    return {
      ...c,
      asset_count: members.length,
      latest_dq_score: averageScore(members.map((a) => a.latest_dq_score)),
    };
  });
}

/** Adds `catalog_count` and the rolled-up `latest_dq_score` to each business unit. */
export function withBusinessUnitRollups<
  B extends BusinessUnitLike,
  C extends CatalogLike,
  A extends AssetLike,
>(
  businessUnits: readonly B[],
  catalogs: readonly C[],
  assets: readonly A[]
): Array<B & { catalog_count: number; latest_dq_score: number | undefined }> {
  return businessUnits.map((bu) => {
    const members = assetsInBusinessUnit(bu.id, catalogs, assets);
    return {
      ...bu,
      catalog_count: catalogs.filter((c) => c.business_unit_id === bu.id).length,
      latest_dq_score: averageScore(members.map((a) => a.latest_dq_score)),
    };
  });
}
