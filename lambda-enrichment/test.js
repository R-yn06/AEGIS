// lambda-enrichment/test.js
const app = require('./index');
const fs = require('fs');
const path = require('path');

const runLocalTest = async () => {
    console.log("Firing up Local Lambda Enrichment Pipeline...");
    
    const response = await app.handler({});
    console.log("Pipeline Complete. Status: " + response.statusCode);
    
    // 1. Parse the payload
    const parsedBody = JSON.parse(response.body);
    
    // 2. Define the output path to drop it straight into the frontend public folder
    const outputPath = path.join(__dirname, '../public/enriched_projects.json');
    
    // 3. Write the file physically to your hard drive
    fs.writeFileSync(outputPath, JSON.stringify(parsedBody, null, 2), 'utf8');
    
    console.log("Success! Generated a fresh JSON asset at: public/enriched_projects.json");
};

runLocalTest();