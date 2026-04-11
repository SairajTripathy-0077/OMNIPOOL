import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import type { HardwareItem } from '../store/useStore';
import { getHardware, createHardware, deleteHardware, updateHardware } from '../api/client';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

const categories = ['compute', 'sensor', 'networking', 'storage', 'display', 'power', 'other'] as const;

const categoryColors: Record<string, 'cyan' | 'indigo' | 'violet' | 'emerald' | 'amber' | 'rose'> = {
  compute: 'indigo',
  sensor: 'cyan',
  networking: 'violet',
  storage: 'emerald',
  display: 'amber',
  power: 'rose',
  other: 'cyan',
};

const HardwareRegistryPage: React.FC = () => {
  const { myHardware, setMyHardware } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'other' as string,
    image_url: '',
    specs: {} as Record<string, string>,
  });
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  useEffect(() => {
    fetchHardware();
  }, []);

  const fetchHardware = async () => {
    try {
      const { data } = await getHardware();
      setMyHardware(data.data);
    } catch (error) {
      console.error('Failed to fetch hardware:', error);
    }
  };

  const handleAddSpec = () => {
    if (specKey.trim() && specValue.trim()) {
      setFormData({
        ...formData,
        specs: { ...formData.specs, [specKey.trim()]: specValue.trim() },
      });
      setSpecKey('');
      setSpecValue('');
    }
  };

  const handleRemoveSpec = (key: string) => {
    const newSpecs = { ...formData.specs };
    delete newSpecs[key];
    setFormData({ ...formData, specs: newSpecs });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createHardware(formData);
      await fetchHardware();
      setIsFormOpen(false);
      setFormData({ name: '', description: '', category: 'other', image_url: '', specs: {} });
    } catch (error) {
      console.error('Failed to create hardware:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteHardware(id);
      await fetchHardware();
    } catch (error) {
      console.error('Failed to delete hardware:', error);
    }
  };

  const handleToggleAvailability = async (item: HardwareItem) => {
    const nextStatus = item.availability_status === 'available' ? 'in-use' : 'available';
    try {
      await updateHardware(item._id, { availability_status: nextStatus });
      await fetchHardware();
    } catch (error) {
      console.error('Failed to update availability:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Hardware <span className="gradient-text">Registry</span>
            </h1>
            <p className="text-text-secondary">
              Share your hardware with the community or browse what's available.
            </p>
          </div>
          <Button variant="primary" onClick={() => setIsFormOpen(true)}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Hardware
          </Button>
        </div>

        {/* Hardware Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myHardware.map((item, index) => (
            <Card key={item._id} className={`animate-fade-in-up stagger-${Math.min(index + 1, 5)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant={categoryColors[item.category] || 'cyan'}>{item.category}</Badge>
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    item.availability_status === 'available' ? 'bg-accent-emerald' :
                    item.availability_status === 'in-use' ? 'bg-accent-amber' : 'bg-accent-rose'
                  }`} />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleToggleAvailability(item)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-accent-indigo hover:bg-bg-glass transition-all cursor-pointer"
                    title="Toggle availability"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-accent-rose hover:bg-accent-rose/10 transition-all cursor-pointer"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <h3 className="text-base font-semibold text-text-primary mb-1.5">{item.name}</h3>
              <p className="text-sm text-text-muted mb-3 line-clamp-2">{item.description}</p>

              {/* Specs */}
              {item.specs && Object.keys(item.specs).length > 0 && (
                <div className="space-y-1 pt-3 border-t border-border-default">
                  {Object.entries(item.specs).slice(0, 3).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-text-muted">{key}</span>
                      <span className="text-text-secondary font-mono">{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}

          {myHardware.length === 0 && (
            <div className="col-span-full text-center py-16 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-bg-tertiary border border-border-default flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-secondary mb-2">No hardware registered yet</h3>
              <p className="text-sm text-text-muted mb-4">Share your first item with the community</p>
              <Button variant="primary" onClick={() => setIsFormOpen(true)}>Add Hardware</Button>
            </div>
          )}
        </div>

        {/* Add Hardware Modal */}
        <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Register Hardware" size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              placeholder="e.g. Raspberry Pi 4 Model B"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
              <textarea
                placeholder="Describe the hardware, its condition, and any accessories included..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full min-h-[100px] bg-bg-tertiary border border-border-default rounded-xl
                  px-4 py-2.5 text-text-primary placeholder-text-muted
                  focus:outline-none focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo/30
                  transition-all duration-200 resize-y"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-bg-tertiary border border-border-default rounded-xl
                  px-4 py-2.5 text-text-primary
                  focus:outline-none focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo/30
                  transition-all duration-200"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>

            <Input
              label="Image URL (optional)"
              placeholder="https://..."
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />

            {/* Dynamic specs */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Specs (optional)</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Key (e.g. RAM)"
                  value={specKey}
                  onChange={(e) => setSpecKey(e.target.value)}
                />
                <Input
                  placeholder="Value (e.g. 4GB)"
                  value={specValue}
                  onChange={(e) => setSpecValue(e.target.value)}
                />
                <Button type="button" variant="secondary" size="sm" onClick={handleAddSpec}>+</Button>
              </div>
              {Object.entries(formData.specs).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(formData.specs).map(([key, val]) => (
                    <span
                      key={key}
                      className="flex items-center gap-1 px-2.5 py-1 bg-bg-tertiary border border-border-default rounded-lg text-xs"
                    >
                      <span className="text-text-secondary">{key}:</span>
                      <span className="text-text-primary font-mono">{val}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(key)}
                        className="ml-1 text-text-muted hover:text-accent-rose transition-colors cursor-pointer"
                      >×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="flex-1">Cancel</Button>
              <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1">Register Hardware</Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default HardwareRegistryPage;
