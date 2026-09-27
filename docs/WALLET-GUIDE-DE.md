# VargaMesh Desktop Wallet – Kurzanleitung

Diese Anleitung gilt für **VargaMesh Desktop v0.4.0**.

VargaMesh Desktop verwendet einen lokalen **VargaMesh Core Full Node**.
Private Schlüssel und Transaktionssignaturen bleiben lokal auf deinem Computer.

---

## 1. Welche Wallet soll ich verwenden?

VargaMesh Desktop bietet zwei Arten, eine neue Wallet anzulegen.

### Recovery Wallet

**Empfohlen für neue Wallets.**

Eine Recovery Wallet verwendet eine standardisierte Recovery Phrase mit:

- 12 oder 24 Wörtern
- BIP39
- BIP32
- BIP84 Native SegWit als Standard
- BIP44 als Legacy-Kompatibilität

Standardpfad:

    m/84'/22093'/0'/0/index

Legacy-Kompatibilität:

    m/44'/22093'/0'/0/index

Der aktuell vorgesehene VargaMesh SLIP-0044 Coin Type ist:

    22093

Hinweis: 22093 ist erst nach Annahme durch das offizielle SLIP-0044-Register
eine offiziell registrierte Zuweisung.

### Neue Wallet

Die Schaltfläche **„Neue Wallet“** erstellt eine normale VargaMesh-Core-Wallet.

Diese Wallet funktioniert weiterhin wie in älteren Desktop-Versionen.

Sie erhält **keine 12/24-Wort-Recovery-Phrase**.

Für diese Wallet ist ein Core-Wallet-Backup besonders wichtig.

---

## 2. Recovery Wallet erstellen

1. Öffne **Wallet**.
2. Klicke auf **Recovery Wallet**.
3. Gib einen Wallet-Namen ein.
4. Wähle 12 oder 24 Recovery-Wörter.
5. Optional, aber empfohlen: Setze eine Wallet-Passphrase.
6. Klicke auf **Recovery Phrase erzeugen**.
7. Sichere die Wörter vollständig und in der richtigen Reihenfolge.
8. Optional:
   - Recovery Phrase kopieren
   - Recovery Phrase als TXT speichern
9. Bestätige, dass die Recovery Phrase gesichert wurde.
10. Erstelle die Wallet.

Die Recovery Phrase ist der eigentliche Wiederherstellungsschlüssel der Wallet.

**Wer die Recovery Phrase besitzt, kann die Wallet wiederherstellen und über
die Coins verfügen.**

---

## 3. Recovery Phrase sichern

Empfohlen:

- auf Papier notieren
- offline aufbewahren
- mehrere sichere Kopien an getrennten Orten verwenden

Nicht empfohlen:

- per E-Mail versenden
- in Discord oder Messenger posten
- Screenshots in Cloud-Fotos speichern
- an Support-Mitarbeiter senden

VargaMesh-Support benötigt niemals deine Recovery Phrase.

Die optionale TXT-Datei ist **nicht verschlüsselt**.

Speichere sie deshalb nur an einem sicheren Ort.

Die Wallet-Passphrase wird nicht in diese Recovery-TXT-Datei geschrieben.

---

## 4. Recovery Wallet wiederherstellen

Wenn der Computer verloren geht, die Wallet-Dateien gelöscht werden oder
VargaMesh Desktop neu installiert wird:

1. Öffne **Wallet**.
2. Klicke auf **Recovery wiederherstellen**.
3. Vergib einen neuen Wallet-Namen.
4. Gib exakt dieselben 12 oder 24 Recovery-Wörter ein.
5. Wähle eine lokale Wallet-Passphrase.
6. Starte die Wiederherstellung.

VargaMesh Core importiert die deterministischen Wallet-Descriptoren und sucht
die Blockchain nach den zugehörigen Transaktionen und Guthaben ab.

Der neue Wallet-Name muss nicht identisch mit dem ursprünglichen Namen sein.

Beispiel:

    Alte Wallet: recovery
    Neue Wallet: HDTEST2

Bei derselben Recovery Phrase werden trotzdem dieselben Schlüssel und
Adressen wiederhergestellt.

---

## 5. Recovery Phrase und Wallet-Passphrase sind NICHT dasselbe

### Recovery Phrase

Die 12 oder 24 Wörter bestimmen die Wallet-Schlüssel.

Sie ermöglichen eine vollständige Wiederherstellung.

### Wallet-Passphrase

Die Wallet-Passphrase verschlüsselt die lokal gespeicherte Wallet.

Sie schützt die Wallet-Datei auf dem Computer.

Beim Wiederherstellen aus der Recovery Phrase kann eine neue lokale
Wallet-Passphrase gesetzt werden.

---

## 6. Alte Wallets aus früheren Versionen

Bestehende VargaMesh-Wallets bleiben unterstützt.

Ein Upgrade auf v0.4.0 verändert oder ersetzt vorhandene Wallets nicht.

### Vorhandene Wallet laden

Klicke auf:

    Wallet laden

und wähle die vorhandene Wallet.

### Wichtig

Eine alte Core-Wallet bekommt durch das Upgrade **nicht automatisch**
eine BIP39-Recovery-Phrase.

Wenn die Wallet ursprünglich ohne Recovery Phrase erstellt wurde, muss sie
weiterhin über ein Core-Wallet-Backup bzw. vorhandene private Schlüssel
gesichert werden.

---

## 7. Backup wiederherstellen

**„Backup wiederherstellen“ ist etwas anderes als
„Recovery wiederherstellen“.**

### Backup wiederherstellen

Verwendet eine vorhandene VargaMesh-Core-Wallet-Backup-Datei, z. B.:

    wallet.dat
    *.dat
    *.bak

Geeignet für klassische oder bereits vorhandene Core-Wallets.

### Recovery wiederherstellen

Verwendet:

    12 oder 24 Wörter

Geeignet für mit v0.4.0 erstellte Recovery Wallets.

---

## 8. Wallet sichern

Die Schaltfläche:

    Wallet sichern

erstellt ein Core-Wallet-Backup.

Auch bei einer Recovery Wallet kann ein zusätzliches Wallet-Backup sinnvoll
sein.

Für eine Recovery Wallet bleibt die korrekt gesicherte Recovery Phrase jedoch
der wichtigste langfristige Wiederherstellungsweg.

---

## 9. Wallet sperren / entsperren

Eine verschlüsselte Wallet ist normalerweise gesperrt.

### Wallet entsperren

Gib die Wallet-Passphrase ein.

Die Wallet wird für die in den Einstellungen festgelegte Zeit entsperrt.

### Wallet sperren

Sperrt die Wallet sofort wieder.

Empfangen ist auch bei einer gesperrten Wallet möglich.

Zum Signieren und Senden von Coins muss eine verschlüsselte Wallet
entsperrt werden.

---

## 10. VMESH empfangen

1. Öffne **Empfangen**.
2. Klicke auf **Neue Adresse erzeugen**.
3. Eine neue Native-SegWit-Adresse wird erzeugt.

VargaMesh Mainnet-Adressen beginnen typischerweise mit:

    vm1...

Der QR-Code wird vollständig lokal erstellt.

---

## 11. VMESH senden

1. Öffne **Senden**.
2. Gib die Zieladresse ein.
3. Gib den Betrag ein.
4. Prüfe Adresse, Betrag und Gebühr.
5. Bestätige die Transaktion.
6. Falls die Wallet gesperrt ist, gib die Wallet-Passphrase ein.

Die Signatur erfolgt durch den lokalen VargaMesh Core.

---

## 12. Blockchain neu scannen

Die Funktion:

    Blockchain neu scannen

sucht die Blockchain erneut nach Transaktionen der aktuellen Wallet.

Das ist beispielsweise hilfreich bei:

- wiederhergestellten Wallets
- importierten Schlüsseln
- fehlenden Transaktionen
- älteren Wallet-Daten

Ein vollständiger Rescan kann abhängig von Blockchain und Hardware einige
Zeit dauern.

---

## 13. Schlüssel / Adresse importieren

VargaMesh Desktop unterstützt weiterhin:

- WIF Private Keys
- Bech32 / P2WPKH
- P2SH-SegWit
- Legacy / P2PKH
- Watch-only Adressen

Private Schlüssel niemals an andere Personen oder Webseiten senden.

---

## 14. Legacy-Wallet migrieren

Bei älteren Nicht-Descriptor-Wallets kann die Funktion:

    Legacy-Wallet migrieren

verwendet werden.

Ist eine Wallet bereits eine Descriptor-Wallet, ist keine Migration nötig.

Vor einer Migration sollte immer ein Wallet-Backup erstellt werden.

---

## 15. Wallet entladen

**Wallet entladen löscht die Wallet nicht.**

Die Wallet wird lediglich aus dem aktuell laufenden VargaMesh Core entfernt.

Sie bleibt lokal auf der Festplatte vorhanden und kann später mit:

    Wallet laden

erneut geladen werden.

Auch durch das Entladen werden keine Blockchain-Daten gelöscht oder verändert.

---

## 16. Erzeugt eine unbenutzte Wallet Blockchain-Daten?

Nein.

Das reine Erstellen von:

- Wallets
- Recovery Phrases
- privaten Schlüsseln
- Adressen

schreibt nichts auf die Blockchain.

Erst wenn eine Adresse in einer echten Transaktion verwendet wird, entstehen
On-Chain-Daten.

---

## 17. Was sollte ich sichern?

### Recovery Wallet

Mindestens:

    Recovery Phrase

Zusätzlich empfohlen:

    Core-Wallet-Backup

### Klassische Wallet ohne Recovery Phrase

Unbedingt:

    Core-Wallet-Backup

und gegebenenfalls vorhandene private Schlüssel.

---

## 18. Sicherheitsregeln

1. Recovery Phrase niemals weitergeben.
2. Private Keys niemals weitergeben.
3. Wallet-Passphrase nicht vergessen.
4. Recovery TXT nur sicher und offline speichern.
5. Vor größeren Beträgen zuerst eine kleine Testtransaktion durchführen.
6. Downloads anhand von `SHA256SUMS` prüfen.
7. Wallet-Backups regelmäßig aktualisieren.

---

## Kurzfassung

Neue Wallet mit Recovery:

    Recovery Wallet
        ↓
    12/24 Wörter sichern
        ↓
    Wallet verwenden
        ↓
    bei Verlust:
    Recovery wiederherstellen

Alte / klassische Wallet:

    Neue Wallet / vorhandene Wallet
        ↓
    Wallet sichern
        ↓
    .dat-Backup sicher aufbewahren
        ↓
    bei Verlust:
    Backup wiederherstellen
