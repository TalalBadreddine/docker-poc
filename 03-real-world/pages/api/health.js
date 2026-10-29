export default function handler(req, res) {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || "1.0.0",
    node: process.version,
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || "development",
  });
}
