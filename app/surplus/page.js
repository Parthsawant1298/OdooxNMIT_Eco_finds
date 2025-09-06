// app/surplus/page.js
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function SurplusPage() {
    // Check if user is authenticated
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    
    if (!userId) {
        redirect('/login?redirectTo=/surplus&message=Please login to access surplus features');
    }

    // Import the user surplus component
    const UserSurplus = (await import('@/components/UserSurplus')).default;
    
    return (
        <main>
            <UserSurplus />
        </main>
    );
}
