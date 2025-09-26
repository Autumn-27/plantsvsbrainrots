'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUserInfo, clearUserInfo } from '@/lib/user';
import dynamic from 'next/dynamic';
const MyPvbTrades = dynamic(() => import('./MyPvbTrades'), { ssr: false });

export default function AccountPage() {
  const [user, setUser] = useState<{ id: string; name?: string | null; image?: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'gag' | 'pvb'>('gag');

  useEffect(() => {
    // 从本地存储加载用户信息
    const userInfo = getUserInfo();
    setUser(userInfo);
    setLoading(false);
  }, []);

  useEffect(() => {
    // 加载 99 nights in the forest 设置
    const run = async () => {
   
    };
    run();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse mb-6" />
        <div className="h-40 w-full bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Not signed in</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Sign in to view your Roblox avatar and basic information.</p>
        <button
          onClick={() => { location.href = '/api/oauth/roblox/login'; }}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Sign in with Roblox
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-semibold  text-gray-100 mb-6">Account</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 卡片 1：个人资料 */}
        <div className="rounded-2xl border border-white/10 bg-[#141824]/60 backdrop-blur shadow-sm hover:shadow transition p-6">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.image || '/favicon.png'}
              alt={user.name || 'User'}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-white/10"
            />
            <div className="flex-1 min-w-0">
              <div className="text-lg font-medium text-white truncate">{user.name || 'Roblox User'}</div>
              {user.id && (
                <div className="text-sm text-white/60 truncate">ID: {user.id}</div>
              )}
            </div>
            <button
              onClick={async () => { 
                await fetch('/api/logout', { method: 'POST' }); 
                clearUserInfo(); 
                setUser(null); 
                location.href = '/'; 
              }}
              className="px-4 py-2 rounded-xl bg-[#141824] text-white/80 text-sm border border-white/10 hover:bg-[#0f1115] hover:text-white transition"
            >
              Sign out
            </button>
          </div>
        </div>

      </div>
      <div className="mt-8">
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setTab('pvb')}
            className={(tab === 'pvb' ? 'text-blue-600 border-blue-600 ' : 'text-gray-600 dark:text-gray-400 border-transparent ') + 'px-4 py-2 -mb-px border-b-2 font-medium'}
          >
            Plants vs Brainrots Trading
          </button>
        </div>
        <div className="mt-6">
        <MyPvbTrades />
        </div>
      </div>
      <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
        <Link href="/">Back to Home</Link>
      </div>
    </div>
  );
}


