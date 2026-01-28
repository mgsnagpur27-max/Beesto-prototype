"use client";

import { useState, useCallback, useMemo } from "react";
import { AppWindow, Code2, Database, CreditCard, BarChart3 } from "lucide-react";
import { useUIStore, CenterTab } from "@/lib/stores/ui-store";
import { useWebContainerStore } from "@/lib/stores/webcontainer-store";
import { useConsoleStore } from "@/lib/stores/console-store";
import { EditorPanel } from "@/components/editor/editor-panel";
import { PreviewFrame, type PreviewStatus } from "@/components/preview/preview-frame";
import { PreviewControls, type DeviceView } from "@/components/preview/preview-controls";
import { ConsolePanel } from "@/components/preview/console-panel";
import { ErrorOverlay } from "@/components/preview/error-overlay";

const TABS: { id: CenterTab; label: string; icon: typeof AppWindow }[] = [
  { id: "app", label: "App", icon: AppWindow },
  { id: "code", label: "Code", icon: Code2 },
  { id: "database", label: "Database", icon: Database },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

const CONSOLE_HEIGHT = 180;

export function CenterPanel() {
  const { activeTab, setActiveTab, previewUrl } = useUIStore();
  const { status: containerStatus, error: containerError } = useWebContainerStore();
  const allLogs = useConsoleStore((s) => s.logs);
  const errorLogs = useMemo(() => allLogs.filter((l) => l.type === "error"), [allLogs]);
  
  const [deviceView, setDeviceView] = useState<DeviceView>("desktop");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dismissedError, setDismissedError] = useState<string | null>(null);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setRefreshKey((k) => k + 1);
    setTimeout(() => setIsRefreshing(false), 500);
  }, []);

  const previewStatus: PreviewStatus = useMemo(() => {
    if (containerError) return "error";
    if (containerStatus === "idle" || containerStatus === "booting") return "initializing";
    if (containerStatus === "installing") return "installing";
    if (containerStatus === "starting") return previewUrl ? "ready" : "starting";
    if (containerStatus === "ready") return previewUrl ? "ready" : "starting";
    return "initializing";
  }, [containerStatus, containerError, previewUrl]);

  const deviceWidth = useMemo(() => {
    switch (deviceView) {
      case "mobile": return "max-w-[375px]";
      case "tablet": return "max-w-[768px]";
      default: return "w-full";
    }
  }, [deviceView]);

  const latestError = useMemo(() => {
    const recent = errorLogs[errorLogs.length - 1];
    if (!recent || recent.id === dismissedError) return null;
    return {
      message: recent.message,
      stack: recent.stack,
      file: recent.source?.split(":")[0],
      line: recent.source ? parseInt(recent.source.split(":")[1]) : undefined,
    };
  }, [errorLogs, dismissedError]);

  return (
    <div className="flex h-full flex-col bg-[#0a0a0f]">
      <div className="flex items-center justify-between border-b border-[#1a1a24] px-2">
        <div className="flex">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                  isActive
                    ? "text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500" />
                )}
              </button>
            );
          })}
        </div>

        {activeTab === "app" && (
          <PreviewControls
            deviceView={deviceView}
            previewUrl={previewUrl}
            isRefreshing={isRefreshing}
            onDeviceChange={setDeviceView}
            onRefresh={handleRefresh}
          />
        )}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === "app" && (
          <>
            <div 
              className="flex-1 flex items-center justify-center bg-[#0a0a0f] p-4 relative overflow-hidden"
            >
              <PreviewFrame
                url={previewUrl}
                status={previewStatus}
                error={containerError}
                deviceWidth={deviceWidth}
                refreshKey={refreshKey}
                onRetry={handleRefresh}
              />
              
              {latestError && previewStatus === "ready" && (
                <ErrorOverlay
                  error={latestError}
                  onDismiss={() => setDismissedError(errorLogs[errorLogs.length - 1]?.id || null)}
                />
              )}
            </div>
            
            {isConsoleOpen && <ConsolePanel height={CONSOLE_HEIGHT} />}
            
            <button
              onClick={() => setIsConsoleOpen(!isConsoleOpen)}
              className="absolute bottom-0 right-4 px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300 bg-[#12121a] rounded-t border border-b-0 border-[#1a1a24] transition-colors z-10"
              style={{ bottom: isConsoleOpen ? CONSOLE_HEIGHT : 0 }}
            >
              {isConsoleOpen ? "Hide Console" : "Show Console"}
            </button>
          </>
        )}

        {activeTab === "code" && <EditorPanel />}

        {activeTab === "database" && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Database className="h-12 w-12 text-zinc-600 mb-4" />
            <h3 className="text-lg font-medium text-zinc-300 mb-2">Database Explorer</h3>
            <p className="text-sm text-zinc-500 max-w-[300px]">
              Connect to Supabase to view and manage your database tables.
            </p>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <CreditCard className="h-12 w-12 text-zinc-600 mb-4" />
            <h3 className="text-lg font-medium text-zinc-300 mb-2">Payments</h3>
            <p className="text-sm text-zinc-500 max-w-[300px]">
              Connect Stripe to manage payments, subscriptions, and invoices.
            </p>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <BarChart3 className="h-12 w-12 text-zinc-600 mb-4" />
            <h3 className="text-lg font-medium text-zinc-300 mb-2">Analytics</h3>
            <p className="text-sm text-zinc-500 max-w-[300px]">
              View usage analytics, performance metrics, and user insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
