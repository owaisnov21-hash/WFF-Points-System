import React, { useState, useEffect } from 'react';
import { LandingPageContent } from '../../../types';
import { convertToDirectGoogleDriveUrl } from '../../../utils';

interface ManageSiteProps {
    landingPageContent: LandingPageContent;
    setLandingPageContent: React.Dispatch<React.SetStateAction<LandingPageContent>>;
    headerLogoUrl: string | null;
    setHeaderLogoUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

const ManageSite: React.FC<ManageSiteProps> = (props) => {
    const { landingPageContent, setLandingPageContent, headerLogoUrl, setHeaderLogoUrl } = props;

    // Use local state for text inputs to provide a better editing experience.
    const [tempUrls, setTempUrls] = useState({
        header: headerLogoUrl || '',
        main: landingPageContent.mainLogoUrl || '',
        bg: landingPageContent.backgroundUrl || '',
    });

    useEffect(() => {
        setTempUrls({
            header: headerLogoUrl || '',
            main: landingPageContent.mainLogoUrl || '',
            bg: landingPageContent.backgroundUrl || '',
        });
    }, [headerLogoUrl, landingPageContent]);

    const handleUrlChange = (type: 'header' | 'main' | 'bg', value: string) => {
        setTempUrls(prev => ({ ...prev, [type]: value }));
        const convertedUrl = convertToDirectGoogleDriveUrl(value);

        switch (type) {
            case 'header':
                setHeaderLogoUrl(convertedUrl);
                break;
            case 'main':
                setLandingPageContent(c => ({ ...c, mainLogoUrl: convertedUrl }));
                break;
            case 'bg':
                setLandingPageContent(c => ({ ...c, backgroundUrl: convertedUrl }));
                break;
        }
    };


    return (
         <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-700">Site Content & Branding</h3>
            <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Main Heading</label>
                    <input type="text" value={landingPageContent.mainHeading} onChange={e => setLandingPageContent(c => ({...c, mainHeading: e.target.value}))} className="mt-1 p-2 border rounded w-full md:w-1/2"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea value={landingPageContent.description} onChange={e => setLandingPageContent(c => ({...c, description: e.target.value}))} className="mt-1 p-2 border rounded w-full" rows={3}/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Header Logo URL</label>
                     <p className="text-xs text-gray-500 mb-1">Paste a public Google Drive share link.</p>
                    <input 
                        type="text"
                        placeholder="https://drive.google.com/..."
                        value={tempUrls.header}
                        onChange={e => handleUrlChange('header', e.target.value)}
                        className="mt-1 p-2 border rounded w-full"
                    />
                    {headerLogoUrl && <img src={headerLogoUrl} alt="Header logo preview" className="h-10 mt-2 bg-gray-200 p-1 rounded"/>}
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Landing Page Main Logo URL</label>
                    <p className="text-xs text-gray-500 mb-1">Paste a public Google Drive share link.</p>
                     <input 
                        type="text"
                        placeholder="https://drive.google.com/..."
                        value={tempUrls.main}
                        onChange={e => handleUrlChange('main', e.target.value)}
                        className="mt-1 p-2 border rounded w-full"
                    />
                    {landingPageContent.mainLogoUrl && <img src={landingPageContent.mainLogoUrl} alt="Main logo preview" className="h-20 mt-2 bg-gray-200 p-1 rounded"/>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Landing Page Background Image URL</label>
                    <p className="text-xs text-gray-500 mb-1">Paste a public Google Drive share link.</p>
                    <input 
                        type="text"
                        placeholder="https://drive.google.com/..."
                        value={tempUrls.bg}
                        onChange={e => handleUrlChange('bg', e.target.value)}
                        className="mt-1 p-2 border rounded w-full"
                    />
                    {landingPageContent.backgroundUrl && <img src={landingPageContent.backgroundUrl} alt="BG preview" className="w-40 mt-2 bg-gray-200 p-1 rounded"/>}
                </div>
            </div>
        </div>
    );
};

export default ManageSite;
