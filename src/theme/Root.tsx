import React from 'react';
import { useLocation } from '@docusaurus/router';
import ChatWidget from '../components/Chat/ChatWidget';
import ProtectedRoute from '../components/Auth/ProtectedRoute';

// Root component wrapper for Docusaurus
export default function Root({ children }) {
    const location = useLocation();
    const isDocsRoute = location.pathname.startsWith('/docs');

    return (
        <>
            {isDocsRoute ? (
                <ProtectedRoute>
                    {children}
                </ProtectedRoute>
            ) : (
                children
            )}
            <ChatWidget />
        </>
    );
}
