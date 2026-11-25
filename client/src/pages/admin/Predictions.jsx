import { useState } from "react";
import { Card, SectionHeader, StatusBadge, StatCard } from "../../components/ui";
import { BarChart, LineChart, DonutChart } from "../../components/kit";
import { aiPredictions, bloodBanks } from "../../lib/mockData";
import { BLOOD_GROUPS, bloodGroupColor } from "../../lib/constants";

export default function Predictions() {
  const [selectedBank, setSelectedBank] = useState(bloodBanks[0].id);

  const bank = bloodBanks.find((b) => b.id === selectedBank) || bloodBanks[0];
  const groupPredictions = aiPredictions.predictions.slice(0, 6);

  const demandData = BLOOD_GROUPS.map((g) => {
    const pred = groupPredictions.find((p) => p.bloodGroup === g);
    return pred ? { label: g, value: pred.predictedUnits, color: bloodGroupColor(g) } : null;
  }).filter(Boolean);

  const shortfall = groupPredictions.find((p) => p.bloodGroup === "O+")?.shortfall || 0;

  return (
    <div className="page">
      <SectionHeader
        title="AI Predictions"
        subtitle="Machine-learning demand forecasting by blood group and location."
      />

      <div className="filter-bar">
        <label className="field field--inline">
          <span className="field__label">Blood bank</span>
          <select className="input" value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
            {bloodBanks.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </label>
      </div>

      <div className="stat-grid">
        <StatCard label="Current stock" value={Object.values(bank.groups).reduce((a, b) => a + b, 0)} icon="📦" tone="primary" />
        <StatCard label="Predicted demand (month)" value={groupPredictions.reduce((a, p) => a + p.predictedUnits, 0)} icon="📈" tone="info" />
        <StatCard label="Shortfall risk" value={shortfall} icon="⚠️" tone="warning" />
        <StatCard label="Accuracy" value="92%" icon="🎯" tone="success" />
      </div>

      <Card className="dash-card">
        <h3>Predicted demand vs current stock</h3>
        <div className="prediction-list">
          {groupPredictions.map((p) => (
            <div key={p.id} className="prediction-row">
              <span className="blood-pill" style={{ background: `${bloodGroupColor(p.bloodGroup)}1a`, color: bloodGroupColor(p.bloodGroup) }}>🩸 {p.bloodGroup}</span>
              <div className="prediction-row__bars">
                <div className="prediction-row__bar">
                  <span>Current</span>
                  <div className="prediction-bar prediction-bar--stock" style={{ width: `${Math.min(100, (p.currentStock / 300) * 100)}%` }} />
                  <strong>{p.currentStock}</strong>
                </div>
                <div className="prediction-row__bar">
                  <span>Predicted</span>
                  <div className="prediction-bar prediction-bar--demand" style={{ width: `${Math.min(100, (p.predictedUnits / 300) * 100)}%` }} />
                  <strong>{p.predictedUnits}</strong>
                </div>
              </div>
              <StatusBadge status={p.shortfall > 0 ? "CANCELLED" : "COMPLETED"} />
              <span className="muted-note">{p.shortfall > 0 ? `${p.shortfall} units short` : "Sufficient"}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="dash-row">
        <Card className="chart-card">
          <h3>Predicted demand by group</h3>
          <DonutChart data={demandData} />
        </Card>
        <Card className="chart-card">
          <h3>Shortfall by group</h3>
          <BarChart
            data={groupPredictions.filter((p) => p.shortfall > 0).map((p) => ({ label: p.bloodGroup, value: p.shortfall })) || [{ label: "None", value: 0 }]}
            color="var(--warning)"
          />
        </Card>
      </div>

      <Card className="dash-card">
        <h3>Forecast trend — next 6 months</h3>
        <LineChart
          data={[
            { label: "Dec", value: groupPredictions.reduce((a, p) => a + p.predictedUnits, 0) },
            { label: "Jan", value: groupPredictions.reduce((a, p) => a + p.predictedUnits, 0) - 30 },
            { label: "Feb", value: groupPredictions.reduce((a, p) => a + p.predictedUnits, 0) + 15 },
            { label: "Mar", value: groupPredictions.reduce((a, p) => a + p.predictedUnits, 0) + 55 },
            { label: "Apr", value: groupPredictions.reduce((a, p) => a + p.predictedUnits, 0) - 20 },
            { label: "May", value: groupPredictions.reduce((a, p) => a + p.predictedUnits, 0) + 40 },
          ]}
          color="var(--primary)"
        />
        <p className="map-note">Predicted using historical donation trends, seasonality, and blood-group demand patterns.</p>
      </Card>
    </div>
  );
}
