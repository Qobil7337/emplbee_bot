import axios from 'axios';

// Check if the organization exists
export const checkOrganizationExists = async (orgId: string): Promise<boolean> => {
    const fullUrl = `${process.env.DEV_API_URL}/task/check-org-id?organizationId=${orgId}`;

    try {
        const res = await axios.get(fullUrl, {
            headers: {
                Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
            }
        });
        return res.data;
    } catch (error) {
        console.error('Error checking organization:', error);
        return false;
    }
};

// Check for duplicate entries
export const checkDuplicateEntries = async (groupId: number): Promise<boolean> => {
    const fullUrl = `${process.env.DEV_API_URL}/task/check-duplicate-telegram-entries?groupId=${groupId}`;

    try {
        const res = await axios.get(fullUrl, {
            headers: {
                Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
            }
        });
        return res.data;
    } catch (error) {
        console.error('Error checking duplicate entries:', error);
        return false;
    }
};

// Register a Telegram group
export const registerTelegramGroup = async (groupId: number) => {
    const fullUrl = `${process.env.DEV_API_URL}/task/register-telegram-id`;

    try {
        const res = await axios.post(fullUrl, {
            type: 'group',
            code: groupId,
            config: JSON.stringify([]),
        }, {
            headers: {
                Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
            }
        });
        return res.data;
    } catch (error) {
        console.error('Error registering Telegram group:', error);
        throw error;
    }
};

// Get Telegram group configuration
export const getTelegramConfig = async (groupId: number): Promise<string[]> => {
    const fullUrl = `${process.env.DEV_API_URL}/task/get-telegram-config?groupId=${groupId}`;

    try {
        const res = await axios.get(fullUrl, {
            headers: {
                Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
            }
        });
        return JSON.parse(res.data?.config || '[]');
    } catch (error) {
        console.error('Error fetching Telegram config:', error);
        return [];
    }
};

// Update Telegram group configuration
export const updateTelegramConfig = async (groupId: number, config: string[]) => {
    const fullUrl = `${process.env.DEV_API_URL}/task/update-telegram-config`;
    console.log(`Full URL: ${fullUrl}`);

    try {
        const res = await axios.post(fullUrl, {
            groupId,
            config: JSON.stringify(config),
        }, {
            headers: {
                Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
            }
        });
        return res.data;
    } catch (error) {
        console.error('Error updating Telegram config:', error);
        throw error;
    }
};
