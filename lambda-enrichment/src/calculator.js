// lambda-enrichment/src/calculator.js

const calculateDeviationPercent = (actual, baseline) => {
    if (!baseline || baseline === 0) return 0;
    const deviation = ((actual - baseline) / baseline) * 100;
    return parseFloat(deviation.toFixed(1)); 
};

const calculateProjectUnitCost = (contractAmount, physicalTargetString) => {
    if (!physicalTargetString) return contractAmount;
    
    // Extract numerical value (e.g., "1.900 km" -> 1.9)
    const targetKm = parseFloat(physicalTargetString.split(' ')[0]);
    if (targetKm === 0 || isNaN(targetKm)) return contractAmount;
    
    return parseFloat((contractAmount / targetKm).toFixed(2));
};

const enrichBOQMaterials = (materialsArray) => {
    return materialsArray.map(item => {
        const devPercent = calculateDeviationPercent(item.unit_cost_declared, item.baseline_unit_cost);
        return {
            ...item,
            item_deviation_percent: devPercent
        };
    });
};

module.exports = {
    calculateDeviationPercent,
    calculateProjectUnitCost,
    enrichBOQMaterials
};