"use strict";

const NATIVE_I18N = Object.freeze({
  "de": {
    "save_recovery_title": "VargaMesh Recovery Phrase speichern",
    "text_file": "Textdatei",
    "wallet_backup_title": "VargaMesh Wallet-Backup",
    "wallet_backup_filter": "Wallet-Backup",
    "restore_backup_title": "VargaMesh Wallet-Backup wiederherstellen",
    "all_files": "Alle Dateien",
    "tray_checking": "Core: Status wird geprüft",
    "tray_online": "Core: online · Block {block}",
    "tray_open": "VargaMesh Desktop öffnen",
    "tray_lock_all": "Alle Wallets sperren",
    "tray_quit": "Beenden und Core stoppen",
    "tray_background": "VargaMesh Core läuft im Hintergrund weiter. Über das Tray-Symbol kannst du die Wallet wieder öffnen."
  },
  "en": {
    "save_recovery_title": "Save VargaMesh recovery phrase",
    "text_file": "Text file",
    "wallet_backup_title": "VargaMesh wallet backup",
    "wallet_backup_filter": "Wallet backup",
    "restore_backup_title": "Restore VargaMesh wallet backup",
    "all_files": "All files",
    "tray_checking": "Core: checking status",
    "tray_online": "Core: online · Block {block}",
    "tray_open": "Open VargaMesh Desktop",
    "tray_lock_all": "Lock all wallets",
    "tray_quit": "Quit and stop Core",
    "tray_background": "VargaMesh Core keeps running in the background. Use the tray icon to reopen the wallet."
  },
  "ru": {
    "save_recovery_title": "Сохранить фразу восстановления VargaMesh",
    "text_file": "Текстовый файл",
    "wallet_backup_title": "Резервная копия кошелька VargaMesh",
    "wallet_backup_filter": "Резервная копия кошелька",
    "restore_backup_title": "Восстановить резервную копию кошелька VargaMesh",
    "all_files": "Все файлы",
    "tray_checking": "Core: проверка состояния",
    "tray_online": "Core: в сети · Блок {block}",
    "tray_open": "Открыть VargaMesh Desktop",
    "tray_lock_all": "Заблокировать все кошельки",
    "tray_quit": "Выйти и остановить Core",
    "tray_background": "VargaMesh Core продолжает работать в фоне. Используйте значок в трее, чтобы снова открыть кошелёк."
  },
  "zh": {
    "save_recovery_title": "保存 VargaMesh 恢复短语",
    "text_file": "文本文件",
    "wallet_backup_title": "VargaMesh 钱包备份",
    "wallet_backup_filter": "钱包备份",
    "restore_backup_title": "恢复 VargaMesh 钱包备份",
    "all_files": "所有文件",
    "tray_checking": "Core：正在检查状态",
    "tray_online": "Core：在线 · 区块 {block}",
    "tray_open": "打开 VargaMesh Desktop",
    "tray_lock_all": "锁定所有钱包",
    "tray_quit": "退出并停止 Core",
    "tray_background": "VargaMesh Core 会继续在后台运行。可使用系统托盘图标重新打开钱包。"
  }
});

function nativeTr(language, key, vars = {}) {
  let text = NATIVE_I18N[language]?.[key] || NATIVE_I18N.en[key] || key;
  for (const [name, value] of Object.entries(vars)) text = text.replaceAll(`{${name}}`, String(value));
  return text;
}

module.exports = { NATIVE_I18N, nativeTr };
