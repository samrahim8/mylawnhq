export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export type InstallPlatform =
  | "ios-safari"
  | "android-chrome"
  | "android-samsung"
  | "android-other"
  | "desktop"
  | "unknown";

export interface A2HSPreferences {
  dismissed: boolean;
  dismissCount: number;
  lastDismissed: string | null;
  permanentDismiss: boolean;
}
