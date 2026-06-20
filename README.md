# Flames of Orion — Mech Builder

![Flames of Orion](https://img.shields.io/badge/Game-Flames%20of%20Orion-ff6b1a?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Complete-00cc55?style=for-the-badge)

Questa è una web app progettata per semplificare la creazione di un'**Unità da Combattimento** per il wargame di miniature *Flames of Orion*, nello specifico utilizzando le regole della **Modalità Veterano**.

L'applicazione permette di comporre la propria unità rispettando le regole di fazione, il budget, le statistiche dei Mech e le configurazioni dei moduli (Armi a Distanza, Armi da Mischia, Miglioramenti e Munizioni Speciali), calcolando automaticamente tutto e generando le schede finali.

🌍 **L'app è disponibile online e pronta all'uso qui:**  
👉 [**Flames of Orion - Mech Builder**](https://zimogame.github.io/flames-of-orion/)

---

## 🛠 Funzionalità

- **Wizard guidato**: Un processo passo-passo semplice e intuitivo.
- **Supporto Fazioni**: Implementate tutte le 4 Fazioni base (*MERCS*, *Mega Corps*, *Casati Nobiliari*, *I Perduti & I Dannati*) con applicazione automatica dei loro bonus speciali.
- **Generatore Nomi in Codice**: Generazione casuale del nome in codice dei Mech utilizzando la Tabella d66 del manuale, o inserimento manuale.
- **Gestione Budget**: Calcolo in tempo reale dei crediti spesi e rimanenti.
- **Controllo Slot MD**: Calcolo automatico degli slot modulo (MD) e validazione dei limiti per ogni Mech.
- **Export in PDF**: Generazione di un documento pronto per la stampa contenente tutte le schede dei Mech dell'Unità da Combattimento.
- **Salvataggio Locale**: L'applicazione salva automaticamente i progressi nel browser del tuo dispositivo.
- **Importa / Esporta**: Puoi esportare il tuo intero Garage in un file `.json` per condividerlo con altri giocatori o per fare un backup, e importarlo su qualsiasi altro dispositivo.

---

## 📋 Come utilizzare l'app

1. Clicca su **+ NUOVA UNITÀ** dal Garage.
2. Scegli la tua **Fazione** in base ai bonus o al background che preferisci.
3. Dai un nome alla tua intera **Unità da Combattimento**.
4. Clicca sulle schede di ogni **Mech** per espanderle:
   - Usa il pulsante **🎲 Tira** per generare un nome in codice.
   - Sfoglia il mercato nero nelle schede **Miglioramenti**, **Armi a Distanza** e **Armi da Mischia** e aggiungi equipaggiamento al tuo Mech.
   - Assegna (se desideri) le **Munizioni Speciali** alle armi a distanza.
5. Controlla il **Riepilogo**. Se non hai sforato il budget e la configurazione ti piace, clicca su "Salva nel Garage".
6. Dal Garage, clicca su **↓ Esporta PDF** per ottenere la scheda stampabile da usare in partita!

---

## 💻 Uso locale / Sviluppo (Opzionale)

L'app è un sito puramente statico (HTML, CSS, JS vanilla) e funziona anche solo facendo doppio click sul file `index.html`. In questa modalità "statica", il salvataggio avviene unicamente nel `localStorage` del browser.

Se vuoi eseguire il progetto in locale potendo salvare fisicamente i dati su file, è incluso un mini server Python:
1. Assicurati di avere Python 3 installato.
2. Apri il terminale nella cartella del progetto.
3. Lancia il comando:
   ```bash
   python3 server.py
   ```
4. Apri il browser su `http://localhost:8765`. 
In questa modalità, l'app salverà (e leggerà) i tuoi garage in un file `garage.json` sulla tua macchina, permettendoti di mantenere il file fisico aggiornato automaticamente.
