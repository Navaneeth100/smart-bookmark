'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { LogOut, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'

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
        if (!user) return toast.error('User not loaded yet')
        if (!url || !title) return toast.warning('Enter title and URL')

        setAdding(true)

        let fixedUrl = url.trim()

        try {
            if (!fixedUrl.startsWith('http://') && !fixedUrl.startsWith('https://')) {
                fixedUrl = 'https://' + fixedUrl
            }

            let urlObj = new URL(fixedUrl)

            if (!urlObj.hostname.includes('.')) {
                urlObj = new URL(`https://${urlObj.hostname}.com`)
            }

            fixedUrl = urlObj.href

            if (!urlObj.hostname.includes('.')) {
                toast.error('Enter a valid website domain (example: google.com)')
                setAdding(false)
                return
            }

            fixedUrl = urlObj.href

        } catch {
            toast.error('Invalid URL')
            setAdding(false)
            return
        }

        const { error } = await supabase.from('bookmarks').insert({
            url: fixedUrl,
            title,
            user_id: user.id,
        })

        setAdding(false)

        if (error) {
            toast.error('Failed to add bookmark')
            return
        }

        setUrl('')
        setTitle('')
        fetchBookmarks()
        toast.success('Bookmark added')
    }

    const deleteBookmark = async (id: string) => {
        await supabase.from('bookmarks').delete().eq('id', id)
        fetchBookmarks()
        toast.success('Bookmark removed')
    }

    const logout = async () => {
        await supabase.auth.signOut()
        location.href = '/login'
    }

    if (loadingUser) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white shadow-lg rounded-xl px-8 py-10 flex flex-col items-center gap-4">

                    <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>

                    <div className="text-center">
                        <p className="text-sm text-gray-500">Loading your bookmarks...</p>
                    </div>

                </div>
            </div>
        )
    }


    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Smart Bookmarks
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Save and access your links anytime
                        </p>
                    </div>

                    <button onClick={logout} className="flex items-center gap-2 text-sm bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"> <LogOut size={16} /> Logout</button>
                </div>

                <div className="bg-gray-50 border rounded-xl p-5 mb-8">
                    <h2 className="text-sm font-bold text-gray-600 mb-4">
                        Add New Bookmark
                    </h2>

                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                        <input
                            className="w-full border rounded-lg px-3 py-2 text-sm text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-black/80 bg-white"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <input
                            className="w-full border rounded-lg px-3 py-2 text-sm text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-black/80 bg-white"
                            placeholder="https://example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />

                        <button
                            onClick={addBookmark}
                            disabled={adding || !title || !url}
                            className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                        >
                            {adding ? 'Adding...' : 'Add Bookmark'}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col h-[350px] min-h-0">
                    <h2 className="text-sm font-medium text-gray-600 mb-4">
                        Your Bookmarks
                    </h2>

                    {bookmarks.length === 0 ? (
                        <div className="text-gray-500 text-center py-12 border rounded-xl bg-gray-50">
                            No bookmarks added
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                            {bookmarks.map((b) => (
                                <div
                                    key={b.id}
                                    className="border rounded-xl px-5 py-4 flex justify-between items-center hover:shadow-md transition bg-white"
                                >
                                    <div className="overflow-hidden">
                                        <p className="font-medium text-gray-800 truncate">
                                            {b.title}
                                        </p>
                                        <a
                                            href={b.url}
                                            target="_blank"
                                            className="text-sm text-blue-600 hover:underline truncate block"
                                        >
                                            {b.url}
                                        </a>
                                    </div>

                                    <button
                                        onClick={() => deleteBookmark(b.id)}
                                        className="text-gray-400 hover:text-red-500 transition p-2 rounded-md hover:bg-red-50"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
