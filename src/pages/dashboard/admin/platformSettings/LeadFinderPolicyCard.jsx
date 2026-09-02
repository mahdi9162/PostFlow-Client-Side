import React from 'react';
import { Compass, AlertCircle, Clock, Globe } from 'lucide-react';

const parse24To12 = (time24 = '01:00') => {
  const [hStr, mStr] = (time24 || '01:00').split(':');
  let h = parseInt(hStr || '1', 10);
  const m = mStr || '00';
  const period = h >= 12 ? 'PM' : 'AM';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return { hour: h, minute: m, period };
};

const format12To24 = (hour, minute, period) => {
  let h = parseInt(hour, 10);
  const m = String(minute).padStart(2, '0');
  if (period === 'AM') {
    if (h === 12) h = 0;
  } else {
    if (h !== 12) h += 12;
  }
  return `${String(h).padStart(2, '0')}:${m}`;
};

const COMMON_TIMEZONES = [
  { value: 'Asia/Dhaka', label: 'Asia/Dhaka (GMT+6)' },
  { value: 'UTC', label: 'UTC (GMT+0)' },
  { value: 'America/New_York', label: 'America/New York (EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'America/Los Angeles (PST/PDT)' },
  { value: 'America/Chicago', label: 'America/Chicago (CST/CDT)' },
  { value: 'Europe/London', label: 'Europe/London (GMT/BST)' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin (CET/CEST)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GST)' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (AEST/AEDT)' },
];

const Time12Picker = ({ label, value24, onChange }) => {
  const { hour, minute, period } = parse24To12(value24);

  const handleHourChange = (e) => {
    const newHour = parseInt(e.target.value, 10);
    onChange(format12To24(newHour, minute, period));
  };

  const handleMinuteChange = (e) => {
    const newMinute = e.target.value;
    onChange(format12To24(hour, newMinute, period));
  };

  const handlePeriodChange = (e) => {
    const newPeriod = e.target.value;
    onChange(format12To24(hour, minute, newPeriod));
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-base-content/70 flex items-center gap-1">
        <Clock className="w-3.5 h-3.5 text-primary" />
        {label}
      </label>
      <div className="flex items-center gap-1.5">
        {/* Hour (1-12) */}
        <select
          className="select select-bordered select-sm rounded-xl font-medium w-16"
          value={hour}
          onChange={handleHourChange}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
        <span className="text-base-content/40 font-bold">:</span>
        {/* Minute (00-55) */}
        <select
          className="select select-bordered select-sm rounded-xl font-medium w-16 font-mono"
          value={minute}
          onChange={handleMinuteChange}
        >
          {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        {/* Period (AM/PM) */}
        <select
          className="select select-bordered select-sm rounded-xl font-bold w-20 text-primary"
          value={period}
          onChange={handlePeriodChange}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
};

const LeadFinderPolicyCard = ({ localData, setLocalData, originalData }) => {
  const lf = localData?.leadFinder || {
    leadFinderEnabled: false,
    autoScrapingEnabled: false,
    scrapingStartTime: '01:00',
    scrapingEndTime: '05:00',
    timezone: 'Asia/Dhaka',
    leadBufferPercent: 0,
  };

  const originalLf = originalData?.leadFinder || {
    leadFinderEnabled: false,
    autoScrapingEnabled: false,
    scrapingStartTime: '01:00',
    scrapingEndTime: '05:00',
    timezone: 'Asia/Dhaka',
    leadBufferPercent: 0,
  };

  const isDirty =
    lf.leadFinderEnabled !== originalLf.leadFinderEnabled ||
    lf.autoScrapingEnabled !== originalLf.autoScrapingEnabled ||
    lf.scrapingStartTime !== originalLf.scrapingStartTime ||
    lf.scrapingEndTime !== originalLf.scrapingEndTime ||
    lf.timezone !== originalLf.timezone ||
    Number(lf.leadBufferPercent ?? 0) !== Number(originalLf.leadBufferPercent ?? 0);

  const isTimeWindowEqual = lf.scrapingStartTime === lf.scrapingEndTime;

  const handleToggleLeadFinder = (e) => {
    setLocalData((prev) => ({
      ...prev,
      leadFinder: {
        ...prev.leadFinder,
        leadFinderEnabled: e.target.checked,
      },
    }));
  };

  const handleToggleAutoScraping = (e) => {
    setLocalData((prev) => ({
      ...prev,
      leadFinder: {
        ...prev.leadFinder,
        autoScrapingEnabled: e.target.checked,
      },
    }));
  };

  const handleStartTimeChange = (val) => {
    setLocalData((prev) => ({
      ...prev,
      leadFinder: {
        ...prev.leadFinder,
        scrapingStartTime: val,
      },
    }));
  };

  const handleEndTimeChange = (val) => {
    setLocalData((prev) => ({
      ...prev,
      leadFinder: {
        ...prev.leadFinder,
        scrapingEndTime: val,
      },
    }));
  };

  const handleTimezoneChange = (e) => {
    setLocalData((prev) => ({
      ...prev,
      leadFinder: {
        ...prev.leadFinder,
        timezone: e.target.value,
      },
    }));
  };

  const handleBufferChange = (e) => {
    const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
    setLocalData((prev) => ({
      ...prev,
      leadFinder: {
        ...prev.leadFinder,
        leadBufferPercent: val,
      },
    }));
  };

  return (
    <div
      className={`rounded-2xl border ${
        isDirty ? 'border-primary/40 shadow-sm bg-base-100' : 'border-base-200 bg-base-100'
      } p-5 transition-all md:col-span-2`}
    >
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-base-content">Lead Finder Global Configuration</h3>
            <p className="text-xs text-base-content/60">
              Manage platform-wide Instagram lead generation rules and automatic scraping windows.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Toggles Column */}
        <div className="flex flex-col gap-4 bg-base-200/40 p-4 rounded-2xl border border-base-200">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-semibold text-sm text-base-content block">Lead Finder Master Switch</span>
              <span className="text-xs text-base-content/60 block">Enable or disable all Lead Finder workflows platform-wide</span>
            </div>
            <input
              type="checkbox"
              className="toggle toggle-primary toggle-sm"
              checked={lf.leadFinderEnabled}
              onChange={handleToggleLeadFinder}
            />
          </label>

          <div className="divider my-0 opacity-40" />

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-semibold text-sm text-base-content block">Automatic Scraping (Cron)</span>
              <span className="text-xs text-base-content/60 block">Allow scheduled LEAD_AUTO workflows during the configured window</span>
            </div>
            <input
              type="checkbox"
              className="toggle toggle-primary toggle-sm"
              checked={lf.autoScrapingEnabled}
              onChange={handleToggleAutoScraping}
              disabled={!lf.leadFinderEnabled}
            />
          </label>
        </div>

        {/* Time Window & Timezone Column */}
        <div className="flex flex-col gap-4 bg-base-200/40 p-4 rounded-2xl border border-base-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Time12Picker
              label="Scraping Window Start"
              value24={lf.scrapingStartTime}
              onChange={handleStartTimeChange}
            />
            <Time12Picker
              label="Scraping Window End"
              value24={lf.scrapingEndTime}
              onChange={handleEndTimeChange}
            />
          </div>

          {isTimeWindowEqual && (
            <p className="text-xs text-error flex items-center gap-1.5 font-medium bg-error/10 p-2 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              Start time and end time cannot be identical.
            </p>
          )}

          <div>
            <label className="text-xs font-semibold text-base-content/70 flex items-center gap-1 mb-1.5">
              <Globe className="w-3.5 h-3.5 text-primary" />
              Scraping Timezone
            </label>
            <select
              className="select select-bordered select-sm w-full rounded-xl"
              value={lf.timezone}
              onChange={handleTimezoneChange}
            >
              {COMMON_TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
              {!COMMON_TIMEZONES.some((tz) => tz.value === lf.timezone) && (
                <option value={lf.timezone}>{lf.timezone}</option>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Lead Buffer & Quota Preview Section (B4) */}
      <div className="mt-6 pt-5 border-t border-base-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Buffer Control */}
          <div className="flex flex-col gap-2 bg-base-200/40 p-4 rounded-2xl border border-base-200">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-base-content">
                Lead Buffer Reserve
              </label>
              <span className="badge badge-primary badge-sm font-mono font-bold">
                {Number(lf.leadBufferPercent || 0)}%
              </span>
            </div>
            <p className="text-xs text-base-content/60 leading-relaxed">
              Generate a small reserve of extra qualified leads without increasing the daily visible follow target.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                min="0"
                max="100"
                className="input input-bordered input-sm rounded-xl font-medium w-24 text-center font-mono"
                value={lf.leadBufferPercent ?? 0}
                onChange={handleBufferChange}
              />
              <span className="text-xs font-semibold text-base-content/70">% extra reserve</span>
            </div>
            {(!Number.isInteger(Number(lf.leadBufferPercent)) || Number(lf.leadBufferPercent) < 0 || Number(lf.leadBufferPercent) > 100) && (
              <p className="text-xs text-error font-medium">Buffer percent must be an integer between 0 and 100.</p>
            )}
          </div>

          {/* Dynamic Formula & Quota Explanation */}
          <div className="md:col-span-2 bg-primary/5 border border-primary/15 p-4 rounded-2xl">
            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
              Formula & Quota Preview (Example: Daily Target = 20)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-base-100/80 p-2.5 rounded-xl border border-base-200">
                <div className="text-[11px] text-base-content/60 font-medium">Visible Target</div>
                <div className="text-base font-bold text-base-content">20</div>
                <div className="text-[10px] text-base-content/50">Worker-facing</div>
              </div>
              <div className="bg-base-100/80 p-2.5 rounded-xl border border-base-200">
                <div className="text-[11px] text-base-content/60 font-medium">Buffer Percent</div>
                <div className="text-base font-bold text-primary">{Number(lf.leadBufferPercent || 0)}%</div>
                <div className="text-[10px] text-base-content/50">Global reserve rate</div>
              </div>
              <div className="bg-base-100/80 p-2.5 rounded-xl border border-base-200">
                <div className="text-[11px] text-base-content/60 font-medium">Generation Target</div>
                <div className="text-base font-bold text-secondary">
                  {Math.ceil(20 * (1 + Math.max(0, Math.min(100, Number(lf.leadBufferPercent || 0))) / 100))}
                </div>
                <div className="text-[10px] text-base-content/50">ceil(20 × (1 + {Number(lf.leadBufferPercent || 0)}%))</div>
              </div>
              <div className="bg-base-100/80 p-2.5 rounded-xl border border-base-200">
                <div className="text-[11px] text-base-content/60 font-medium">Reserve Leads</div>
                <div className="text-base font-bold text-accent">
                  {Math.ceil(20 * (1 + Math.max(0, Math.min(100, Number(lf.leadBufferPercent || 0))) / 100)) - 20}
                </div>
                <div className="text-[10px] text-base-content/50">Held in reserve</div>
              </div>
            </div>
            <p className="text-[11px] text-base-content/60 mt-2.5">
              • Worker view strictly enforces <code className="text-primary font-mono text-[10px]">availableAt &lt;= now</code> and hides all reserve leads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadFinderPolicyCard;
