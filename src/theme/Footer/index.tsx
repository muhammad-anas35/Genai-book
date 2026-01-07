import React from 'react';
import OriginalFooter from '@theme-original/Footer';
import type FooterType from '@theme/Footer';
import { useLocation } from '@docusaurus/router';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): JSX.Element | null {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    // Don't render footer on auth pages
    if (isAuthPage) {
        return null;
    }

    return (
        <>
            <OriginalFooter {...props} />
        </>
    );
}
