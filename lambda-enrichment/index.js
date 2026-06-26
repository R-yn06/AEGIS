// lambda-enrichment/index.js
const { fetchRawProjects } = require('./src/ingest');
const { extractBOQFromProject } = require('./src/boqService');
const { calculateProjectUnitCost, calculateDeviationPercent, enrichBOQMaterials } = require('./src/calculator');
const { assignRiskProfile, generateFallbackAnalysis } = require('./src/formatter');

exports.handler = async (event) => {
    try {
        // 1. INGEST: Read the live, updating projects.json file
        const rawProjects = fetchRawProjects();

        // 2. ENRICH: Process the pipeline
        const enrichedProjects = rawProjects.map(project => {
            
            // Math calculations
            const calcUnitCost = calculateProjectUnitCost(project.contract_amount, project.physical_target);
            const devPercent = calculateDeviationPercent(calcUnitCost, project.regional_baseline_unit_cost);
            
            // UI Formatting
            const { risk_classification, ui_theme } = assignRiskProfile(project.slippage_percent, devPercent);
            
            // BOQ Processing
            const rawMaterials = extractBOQFromProject(project);
            const enrichedBOQ = enrichBOQMaterials(rawMaterials);

            // Construct Final Object
            return {
                ...project,
                calculated_unit_cost: calcUnitCost,
                cost_deviation_percent: devPercent,
                risk_classification: risk_classification,
                ui_theme: ui_theme,
                ai_engine_analysis: project.ai_engine_analysis || generateFallbackAnalysis(risk_classification),
                bill_of_quantities_materials: enrichedBOQ
            };
        });

        // 3. RESPOND: Return AWS API Gateway formatted response
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(enrichedProjects) // Sends the enriched data to the frontend
        };

    } catch (error) {
        console.error("Enrichment Pipeline Failed:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error during data enrichment." })
        };
    }
};