import React from 'react';
import OriginalFooter from '@theme-original/Footer';
import type FooterType from '@theme/Footer';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): React.ReactNode {
    return (
        <>
            <OriginalFooter {...props} />
        </>
    );
}
