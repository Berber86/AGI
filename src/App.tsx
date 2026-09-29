import { StoreProvider, useStore } from "@/game/store";
import { DayReportModal, MobileNav, SettingsModal, SideNav, Toasts, TopBar } from "@/components/Shell";
import Onboarding from "@/pages/Onboarding";
import Home from "@/pages/Home";
import MapPage from "@/pages/MapPage";
import Develop from "@/pages/Develop";
import Forge from "@/pages/Forge";
import Army from "@/pages/Army";
import Battle from "@/pages/Battle";

function Root() {
  const { game, page, match } = useStore();
  if (!game.player.onboardingComplete) {
    return (
      <>
        <Onboarding />
        <Toasts />
      </>
    );
  }
  return (
    <div className="min-h-dvh lg:pl-[216px]">
      <SideNav />
      <TopBar />
      <main>
        {page === "home" && <Home />}
        {page === "map" && <MapPage />}
        {page === "develop" && <Develop />}
        {page === "forge" && <Forge />}
        {page === "army" && <Army />}
      </main>
      <MobileNav />
      <SettingsModal />
      <DayReportModal />
      {match && <Battle />}
      <Toasts />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Root />
    </StoreProvider>
  );
}
