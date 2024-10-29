export default function useTelegram() {
  const tg = window.Telegram.WebApp;

  const onClose = () => {
    if (tg) tg.close();
  };

  const onToggleButton = () => {
    if (tg) {
      if (tg.MainButton.isVisible) {
        tg.MainButton.hide();
      } else {
        tg.MainButton.show();
      }
    }
  };

  return {
    onClose,
    onToggleButton,
    tg,
    user: tg?.initDataUnsafe?.user,
    queryId: tg?.initDataUnsafe?.query_id,
  };
}
