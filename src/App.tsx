import { StoreProvider, useStore } from "@/game/store";
import { CultureChoiceModal, DayReportModal, MobileNav, SettingsModal, SideNav, Toasts, TopBar } from "@/components/Shell";
import Onboarding from "@/pages/Onboarding";
import Home from "@/pages/Home";
import MapPage from "@/pages/MapPage";
import Develop from "@/pages/Develop";
import Forge from "@/pages/Forge";
import Army from "@/pages/Army";
import Battle from "@/pages/Battle";

function Root() {
  const { game, page, match } = useStore();
  // Никакого обязательного маршрута: после создания народа игрок остаётся в поселении
  // и сам выбирает, куда идти — развитие, карта, кузница или армия.
  const onboarded = game.player.onboardingComplete;

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
      <CultureChoiceModal />
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
