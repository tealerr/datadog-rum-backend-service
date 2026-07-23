import tracer from "dd-trace";

tracer.init({
  profiling: true,
  env: process.env.DD_ENV || "development",
  service: process.env.DD_SERVICE || "rum-backend-service",
  version: process.env.DD_VERSION || "1.0.0",
});

export default tracer;
