# GUIDA COMPLETA: Mettere Online Beehind Studio Platform

## 📋 Cosa Ti Serve

Prima di iniziare, assicurati di avere:
- Un computer con accesso a internet
- Un indirizzo email valido
- 30-45 minuti di tempo libero

---

## PARTE 1: CREARE ACCOUNT GITHUB

### Passo 1: Registrazione GitHub
1. Apri il browser (Chrome, Firefox, Safari, etc.)
2. Vai su **https://github.com**
3. Clicca sul pulsante verde **"Sign up"** in alto a destra
4. Compila il form:
   - **Email**: inserisci la tua email
   - **Password**: scegli una password sicura (almeno 8 caratteri)
   - **Username**: scegli un nome utente (es: beehindstudio)
5. Risolvi il puzzle di verifica
6. Clicca **"Create account"**
7. Vai alla tua email e clicca sul link di verifica

### Passo 2: Conferma Email
1. Apri la tua casella email
2. Cerca un'email da GitHub
3. Clicca sul link di conferma
4. Completa eventuali domande (puoi saltarle cliccando "Skip")

✅ **Checkpoint 1**: Ora hai un account GitHub attivo!

---

## PARTE 2: INSTALLARE GIT SUL TUO COMPUTER

### Per Windows:
1. Vai su **https://git-scm.com/download/win**
2. Il download partirà automaticamente
3. Apri il file scaricato (es: Git-2.43.0-64-bit.exe)
4. Clicca **"Next"** per tutte le opzioni (lascia le impostazioni predefinite)
5. Clicca **"Install"**
6. Clicca **"Finish"**

### Per Mac:
1. Apri **Terminal** (cerca "Terminal" in Spotlight)
2. Digita: `git --version` e premi Invio
3. Se appare una finestra, clicca **"Install"**
4. Segui le istruzioni a schermo

### Per verificare l'installazione:
1. Apri **Prompt dei comandi** (Windows) o **Terminal** (Mac)
2. Digita: `git --version`
3. Dovresti vedere qualcosa come: "git version 2.43.0"

✅ **Checkpoint 2**: Git è installato correttamente!

---

## PARTE 3: CARICARE IL PROGETTO SU GITHUB

### Passo 1: Scaricare i File del Progetto
1. Scarica la cartella **beehind-project** che ti ho preparato
2. Salvala sul Desktop o in una cartella facile da trovare
3. Annota il percorso completo (es: C:\Users\TuoNome\Desktop\beehind-project)

### Passo 2: Aprire il Terminale nella Cartella del Progetto

**Su Windows:**
1. Apri la cartella **beehind-project**
2. Nella barra degli indirizzi in alto, digita: `cmd` e premi Invio
3. Si aprirà il Prompt dei comandi

**Su Mac:**
1. Apri **Terminal**
2. Digita: `cd ` (con uno spazio alla fine)
3. Trascina la cartella beehind-project nella finestra Terminal
4. Premi Invio

### Passo 3: Configurare Git (SOLO LA PRIMA VOLTA)
Nel terminale, digita questi comandi uno alla volta (premi Invio dopo ognuno):

```bash
git config --global user.name "Tuo Nome"
git config --global user.email "tua-email@example.com"
```

(Sostituisci con il tuo nome e la tua email GitHub)

### Passo 4: Creare un Nuovo Repository su GitHub
1. Vai su **https://github.com**
2. Accedi con le tue credenziali
3. Clicca sul pulsante **"+"** in alto a destra
4. Seleziona **"New repository"**
5. Nel campo **"Repository name"** scrivi: `beehind-studio-platform`
6. Lascia selezionato **"Public"**
7. **NON** selezionare "Add a README file"
8. Clicca **"Create repository"**

### Passo 5: Collegare il Progetto a GitHub
GitHub ti mostrerà una pagina con delle istruzioni. Ignora quelle e usa queste:

Nel terminale (dentro la cartella beehind-project), digita questi comandi:

```bash
git init
```
(Inizializza Git nella cartella)

```bash
git add .
```
(Aggiunge tutti i file)

```bash
git commit -m "Prima versione Beehind Studio"
```
(Crea il primo salvataggio)

```bash
git branch -M main
```
(Rinomina il branch principale)

```bash
git remote add origin https://github.com/TUO-USERNAME/beehind-studio-platform.git
```
⚠️ **IMPORTANTE**: Sostituisci `TUO-USERNAME` con il tuo username GitHub!
(Collega il progetto locale a GitHub)

```bash
git push -u origin main
```
(Carica tutto su GitHub)

Ti verrà chiesto di inserire username e password GitHub.

✅ **Checkpoint 3**: Il codice è su GitHub! Puoi verificare andando su github.com/TUO-USERNAME/beehind-studio-platform

---

## PARTE 4: PUBBLICARE CON VERCEL

### Passo 1: Creare Account Vercel
1. Vai su **https://vercel.com**
2. Clicca su **"Sign Up"**
3. Seleziona **"Continue with GitHub"**
4. Inserisci le credenziali GitHub se richiesto
5. Clicca **"Authorize Vercel"** per dare i permessi

### Passo 2: Importare il Progetto
1. Nella dashboard di Vercel, clicca **"Add New..."**
2. Seleziona **"Project"**
3. Dovresti vedere la lista dei tuoi repository GitHub
4. Trova **beehind-studio-platform**
5. Clicca **"Import"** accanto al nome

### Passo 3: Configurare il Deploy
1. Vercel rileverà automaticamente che è un progetto Vite/React
2. Le impostazioni dovrebbero essere:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. **NON modificare nulla** (le impostazioni automatiche vanno bene)
4. Clicca **"Deploy"**

### Passo 4: Attendere il Deploy
1. Vedrai una schermata con dei log che scorrono
2. Aspetta 2-3 minuti
3. Quando vedi i fuochi d'artificio 🎉, è pronto!

### Passo 5: Ottenere il Link
1. Vercel ti mostrerà un link tipo: **beehind-studio-platform.vercel.app**
2. Clicca sul link per testare la piattaforma
3. Copia il link e condividilo con i tuoi soci!

✅ **Checkpoint 4**: La piattaforma è online e accessibile a tutti!

---

## 🎯 COME USARE LA PIATTAFORMA

### Per i Soci:
1. Condividi il link Vercel con tutti: **beehind-studio-platform.vercel.app**
2. Ogni socio può accedere al link senza registrazione
3. Tutte le modifiche sono condivise in tempo reale
4. I dati rimangono salvati tra le sessioni

### Importante da Sapere:
- ✅ Tutti possono vedere e modificare tutto
- ✅ I dati sono condivisi automaticamente
- ✅ Non serve fare login
- ⚠️ Chiunque abbia il link può accedere (consideralo come un Google Doc condiviso)

---

## 🔄 COME FARE AGGIORNAMENTI

Quando vuoi modificare la piattaforma:

### Passo 1: Modifica i File
1. Apri i file del progetto sul tuo computer
2. Fai le modifiche necessarie
3. Salva i file

### Passo 2: Carica su GitHub
Nel terminale (nella cartella del progetto):

```bash
git add .
git commit -m "Descrizione delle modifiche"
git push
```

### Passo 3: Deploy Automatico
- Vercel rileverà automaticamente le modifiche
- In 2-3 minuti il sito sarà aggiornato
- Non devi fare nulla su Vercel!

---

## 🆘 RISOLUZIONE PROBLEMI

### Problema: "git: command not found"
**Soluzione**: Git non è installato. Torna alla PARTE 2.

### Problema: "permission denied" quando faccio git push
**Soluzione**: 
1. GitHub richiede autenticazione
2. Vai su GitHub → Settings → Developer settings → Personal access tokens
3. Crea un nuovo token (seleziona "repo" come scope)
4. Usa il token come password quando Git te lo chiede

### Problema: Il sito su Vercel non si aggiorna
**Soluzione**:
1. Controlla su github.com che i file siano stati caricati
2. Vai su vercel.com → Deployments
3. Controlla se ci sono errori nel log
4. Prova a fare un nuovo deploy manuale cliccando "Redeploy"

### Problema: Errore durante il build su Vercel
**Soluzione**:
1. Verifica che tutti i file siano stati caricati su GitHub
2. Controlla i log dell'errore su Vercel
3. Assicurati che package.json sia presente nella root del progetto

### Problema: I dati non si salvano
**Soluzione**:
- I dati sono salvati nel browser (localStorage)
- Se cancelli i cookie/cache, i dati vengono persi
- Per una soluzione più permanente, contattami per aggiungere un database

---

## 📞 BISOGNO DI AIUTO?

Se incontri difficoltà:
1. Rileggi la sezione "Risoluzione Problemi"
2. Verifica di aver seguito tutti i passi
3. Controlla i log di errore (se presenti)
4. Cerca l'errore su Google (spesso trovi soluzioni)

---

## 🎉 CONGRATULAZIONI!

Se sei arrivato fin qui, la tua piattaforma Beehind Studio è:
- ✅ Online e accessibile da chiunque
- ✅ Condivisa con tutti i soci
- ✅ Aggiornabile facilmente
- ✅ Gratuita (GitHub e Vercel hanno piani free generosi)

Buon lavoro con Beehind Studio! 🐝
