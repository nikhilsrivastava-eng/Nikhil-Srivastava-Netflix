import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import {
  Button,
  Input,
  Card,
  Form,
  Avatar,
  Badge,
  Loading,
  Modal,
  Dropdown,
  Checkbox,
  Radio,
  Textarea,
  Toast,
  Slider
} from '../ui';

const UIShowcase: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState('');
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('');
  const [sliderValue, setSliderValue] = useState(50);
  const [toasts, setToasts] = useState<Array<{ id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string }>>([]);

  const dropdownOptions = [
    { value: 'action', label: 'Action' },
    { value: 'drama', label: 'Drama' },
    { value: 'comedy', label: 'Comedy' },
    { value: 'thriller', label: 'Thriller' }
  ];

  const radioOptions = [
    { value: 'basic', label: 'Basic Plan' },
    { value: 'standard', label: 'Standard Plan' },
    { value: 'premium', label: 'Premium Plan' }
  ];

  const addToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <MainLayout>
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#e50914] mb-4">Netflix UI Components Showcase</h1>
          <p className="text-[#b3b3b3] text-lg">A comprehensive demo of all available UI components</p>
        </div>

        {/* Buttons Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Buttons</h2>
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-[#b3b3b3]">Variants</h3>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="outline">Outline</Button>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-[#b3b3b3]">Sizes</h3>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-[#b3b3b3]">States</h3>
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Form Elements Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Form Elements</h2>
          <Card className="p-6">
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                />
                <Input
                  label="Password"
                  placeholder="Enter password"
                  type="password"
                  error="Password is required"
                />
                <Input
                  label="Search"
                  placeholder="Search movies..."
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
                <Dropdown
                  label="Genre"
                  options={dropdownOptions}
                  value={dropdownValue}
                  onChange={setDropdownValue}
                  placeholder="Select a genre"
                />
              </div>
              
              <Textarea
                label="Description"
                placeholder="Enter movie description..."
                rows={4}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Checkbox
                    label="Remember me"
                    checked={checkboxChecked}
                    onChange={(e) => setCheckboxChecked(e.target.checked)}
                  />
                </div>
                <div>
                  <Radio
                    name="plan"
                    label="Select Plan"
                    options={radioOptions}
                    value={radioValue}
                    onChange={setRadioValue}
                  />
                </div>
              </div>

              <Slider
                label="Rating"
                min={0}
                max={10}
                step={0.1}
                value={sliderValue}
                onChange={setSliderValue}
                showValue
              />
            </Form>
          </Card>
        </section>

        {/* Cards Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default" className="p-6">
              <h3 className="text-lg font-semibold mb-2">Default Card</h3>
              <p className="text-[#b3b3b3]">This is a default card with basic styling.</p>
            </Card>
            <Card variant="elevated" hover className="p-6">
              <h3 className="text-lg font-semibold mb-2">Elevated Card</h3>
              <p className="text-[#b3b3b3]">This card has elevation and hover effects.</p>
            </Card>
            <Card variant="movie" hover className="aspect-[2/3] bg-gradient-to-t from-black/80 to-transparent relative overflow-hidden">
              <div className="absolute inset-0 bg-[#2d2d2d] flex items-center justify-center">
                <span className="text-[#808080]">Movie Poster</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-sm font-semibold">Movie Title</h3>
              </div>
            </Card>
          </div>
        </section>

        {/* Avatars & Badges Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Avatars & Badges</h2>
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Avatars</h3>
                <div className="flex items-center space-x-4">
                  <Avatar size="sm" fallback="JS" />
                  <Avatar size="md" fallback="JD" online />
                  <Avatar size="lg" fallback="AB" />
                  <Avatar size="xl" fallback="CD" online />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="info">Info</Badge>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Loading States Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Loading States</h2>
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Spinner</h3>
                <Loading variant="spinner" size="lg" text="Loading..." />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Dots</h3>
                <Loading variant="dots" size="lg" text="Processing..." />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Pulse</h3>
                <Loading variant="pulse" size="lg" text="Buffering..." />
              </div>
            </div>
          </Card>
        </section>

        {/* Interactive Elements Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Interactive Elements</h2>
          <Card className="p-6">
            <div className="space-y-4">
              <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
              <div className="flex space-x-2">
                <Button onClick={() => addToast('success', 'Success message!')}>Success Toast</Button>
                <Button onClick={() => addToast('error', 'Error occurred!')}>Error Toast</Button>
                <Button onClick={() => addToast('warning', 'Warning message!')}>Warning Toast</Button>
                <Button onClick={() => addToast('info', 'Info message!')}>Info Toast</Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Sample Modal"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-[#b3b3b3]">
              This is a sample modal demonstrating the modal component with Netflix theming.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setModalOpen(false)}>
                Confirm
              </Button>
            </div>
          </div>
        </Modal>

        {/* Toast Container */}
        <div className="fixed top-4 right-4 space-y-2 z-50">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              id={toast.id}
              type={toast.type}
              message={toast.message}
              onClose={removeToast}
              duration={3000}
            />
          ))}
        </div>
      </div>
    </div>
    </MainLayout>
  );
};

export default UIShowcase;
