import { useState } from 'react';
import { Resizable } from 're-resizable';
import svgPaths from '../imports/svg-xs4guo0nux';

interface PricingProps {
  onSelectPlan?: (plan: 'free' | 'starter' | 'pro' | 'premium') => void;
}

export default function Pricing({ onSelectPlan }: PricingProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('monthly');
  const [size, setSize] = useState({ width: 1200, height: 600 });

  // Calculate scale based on size
  const baseWidth = 1200;
  const baseHeight = 600;
  const scaleX = size.width / baseWidth;
  const scaleY = size.height / baseHeight;
  const scale = Math.min(scaleX, scaleY);

  return (
    <Resizable
      size={size}
      onResizeStop={(_e, _direction, _ref, d) => {
        setSize({
          width: size.width + d.width,
          height: size.height + d.height,
        });
      }}
      minWidth={400}
      minHeight={300}
      maxWidth={1600}
      maxHeight={1000}
      className="mx-auto"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
      enable={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
    >
      <div 
        className="bg-gradient-to-br from-[#E5C5F1] to-[#D4A5E8] rounded-2xl p-6 sm:p-8 origin-top-left"
        style={{
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl leading-[1.1] font-bold text-[#1E2330] mb-0">
              Pick the perfect plan
            </h1>
          </div>
          
          <div className="flex flex-col items-start sm:items-end gap-2">
            <p className="text-xs sm:text-sm text-[#1E2330] whitespace-nowrap">Save with annual plans</p>
            <div className="bg-white rounded-full p-1 flex items-center gap-1">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  billingPeriod === 'monthly'
                    ? 'bg-[#1E2330] text-white'
                    : 'bg-transparent text-[#1E2330]'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annually')}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  billingPeriod === 'annually'
                    ? 'bg-[#1E2330] text-white'
                    : 'bg-transparent text-[#1E2330]'
                }`}
              >
                Annually
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {/* Premium Card */}
          <div className="bg-white rounded-2xl overflow-hidden flex flex-col">
            <div className="bg-[#502274] p-4">
              <h3 className="text-white text-lg font-semibold mb-1">Premium</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-white text-2xl font-bold">$24</span>
                <span className="text-white/80 text-xs">USD/month</span>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <p className="text-[#676B5F] text-xs mb-4 flex-1">
                The VIP support plan for businesses ready to monetize and sell on a larger scale.
              </p>
              <button
                onClick={() => onSelectPlan?.('premium')}
                className="w-full bg-white border-2 border-[#502274] text-[#502274] py-2 rounded-full text-sm font-semibold hover:bg-[#502274] hover:text-white transition-all"
              >
                Get Premium
              </button>
            </div>
          </div>

          {/* Pro Card - Recommended */}
          <div className="bg-white rounded-2xl overflow-hidden flex flex-col relative">
            <div className="bg-[#502274] p-4 relative">
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-white text-lg font-semibold">Pro</h3>
                <div className="bg-[#C7F542] text-[#1E2330] text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                  Recommended
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-white text-2xl font-bold">$9</span>
                <span className="text-white/80 text-xs">USD/month</span>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <p className="text-[#676B5F] text-xs mb-4 flex-1">
                Grow, learn about and own your following forever with a branded Linktree.
              </p>
              <button
                onClick={() => onSelectPlan?.('pro')}
                className="w-full bg-[#FF5E0E] text-white py-2 rounded-full text-sm font-semibold hover:bg-[#E54D00] transition-all mb-3"
              >
                Get Pro
              </button>
              <div className="flex items-center gap-1.5 text-[#70764D] text-[10px]">
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 16 14">
                  <path
                    clipRule="evenodd"
                    d={svgPaths.p31f19100}
                    fill="currentColor"
                    fillRule="evenodd"
                  />
                </svg>
                <span>Pro users get more visitors</span>
              </div>
            </div>
          </div>

          {/* Starter Card */}
          <div className="bg-white rounded-2xl overflow-hidden flex flex-col">
            <div className="bg-[#502274] p-4">
              <h3 className="text-white text-lg font-semibold mb-1">Starter</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-white text-2xl font-bold">$5</span>
                <span className="text-white/80 text-xs">USD/month</span>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <p className="text-[#676B5F] text-xs mb-4 flex-1">
                More customization and control for creators ready to drive more traffic to and through their Linktree.
              </p>
              <button
                onClick={() => onSelectPlan?.('starter')}
                className="w-full bg-white border-2 border-[#502274] text-[#502274] py-2 rounded-full text-sm font-semibold hover:bg-[#502274] hover:text-white transition-all"
              >
                Get Starter
              </button>
            </div>
          </div>

          {/* Free Card */}
          <div className="bg-white rounded-2xl overflow-hidden flex flex-col">
            <div className="bg-[#502274] p-4">
              <h3 className="text-white text-lg font-semibold mb-1">Free</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-white text-2xl font-bold">$0</span>
                <span className="text-white/80 text-xs">USD/month</span>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <p className="text-[#676B5F] text-xs mb-4 flex-1">
                Unlimited links and a customizable Linktree to connect your community to everything you are.
              </p>
              <button
                onClick={() => onSelectPlan?.('free')}
                className="w-full bg-white border-2 border-[#502274] text-[#502274] py-2 rounded-full text-sm font-semibold hover:bg-[#502274] hover:text-white transition-all"
              >
                Join for free
              </button>
            </div>
          </div>
        </div>

        {/* Explore all features */}
        <div className="flex items-center justify-center gap-2 text-[#1E2330]">
          <span className="text-xs sm:text-sm font-medium underline cursor-pointer hover:no-underline">
            Explore all features
          </span>
          <svg className="w-3 h-3 sm:w-4 sm:h-4 rotate-[270deg]" fill="none" viewBox="0 0 14 16">
            <path
              clipRule="evenodd"
              d={svgPaths.p302d2800}
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </Resizable>
  );
}