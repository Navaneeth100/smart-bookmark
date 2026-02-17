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
        <div className="flex h-screen items-center justify-center">
            <LoginButton />
        </div>
    )
}
