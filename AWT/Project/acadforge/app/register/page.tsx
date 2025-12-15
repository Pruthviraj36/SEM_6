// 'use client'

// import { useRouter } from 'next/navigation'
// import React, { useState } from 'react'
// import Image from 'next/image'
// import Link from 'next/link'

// function RegisterPage() {
//     const router = useRouter()
//     const [name, setName] = useState('')
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     const [phone, setPhone] = useState('')
//     const [description, setDescription] = useState('')
//     const [error, setError] = useState<string | null>(null)
//     const [loading, setLoading] = useState(false)

//     const onSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()
//         setLoading(true)
//         setError(null)

//         try {
//             const res = await fetch('/api/register', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ name, email, password, phone, description })
//             })

//             const data = await res.json()

//             if (!res.ok) {
//                 setError(data.message || 'Registration failed')
//             } else {
//                 // Success - redirect to login
//                 router.push('/login')
//             }
//         } catch (err) {
//             setError(`An unexpected error occurred :${err}`)
//         } finally {
//             setLoading(false)
//         }
//     }

//     return (
//         <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
//             {/* Left side - Branding */}
//             <div className="hidden lg:flex flex-1 items-center justify-center bg-blue-600 dark:bg-blue-800 p-12">
//                 <div className="text-center text-white">
//                     <div className="mb-8">
//                         <Image
//                             src="/next.svg"
//                             alt="AcadForge Logo"
//                             width={120}
//                             height={24}
//                             className="invert brightness-0"
//                         />
//                     </div>
//                     <h1 className="text-3xl font-bold mb-4">Join AcadForge</h1>
//                     <p className="text-blue-100 max-w-md">
//                         Create your account to start managing academic projects.
//                         Collaborate with students and staff efficiently.
//                     </p>
//                 </div>
//             </div>

//             {/* Right side - Register Form */}
//             <div className="flex-1 flex items-center justify-center p-6">
//                 <div className="w-full max-w-md">
//                     <div className="mb-8 lg:hidden">
//                         <Image
//                             src="/next.svg"
//                             alt="AcadForge Logo"
//                             width={100}
//                             height={20}
//                             className="dark:invert mx-auto"
//                         />
//                         <h1 className="text-2xl font-bold text-center mt-4 text-black dark:text-white">Staff Registration</h1>
//                     </div>

//                     <div className="lg:hidden text-center mb-6">
//                         <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Create Account</h1>
//                     </div>

//                     <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-8">
//                         <form onSubmit={onSubmit} className="space-y-4">
//                             {error && (
//                                 <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
//                                     <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
//                                 </div>
//                             )}

//                             <div>
//                                 <label htmlFor="name" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
//                                     Full Name
//                                 </label>
//                                 <input
//                                     id="name"
//                                     type="text"
//                                     className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-zinc-100 transition-all"
//                                     value={name}
//                                     onChange={e => setName(e.target.value)}
//                                     required
//                                     placeholder="Prof. John Doe"
//                                 />
//                             </div>

//                             <div>
//                                 <label htmlFor="email" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
//                                     Email Address
//                                 </label>
//                                 <input
//                                     id="email"
//                                     type="email"
//                                     className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-zinc-100 transition-all"
//                                     value={email}
//                                     onChange={e => setEmail(e.target.value)}
//                                     required
//                                     placeholder="your@university.edu"
//                                 />
//                             </div>

//                             <div>
//                                 <label htmlFor="phone" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
//                                     Phone Number
//                                 </label>
//                                 <input
//                                     id="phone"
//                                     type="tel"
//                                     className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-zinc-100 transition-all"
//                                     value={phone}
//                                     onChange={e => setPhone(e.target.value)}
//                                     placeholder="+1 (555) 000-0000"
//                                 />
//                             </div>

//                             <div>
//                                 <label htmlFor="password" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
//                                     Password
//                                 </label>
//                                 <input
//                                     id="password"
//                                     type="password"
//                                     className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-zinc-100 transition-all"
//                                     value={password}
//                                     onChange={e => setPassword(e.target.value)}
//                                     required
//                                     placeholder="••••••••"
//                                 />
//                             </div>

//                             <div>
//                                 <label htmlFor="description" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
//                                     Description / Role
//                                 </label>
//                                 <select
//                                     id="description"
//                                     className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-zinc-100 transition-all"
//                                     value={description}
//                                     onChange={e => setDescription(e.target.value)}
//                                 >
//                                     <option value="">Select Staff Position...</option>
//                                     <option value="Assistant Professor, Department of CS">Assistant Professor, Department of CS</option>
//                                     <option value="Associate Professor, Department of CS">Associate Professor, Department of CS</option>
//                                     <option value="Professor, Department of CS">Professor, Department of CS</option>
//                                     <option value="Head of Department, CS">Head of Department, CS</option>
//                                 </select>
//                             </div>

//                             <div className="pt-2">
//                                 <button
//                                     type="submit"
//                                     disabled={loading}
//                                     className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     {loading ? (
//                                         <>
//                                             <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                             </svg>
//                                             Creating Account...
//                                         </>
//                                     ) : 'Sign Up'}
//                                 </button>
//                             </div>
//                         </form>

//                         <div className="mt-6">
//                             <div className="relative">
//                                 <div className="absolute inset-0 flex items-center">
//                                     <div className="w-full border-t border-zinc-300 dark:border-zinc-700"></div>
//                                 </div>
//                                 <div className="relative flex justify-center text-sm">
//                                     <span className="px-2 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
//                                         Already have an account?
//                                     </span>
//                                 </div>
//                             </div>

//                             <div className="mt-6">
//                                 <Link
//                                     href="/login"
//                                     className="w-full flex justify-center py-3 px-4 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
//                                 >
//                                     Log In
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
//                         <Link href="/" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
//                             ← Back to Home
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default RegisterPage


'use client'

import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

function RegisterPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [role, setRole] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [matrixChars, setMatrixChars] = useState<string[]>([])
    const [terminalText, setTerminalText] = useState('')

    useEffect(() => {
        // Generate random matrix characters
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'.split('')
        setMatrixChars(Array.from({ length: 50 }, () => chars[Math.floor(Math.random() * chars.length)]))

        // Terminal typing effect
        const text = '> INITIALIZING REGISTRATION PROTOCOL...'
        let i = 0
        const interval = setInterval(() => {
            if (i < text.length) {
                setTerminalText(text.slice(0, i + 1))
                i++
            } else {
                clearInterval(interval)
            }
        }, 50)

        return () => clearInterval(interval)
    }, [])

    const handleSubmit = async () => {
        setLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, phone, role })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || 'REGISTRATION FAILED')
            } else {
                router.push('/login')
            }
        } catch (err) {
            setError(`SYSTEM ERROR: ${err}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-black relative overflow-hidden">
            {/* Matrix rain background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="flex justify-around h-full">
                    {matrixChars.map((char, i) => (
                        <div
                            key={i}
                            className="text-green-500 text-sm font-mono animate-pulse"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            {char.repeat(50)}
                        </div>
                    ))}
                </div>
            </div>

            {/* Grid overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-5"
                style={{
                    backgroundImage: 'linear-gradient(#00ff00 1px, transparent 1px), linear-gradient(90deg, #00ff00 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}
            />

            {/* Left side - Hacker Branding */}
            <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-12 relative border-r-2 border-green-500/30">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse" />

                <div className="text-center relative z-10">
                    <div className="mb-8 inline-block p-4 border-2 border-green-500 rounded-lg bg-black/50 backdrop-blur-sm shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                        <div className="text-green-500 font-mono text-4xl font-bold glitch-text">
                            {'<ACADFORGE/>'}
                        </div>
                    </div>

                    <div className="mb-4 font-mono text-green-400 text-sm">
                        {terminalText}<span className="animate-pulse">▊</span>
                    </div>

                    <h1 className="text-3xl font-bold mb-4 text-green-500 font-mono tracking-wider">
                        ACCESS GRANTED
                    </h1>
                    <p className="text-green-400/80 max-w-md font-mono text-sm leading-relaxed">
                        {'> ESTABLISHING SECURE CONNECTION...'}<br />
                        {'> ENCRYPTING DATA STREAM...'}<br />
                        {'> READY FOR CREDENTIAL INPUT'}
                    </p>

                    <div className="mt-8 flex justify-center gap-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                        ))}
                    </div>
                </div>

                {/* Scanning line effect */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-scan" />
                </div>
            </div>

            {/* Right side - Terminal Register Form */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-md">
                    <div className="mb-8 lg:hidden text-center">
                        <div className="inline-block p-3 border border-green-500 rounded bg-black/50 backdrop-blur-sm mb-4">
                            <div className="text-green-500 font-mono text-2xl font-bold">
                                {'<ACADFORGE/>'}
                            </div>
                        </div>
                        <h1 className="text-xl font-mono text-green-500">STAFF REGISTRATION</h1>
                    </div>

                    <div className="bg-black/80 backdrop-blur-sm rounded-lg border-2 border-green-500/50 shadow-[0_0_50px_rgba(34,197,94,0.2)] relative overflow-hidden">
                        {/* Terminal header */}
                        <div className="bg-gradient-to-r from-green-900/50 to-green-800/50 px-4 py-3 border-b-2 border-green-500/50 flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <div className="font-mono text-green-400 text-sm flex-1 text-center">
                                root@acadforge:~/register#
                            </div>
                        </div>

                        <div className="p-8">
                            {/* Hidden fake fields to confuse autofill */}
                            <input type="text" style={{ display: 'none' }} autoComplete="off" />
                            <input type="password" style={{ display: 'none' }} autoComplete="off" />

                            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                                {error && (
                                    <div className="p-3 bg-red-500/10 rounded border border-red-500 backdrop-blur-sm">
                                        <p className="text-sm text-red-400 font-mono">{'> ERROR: ' + error}</p>
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="xname" className="block text-sm font-mono text-green-400 mb-2">
                                        {'> FULL_NAME:'}
                                    </label>
                                    <input
                                        id="xname"
                                        name={`field_${Math.random()}`}
                                        type="text"
                                        className="w-full px-3 py-2 bg-black border border-green-500/50 rounded font-mono text-green-300 focus:outline-none focus:border-green-500 focus:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all placeholder-green-700"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                        placeholder="Prof. John Doe"
                                        autoComplete="chrome-off"
                                        data-lpignore="true"
                                        data-form-type="other"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="xemail" className="block text-sm font-mono text-green-400 mb-2">
                                        {'> EMAIL_ADDRESS:'}
                                    </label>
                                    <input
                                        id="xemail"
                                        name={`field_${Math.random()}`}
                                        type="text"
                                        className="w-full px-3 py-2 bg-black border border-green-500/50 rounded font-mono text-green-300 focus:outline-none focus:border-green-500 focus:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all placeholder-green-700"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        placeholder="your@university.edu"
                                        autoComplete="chrome-off"
                                        data-lpignore="true"
                                        data-form-type="other"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="xphone" className="block text-sm font-mono text-green-400 mb-2">
                                        {'> PHONE_NUMBER:'}
                                    </label>
                                    <input
                                        id="xphone"
                                        name={`field_${Math.random()}`}
                                        type="text"
                                        className="w-full px-3 py-2 bg-black border border-green-500/50 rounded font-mono text-green-300 focus:outline-none focus:border-green-500 focus:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all placeholder-green-700"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        placeholder="+1 (555) 000-0000"
                                        autoComplete="chrome-off"
                                        data-lpignore="true"
                                        data-form-type="other"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="xpassword" className="block text-sm font-mono text-green-400 mb-2">
                                        {'> PASSWORD:'}
                                    </label>
                                    <input
                                        id="xpassword"
                                        name={`field_${Math.random()}`}
                                        type="password"
                                        className="w-full px-3 py-2 bg-black border border-green-500/50 rounded font-mono text-green-300 focus:outline-none focus:border-green-500 focus:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all placeholder-green-700"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        autoComplete="chrome-off"
                                        data-lpignore="true"
                                        data-form-type="other"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="role" className="block text-sm font-mono text-green-400 mb-2">
                                        {'> ACCESS_LEVEL (ROLE):'}
                                    </label>
                                    <select
                                        id="role"
                                        className="w-full px-3 py-2 bg-black border border-green-500/50 rounded font-mono text-green-300 focus:outline-none focus:border-green-500 focus:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all"
                                        value={role}
                                        onChange={e => setRole(e.target.value)}
                                    >
                                        <option value="">Select Role...</option>
                                        <option value="access_student">ROLE: STUDENT</option>
                                        <option value="access_faculty">ROLE: FACULTY</option>
                                        <option value="access_admin">ROLE: ADMIN (DEAN)</option>
                                    </select>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center items-center py-3 px-4 border-2 border-green-500 rounded font-mono text-sm font-bold text-green-400 bg-green-500/10 hover:bg-green-500/20 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {'> PROCESSING...'}
                                            </>
                                        ) : '> EXECUTE_REGISTRATION'}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-green-500/30"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-black font-mono text-green-500/70">
                                            {'> EXISTING_USER?'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Link
                                        href="/login"
                                        className="w-full flex justify-center py-3 px-4 border border-green-500/50 rounded font-mono text-sm text-green-400 hover:bg-green-500/10 hover:border-green-500 transition-all"
                                    >
                                        {'> ACCESS_LOGIN_TERMINAL'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-sm">
                        <Link href="/" className="font-mono text-green-500 hover:text-green-400 transition-colors hover:underline">
                            {'< RETURN_TO_MAIN_SYSTEM'}
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(100vh); }
                }
                .animate-scan {
                    animation: scan 3s linear infinite;
                }
                .glitch-text {
                    text-shadow: 0 0 10px #22c55e, 0 0 20px #22c55e, 0 0 30px #22c55e;
                }
            `}</style>
        </div >
    )
}

export default RegisterPage