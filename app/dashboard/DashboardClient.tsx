'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function DashboardClient() {
    const [user, setUser] = useState<any>(null)
    const [url, setUrl] = useState('')
    const [title, setTitle] = useState('')
    const [bookmarks, setBookmarks] = useState<any[]>([])
    const [loadingUser, setLoadingUser] = useState(true)
    const [adding, setAdding] = useState(false)

    useEffect(() => {
        getUser()
        fetchBookmarks()

        const channel = supabase
            .channel('bookmarks-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'bookmarks' },
                () => {
                    fetchBookmarks()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const getUser = async () => {
        const { data } = await supabase.auth.getUser()
        setUser(data.user)
        setLoadingUser(false)
    }

    const fetchBookmarks = async () => {
        const { data } = await supabase
            .from('bookmarks')
            .select('*')
            .order('created_at', { ascending: false })

        setBookmarks(data || [])
    }

    const addBookmark = async () => {
        if (!user) return alert('User not loaded yet')
        if (!url || !title) return

        if (!url.startsWith('http')) {
            alert('Enter valid URL starting with http/https')
            return
        }

        setAdding(true)

        await supabase.from('bookmarks').insert({
            url,
            title,
            user_id: user.id,
        })

        setUrl('')
        setTitle('')
        setAdding(false)
    }

    const deleteBookmark = async (id: string) => {
        await supabase.from('bookmarks').delete().eq('id', id)
    }

    const logout = async () => {
        await supabase.auth.signOut()
        location.href = '/login'
    }

    if (loadingUser) {
        return <div className="p-10 text-center">Loading session...</div>
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Smart Bookmarks</h1>
                <button onClick={logout} className="text-sm text-red-500">Logout</button>
            </div>

            <div className="space-y-2 mb-6">
                <input
                    className="border p-2 w-full rounded"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    className="border p-2 w-full rounded"
                    placeholder="URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />

                <button
                    onClick={addBookmark}
                    disabled={adding}
                    className="bg-black text-white px-4 py-2 rounded w-full"
                >
                    {adding ? 'Adding...' : 'Add Bookmark'}
                </button>
            </div>

            <div className="space-y-3">
                {bookmarks.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">
                        No bookmarks added
                    </p>
                ) : (
                    bookmarks.map((b) => (
                        <div
                            key={b.id}
                            className="border p-3 rounded flex justify-between items-center"
                        >
                            <div>
                                <p className="font-semibold">{b.title}</p>
                                <a
                                    href={b.url}
                                    target="_blank"
                                    className="text-blue-600 text-sm"
                                >
                                    {b.url}
                                </a>
                            </div>

                            <button
                                onClick={() => deleteBookmark(b.id)}
                                className="text-red-500 hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
