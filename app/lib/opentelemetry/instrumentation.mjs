/**
 * This file implements custom instrumentation for our Node.js services due to limitations
 * with the current auto-instrumentation capabilities of OpenTelemetry.
 *
 * During our migration to OpenTelemetry, we identified an issue where the documented
 * auto-instrumentation does not work as expected for services written in ES6 modules (using .mjs),
 * which is the modern and recommended way of writing Node.js applications.
 *
 * While auto-instrumentation works well for older CommonJS-based projects (e.g., spans with URLs and
 * Express routes are instrumented correctly), it fails for ES6 module-based projects. For these,
 * only a single "fs" span corresponding to the Node.js binary being started is generated, with no
 * detailed instrumentation.
 *
 * The root cause is that the OpenTelemetry operator currently assumes all Node.js code follows the
 * older CommonJS approach. Although the OpenTelemetry community is  working on a feature
 * request to improve support for ES6 modules, it is unclear when this will be implemented or
 * whether it will fully address our needs. Moreover, transitioning the default behavior to ES6
 * modules might break existing CommonJS-based projects.
 *
 * For more details, see:
 * - ESM support documentation: https://github.com/open-telemetry/opentelemetry-js/blob/main/doc/esm-support.md
 * - Related PR on the OpenTelemetry operator: https://github.com/open-telemetry/opentelemetry-operator/pull/3416
 *
 * Until these limitations are resolved, this custom instrumentation ensures proper observability
 * across all our projects, regardless of the module system used.
 * And we should be able to use auto-instrumentation :
 * https://skillsoftdev.atlassian.net/wiki/spaces/AR/pages/4316004764/Application+auto-instrumentation
 */

import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter as OTLPProtoTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { OTLPTraceExporter as OTLPHttpTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPTraceExporter as OTLPGrpcTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { containerDetector } from '@opentelemetry/resource-detector-container';
import { envDetector, hostDetector, osDetector, processDetector } from '@opentelemetry/resources';
import { diag, DiagConsoleLogger } from '@opentelemetry/api';
import * as opentelemetry from '@opentelemetry/sdk-node';

diag.setLogger(
  new DiagConsoleLogger(),
  opentelemetry.core.getEnv().OTEL_LOG_LEVEL,
);

function getTraceExporter() {
  let protocol = process.env.OTEL_EXPORTER_OTLP_PROTOCOL;
  switch (protocol) {
  case undefined:
  case '':
  case 'grpc':
    return new OTLPGrpcTraceExporter();
  case 'http/json':
    return new OTLPHttpTraceExporter();
  case 'http/protobuf':
    return new OTLPProtoTraceExporter();
  default:
    throw Error(`Creating traces exporter based on "${protocol}" protocol (configured via environment variable OTEL_EXPORTER_OTLP_PROTOCOL) is not implemented!`);
  }
}

function getMetricReader() {
  switch (process.env.OTEL_METRICS_EXPORTER) {
  case undefined:
  case '':
  case 'otlp':
    diag.info('using otel metrics exporter');
    return new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter(),
    });
  case 'prometheus':
    diag.info('using prometheus metrics exporter');
    return new PrometheusExporter({});
  case 'none':
    diag.info('disabling metrics reader');
    return undefined;
  default:
    throw Error(`no valid option for OTEL_METRICS_EXPORTER: ${process.env.OTEL_METRICS_EXPORTER}`)
  }
}

const sdk = new opentelemetry.NodeSDK({
  autoDetectResources: true,
  instrumentations:    [getNodeAutoInstrumentations()],
  traceExporter:       getTraceExporter(),
  metricReader:        getMetricReader(),
  resourceDetectors:
    [
      containerDetector,
      envDetector,
      hostDetector,
      osDetector,
      processDetector,
    ],
});

try {
  sdk.start();
  diag.info('OpenTelemetry automatic instrumentation started successfully');
} catch (error) {
  diag.error(
    'Error initializing OpenTelemetry SDK. Your application is not instrumented and will not produce telemetry',
    error,
  );
}

async function shutdown() {
  try {
    await sdk.shutdown();
    diag.debug('OpenTelemetry SDK terminated');
  } catch (error) {
    diag.error('Error terminating OpenTelemetry SDK', error);
  }
}

process.on('SIGTERM', shutdown);
process.once('beforeExit', shutdown);