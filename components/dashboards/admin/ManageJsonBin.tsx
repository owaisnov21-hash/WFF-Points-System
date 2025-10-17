import React, { useState, useEffect } from 'react';

interface ManageJsonBinProps {
    jsonBinApiKey: string | null;
    setJsonBinApiKey: React.Dispatch<React.SetStateAction<string | null>>;
    jsonBinId: string | null;
    setJsonBinId: React.Dispatch<React.SetStateAction<string | null>>;
}

const ManageJsonBin: React.FC<ManageJsonBinProps> = ({ jsonBinApiKey, setJsonBinApiKey, jsonBinId, setJsonBinId }) => {
    const [apiKey, setApiKey] = useState(jsonBinApiKey || '');
    const [binId, setBinId] = useState(jsonBinId || '');
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        setApiKey(jsonBinApiKey || '');
        setBinId(jsonBinId || '');
    }, [jsonBinApiKey, jsonBinId]);

    const handleSave = () => {
        setJsonBinApiKey(apiKey.trim());
        setJsonBinId(binId.trim());
        setSaveMessage('Settings saved successfully! The app will now sync with JSONBin.io.');
        setTimeout(() => setSaveMessage(''), 4000);
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">JSONBin.io Live Data Sync</h3>
                <div className="p-4 border-2 border-blue-300 rounded-lg bg-blue-50 space-y-4">
                    <p className="text-sm text-gray-600">
                        Connect the application to a JSONBin.io bin to enable live data storage. This will allow multiple users (Admins, Directors) to see and manage the same data in real-time.
                    </p>
                    
                    <div>
                        <label htmlFor="jsonbin-api-key" className="block text-sm font-medium text-gray-700">JSONBin.io X-Access-Key</label>
                        <input 
                            id="jsonbin-api-key"
                            type="text"
                            value={apiKey}
                            onChange={e => setApiKey(e.target.value)}
                            placeholder="Enter your X-Access-Key"
                            className="mt-1 p-2 border border-gray-300 rounded w-full shadow-sm"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="jsonbin-bin-id" className="block text-sm font-medium text-gray-700">JSONBin.io Bin ID</label>
                        <input 
                            id="jsonbin-bin-id"
                            type="text"
                            value={binId}
                            onChange={e => setBinId(e.target.value)}
                            placeholder="Enter your Bin ID"
                            className="mt-1 p-2 border border-gray-300 rounded w-full shadow-sm"
                        />
                    </div>
                    
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Save Settings
                    </button>
                    {saveMessage && <p className="text-green-600 text-sm mt-2">{saveMessage}</p>}
                </div>
            </div>

            <div className="p-4 border-2 border-green-400 rounded-lg bg-green-50 text-sm text-green-900">
                <p><strong>Pro Tip:</strong> By using URLs for images (like from a public Google Drive folder), your data remains small and syncs quickly. This is the recommended way to handle all images and logos.</p>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">How to Set Up</h3>
                 <div className="p-4 border rounded-lg bg-gray-50 space-y-3 text-sm text-gray-800">
                    <p><strong>Step 1: Get a JSONBin.io Account</strong><br/>If you don't have one, go to <a href="https://jsonbin.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">JSONBin.io</a> and create a free account.</p>
                    
                    <p><strong>Step 2: Export Your Current Data</strong><br/>Go to the "System" tab in this admin panel and click "Export All Data" to download your current application state as a JSON file.</p>

                    <p><strong>Step 3: Create a Bin</strong><br/>In your JSONBin.io dashboard, create a new **Private Bin**. Paste the entire content of the JSON file you just exported into this new bin and save it.</p>
                    
                    <p><strong>Step 4: Get Your Bin ID</strong><br/>After creating the bin, look at the URL in your browser. It will be something like <code>https://jsonbin.io/b/YOUR_BIN_ID</code>. Copy the `YOUR_BIN_ID` part.</p>

                    <p><strong>Step 5: Get Your API Key</strong><br/>On the JSONBin.io site, go to the "API Keys" section from your user menu. Copy the **X-Access-Key** provided.</p>
                    
                     <p><strong>Step 6: Save Your Credentials Here</strong><br/>Paste the Bin ID and the X-Access-Key into the fields above and click "Save Settings". The app will reload and start syncing data live.</p>
                </div>
            </div>
        </div>
    );
};

export default ManageJsonBin;