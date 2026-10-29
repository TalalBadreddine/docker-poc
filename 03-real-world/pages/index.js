import { useState, useEffect } from "react";

export default function Home() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then(setHealth)
      .catch(() => setHealth({ status: "error" }));
  }, []);

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <h1 style={styles.title}>Server Example</h1>
        <p style={styles.subtitle}>
          Next.js production server running inside a Docker container.
        </p>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Health Check</h2>
          {health ? (
            <pre style={styles.pre}>{JSON.stringify(health, null, 2)}</pre>
          ) : (
            <p style={styles.loading}>Loading...</p>
          )}
        </div>

        <div style={styles.grid}>
          <div style={styles.gridCard}>
            <h3>Runtime</h3>
            <p>Node.js on Alpine Linux</p>
          </div>
          <div style={styles.gridCard}>
            <h3>Framework</h3>
            <p>Next.js 15 (Pages Router)</p>
          </div>
          <div style={styles.gridCard}>
            <h3>User</h3>
            <p>Non-root (node)</p>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#ededed",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  main: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "4rem 1.5rem",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: 700,
    margin: 0,
  },
  subtitle: {
    color: "#888",
    fontSize: "1.1rem",
    marginTop: "0.5rem",
    marginBottom: "2rem",
  },
  card: {
    background: "#111",
    border: "1px solid #222",
    borderRadius: 8,
    padding: "1.5rem",
    marginBottom: "2rem",
  },
  cardTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    marginTop: 0,
    marginBottom: "1rem",
    color: "#0af",
  },
  pre: {
    background: "#0a0a0a",
    padding: "1rem",
    borderRadius: 6,
    overflow: "auto",
    fontSize: "0.85rem",
    color: "#ccc",
    margin: 0,
  },
  loading: {
    color: "#555",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
  },
  gridCard: {
    background: "#111",
    border: "1px solid #222",
    borderRadius: 8,
    padding: "1.25rem",
  },
};
