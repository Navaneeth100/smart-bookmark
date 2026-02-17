import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createSupabaseServer } from '@/lib/supabaseServer'
import DashboardClient from './DashboardClient'

export default async function Dashboard() {
    const cookieStore = await cookies()
    const supabase = createSupabaseServer(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    return <DashboardClient />
}
