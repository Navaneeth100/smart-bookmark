'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LoginButton() {

    const [loading, setLoading] = useState(false)

    const login = async () => {

        setLoading(true)

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
            disabled={loading}
            className={`flex items-center justify-center gap-3 w-full border rounded-lg px-5 py-3 transition ${loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border-gray-300 hover:shadow-md text-gray-700'}`}
        >
            {loading ? (
                <>
                    <svg
                        className="animate-spin h-5 w-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                        />
                    </svg>

                    Redirecting...
                </>
            ) : (
                <>
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="google"
                        className="w-5 h-5"
                    />
                    Continue with Google
                </>
            )}
        </button>
    )
}
