// lambda-enrichment/src/boqService.js

/**
 * Extracts the itemized Bill of Quantities from the raw project data.
 */
const extractBOQFromProject = (project) => {
    // If the scraper already nested them, return the array.
    // Otherwise, return an empty array as a safe fallback.
    return project.bill_of_quantities_materials || [];
};

module.exports = { extractBOQFromProject };