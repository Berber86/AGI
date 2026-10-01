import { useEffect, useRef } from "react";
import { StoreProvider, currentGuideStep, useStore } from "@/game/store";
import { DayReportModal, GuideBar, KeyGate, MobileNav, SettingsModal, SideNav, Toasts, TopBar } from "@/components/Shell";
import Onboarding from "@/pages/Onboarding";
import Home from "@/pages/Home";
import MapPage from "@/pages/MapPage";
import Develop from "@/pages/Develop";
import Forge from "@/pages/Forge";
import Army from "@/pages/Army";
import Battle from "@/pages/Battle";

function Root() {
  const { game, page, match, go } = useStore();
  const routed = useRef(false);
  const onboarded = game.player.onboardingComplete;

  // Первый маршрут ведёт сам: игрок попадает на тот экран, где находится следующий шаг.
  useEffect(() => {
    if (!onboarded || routed.current) return;
    routed.current = true;
    const guided = currentGuideStep(game);
    if (guided && guided.page !== page) go(guided.page);
  }, [game, onboarded, page, go]);

  if (!onboarded) {
    return (
      <>
        <Onboarding />
        <Toasts />
      </>
    );
  }
  // Бой — отдельный полноэкранный режим: страница под ним не рендерится,
  // иначе на телефоне под оверлеем остаётся прокручиваемый экран армии.
  if (match) {
    return (
      <>
        <Battle />
        <Toasts />
      </>
    );
  }
  return (
    <div className="min-h-dvh lg:pl-[216px]">
      <SideNav />
      <TopBar />
      <GuideBar />
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
      <KeyGate />
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
