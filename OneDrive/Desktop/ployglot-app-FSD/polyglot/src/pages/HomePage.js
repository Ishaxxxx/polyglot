import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

// 5. The HomePage component
// This component uses the `useLocalization` hook to display translated text.
const HomePage = () => {
    const { t } = useLocalization();

    return (
        <div className="text-center p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('welcome_message')}</h1>
            <p className="text-xl text-gray-600">{t('app_introduction')}</p>
        </div>
    );
};

export default HomePage;