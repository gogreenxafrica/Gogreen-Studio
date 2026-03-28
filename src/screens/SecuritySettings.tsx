import React from 'react';
import { Icons } from '../../components/Icons';
import { Button } from '../../components/Button';

export const SecuritySettings: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-black text-gray-900 mb-6">Security & Sessions</h2>
      
      <div className="space-y-8">
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Active Sessions</h3>
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-bold text-sm">Chrome on Windows</p>
                <p className="text-xs text-gray-500">Last active: Just now</p>
              </div>
              <Button variant="outline" className="!h-11 !text-xs px-4">Log out</Button>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Security Activity</h3>
          <div className="space-y-3">
            <div className="flex gap-3 items-center text-sm">
              <Icons.ShieldCheck className="text-emerald-500 w-5 h-5" />
              <p>Login from Chrome on Windows at 12:00 PM</p>
            </div>
            <div className="flex gap-3 items-center text-sm">
              <Icons.ShieldCheck className="text-emerald-500 w-5 h-5" />
              <p>Password changed 2 days ago</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-4">2FA Management</h3>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-sm font-bold">Authenticator App</p>
            <Button variant="primary" className="!h-11 !text-xs px-4">Enable</Button>
          </div>
        </section>
      </div>
    </div>
  );
};
