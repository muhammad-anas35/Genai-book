import { useEffect, useState, type ReactNode } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps): ReactNode {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/check');
                const data = await response.json();
                setIsAuthenticated(data.authenticated);

                if (!data.authenticated) {
                    // Store the intended destination
                    sessionStorage.setItem('redirectAfterLogin', location.pathname);
                    history.push('/login');
                }
            } catch (error) {
                console.error('Failed to check authentication:', error);
                setIsAuthenticated(false);
                sessionStorage.setItem('redirectAfterLogin', location.pathname);
                history.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [history, location.pathname]);

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                fontSize: '1.2rem',
                color: 'var(--ifm-color-primary)'
            }}>
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
