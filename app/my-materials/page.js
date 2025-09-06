// app/my-materials/page.js
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function MyMaterialsPage() {
    // Check if user is authenticated
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    
    if (!userId) {
        redirect('/login?redirectTo=/my-materials&message=Please login to view your materials');
    }

    // Import the user materials component
    const UserRawMaterials = (await import('@/components/UserRawMaterials')).default;
    
    return (
        <main>
            <UserRawMaterials />
        </main>
    );
}
