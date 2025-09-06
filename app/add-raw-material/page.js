// app/add-raw-material/page.js
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function AddRawMaterialPage() {
    // Check if user is authenticated
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    
    if (!userId) {
        redirect('/login?redirectTo=/add-raw-material&message=Please login to add materials');
    }

    // Import the supplier add material component but use user auth
    const AddRawMaterial = (await import('@/components/AddRawMaterial')).default;
    
    return (
        <main>
            <AddRawMaterial />
        </main>
    );
}
