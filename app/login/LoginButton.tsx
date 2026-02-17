'use client'

import { supabase } from '@/lib/supabaseClient'

export default function LoginButton() {

    const login = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        })
    }


    return (
        <button
            onClick={login}
            className="bg-black text-white px-6 py-3 rounded-lg"
        >
            Continue with Google
        </button>
    )
}
