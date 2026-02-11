const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5001/api';
const EMAIL = 'customer@example.com'; 
const PASSWORD = 'password123'; // Make sure this user exists or update credentials

let token = '';
let headers = {};

const login = async () => {
    try {
        console.log('--- Authenticating ---');
        const res = await axios.post(`${BASE_URL}/auth/login`, {
            email: EMAIL,
            password: PASSWORD
        });
        token = res.data.token;
        headers = { Authorization: `Bearer ${token}` };
        console.log('✅ Login successful');
        return true;
    } catch (error) {
        console.error('❌ Login failed:', error.response?.data?.message || error.message);
        return false;
    }
};

const testOffers = async () => {
    try {
        console.log('\n--- Testing Offers ---');
        const res = await axios.get(`${BASE_URL}/offers`, { headers });
        console.log(`✅ Fetched ${res.data.data.length} offers`);
        
        if (res.data.data.length > 0) {
            const offerCode = res.data.data[0].code;
            const validRes = await axios.post(`${BASE_URL}/offers/validate`, { code: offerCode }, { headers });
            console.log(`✅ Validated offer code: ${offerCode}`);
        }
    } catch (error) {
        console.error('❌ Offers test failed:', error.response?.data?.message || error.message);
    }
};

const testNearbySuppliers = async () => {
    try {
        console.log('\n--- Testing Nearby Suppliers ---');
        // Test with Hyderabad coordinates
        const lat = 17.3850;
        const lng = 78.4867;
        const res = await axios.get(`${BASE_URL}/suppliers/nearby?lat=${lat}&lng=${lng}&radius=50`, { headers });
        console.log(`✅ Fetched ${res.data.data.length} nearby suppliers`);
    } catch (error) {
        console.error('❌ Nearby Suppliers test failed:', error.response?.data?.message || error.message);
    }
};

const testChat = async () => {
    try {
        console.log('\n--- Testing Chat System ---');
        // 1. Get Conversations
        const convRes = await axios.get(`${BASE_URL}/chat/conversations`, { headers });
        console.log(`✅ Fetched ${convRes.data.data.length} conversations`);

        // 2. Send Message (Need a valid receiver ID, using a placeholder or skipping if no convs)
        if (convRes.data.data.length > 0) {
            const receiverId = convRes.data.data[0].otherUser._id;
            const msgRes = await axios.post(`${BASE_URL}/chat/message`, {
                receiverId,
                content: "Test message from automated script"
            }, { headers });
            console.log('✅ Sent message successfully');
        } else {
            console.log('⚠️ No conversations found to test sending messages (requires valid receiverId)');
        }
    } catch (error) {
        console.error('❌ Chat test failed:', error.response?.data?.message || error.message);
    }
};

const testProductAlerts = async () => {
    try {
        console.log('\n--- Testing Product Alerts ---');
        // 1. Get existing alerts
        const alertsRes = await axios.get(`${BASE_URL}/alerts`, { headers });
        console.log(`✅ Fetched ${alertsRes.data.data.length} active alerts`);

        // 2. Create Alert (Need a product ID)
        // Fetch a product first to get ID
        const productsRes = await axios.get(`${BASE_URL}/products?limit=1`);
        if (productsRes.data.data.length > 0) {
            const productId = productsRes.data.data[0]._id;
            
            // Check if alert exists first to avoid duplicate error
            const exists = alertsRes.data.data.find(a => a.product._id === productId);
            if (!exists) {
                const createRes = await axios.post(`${BASE_URL}/alerts`, {
                    productId,
                    alertType: 'price_drop',
                    targetPrice: 1000
                }, { headers });
                console.log('✅ Created product alert');
                
                // 3. Delete Alert
                const alertId = createRes.data.data._id;
                await axios.delete(`${BASE_URL}/alerts/${alertId}`, { headers });
                console.log('✅ Deleted product alert');
            } else {
                 console.log('⚠️ Alert already exists for this product, skipping creation test');
            }
        }
    } catch (error) {
        console.error('❌ Product Alerts test failed:', error.response?.data?.message || error.message);
    }
};

const testAnalytics = async () => {
    try {
        console.log('\n--- Testing Spending Analytics ---');
        const res = await axios.get(`${BASE_URL}/customer/analytics`, { headers });
        console.log(`✅ Fetched analytics: Total Spent ₹${res.data.totalSpent}, Total Orders: ${res.data.totalOrders}`);
        console.log(`✅ Monthly Stats: ${res.data.monthlyStats.length} months data`);
        console.log(`✅ Category Stats: ${res.data.categoryStats.length} categories`);
    } catch (error) {
        console.error('❌ Analytics test failed:', error.response?.data?.message || error.message);
    }
};

const runTests = async () => {
    const authenticated = await login();
    if (authenticated) {
        await testOffers();
        await testNearbySuppliers();
        await testChat();
        await testProductAlerts();
        await testAnalytics();
    }
    console.log('\n--- Test Run Complete ---');
};

runTests();
