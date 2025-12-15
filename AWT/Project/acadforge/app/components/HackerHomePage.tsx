'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HackerHomePage({ user, recentLogins }: { user: any, recentLogins?: any[] }) {
    const [matrixChars, setMatrixChars] = useState<string[]>([]);
    const [terminalLines, setTerminalLines] = useState<string[]>([]);
    const [logs, setLogs] = useState<any[]>(recentLogins || []);

    useEffect(() => {
        // Live polling for logs (Simulated Socket)
        const pollInterval = setInterval(async () => {
            if (user) {
                try {
                    const res = await fetch('/api/logs', { cache: 'no-store' });
                    if (res.ok) {
                        const data = await res.json();
                        setLogs(data);
                    }
                } catch (e) {
                    // silent fail
                }
            }
        }, 3000);

        return () => clearInterval(pollInterval);
    }, [user]);

    useEffect(() => {
        // Generate random matrix characters
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'.split('');
        setMatrixChars(Array.from({ length: 50 }, () => chars[Math.floor(Math.random() * chars.length)]));

        // Simulate terminal boot sequence
        const lines = [
            '> INITIALIZING ACADFORGE SYSTEM...',
            '> LOADING MODULES...',
            '> ESTABLISHING SECURE CONNECTION...',
            '> SYSTEM READY'
        ];

        let currentLine = 0;
        const interval = setInterval(() => {
            if (currentLine < lines.length) {
                setTerminalLines(prev => [...prev, lines[currentLine]]);
                currentLine++;
            } else {
                clearInterval(interval);
            }
        }, 300);

        return () => clearInterval(interval);
    }, []);

    const formatIP = (ip: string) => {
        if (!ip) return 'UNKNOWN';
        if (ip === '::1' || ip === '127.0.0.1') return 'z127.0.0.1 (LOCALHOST)';
        return ip.replace('::ffff:', '');
    };

    return (
        <div className="flex min-h-screen flex-col bg-black font-mono relative overflow-hidden">
            {/* Matrix rain background */}
            <div className="fixed inset-0 opacity-5 pointer-events-none">
                <div className="flex justify-around h-full">
                    {matrixChars.map((char, i) => (
                        <div
                            key={i}
                            className="text-green-500 text-sm animate-pulse"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            {char.repeat(100)}
                        </div>
                    ))}
                </div>
            </div>

            {/* Grid overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-5"
                style={{
                    backgroundImage: 'linear-gradient(#00ff00 1px, transparent 1px), linear-gradient(90deg, #00ff00 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}
            />

            {/* Scanning line */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-scan opacity-30" />
            </div>

            {/* Navigation Header */}
            <header className="relative z-10 flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-sm border-b-2 border-green-500/50">
                <div className="flex items-center gap-4">
                    <div className="px-3 py-1 border border-green-500 rounded bg-green-500/10">
                        <span className="text-green-500 font-bold text-lg">{'<ACADFORGE/>'}</span>
                    </div>
                </div>

                <nav className="flex items-center gap-6">
                    <Link href="/" className="text-green-400 hover:text-green-300 transition-colors hover:underline">
                        {'> HOME'}
                    </Link>
                    <Link href="/dashboard" className="text-green-400 hover:text-green-300 transition-colors hover:underline">
                        {'> DASHBOARD'}
                    </Link>
                    {user ? (
                        <>
                            <span className="text-green-500">{'> USER: ' + (user.name || user.email)}</span>
                            <Link href="/api/logout" className="bg-red-500/20 hover:bg-red-500/30 border border-red-500 text-red-400 px-4 py-2 rounded text-sm transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                                {'> LOGOUT'}
                            </Link>
                        </>
                    ) : (
                        <Link href="/" className="bg-green-500/20 hover:bg-green-500/30 border border-green-500 text-green-400 px-4 py-2 rounded text-sm transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                            {'> LOGIN'}
                        </Link>
                    )}
                </nav>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-1 container mx-auto px-6 py-12">
                {/* Hero Section */}
                <section className="text-center mb-16">
                    <div className="mb-4">
                        {terminalLines.map((line, i) => (
                            <div key={i} className="text-green-400 text-sm mb-1">
                                {line}<span className="animate-pulse">▊</span>
                            </div>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-green-500 glitch-text">
                        {'> ACADFORGE_SYSTEM'}
                    </h1>
                    <p className="text-xl text-green-400/80 max-w-3xl mx-auto mb-8">
                        {'> ACADEMIC_PROJECT_MANAGEMENT_PROTOCOL_v2.0'}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={user ? "/dashboard" : "/login"}
                            className="bg-green-500/20 hover:bg-green-500/30 border-2 border-green-500 text-green-400 px-6 py-3 rounded font-bold transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                        >
                            {user ? '> ACCESS_DASHBOARD' : '> INITIALIZE_SESSION'}
                        </Link>
                        <Link
                            href="#features"
                            className="border-2 border-green-500/50 hover:border-green-500 hover:bg-green-500/10 text-green-400 px-6 py-3 rounded font-bold transition-all"
                        >
                            {'> EXPLORE_FEATURES'}
                        </Link>
                    </div>
                </section>

                {/* Project Description */}
                <section className="mb-16 bg-black/60 backdrop-blur-sm rounded-lg border-2 border-green-500/50 p-8 shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="ml-4 text-green-400">root@acadforge:~/about#</span>
                    </div>

                    <h2 className="text-2xl font-bold mb-6 text-green-500">{'> SYSTEM_OVERVIEW'}</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <p className="text-green-400/80">
                                {'> AcadForge is a cutting-edge academic project management system engineered for maximum efficiency in staff-student collaboration protocols.'}
                            </p>
                            <p className="text-green-400/80">
                                {'> Our platform deploys comprehensive tools for managing academic operations, tracking progress metrics, and facilitating secure communications.'}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-green-500 mb-3">{'> CORE_MODULES:'}</h3>
                            <ul className="space-y-2 text-green-400/80">
                                <li>{'>> project_group_management.sys'}</li>
                                <li>{'>> meeting_scheduler.exe'}</li>
                                <li>{'>> collaboration_tools.dll'}</li>
                                <li>{'>> analytics_engine.bin'}</li>
                                <li>{'>> security_authentication.key'}</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Authentication Status */}
                <section className="bg-black/60 backdrop-blur-sm rounded-lg border-2 border-green-500/50 p-8 shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="ml-4 text-green-400">root@acadforge:~/auth#</span>
                    </div>

                    <h2 className="text-2xl font-bold mb-6 text-green-500">{'> AUTHENTICATION_STATUS'}</h2>
                    {user ? (
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-green-500 font-bold mb-4 border-b border-green-500/30 pb-2">{'> USER_PROFILE'}</h3>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-green-500/10 border-2 border-green-500 rounded flex items-center justify-center text-green-400 font-bold text-2xl shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                                        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-bold text-green-400">{'> IDENTITY: ' + user.email}</p>
                                        {user.name && <p className="text-green-500/70">{'> ALIAS: ' + user.name}</p>}
                                        <p className="text-green-500">{'> ROLE: ' + (user.role || 'UNASSIGNED_PERSONNEL').toUpperCase()}</p>
                                        <p className="text-green-500/50 text-xs">{'> ID: ' + user.staffId}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Link href="/dashboard" className="bg-green-500/20 hover:bg-green-500/30 border border-green-500 text-green-400 px-4 py-2 rounded text-sm transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                                        {'> REFRESH_DATA'}
                                    </Link>
                                    <Link href="/api/logout" className="bg-red-500/20 hover:bg-red-500/30 border border-red-500 text-red-400 px-4 py-2 rounded text-sm transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                                        {'> TERMINATE_SESSION'}
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-green-500 font-bold mb-4 border-b border-green-500/30 pb-2">{'> ACTIVE_CONNECTIONS / LOGS'}</h3>
                                <div className="bg-black/50 rounded border border-green-500/30 p-4 font-mono text-xs h-48 overflow-y-auto custom-scrollbar">
                                    {!logs || logs.length === 0 ? (
                                        <p className="text-green-500/50">{'> NO_RECENT_LOGS_FOUND'}</p>
                                    ) : (
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="text-green-500 border-b border-green-500/20">
                                                    <th className="pb-2">TIMESTAMP</th>
                                                    <th className="pb-2">IP_ADDR</th>
                                                    <th className="pb-2">STATUS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {logs.map((log: any, i: number) => (
                                                    <tr key={i} className="text-green-400/70 hover:bg-green-500/10 hover:text-green-300 transition-colors">
                                                        <td className="py-1" suppressHydrationWarning>{new Date(log.LoginTime).toLocaleString('en-GB')}</td>
                                                        <td className="py-1">{formatIP(log.IPAddress)}</td>
                                                        <td className="py-1">{log.Success ? 'SUCCESS' : 'FAILED'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                                <p className="mt-2 text-green-500/40 text-xs text-right animate-pulse">
                                    {'> LIVE_FEED_ACTIVE'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <p className="text-green-400/70">{'> STATUS: NO_ACTIVE_SESSION DETECTED'}</p>
                            <div className="flex gap-3">
                                <Link href="/" className="bg-green-500/20 hover:bg-green-500/30 border border-green-500 text-green-400 px-4 py-2 rounded text-sm transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                                    {'> LOGIN'}
                                </Link>
                                <Link href="/register" className="border border-green-500/50 hover:border-green-500 hover:bg-green-500/10 text-green-400 px-4 py-2 rounded text-sm transition-all">
                                    {'> REGISTER'}
                                </Link>
                            </div>
                        </div>
                    )}
                </section>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t-2 border-green-500/50 py-8 bg-black/80 backdrop-blur-sm">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="px-2 py-1 border border-green-500 rounded bg-green-500/10">
                                <span className="text-green-500 font-bold">{'<ACADFORGE/>'}</span>
                            </div>
                            <span className="text-green-400/70 text-sm">{'© ' + new Date().getFullYear() + ' AcadForge. All rights reserved.'}</span>
                        </div>
                        <div className="flex gap-6 text-sm text-green-400">
                            <Link href="#" className="hover:text-green-300 transition-colors hover:underline">{'> Privacy'}</Link>
                            <Link href="#" className="hover:text-green-300 transition-colors hover:underline">{'> Terms'}</Link>
                            <Link href="#" className="hover:text-green-300 transition-colors hover:underline">{'> Contact'}</Link>
                        </div>
                    </div>
                </div>
            </footer>

            <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
        .glitch-text {
          text-shadow: 0 0 10px #22c55e, 0 0 20px #22c55e, 0 0 30px #22c55e, 0 0 40px #22c55e;
        }
      `}</style>
        </div>
    );
}
