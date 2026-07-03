import { getIndex } from "@/lib/windows";
import type { StationOption } from "@/components/tools-shared";

/** Server-side helper: the light station list passed to client tools as props. */
export function getStationOptions(): StationOption[] {
  return getIndex().stations.map((s) => ({
    slug: s.slug,
    name: s.name,
    state: s.state,
    stateSlug: s.stateSlug,
    noaaId: s.noaaId,
    spots: s.spots,
  }));
}
