import "./styles/MarketKpis.css";

export default function MarketKpis() {
  return (
    <div className="kpis">
      <div className="kpi">
        <div className="kpi-title">S&amp;P 500</div>
        <div className="kpi-value">4,783.45</div>
        <div className="kpi-sub">Last updated 2 mins ago</div>
        <div className="kpi-delta kpi-up">+2.3%</div>
      </div>
      <div className="kpi">
        <div className="kpi-title">NASDAQ</div>
        <div className="kpi-value">15,011.35</div>
        <div className="kpi-sub">Last updated 2 mins ago</div>
        <div className="kpi-delta kpi-down">-0.8%</div>
      </div>
      <div className="kpi">
        <div className="kpi-title">DOW JONES</div>
        <div className="kpi-value">37,305.16</div>
        <div className="kpi-sub">Last updated 2 mins ago</div>
        <div className="kpi-delta kpi-up">+1.2%</div>
      </div>
    </div>
  );
}
