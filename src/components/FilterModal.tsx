import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: {
    city: string;
    maxDistance: number;
    minRating: number;
    open247Only: boolean;
    emergencyOnly: boolean;
  }) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
}) => {
  const { isTelugu } = useLanguage();
  const [city, setCity] = useState('All');
  const [maxDistance, setMaxDistance] = useState<number>(20);
  const [minRating, setMinRating] = useState<number>(4.0);
  const [open247Only, setOpen247Only] = useState(false);
  const [emergencyOnly, setEmergencyOnly] = useState(false);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters({
      city,
      maxDistance,
      minRating,
      open247Only,
      emergencyOnly,
    });
    onClose();
  };

  const handleReset = () => {
    setCity('All');
    setMaxDistance(20);
    setMinRating(4.0);
    setOpen247Only(false);
    setEmergencyOnly(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 border border-outline-variant/30 shadow-2xl space-y-5">
        <div className="flex justify-between items-center pb-3 border-b border-surface-variant">
          <h3 className="font-bold text-lg text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">tune</span>
            {isTelugu ? 'ఫిల్టర్‌లు (Filters)' : 'Filter Hospitals'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-surface-variant text-outline"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* City Filter */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-on-surface">
            {isTelugu ? 'నగరం / ప్రాంతం' : 'City / Region'}
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-sand-soft rounded-xl px-3 py-2.5 text-xs text-on-surface border border-outline-variant/50 outline-none"
          >
            <option value="All">{isTelugu ? 'అన్ని ప్రాంతాలు' : 'All Locations'}</option>
            <option value="Kodad">{isTelugu ? 'కోదాడ, తెలంగాణ' : 'Kodad, Telangana'}</option>
            <option value="Telangana">{isTelugu ? 'తెలంగాణ రాష్ట్రం' : 'Telangana State'}</option>
          </select>
        </div>

        {/* Distance Range */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-on-surface">
            <span>{isTelugu ? 'గరిష్ట దూరం' : 'Maximum Distance'}</span>
            <span className="text-primary font-bold">{maxDistance} km</span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

        {/* Minimum Rating */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-on-surface">
            {isTelugu ? 'కనీస రేటింగ్' : 'Minimum Rating'}
          </label>
          <div className="flex gap-2">
            {[4.0, 4.5, 4.8].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setMinRating(rating)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                  minRating === rating
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-sand-soft text-on-surface border-transparent'
                }`}
              >
                {rating}★ +
              </button>
            ))}
          </div>
        </div>

        {/* Toggle Switches */}
        <div className="space-y-3 pt-2 border-t border-surface-variant">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-xs font-semibold text-on-surface">
              {isTelugu ? '24/7 తెరిచి ఉండేవి మాత్రమే' : 'Open 24/7 Only'}
            </span>
            <input
              type="checkbox"
              checked={open247Only}
              onChange={(e) => setOpen247Only(e.target.checked)}
              className="accent-primary w-4 h-4 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-xs font-semibold text-on-surface">
              {isTelugu ? 'అత్యవసర చికిత్స విభాగం అందుబాటులో ఉన్నవి' : 'Emergency Services Available'}
            </span>
            <input
              type="checkbox"
              checked={emergencyOnly}
              onChange={(e) => setEmergencyOnly(e.target.checked)}
              className="accent-primary w-4 h-4 rounded cursor-pointer"
            />
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-3 border border-outline-variant rounded-xl text-xs font-semibold hover:bg-surface-container-low transition-all"
          >
            {isTelugu ? 'రీసెట్' : 'Reset'}
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-3 bg-primary text-on-primary rounded-xl text-xs font-semibold hover:bg-teal-deep transition-all shadow-xs"
          >
            {isTelugu ? 'వర్తింపజేయండి' : 'Apply Filters'}
          </button>
        </div>
      </div>
    </div>
  );
};
