import { fs, govnSvcMetrics as gsm, uuid } from "../deps.ts";

//Created by: Shanil Sasikumar
//Created on: 11/02/2021
//Objective: To ensure metrics comment
//Module: Metrics
//Last modified on: 12/04/2021
//Last modified by: Shanil Sasikumar

export interface AssuranceCaseExecInfoMetricLabels {
  // These are known at controller init time
  readonly initOn: Date;
  readonly host: string;
  readonly txId: string;
  // These are updated at the end, after finalization
  status?: "pass" | "fail" | "warn";
  statusMessage?: string;
  caseID?: string;
  caseGroups?: string; // medigy.seo.whatever
  finalizeOn?: Date;
  pageURL?: string;
}

export class AssuranceCaseMetrics extends gsm.TypicalMetrics {
  readonly metricsTransactionId = uuid.v4.generate();
  readonly assuranceCaseExec = this.infoMetric<
    AssuranceCaseExecInfoMetricLabels
  >(
    "assurance_case_exec",
    "Assurance case execution tracker",
  );

  async persistMetrics(assuranceCaseExec: AssuranceCaseMetrics): Promise<void> {
    // const dialect = gsm.prometheusDialect();
    // const exported = dialect.export(assuranceCaseExec.instances);
    // if (exported.length > 0) {
    //   await Deno.writeTextFile(
    //     "./assurance-case-observability-prometheus-metrics.auto.txt",
    //     "",
    //   );
    //   await Deno.writeTextFile(
    //     "./assurance-case-observability-prometheus-metrics.auto.txt",
    //     exported.join("\n") + "\n",
    //     {
    //       append: true,
    //     },
    //   );
    // }
    const isFileExit = fs.existsSync(
      "./assurance-case-observability-prometheus-metrics.auto.txt",
    );
    const dialect = gsm.prometheusDialect();
    let exported = dialect.export(assuranceCaseExec.instances);
    if (exported.length > 0) {
      if (isFileExit && exported.length > 2) {
        exported = exported.slice(2, exported.length);
      }
      await Deno.writeTextFile(
        "./assurance-case-observability-prometheus-metrics.auto.txt",
        exported.join("\n") + "\n",
        {
          append: true,
        },
      );
    }
  }

  async persistUitMetrics(
    assuranceCaseExec: AssuranceCaseMetrics,
  ): Promise<void> {
    const isFileExit = fs.existsSync(
      "./assurance-case-observability-prometheus-uit-metrics.auto.txt",
    );
    const dialect = gsm.prometheusDialect();
    let exported = dialect.export(assuranceCaseExec.instances);
    if (exported.length > 0) {
      if (isFileExit && exported.length > 2) {
        exported = exported.slice(2, exported.length);
      }
      await Deno.writeTextFile(
        "./assurance-case-observability-prometheus-uit-metrics.auto.txt",
        exported.join("\n") + "\n",
        {
          append: true,
        },
      );
    }
  }
}
