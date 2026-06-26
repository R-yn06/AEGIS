// lambda-enrichment/src/formatter.js

const assignRiskProfile = (slippagePercent, costDeviationPercent) => {
    // High Risk: Slippage worse than -10% OR cost inflation over 25%
    if (slippagePercent <= -10 || costDeviationPercent >= 25) {
        return { risk_classification: 'High', ui_theme: 'rose' };
    }
    
    // Medium Risk: Any negative slippage OR cost inflation over 5%
    if (slippagePercent < 0 || costDeviationPercent > 5) {
        return { risk_classification: 'Medium', ui_theme: 'amber' };
    }

    // Low Risk: On track and within budget
    return { risk_classification: 'Low', ui_theme: 'emerald' };
};

const generateFallbackAnalysis = (risk) => {
    if (risk === 'High') return "Critical alert. Project exhibits substantial metric anomalies.";
    if (risk === 'Medium') return "Asset profile reveals minor delays or moderate cost deviations.";
    return "Project is operating securely within baseline parameters.";
};

module.exports = { assignRiskProfile, generateFallbackAnalysis };