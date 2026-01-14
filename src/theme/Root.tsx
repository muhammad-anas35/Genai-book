import React from 'react';
import { useLocation } from '@docusaurus/router';
import ChatWidget from '../components/Chat/ChatWidget';

// Root component wrapper for Docusaurus
export default function Root({ children }) {
    return (
        <>
            {children}
            <ChatWidget />
        </>
    );
}
