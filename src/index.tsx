import { definePlugin, toaster } from "@decky/api";
import {
  ButtonItem,
  Navigation,
  PanelSection,
  PanelSectionRow,
  sleep,
} from "@decky/ui";
import { FaBook } from "react-icons/fa";

const INITIAL_DELAY_MS = 2000;
const RETRY_INTERVAL_MS = 1000;
const MAX_RETRY_WINDOW_MS = 45000;
const TABMASTER_WAIT_WINDOW_MS = 15000;

type DeckyPluginLike = {
  name?: string;
  plugin?: {
    name?: string;
  };
};

const getLoadedPlugins = (): DeckyPluginLike[] => {
  const loader = (globalThis as any).DeckyPluginLoader;
  const pluginCollections = [
    loader?.plugins,
    loader?.pluginLoader?.plugins,
    loader?.pluginService?.plugins,
  ];

  for (const collection of pluginCollections) {
    if (Array.isArray(collection)) {
      return collection;
    }

    if (collection && typeof collection === "object") {
      return Object.values(collection);
    }
  }

  return [];
};

const isPluginLoaded = (name: string): boolean => {
  return getLoadedPlugins().some((plugin) => {
    return plugin?.name === name || plugin?.plugin?.name === name;
  });
};

const getLibraryRoutePatches = (): unknown[] => {
  const loader = (globalThis as any).DeckyPluginLoader;
  const patches =
    loader?.routerHook?.routerState?._routePatches?.get?.("/library");
  if (!patches) {
    return [];
  }

  return Array.isArray(patches) ? patches : [...patches];
};

const isTabMasterLibraryPatchReady = (): boolean => {
  return getLibraryRoutePatches().some((patch) => {
    const source = String(patch);
    return (
      source.includes("tabMasterManager") ||
      source.includes("visibleTabsList") ||
      source.includes("CustomTabContainer")
    );
  });
};

const switchToLibrary = (): boolean => {
  try {
    Navigation.Navigate("/library");
    Navigation.CloseSideMenus();
    return true;
  } catch (error) {
    console.error("[Start In Library] failed to navigate to /library", error);
    return false;
  }
};

export default definePlugin(() => {
  let isDismounted = false;

  const startupNavigation = async () => {
    await sleep(INITIAL_DELAY_MS);
    if (isDismounted) {
      return;
    }

    if (isPluginLoaded("TabMaster")) {
      const patchDeadline = Date.now() + TABMASTER_WAIT_WINDOW_MS;
      while (!isDismounted && Date.now() < patchDeadline) {
        if (isTabMasterLibraryPatchReady()) {
          // Give Decky one more tick after the route patch appears.
          await sleep(500);
          break;
        }

        await sleep(RETRY_INTERVAL_MS);
      }
    }

    const retryDeadline = Date.now() + MAX_RETRY_WINDOW_MS;
    while (!isDismounted && Date.now() < retryDeadline) {
      if (switchToLibrary()) {
        return;
      }

      await sleep(RETRY_INTERVAL_MS);
    }
  };

  void startupNavigation();

  return {
    name: "Start In Library",
    titleView: <div>Start In Library</div>,
    content: (
      <PanelSection title="Actions">
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            onClick={() => {
              if (switchToLibrary()) {
                toaster.toast({
                  title: "Switched to Library",
                  body: "Steam opened Library.",
                });
              } else {
                toaster.toast({
                  title: "Library switch failed",
                  body: "Try again from this button.",
                });
              }
            }}
          >
            Switch to Library now
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>
    ),
    icon: <FaBook />,
    onDismount() {
      isDismounted = true;
    },
  };
});
