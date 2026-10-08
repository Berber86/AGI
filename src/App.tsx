import { StoreProvider, useStore } from "@/game/store";
import { CultureChoiceModal, MobileNav, SettingsModal, SideNav, Toasts, TopBar } from "@/components/Shell";
import Onboarding from "@/pages/Onboarding";
import Camp from "@/pages/Camp";
import Forge from "@/pages/Forge";
import Army from "@/pages/Army";
import Battle from "@/pages/Battle";

function Root() {
  const { game, page, match } = useStore();
  // Три экрана: лагерь (соперники и улучшения), армия (колода) и кузница (новые карты).
  // Обязательного маршрута нет: после основания народа игрок сам выбирает, куда идти.
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
  // иначе на телефоне под оверлеем остаётся прокручиваемый экран лагеря.
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
      <a className="skip-link" href="#main-content">Перейти к содержимому</a>
      <SideNav />
      <TopBar />
      <main id="main-content" tabIndex={-1}>
        {page === "camp" && <Camp />}
        {page === "army" && <Army />}
        {page === "forge" && <Forge />}
      </main>
      <MobileNav />
      <SettingsModal />
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
