import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createSupabaseServer } from '@/lib/supabaseServer'
import LoginButton from './LoginButton'

export default async function LoginPage() {
    const cookieStore = await cookies()
    const supabase = createSupabaseServer(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()

    if (user) redirect('/dashboard')

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">

                <div className="text-center mb-8">
                    <h1 className="text-black text-3xl font-bold">Smart Bookmarks</h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Save and access your links anywhere
                    </p>
                </div>

                <LoginButton />

                <p className="text-xs text-gray-400 text-center mt-6">
                    Secure login powered by Google & Supabase
                </p>

            </div>
        </div>
    )
}
