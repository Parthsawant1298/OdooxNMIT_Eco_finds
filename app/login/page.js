import Loginitem from '@/components/Login';
import { Suspense } from 'react';

function LoginSuspense() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <main>
            <Suspense fallback={<LoginSuspense />}>
                <Loginitem />
            </Suspense>
        </main>
    );
}