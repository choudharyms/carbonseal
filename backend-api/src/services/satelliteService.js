const axios = require('axios');
require('dotenv').config();

// MOCK DATA GENERATOR (Use this if you don't have a live Sentinel Key)
const getMockSatelliteData = (lat, lng) => {
    return {
        ndvi: (0.6 + Math.random() * 0.3).toFixed(2), // Random "Healthy" score 0.6-0.9
        captureDate: new Date().toISOString().split('T')[0],
        imageUrl: "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/36/R/UU/2023/1/S2A_36RUU_20230101_0_L2A/L2A_PVI.tif", // Sample
        verificationStatus: "VERIFIED_HEALTHY"
    };
};

const verifyCoordinates = async (lat, lng) => {
    try {
        // OPTION A: REAL API (Uncomment if you have keys)
        /*
        const response = await axios.post('https://services.sentinel-hub.com/api/v1/process', {
            input: {
                bounds: {
                    bbox: [lng - 0.01, lat - 0.01, lng + 0.01, lat + 0.01]
                },
                data: [{ type: "sentinel-2-l2a" }]
            },
            evalscript: `//NDVI Evalscript...`
        }, {
            headers: { Authorization: `Bearer ${process.env.SENTINEL_HUB_TOKEN}` }
        });
        return response.data;
        */

        // OPTION B: MOCK (Safe for Hackathons/Demos)
        console.log(`🛰️ Fetching Satellite Data for [${lat}, ${lng}]...`);
        return getMockSatelliteData(lat, lng);

    } catch (error) {
        console.error("Satellite API Error:", error.message);
        throw new Error("Satellite Verification Failed");
    }
};

module.exports = { verifyCoordinates };