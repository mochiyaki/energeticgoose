'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Copy, Check, Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const fakeApiKey = 'eg_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(fakeApiKey);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'API key copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization and account settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Organization Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              Organization Profile
            </CardTitle>
            <CardDescription>
              Manage your organization information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input
                id="orgName"
                defaultValue={session?.user?.orgName}
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Contact support to change your organization name
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orgEmail">Primary Contact Email</Label>
              <Input
                id="orgEmail"
                type="email"
                defaultValue={session?.user?.email}
                disabled
              />
            </div>
          </CardContent>
        </Card>

        {/* User Profile */}
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>
              Your personal account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Name</Label>
              <Input
                id="userName"
                defaultValue={session?.user?.name || 'Not set'}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userEmail">Email</Label>
              <Input
                id="userEmail"
                type="email"
                defaultValue={session?.user?.email}
                disabled
              />
              <p className="text-xs text-muted-foreground">
                This is your login email
              </p>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Change Password</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Password management is currently disabled in this demo
              </p>
              <Button variant="outline" disabled>
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Use API keys to integrate Energetic Goose with your systems
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Production API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="apiKey"
                  type="password"
                  value={fakeApiKey}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyApiKey}
                  aria-label="Copy API key"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This is a demo API key. In production, keep your keys secure and never share them.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Demo Mode</h4>
              <p className="text-sm text-yellow-800">
                API integration is not functional in this demo. This key is for display purposes only.
                In production, you would use this key to integrate with Centrifuge, Aave, and other DeFi protocols.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Integration Info */}
        <Card>
          <CardHeader>
            <CardTitle>Future Integrations</CardTitle>
            <CardDescription>
              Planned integrations for production deployment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Centrifuge Protocol</p>
                  <p className="text-sm text-muted-foreground">
                    Real-world asset tokenization and on-chain invoice financing
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Aave Integration</p>
                  <p className="text-sm text-muted-foreground">
                    Liquidity pools for competitive lending rates
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">AI Treasury Agent</p>
                  <p className="text-sm text-muted-foreground">
                    Connect to OpenAI or Anthropic for intelligent AR/AP optimization
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">FX Settlement</p>
                  <p className="text-sm text-muted-foreground">
                    Circle USDC for 0% markup cross-border payments
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
