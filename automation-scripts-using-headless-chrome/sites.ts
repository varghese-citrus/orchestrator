import { Site, sitesToInspect } from "../continuous-quality/sites.ts";
import { AssuranceCaseMetrics } from "../continuous-quality/metrics.ts";

type MutableSite = {
  -readonly [K in keyof Site]: Site[K];
};

function getSitesToInspect(): Site[] {
  var metrics = new AssuranceCaseMetrics(
    "nets_medigy_dpo_uit_",
  );

  sitesToInspect.forEach(
    (site) => {
      const mutSite: MutableSite = site;
      mutSite.metrics = metrics;
    },
  );
  return sitesToInspect;
}

export { getSitesToInspect };
