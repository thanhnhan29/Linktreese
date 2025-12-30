import { useState, useEffect } from 'react';
import { Globe, Lock, Bell, Trash2, CheckCircle, AlertCircle, Copy, Crown, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { toast } from 'sonner';
import Pricing from './Pricing';

interface User {
  username: string;
  email: string;
}

interface SettingsProps {
  user: User;
  onLogout: () => void;
  onUpdateDisplayName: (displayName: string) => void;
  onSettingsChange?: (settings: any) => void;
}

interface DomainStatus {
  domain: string;
  isVerified: boolean;
  isPro: boolean;
}

export default function Settings({ user, onLogout, onUpdateDisplayName, onSettingsChange }: SettingsProps) {
  const [customDomain, setCustomDomain] = useState('');
  const [domainStatus, setDomainStatus] = useState<DomainStatus | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showDomainDialog, setShowDomainDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Account settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  // Validation errors
  const [_emailError, _setEmailError] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [_newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  // Dialogs
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPricingDialog, setShowPricingDialog] = useState(false);
  
  // Debounce timer for display name
  const [displayNameTimer, setDisplayNameTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Privacy settings
  const [isProfilePublic, setIsProfilePublic] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(true);
  
  // PRO settings
  const [hideVielinkLogo, setHideVielinkLogo] = useState(false);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  useEffect(() => {
    // Load domain status from localStorage
    const savedDomain = localStorage.getItem(`domain_${user.username}`);
    if (savedDomain) {
      setDomainStatus(JSON.parse(savedDomain));
      setCustomDomain(JSON.parse(savedDomain).domain);
    }

    // Load user settings
    const savedSettings = localStorage.getItem(`settings_${user.username}`);
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setEmail(settings.email || user.email || '');
      setDisplayName(settings.displayName || user.username || '');
      setIsProfilePublic(settings.isProfilePublic ?? true);
      setShowAnalytics(settings.showAnalytics ?? true);
      setHideVielinkLogo(settings.hideVielinkLogo ?? false);
      setEmailNotifications(settings.emailNotifications ?? true);
      setWeeklyReports(settings.weeklyReports ?? false);
    } else {
      setEmail(user.email || '');
      setDisplayName(user.username || '');
    }
  }, [user.username]);

  const handleVerifyDomain = async () => {
    if (!customDomain) {
      toast.error('Please enter a domain name');
      return;
    }

    // Basic domain validation
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
    if (!domainRegex.test(customDomain)) {
      toast.error('Please enter a valid domain name');
      return;
    }

    setIsVerifying(true);

    // Simulate DNS verification (in production, this would be a server-side check)
    setTimeout(() => {
      // Simulate 70% success rate for demo
      const isSuccess = Math.random() > 0.3;
      
      if (isSuccess) {
        const newStatus: DomainStatus = {
          domain: customDomain,
          isVerified: true,
          isPro: true // In production, check if user has Pro subscription
        };
        setDomainStatus(newStatus);
        localStorage.setItem(`domain_${user.username}`, JSON.stringify(newStatus));
        toast.success('Domain verified successfully!');
        setShowDomainDialog(false);
      } else {
        toast.error('Unable to verify domain. Please check your DNS settings and try again.');
      }
      
      setIsVerifying(false);
    }, 2000);
  };

  const handleRemoveDomain = () => {
    setDomainStatus(null);
    setCustomDomain('');
    localStorage.removeItem(`domain_${user.username}`);
    toast.success('Custom domain removed');
  };

  const handleSaveSettings = () => {
    const settings = {
      email,
      displayName,
      isProfilePublic,
      showAnalytics,
      hideVielinkLogo,
      emailNotifications,
      weeklyReports
    };
    localStorage.setItem(`settings_${user.username}`, JSON.stringify(settings));
    toast.success('Settings saved successfully');
    if (onSettingsChange) {
      onSettingsChange(settings);
    }
  };

  const handleChangePassword = () => {
    // Clear previous errors
    setCurrentPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');
    
    // Validate fields are filled
    if (!currentPassword) {
      setCurrentPasswordError('Current password is required');
      return;
    }
    
    if (!newPassword) {
      setNewPasswordError('New password is required');
      return;
    }
    
    if (!confirmPassword) {
      setConfirmPasswordError('Confirm password is required');
      return;
    }
    
    // Get stored user data to verify current password
    const storedUser = localStorage.getItem(`user_${user.username}`);
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.password !== currentPassword) {
        setCurrentPasswordError('Current password is incorrect');
        return;
      }
    }
    
    // Validate password strength
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (!passwordRegex.test(newPassword)) {
      const errors = [];
      if (newPassword.length < 8) {
        errors.push('at least 8 characters');
      }
      if (!/(?=.*[a-z])/.test(newPassword)) {
        errors.push('one lowercase letter');
      }
      if (!/(?=.*[A-Z])/.test(newPassword)) {
        errors.push('one uppercase letter');
      }
      if (!/(?=.*\d)/.test(newPassword)) {
        errors.push('one number');
      }
      if (!/(?=.*[@$!%*?&])/.test(newPassword)) {
        errors.push('one special character (@$!%*?&)');
      }
      
      setNewPasswordError(`Password must contain ${errors.join(', ')}`);
      return;
    }
    
    // Validate confirm password
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }
    
    // Update password in localStorage
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      userData.password = newPassword;
      localStorage.setItem(`user_${user.username}`, JSON.stringify(userData));
    }
    
    toast.success('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordDialog(false);
  };

  const handleDeleteAccount = () => {
    // In production, this would delete the account from database
    localStorage.removeItem('user');
    localStorage.removeItem(`user_${user.username}`);
    localStorage.removeItem(`links_${user.username}`);
    localStorage.removeItem(`profile_${user.username}`);
    localStorage.removeItem(`analytics_${user.username}`);
    localStorage.removeItem(`domain_${user.username}`);
    localStorage.removeItem(`settings_${user.username}`);
    
    toast.success('Account deleted successfully');
    setShowDeleteDialog(false);
    onLogout();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  // Password validation helpers
  const validateCurrentPassword = (password: string) => {
    return password === 'Hihi34@';
  };

  const validatePasswordStrength = (password: string) => {
    return {
      minLength: password.length >= 8,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[@$!%*?&]/.test(password)
    };
  };

  const isPasswordValid = () => {
    if (!currentPassword || !newPassword || !confirmPassword) return false;
    
    // Check current password
    if (!validateCurrentPassword(currentPassword)) return false;
    
    // Check new password strength
    const strength = validatePasswordStrength(newPassword);
    const isStrong = Object.values(strength).every(v => v);
    if (!isStrong) return false;
    
    // Check confirm password matches
    if (newPassword !== confirmPassword) return false;
    
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-black mb-2">Settings</h2>
        <p className="text-[#676b5f]">Manage your account settings and preferences</p>
      </div>

      {/* Custom Domain Section */}
      <div className="bg-white rounded-lg border border-[#e0e2d9] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#676b5f]" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-black">Custom Domain</h3>
                <Badge 
                  className="bg-gradient-to-r from-[#8129d9] to-[#d946ef] text-white border-0 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setShowPricingDialog(true)}
                >
                  <Crown className="w-3 h-3 mr-1" />
                  PRO
                </Badge>
              </div>
              <p className="text-[#676b5f] mt-1">Use your own domain for your Linktree page</p>
            </div>
          </div>
        </div>

        {domainStatus?.isVerified ? (
          <div className="space-y-4">
            <div className="bg-[#f0fdf4] border border-[#86efac] rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#16a34a] mt-0.5" />
                <div className="flex-1">
                  <p className="text-black mb-1">Domain Verified</p>
                  <p className="text-[#676b5f]">Your page is now accessible at:</p>
                  <a 
                    href={`https://${domainStatus.domain}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#8129d9] hover:underline mt-1 inline-block"
                  >
                    {domainStatus.domain}
                  </a>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveDomain}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-[#f6f7f5] rounded-lg p-4">
              <p className="text-[#676b5f] mb-2">Default URL:</p>
              <div className="flex items-center gap-2">
                <code className="text-black bg-white px-3 py-2 rounded border border-[#e0e2d9] flex-1">
                  linktr.ee/{user.username}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(`linktr.ee/${user.username}`)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button 
              onClick={() => setShowDomainDialog(true)}
              className="bg-[#8129d9] hover:bg-[#7020c0] text-white"
            >
              <Globe className="w-4 h-4 mr-2" />
              Setup Custom Domain
            </Button>
          </div>
        )}
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-lg border border-[#e0e2d9] p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-[#676b5f]" />
          <h3 className="text-black">Account Settings</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-black">Username</label>
            <input
              type="text"
              value={user.username}
              disabled
              className="w-full px-4 py-2 bg-[#f6f7f5] rounded-lg text-[#676b5f] cursor-not-allowed"
            />
            <p className="text-[#676b5f] mt-1">Username cannot be changed</p>
          </div>

          <div>
            <label className="block mb-2 text-black">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-2 bg-[#f6f7f5] rounded-lg text-[#676b5f] cursor-not-allowed"
            />
            <p className="text-[#676b5f] mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block mb-2 text-sm text-[#676b5f]">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => {
                const newValue = e.target.value;
                setDisplayName(newValue);
                // Auto-save display name with debounce
                if (displayNameTimer) {
                  clearTimeout(displayNameTimer);
                }
                const timer = setTimeout(() => {
                  const settings = {
                    email,
                    displayName: newValue,
                    isProfilePublic,
                    showAnalytics,
                    hideVielinkLogo,
                    emailNotifications,
                    weeklyReports
                  };
                  localStorage.setItem(`settings_${user.username}`, JSON.stringify(settings));
                  onUpdateDisplayName(newValue);
                }, 500);
                setDisplayNameTimer(timer);
              }}
              placeholder="Your Name"
              className="w-full px-4 py-2 bg-[#f6f7f5] rounded-lg text-black placeholder:text-[#676b5f]"
            />
            <p className="text-xs text-[#676b5f] mt-1">Changes are saved automatically</p>
          </div>

          <div className="pt-4">
            <Button 
              onClick={() => setShowPasswordDialog(true)}
              variant="outline"
              className="w-full"
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-lg border border-[#e0e2d9] p-6">
        <h3 className="text-black mb-6">Privacy Settings</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black">Public Profile</p>
              <p className="text-[#676b5f]">Make your profile visible to everyone</p>
            </div>
            <Switch
              checked={isProfilePublic}
              onCheckedChange={setIsProfilePublic}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-black">Show Analytics</p>
              <p className="text-[#676b5f]">Display view count on your profile</p>
            </div>
            <Switch
              checked={showAnalytics}
              onCheckedChange={setShowAnalytics}
            />
          </div>
        </div>
      </div>

      {/* PRO Settings */}
      <div className="bg-white rounded-lg border border-[#e0e2d9] p-6">
        <h3 className="text-black mb-6">PRO Settings</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black">Hide Vielink Logo</p>
              <p className="text-[#676b5f]">Remove the Vielink logo from your profile</p>
            </div>
            <Switch
              checked={hideVielinkLogo}
              onCheckedChange={(checked: boolean) => {
                setHideVielinkLogo(checked);
                // Auto-save when toggled
                const settings = {
                  email,
                  displayName,
                  isProfilePublic,
                  showAnalytics,
                  hideVielinkLogo: checked,
                  emailNotifications,
                  weeklyReports
                };
                localStorage.setItem(`settings_${user.username}`, JSON.stringify(settings));
                if (onSettingsChange) {
                  onSettingsChange(settings);
                }
                toast.success(checked ? 'VieLink logo hidden' : 'VieLink logo shown');
              }}
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg border border-[#e0e2d9] p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-[#676b5f]" />
          <h3 className="text-black">Notifications</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black">Email Notifications</p>
              <p className="text-[#676b5f]">Receive email updates about your account</p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-black">Weekly Reports</p>
              <p className="text-[#676b5f]">Get weekly analytics reports via email</p>
            </div>
            <Switch
              checked={weeklyReports}
              onCheckedChange={setWeeklyReports}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <Button 
        onClick={handleSaveSettings}
        className="w-full bg-[#8129d9] hover:bg-[#7020c0] text-white"
      >
        Save All Settings
      </Button>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Trash2 className="w-5 h-5 text-red-500" />
          <h3 className="text-red-500">Danger Zone</h3>
        </div>

        <p className="text-[#676b5f] mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>

        <Button
          variant="outline"
          onClick={() => setShowDeleteDialog(true)}
          className="border-red-500 text-red-500 hover:bg-red-50"
        >
          Delete Account
        </Button>
      </div>

      {/* Custom Domain Setup Dialog */}
      <Dialog open={showDomainDialog} onOpenChange={setShowDomainDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Setup Custom Domain
            </DialogTitle>
            <DialogDescription>
              Connect your own domain to your Linktree profile
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Step 1 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-[#8129d9] text-white rounded-full flex items-center justify-center">
                  1
                </div>
                <h4 className="text-black">Enter your domain</h4>
              </div>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="mybrand.vn"
                className="w-full px-4 py-2 bg-[#f6f7f5] rounded-lg text-black placeholder:text-[#676b5f]"
              />
            </div>

            {/* Step 2 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-[#8129d9] text-white rounded-full flex items-center justify-center">
                  2
                </div>
                <h4 className="text-black">Configure DNS Settings</h4>
              </div>
              <div className="bg-[#f6f7f5] rounded-lg p-4 space-y-3">
                <p className="text-[#676b5f]">
                  Add the following CNAME record to your domain's DNS settings:
                </p>
                <div className="bg-white border border-[#e0e2d9] rounded p-3">
                  <div className="grid grid-cols-3 gap-4 mb-2">
                    <div>
                      <p className="text-[#676b5f] mb-1">Type</p>
                      <code className="text-black">CNAME</code>
                    </div>
                    <div>
                      <p className="text-[#676b5f] mb-1">Name</p>
                      <code className="text-black">@</code>
                    </div>
                    <div>
                      <p className="text-[#676b5f] mb-1">Value</p>
                      <div className="flex items-center gap-2">
                        <code className="text-black">cname.vielink.vn</code>
                        <button
                          onClick={() => copyToClipboard('cname.vielink.vn')}
                          className="text-[#8129d9] hover:text-[#7020c0]"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-black mb-1">DNS Propagation Time</p>
                      <p className="text-[#676b5f]">
                        DNS changes can take up to 48 hours to propagate globally. 
                        You can verify your domain after making the changes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-[#8129d9] text-white rounded-full flex items-center justify-center">
                  3
                </div>
                <h4 className="text-black">Verify Domain</h4>
              </div>
              <p className="text-[#676b5f] mb-4">
                After configuring your DNS settings, click the button below to verify your domain.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDomainDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerifyDomain}
              disabled={isVerifying || !customDomain}
              className="bg-[#8129d9] hover:bg-[#7020c0]"
            >
              {isVerifying ? 'Verifying...' : 'Verify Domain'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-red-50 border border-red-200 rounded p-4">
            <p className="text-red-800">
              All of your data will be permanently deleted, including:
            </p>
            <ul className="list-disc list-inside mt-2 text-red-700 space-y-1">
              <li>Your profile and bio</li>
              <li>All your links</li>
              <li>Analytics data</li>
              <li>Custom domain settings</li>
            </ul>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Yes, Delete My Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </DialogTitle>
            <DialogDescription>
              Update your account password
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block mb-2 text-black">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  setCurrentPassword(value);
                  // Real-time validation
                  if (value && !validateCurrentPassword(value)) {
                    setCurrentPasswordError('Incorrect password');
                  } else {
                    setCurrentPasswordError('');
                  }
                }}
                placeholder="••••••••"
                className={`w-full px-4 py-2 bg-[#f6f7f5] rounded-lg text-black placeholder:text-[#676b5f] border-2 ${
                  currentPassword && !validateCurrentPassword(currentPassword)
                    ? 'border-red-500'
                    : currentPassword && validateCurrentPassword(currentPassword)
                    ? 'border-green-500'
                    : 'border-transparent'
                }`}
              />
              {currentPasswordError && (
                <div className="flex items-center gap-1 mt-1">
                  <X className="w-4 h-4 text-red-500" />
                  <p className="text-red-500 text-sm">{currentPasswordError}</p>
                </div>
              )}
              {currentPassword && validateCurrentPassword(currentPassword) && (
                <div className="flex items-center gap-1 mt-1">
                  <Check className="w-4 h-4 text-green-600" />
                  <p className="text-green-600 text-sm">Password verified</p>
                </div>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block mb-2 text-black">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setNewPasswordError('');
                }}
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-[#f6f7f5] rounded-lg text-black placeholder:text-[#676b5f]"
              />
              {/* Real-time password requirements */}
              {newPassword && (
                <div className="mt-3 space-y-2 bg-[#f6f7f5] p-3 rounded-lg">
                  <p className="text-xs text-[#676b5f] mb-2">Password requirements:</p>
                  {Object.entries(validatePasswordStrength(newPassword)).map(([key, isValid]) => {
                    const labels = {
                      minLength: 'At least 8 characters',
                      hasLowercase: 'One lowercase letter',
                      hasUppercase: 'One uppercase letter',
                      hasNumber: 'One number',
                      hasSpecial: 'One special character (@$!%*?&)'
                    };
                    return (
                      <div key={key} className="flex items-center gap-2">
                        {isValid ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                        <p className={`text-sm ${
                          isValid ? 'text-green-600' : 'text-red-500'
                        }`}>
                          {labels[key as keyof typeof labels]}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-2 text-black">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  setConfirmPassword(value);
                  // Real-time validation
                  if (value && value !== newPassword) {
                    setConfirmPasswordError('Passwords do not match');
                  } else {
                    setConfirmPasswordError('');
                  }
                }}
                placeholder="••••••••"
                className={`w-full px-4 py-2 bg-[#f6f7f5] rounded-lg text-black placeholder:text-[#676b5f] border-2 ${
                  confirmPassword && confirmPassword !== newPassword
                    ? 'border-red-500'
                    : confirmPassword && confirmPassword === newPassword && newPassword
                    ? 'border-green-500'
                    : 'border-transparent'
                }`}
              />
              {confirmPasswordError && (
                <div className="flex items-center gap-1 mt-1">
                  <X className="w-4 h-4 text-red-500" />
                  <p className="text-red-500 text-sm">{confirmPasswordError}</p>
                </div>
              )}
              {confirmPassword && confirmPassword === newPassword && newPassword && (
                <div className="flex items-center gap-1 mt-1">
                  <Check className="w-4 h-4 text-green-600" />
                  <p className="text-green-600 text-sm">Passwords match</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordDialog(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setCurrentPasswordError('');
                setNewPasswordError('');
                setConfirmPasswordError('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={!isPasswordValid()}
              className="bg-[#8129d9] hover:bg-[#7020c0] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pricing Dialog */}
      <Dialog open={showPricingDialog} onOpenChange={setShowPricingDialog}>
        <DialogContent className="max-w-[1400px] p-0 bg-transparent border-0" aria-describedby="pricing-description">
          <DialogHeader className="sr-only">
            <DialogTitle>Select Your Plan</DialogTitle>
            <DialogDescription id="pricing-description">
              Choose the perfect pricing plan for your needs
            </DialogDescription>
          </DialogHeader>
          <Pricing onSelectPlan={(plan) => {
            toast.success(`Selected ${plan} plan!`);
            setShowPricingDialog(false);
          }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}