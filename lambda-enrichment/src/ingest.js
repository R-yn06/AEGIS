// lambda-enrichment/src/ingest.js
const fs = require('fs');
const path = require('path');

/**
 * Reads the dynamically updating projects.json from the frontend public folder.
 * Note: In an actual AWS deployment, this would be swapped to read from an S3 bucket.
 */

const fetchRawProjects = () => {
    try {
        // Path routing: from src/ -> lambda-enrichment/ -> AEGIS/ -> public/projects.json
        const filePath = path.join(__dirname, '../../public/projects.json');
        
        // Read the file synchronously to ensure we have data before proceeding
        const rawData = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error("Critical Error: Cannot read public/projects.json", error);
        return []; // Return empty array to prevent crashing if file is temporarily locked
    }
};

module.exports = { fetchRawProjects };