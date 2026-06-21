# Flames of Orion — Mech Builder

![Flames of Orion](https://img.shields.io/badge/Game-Flames%20of%20Orion-ff6b1a?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Complete-00cc55?style=for-the-badge)

Questa è una web app progettata per semplificare la creazione di un'**Unità da Combattimento** per il wargame di miniature *Flames of Orion*. L'app supporta la creazione rapida o dettagliata della propria squadra, permettendo di gestire budget, statistiche, slot e schede finali.

🌍 **L'app è disponibile online e pronta all'uso qui:**  
👉 [**Flames of Orion - Mech Builder**](https://zimogame.github.io/flames-of-orion/)

---

## 🛠 Funzionalità Principali

- **Modalità di Gioco Supportate**:
  - ⚡ **Gioco Rapido**: Nessuna fazione, budget limitato (25.000¢) e moduli iniziali estratti casualmente (gratuiti) per entrare subito in azione.
  - 🎖️ **Modalità Veterano**: Scegli la tua fazione (ognuna con bonus unici), ottieni un budget completo (150.000¢) e acquista liberamente il tuo equipaggiamento.
- **Roster Dinamico (Forze di Terra)**: Crea non solo Mech, ma includi nel roster anche *Veicoli Terrestri*, *Velivoli* e *Fanteria*. L'app calcola automaticamente i 4 slot gratuiti base (ogni unità di terra ha un "peso" in slot ridotto rispetto ai Mech).
- **Gestione Flessibile dei Crediti**: Tieni traccia dei fondi durante la campagna! Dal Garage puoi impostare manualmente il saldo attuale del *Deposito* della tua squadra (ad esempio a seguito di una perdita finanziaria o di un guadagno in-game).
- **Generatore Nomi in Codice**: Generazione casuale del nome in codice dei modelli utilizzando la Tabella d66 del manuale, o inserimento manuale.
- **Controllo Limiti e Slot MD**: Validazione automatica dell'equipaggiamento, blocco delle armi da mischia per le Forze di Terra e conteggio degli slot Modulo Dati (MD) massimi in tempo reale.
- **Export PDF Automatico**: Generazione con un clic di un PDF pronto per la stampa contenente tutte le schede dei modelli dell'Unità da Combattimento.
- **Importa / Esporta**: Puoi salvare le unità in locale, oppure esportare e importare l'intero Garage tramite file JSON.

---

## 📋 Come utilizzare l'app

1. Clicca su **+ NUOVA UNITÀ** dal Garage.
2. Scegli se vuoi utilizzare le regole del **Gioco Rapido** o della **Modalità Veterano**.
3. (Solo per Veterano) Scegli la tua **Fazione** in base ai bonus o al background che preferisci.
4. Nello **Step Identità**: dai un nome all'Unità da Combattimento e personalizza il Roster aggiungendo Mech, Fanteria o Veicoli. Assicurati di avere sempre almeno 2 Mech!
5. Nello **Step Loadout**, apri le schede di ogni modello per espanderle:
   - Sfoglia il mercato nero nelle schede **Miglioramenti**, **Armi a Distanza** e **Armi da Mischia** e aggiungi equipaggiamento.
   - *In Gioco Rapido*: usa i bottoni speciali in cima per ottenere equipaggiamento gratuito ed estratto casualmente.
6. Controlla il **Riepilogo**. Se non hai sforato il budget e la configurazione ti piace, clicca su "Salva nel Garage".
7. Dal Garage, potrai modificare l'Unità, **gestire i crediti** nel deposito in base ai risultati delle tue partite, oppure cliccare su **↓ Esporta PDF** per ottenere la scheda stampabile!

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
