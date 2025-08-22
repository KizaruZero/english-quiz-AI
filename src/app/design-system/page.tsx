"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Surface from "@/components/ui/Surface";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function DesignSystemPage() {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-bg-default">
      {/* Header */}
      <Surface variant="glass" padding="lg" className="sticky top-0 z-50 backdrop-blur-md border-b border-border-subtle">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gradient">Design System</h1>
          <ThemeToggle showLabel />
        </div>
      </Surface>

      <div className="container mx-auto max-w-7xl px-4 py-12">
        {/* Design Tokens */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-text-primary mb-8">Design Tokens</h2>
          
          {/* Colors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Surface variant="elevated" padding="lg" radius="xl" border>
              <h3 className="text-xl font-bold text-text-primary mb-6">Color Palette</h3>
              
              {/* Accent Colors */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-text-primary mb-3">Accent Colors</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent-primary rounded-lg mb-2 shadow-glow"></div>
                    <p className="text-sm text-text-muted">Primary</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent-secondary rounded-lg mb-2 shadow-glow-purple"></div>
                    <p className="text-sm text-text-muted">Secondary</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent-tertiary rounded-lg mb-2 shadow-glow-lime"></div>
                    <p className="text-sm text-text-muted">Tertiary</p>
                  </div>
                </div>
              </div>

              {/* Background Colors */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-text-primary mb-3">Background Colors</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-bg-default border border-border-default rounded-lg">
                    <p className="text-sm text-text-secondary">Default</p>
                  </div>
                  <div className="p-3 bg-bg-subtle border border-border-default rounded-lg">
                    <p className="text-sm text-text-secondary">Subtle</p>
                  </div>
                  <div className="p-3 bg-bg-surface border border-border-default rounded-lg">
                    <p className="text-sm text-text-secondary">Surface</p>
                  </div>
                  <div className="p-3 bg-bg-elevated border border-border-default rounded-lg">
                    <p className="text-sm text-text-secondary">Elevated</p>
                  </div>
                </div>
              </div>
            </Surface>

            {/* Typography */}
            <Surface variant="elevated" padding="lg" radius="xl" border>
              <h3 className="text-xl font-bold text-text-primary mb-6">Typography</h3>
              
              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl font-bold text-text-primary">Heading 1</h1>
                  <p className="text-sm text-text-muted">text-4xl font-bold</p>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-text-primary">Heading 2</h2>
                  <p className="text-sm text-text-muted">text-3xl font-bold</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text-primary">Heading 3</h3>
                  <p className="text-sm text-text-muted">text-2xl font-bold</p>
                </div>
                <div>
                  <p className="text-lg text-text-primary">Body Large</p>
                  <p className="text-sm text-text-muted">text-lg</p>
                </div>
                <div>
                  <p className="text-base text-text-primary">Body Regular</p>
                  <p className="text-sm text-text-muted">text-base</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Body Small</p>
                  <p className="text-xs text-text-muted">text-sm</p>
                </div>
              </div>
            </Surface>
          </div>
        </section>

        {/* Components */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-text-primary mb-8">Components</h2>

          {/* Buttons */}
          <div className="mb-12">
            <Surface variant="elevated" padding="lg" radius="xl" border>
              <h3 className="text-xl font-bold text-text-primary mb-6">Buttons</h3>
              
              {/* Button Variants */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-text-primary mb-4">Variants</h4>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary" glow>Primary</Button>
                  <Button variant="secondary" glow>Secondary</Button>
                  <Button variant="tertiary">Tertiary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>

              {/* Button Sizes */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-text-primary mb-4">Sizes</h4>
                <div className="flex flex-wrap items-end gap-4">
                  <Button variant="primary" size="xs">Extra Small</Button>
                  <Button variant="primary" size="sm">Small</Button>
                  <Button variant="primary" size="md">Medium</Button>
                  <Button variant="primary" size="lg">Large</Button>
                  <Button variant="primary" size="xl">Extra Large</Button>
                </div>
              </div>

              {/* Button States */}
              <div>
                <h4 className="text-lg font-semibold text-text-primary mb-4">States</h4>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Normal</Button>
                  <Button variant="primary" loading={loading} onClick={handleLoadingDemo}>
                    {loading ? "Loading..." : "Click for Loading"}
                  </Button>
                  <Button variant="primary" disabled>Disabled</Button>
                  <Button 
                    variant="primary" 
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>}
                  >
                    With Icon
                  </Button>
                </div>
              </div>
            </Surface>
          </div>

          {/* Inputs */}
          <div className="mb-12">
            <Surface variant="elevated" padding="lg" radius="xl" border>
              <h3 className="text-xl font-bold text-text-primary mb-6">Inputs</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Variants */}
                <div>
                  <h4 className="text-lg font-semibold text-text-primary mb-4">Variants</h4>
                  <div className="space-y-4">
                    <Input 
                      variant="default" 
                      placeholder="Default input"
                      label="Default"
                    />
                    <Input 
                      variant="filled" 
                      placeholder="Filled input"
                      label="Filled"
                    />
                    <Input 
                      variant="outline" 
                      placeholder="Outline input"
                      label="Outline"
                    />
                    <Input 
                      variant="ghost" 
                      placeholder="Ghost input"
                      label="Ghost"
                    />
                  </div>
                </div>

                {/* Input States */}
                <div>
                  <h4 className="text-lg font-semibold text-text-primary mb-4">States</h4>
                  <div className="space-y-4">
                    <Input 
                      placeholder="Normal input"
                      label="Normal"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                    <Input 
                      placeholder="Input with icon"
                      label="With Icon"
                      icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>}
                    />
                    <Input 
                      placeholder="Success input"
                      label="Success State"
                      success
                      helperText="This looks good!"
                    />
                    <Input 
                      placeholder="Error input"
                      label="Error State"
                      errorText="This field is required"
                    />
                    <Input 
                      placeholder="Disabled input"
                      label="Disabled"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </Surface>
          </div>

          {/* Surfaces */}
          <div className="mb-12">
            <Surface variant="elevated" padding="lg" radius="xl" border>
              <h3 className="text-xl font-bold text-text-primary mb-6">Surfaces</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Surface variant="default" padding="md" radius="lg" border>
                  <h4 className="font-semibold text-text-primary mb-2">Default</h4>
                  <p className="text-sm text-text-secondary">Basic surface with subtle background</p>
                </Surface>
                
                <Surface variant="elevated" padding="md" radius="lg" border>
                  <h4 className="font-semibold text-text-primary mb-2">Elevated</h4>
                  <p className="text-sm text-text-secondary">Raised surface with shadow</p>
                </Surface>
                
                <Surface variant="glass" padding="md" radius="lg" border>
                  <h4 className="font-semibold text-text-primary mb-2">Glass</h4>
                  <p className="text-sm text-text-secondary">Glassmorphism effect</p>
                </Surface>
                
                <Surface variant="elevated" padding="md" radius="lg" border interactive glow>
                  <h4 className="font-semibold text-text-primary mb-2">Interactive</h4>
                  <p className="text-sm text-text-secondary">Clickable with hover effects</p>
                </Surface>
              </div>
            </Surface>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-text-primary mb-8">Usage Guidelines</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Surface variant="elevated" padding="lg" radius="xl" border>
              <h3 className="text-xl font-bold text-text-primary mb-4">Web3 Design Principles</h3>
              <ul className="space-y-3 text-text-secondary">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Dark-first:</strong> Dark theme is the primary experience</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Gradients:</strong> Use sparingly for accents and CTAs</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent-tertiary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Glassmorphism:</strong> Subtle transparency with blur effects</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Glow effects:</strong> Neon-inspired shadows for emphasis</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Smooth animations:</strong> 180ms transitions for interactions</span>
                </li>
              </ul>
            </Surface>

            <Surface variant="elevated" padding="lg" radius="xl" border>
              <h3 className="text-xl font-bold text-text-primary mb-4">Accessibility</h3>
              <ul className="space-y-3 text-text-secondary">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Contrast:</strong> WCAG AA compliant (4.5:1 minimum)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Focus:</strong> Visible focus rings with glow effects</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Motion:</strong> Respects prefers-reduced-motion</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Semantic:</strong> Proper ARIA labels and roles</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Keyboard:</strong> Full keyboard navigation support</span>
                </li>
              </ul>
            </Surface>
          </div>
        </section>

        {/* Implementation */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary mb-8">Implementation</h2>
          
          <Surface variant="elevated" padding="lg" radius="xl" border>
            <h3 className="text-xl font-bold text-text-primary mb-4">Getting Started</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-text-primary mb-2">1. Import Components</h4>
                <Surface variant="default" padding="md" radius="md" className="bg-bg-surface">
                  <code className="text-sm text-accent-primary">
                    {`import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Surface from '@/components/ui/Surface';`}
                  </code>
                </Surface>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-text-primary mb-2">2. Use Design Tokens</h4>
                <Surface variant="default" padding="md" radius="md" className="bg-bg-surface">
                  <code className="text-sm text-accent-primary">
                    {`className="bg-bg-surface text-text-primary border-border-default"`}
                  </code>
                </Surface>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-text-primary mb-2">3. Apply Theme Provider</h4>
                <Surface variant="default" padding="md" radius="md" className="bg-bg-surface">
                  <code className="text-sm text-accent-primary">
                    {`<ThemeProvider defaultTheme="dark">
  <App />
</ThemeProvider>`}
                  </code>
                </Surface>
              </div>
            </div>
          </Surface>
        </section>
      </div>
    </div>
  );
}