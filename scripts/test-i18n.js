"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const read = rel => fs.readFileSync(path.join(root, rel), "utf8");
const fail = message => { throw new Error(message); };

const app = read("src/renderer/app.js");
const vmt = read("src/renderer/vmt.js");
const html = read("src/renderer/index.html");
const settings = read("src/settings.js");

const start = app.indexOf("const I18N =");
const end = app.indexOf("I18N.ru =");
if (start < 0 || end <= start) fail("Base I18N block not found in app.js");

const baseContext = {};
vm.runInNewContext(app.slice(start, end) + "\nglobalThis.__I18N = I18N;", baseContext);
const base = baseContext.__I18N;
if (!base || !base.de || !base.en) fail("German/English base dictionaries missing");

function loadRendererDictionary(file, globalName) {
  const context = { window: {} };
  vm.runInNewContext(read(file), context);
  const value = context.window[globalName];
  if (!value || typeof value !== "object") fail(globalName + " missing from " + file);
  return value;
}

const ru = loadRendererDictionary("src/renderer/i18n-ru.js", "VARGA_TRANSLATIONS_RU");
const zh = loadRendererDictionary("src/renderer/i18n-zh.js", "VARGA_TRANSLATIONS_ZH");
const extra = loadRendererDictionary("src/renderer/i18n-extra.js", "VARGA_I18N_EXTRA");

const languages = { de: { ...base.de }, en: { ...base.en }, ru: { ...ru }, zh: { ...zh } };
for (const lang of Object.keys(languages)) {
  if (!extra[lang]) fail("Missing extra dictionary for " + lang);
  Object.assign(languages[lang], extra[lang]);
}

const sorted = value => Object.keys(value).sort();
const equalKeys = (a, b) => JSON.stringify(sorted(a)) === JSON.stringify(sorted(b));
if (!equalKeys(base.de, base.en)) fail("Base German/English translation key sets differ");
if (!equalKeys(base.en, ru)) fail("Russian base translation key set is incomplete");
if (!equalKeys(base.en, zh)) fail("Simplified Chinese base translation key set is incomplete");

const extraKeys = sorted(extra.de);
for (const lang of ["en", "ru", "zh"]) {
  if (JSON.stringify(extraKeys) !== JSON.stringify(sorted(extra[lang]))) {
    fail("Extra translation key set differs for " + lang);
  }
}

for (const [lang, dict] of Object.entries(languages)) {
  for (const [key, value] of Object.entries(dict)) {
    if (typeof value !== "string" || !value.trim()) fail("Empty translation " + lang + "." + key);
  }
}

const ruCyrillic = Object.values(languages.ru).filter(v => /[А-Яа-яЁё]/.test(v)).length;
const zhHan = Object.values(languages.zh).filter(v => /[\u3400-\u9fff]/.test(v)).length;
if (ruCyrillic < 150) fail("Russian dictionary does not look fully translated (" + ruCyrillic + " Cyrillic values)");
if (zhHan < 150) fail("Chinese dictionary does not look fully translated (" + zhHan + " Han values)");

for (const match of html.matchAll(/data-i18n(?:-placeholder|-title|-aria-label)?="([^"]+)"/g)) {
  for (const lang of Object.keys(languages)) {
    if (!(match[1] in languages[lang])) fail("HTML key " + match[1] + " missing in " + lang);
  }
}

function assertReferencedKeys(source, regex, label) {
  for (const match of source.matchAll(regex)) {
    const key = match[1];
    for (const lang of Object.keys(languages)) {
      if (!(key in languages[lang])) fail(label + " key " + key + " missing in " + lang);
    }
  }
}
assertReferencedKeys(app, /\btr\(["']([^"']+)["']/g, "app.js");
assertReferencedKeys(vmt, /\bt\(["']([^"']+)["']/g, "vmt.js");

for (const selector of [
  "[data-i18n]",
  "[data-i18n-placeholder]",
  "[data-i18n-title]",
  "[data-i18n-aria-label]"
]) {
  const singleA = "$('" + selector + "').forEach";
  const singleB = '$("' + selector + '").forEach';
  if (app.includes(singleA) || app.includes(singleB)) fail("Collection selector " + selector + " uses single-element $ helper");
  const doubleA = "$$('" + selector + "').forEach";
  const doubleB = '$$("' + selector + '").forEach';
  if (!app.includes(doubleA) && !app.includes(doubleB)) fail("Collection selector " + selector + " is not handled by $$");
}

if (/state\.settings\.language\s*(?:===|!==|==|!=)/.test(app)) {
  fail("Renderer still contains binary language branching");
}
if (/\bconst\s+de\s*=|\bl\s*=\s*\(deText/.test(vmt)) {
  fail("VMT renderer still contains German/English-only language branching");
}

for (const lang of ["de", "en", "ru", "zh"]) {
  if (!settings.includes('"' + lang + '"')) fail("Settings do not accept language " + lang);
  if (!html.includes('<option value="' + lang + '"')) fail("Language selector missing " + lang);
}
for (const file of ["i18n-ru.js", "i18n-zh.js", "i18n-extra.js"]) {
  if (!html.includes('<script src="' + file + '"></script>')) fail("Renderer does not load " + file);
  if (html.indexOf(file) > html.indexOf('<script src="app.js"></script>')) fail(file + " must load before app.js");
}

for (const key of ["target_2_blocks", "target_6_blocks", "target_12_blocks", "target_24_blocks"]) {
  if (!html.includes('data-i18n="' + key + '"')) fail("Fee target label " + key + " is not localized");
}

const native = require(path.join(root, "src/i18n-native.js"));
const NATIVE_I18N = native.NATIVE_I18N;
const nativeTr = native.nativeTr;
const nativeKeySet = JSON.stringify(sorted(NATIVE_I18N.de));
for (const lang of ["en", "ru", "zh"]) {
  if (JSON.stringify(sorted(NATIVE_I18N[lang])) !== nativeKeySet) fail("Native translation key set differs for " + lang);
}
if (!/[А-Яа-яЁё]/.test(nativeTr("ru", "tray_open"))) fail("Russian native UI translation failed");
if (!/[\u3400-\u9fff]/.test(nativeTr("zh", "tray_open"))) fail("Chinese native UI translation failed");
if (nativeTr("en", "tray_online", { block: 123 }).includes("{block}")) fail("Native translation interpolation failed");

console.log("VargaMesh Desktop i18n tests: PASS · " + Object.keys(languages.de).length + " UI keys × 4 languages · " + extraKeys.length + " dynamic keys");
