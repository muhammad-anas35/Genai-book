import React from 'react';
import OriginalFooter from '@theme-original/Footer';
import type FooterType from '@theme/Footer';
import type { WrapperProps } from '@docusaurus/types';
import { useLocation } from '@docusaurus/router';

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): React.ReactNode {
    const { pathname } = useLocation();
    const isAuthPage = pathname.includes('/auth/');

    if (isAuthPage) {
        return null;
    }

    return (
        <>
            <OriginalFooter {...props} />
        </>
    );
}
