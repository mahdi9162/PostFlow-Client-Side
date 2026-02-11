import React, { useState } from 'react';
import { Hash } from 'lucide-react';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import TagGroupsList from './TagGroupsList';

const accounts = [
  { value: 'snortpugs', label: 'Snortpugs' },
  { value: 'pugsnortz', label: 'Pugsnortz' },
  { value: 'pugsnuff', label: 'Pugsnuff' },
];

const AccountTagGroupsPanel = () => {
  const [selectedAccount, setSelectedAccount] = useState('');

  const axiosSecure = useAxiosSecure();
  const { data: tags } = useQuery({
    queryKey: [selectedAccount],
    enabled: Boolean(selectedAccount),
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/tags?accountId=${selectedAccount}`);
      return res.data;
    },
  });

  return (
    <div className="rounded-2xl border border-base-200 bg-base-100 p-4">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
          <Hash className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-secondary">Select Account</p>
          <p className="text-xs text-muted leading-relaxed">Choose which accounts tags you're editing.</p>
        </div>
      </div>

      <div className="mt-4">
        <label className="text-[11px] sm:text-xs font-semibold text-secondary/70">Account</label>

        <select
          className="select select-bordered w-full mt-2 rounded-xl text-sm"
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
        >
          <option value="" disabled hidden>
            Select an Account
          </option>

          {accounts.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>

        <div className="mt-2 text-xs text-muted">
          Selected: <span className="font-semibold text-secondary/80">{selectedAccount || '—'}</span>
        </div>
      </div>

      <TagGroupsList tags={tags} onUpdate={(item) => console.log('update', item)} onDelete={(item) => console.log('delete', item)} />
    </div>
  );
};

export default AccountTagGroupsPanel;
